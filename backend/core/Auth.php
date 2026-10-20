<?php
declare(strict_types=1);
/** Autenticación Bearer revocable; solo el hash del secreto se guarda en MySQL. */
final class Auth
{
    private static ?int $tokenId = null;
    public static function requireUser(?string $role = null): Usuario
    {
        // Apache puede entregar Authorization con cualquiera de estos dos nombres internos.
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
        // El token debe tener formato id|secreto: un id positivo y 64 caracteres hexadecimales.
        if (!preg_match('/^Bearer\s+([1-9]\d*)\|([a-f0-9]{64})$/iD', $header, $matches)) {
            throw new ApiException(401, 'Debe iniciar sesión.');
        }
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if ($id === false) {
            throw new ApiException(401, 'El token no es válido.');
        }
        // Busca en MySQL la sesión correspondiente al id público del token.
        $token = new AuthRepository()->buscarToken($id);
        // La comparación constante y la consulta del usuario impiden confiar en roles del navegador.
        if (
            !$token ||
            !hash_equals($token['token_hash'], hash('sha256', $matches[2])) ||
            strtotime($token['expires_at'] . ' UTC') <= time()
        ) {
            throw new ApiException(401, 'La sesión venció o no es válida.');
        }
        // El rol y el estado siempre se leen desde la cuenta persistida, nunca del navegador.
        $user = new UsuarioRepository()->buscar((int) $token['usuario_id']);
        if (!$user || !$user->activo()) {
            throw new ApiException(401, 'La cuenta no está habilitada.');
        }
        // Directora hereda el acceso operativo del personal, pero las acciones de
        // aprobación comprueban DIRECTORA de forma explícita en el servicio.
        $allowed =
            $role === null ||
            $user->rol() === $role ||
            ($role === 'PERSONAL_IMSJ' && $user->rol() === 'DIRECTORA');
        if (!$allowed) {
            throw new ApiException(403, 'No tiene permiso para realizar esta acción.');
        }
        self::$tokenId = $id;
        return $user;
    }
    public static function tokenId(): int
    {
        if (self::$tokenId === null) {
            throw new LogicException('Falta autenticar la petición.');
        }
        return self::$tokenId;
    }
    /** Cinco intentos por minuto; flock coordina el contador entre procesos PHP. */
    public static function limitAttempts(string $operation): void
    {
        // Crea el directorio local donde se guardan temporalmente los intentos recientes.
        if (!is_dir(CACHE_ROOT) && !mkdir(CACHE_ROOT, 0770, true) && !is_dir(CACHE_ROOT)) {
            throw new RuntimeException('No se pudo crear la caché de acceso.');
        }
        // Combina operación e IP sin conservar la dirección original en el nombre del archivo.
        $key = hash('sha256', $operation . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        $file = fopen(CACHE_ROOT . '/' . $key . '.json', 'c+');
        // LOCK_EX evita que dos procesos actualicen el mismo contador simultáneamente.
        if (!$file || !flock($file, LOCK_EX)) {
            throw new RuntimeException('No se pudo bloquear el contador de acceso.');
        }
        try {
            // Conserva únicamente intentos producidos durante los últimos 60 segundos.
            $times = json_decode(stream_get_contents($file), true);
            $times = array_values(
                array_filter(
                    is_array($times) ? $times : [],
                    fn($t) => is_int($t) && $t > time() - 60,
                ),
            );
            if (count($times) >= 5) {
                // Indica al cliente cuántos segundos debe esperar antes de reintentar.
                header('Retry-After: ' . max(1, $times[0] + 60 - time()));
                throw new ApiException(429, 'Demasiados intentos. Espere un minuto.');
            }
            // Registra el intento actual y reescribe el archivo desde su comienzo.
            $times[] = time();
            rewind($file);
            ftruncate($file, 0);
            fwrite($file, json_encode($times, JSON_THROW_ON_ERROR));
            fflush($file);
        } finally {
            // Libera el bloqueo y el descriptor incluso si se produjo una excepción.
            flock($file, LOCK_UN);
            fclose($file);
        }
    }
}
