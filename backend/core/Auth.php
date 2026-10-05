<?php
declare(strict_types=1);
/** Autenticación Bearer revocable; solo el hash del secreto se guarda en MySQL. */
final class Auth {
    private static ?int $tokenId = null;
    public static function requireUser(?string $role = null): Usuario {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+([1-9]\d*)\|([a-f0-9]{64})$/iD', $header, $matches)) throw new ApiException(401, 'Debe iniciar sesión.');
        $id = filter_var($matches[1], FILTER_VALIDATE_INT);
        if ($id === false) throw new ApiException(401, 'El token no es válido.');
        $token = (new AuthRepository())->buscarToken($id);
        // La comparación constante y la consulta del usuario impiden confiar en roles del navegador.
        if (!$token || !hash_equals($token['token_hash'], hash('sha256', $matches[2])) || strtotime($token['expires_at'] . ' UTC') <= time()) throw new ApiException(401, 'La sesión venció o no es válida.');
        $user = (new UsuarioRepository())->buscar((int)$token['usuario_id']);
        if (!$user || !$user->activo()) throw new ApiException(401, 'La cuenta no está habilitada.');
        if ($role !== null && $user->rol() !== $role) throw new ApiException(403, 'No tiene permiso para realizar esta acción.');
        self::$tokenId = $id;
        return $user;
    }
    public static function tokenId(): int {
        if (self::$tokenId === null) throw new LogicException('Falta autenticar la petición.');
        return self::$tokenId;
    }
    /** Cinco intentos por minuto; flock coordina el contador entre procesos PHP. */
    public static function limitAttempts(string $operation): void {
        if (!is_dir(CACHE_ROOT) && !mkdir(CACHE_ROOT, 0770, true) && !is_dir(CACHE_ROOT)) throw new RuntimeException('No se pudo crear la caché de acceso.');
        $key = hash('sha256', $operation . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        $file = fopen(CACHE_ROOT . '/' . $key . '.json', 'c+');
        if (!$file || !flock($file, LOCK_EX)) throw new RuntimeException('No se pudo bloquear el contador de acceso.');
        try {
            $times = json_decode(stream_get_contents($file), true);
            $times = array_values(array_filter(is_array($times) ? $times : [], fn($t) => is_int($t) && $t > time() - 60));
            if (count($times) >= 5) {
                header('Retry-After: ' . max(1, $times[0] + 60 - time()));
                throw new ApiException(429, 'Demasiados intentos. Espere un minuto.');
            }
            $times[] = time(); rewind($file); ftruncate($file, 0);
            fwrite($file, json_encode($times, JSON_THROW_ON_ERROR)); fflush($file);
        } finally { flock($file, LOCK_UN); fclose($file); }
    }
}
