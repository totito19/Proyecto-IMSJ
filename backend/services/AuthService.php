<?php
declare(strict_types=1);
/** Casos de uso de cuenta; contraseña y sesiones se coordinan en una sola transacción. */
final class AuthService
{
    private UsuarioRepository $users;
    private AuthRepository $tokens;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct()
    {
        $this->users = new UsuarioRepository();
        $this->tokens = new AuthRepository();
    }
    /** Verifica identidad y contraseña antes de emitir una sesión revocable. */
    public function login(string $cedula, string $password): array
    {
        // La transacción mantiene bloqueada la cuenta mientras se reemplaza su sesión anterior.
        return Database::transaction(function () use ($cedula, $password) {
            // Primero busca por cédula y luego bloquea la misma fila antes de verificarla.
            $found = $this->users->buscarCedula($cedula);
            $user = $found ? $this->users->bloquear($found->id()) : null;
            // Usa el mismo mensaje para cuenta inexistente, inactiva o contraseña incorrecta.
            if (!$user || !$user->activo() || !$user->verify($password)) {
                Response::invalid('cedula', 'Las credenciales no son correctas.');
            }
            return $this->credenciales($user);
        });
    }
    /** Crea la cuenta ciudadana y su sesión dentro de la transacción. */
    public function register(string $cedula, string $password): array
    {
        // Cuenta y primera sesión se confirman juntas o se revierten juntas.
        return Database::transaction(function () use ($cedula, $password) {
            if ($this->users->buscarCedula($cedula)) {
                Response::invalid('cedula', 'La cédula ya está registrada.');
            }
            // Bcrypt recibe la contraseña original; a la base solo llega el hash resultante.
            $user = $this->users->crear(
                null,
                $cedula,
                password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]),
                'PUBLICO_GENERAL',
            );
            return $this->credenciales($user);
        });
    }
    /** Token aleatorio revocable, ocho horas; al emitirlo se eliminan sesiones anteriores. */
    private function credenciales(Usuario $user): array
    {
        // Genera 32 bytes aleatorios y los representa como 64 caracteres hexadecimales.
        $secret = bin2hex(random_bytes(32));
        // La sesión vence ocho horas después; la fecha persistida se expresa en UTC.
        $expires = gmdate('Y-m-d H:i:s', time() + 8 * 3600);
        // Mantiene una sola sesión vigente por cuenta.
        $this->tokens->revocarTodos($user->id());
        // Persiste solo SHA-256 del secreto. El secreto original se devuelve una única vez.
        $id = $this->tokens->crear($user->id(), hash('sha256', $secret), $expires);
        return [
            'token' => $id . '|' . $secret,
            'expira_en' => new DateTimeImmutable($expires, new DateTimeZone('UTC'))->format(
                DATE_ATOM,
            ),
            'usuario' => $user->toArray(),
        ];
    }
    /** Revoca el token de la solicitud ya autenticada. */
    public function logout(): void
    {
        $this->tokens->revocar(Auth::tokenId());
    }
}
