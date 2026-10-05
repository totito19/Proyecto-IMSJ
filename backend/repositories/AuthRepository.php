<?php
declare(strict_types=1);
/** Persistencia de sesiones opacas; no contiene decisiones HTTP ni contraseñas. */
final class AuthRepository {
    /** Lee el hash y vencimiento del token por su identificador. */
    public function buscarToken(int $id): ?array {
        return Database::query('SELECT * FROM auth_tokens WHERE id = ?', [$id])->fetch() ?: null;
    }
    /** Elimina las sesiones anteriores de la cuenta. */
    public function revocarTodos(int $usuarioId): void {
        Database::query('DELETE FROM auth_tokens WHERE usuario_id = ?', [$usuarioId]);
    }
    /** Elimina una sesión concreta para que deje de autenticar peticiones. */
    public function revocar(int $id): void {
        Database::query('DELETE FROM auth_tokens WHERE id = ?', [$id]);
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(int $usuarioId, string $hash, string $expires): int {
        Database::query('INSERT INTO auth_tokens (usuario_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP())', [$usuarioId, $hash, $expires]);
        return (int) Database::connection()->lastInsertId();
    }
}
