<?php
declare(strict_types=1);
/** Casos de uso de cuenta; contraseña y sesiones se coordinan en una sola transacción. */
final class AuthService {
    private UsuarioRepository $users;
    private AuthRepository $tokens;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->users=new UsuarioRepository();
        $this->tokens=new AuthRepository();
    }
    /** Verifica identidad y contraseña antes de emitir una sesión revocable. */
    public function login(string $cedula,string $password): array {
        return Database::transaction(function() use($cedula,$password) {
            $found=$this->users->buscarCedula($cedula);
            $user=$found ? $this->users->bloquear($found->id()) : null;
            if (!$user || !$user->activo() || !$user->verify($password)) Response::invalid('cedula','Las credenciales no son correctas.');
            return $this->credenciales($user);
        });
    }
    /** Crea la cuenta ciudadana y su sesión dentro de la transacción. */
    public function register(string $cedula,string $password): array {
        return Database::transaction(function() use($cedula,$password) {
            if ($this->users->buscarCedula($cedula)) Response::invalid('cedula','La cédula ya está registrada.');
            $user=$this->users->crear(null,$cedula,password_hash($password,PASSWORD_BCRYPT,['cost'=>12]),'PUBLICO_GENERAL');
            return $this->credenciales($user);
        });
    }
    /** Token aleatorio revocable, ocho horas; al emitirlo se eliminan sesiones anteriores. */
    private function credenciales(Usuario $user): array {
        $secret=bin2hex(random_bytes(32)); $expires=gmdate('Y-m-d H:i:s',time()+8*3600);
        $this->tokens->revocarTodos($user->id());
        $id=$this->tokens->crear($user->id(),hash('sha256',$secret),$expires);
        return ['token'=>$id.'|'.$secret,'expira_en'=>(new DateTimeImmutable($expires,new DateTimeZone('UTC')))->format(DATE_ATOM),'usuario'=>$user->toArray()];
    }
    /** Revoca el token de la solicitud ya autenticada. */
    public function logout(): void {
        $this->tokens->revocar(Auth::tokenId());
    }
}
