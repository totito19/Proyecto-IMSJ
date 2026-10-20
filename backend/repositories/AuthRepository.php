<?php
declare(strict_types=1);
/** Persistencia de sesiones opacas; no contiene decisiones HTTP ni contraseñas. */
final class AuthRepository
{
    /** Lee el hash y vencimiento del token por su identificador. */
    public function buscarToken(int $id): ?array
    {
        // Busca la sesión concreta que llegó en el encabezado Bearer.
        // El signo ? se sustituye por $id mediante PDO, sin concatenar datos en el SQL.
        return Database::query('SELECT * FROM auth_tokens WHERE id = ?', [$id])->fetch() ?: null;
    }
    /** Elimina las sesiones anteriores de la cuenta. */
    public function revocarTodos(int $usuarioId): void
    {
        // Borra todas las sesiones del usuario, por ejemplo al desactivar o reactivar su cuenta.
        Database::query('DELETE FROM auth_tokens WHERE usuario_id = ?', [$usuarioId]);
    }
    /** Elimina una sesión concreta para que deje de autenticar peticiones. */
    public function revocar(int $id): void
    {
        // Borra solamente el token utilizado para cerrar la sesión actual.
        Database::query('DELETE FROM auth_tokens WHERE id = ?', [$id]);
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(int $usuarioId, string $hash, string $expires): int
    {
        // Guarda el hash del secreto y su vencimiento; el token original nunca se almacena.
        Database::query(
            'INSERT INTO auth_tokens (usuario_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP())',
            [$usuarioId, $hash, $expires],
        );
        // MySQL devuelve el identificador generado para formar el token id|secreto.
        return (int) Database::connection()->lastInsertId();
    }
}
