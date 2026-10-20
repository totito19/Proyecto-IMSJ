<?php
declare(strict_types=1);
/** Una conexión PDO por petición; los repositorios comparten la misma transacción. */
final class Database
{
    private static ?PDO $connection = null;
    public static function connection(): PDO
    {
        if (self::$connection === null) {
            // Construye una sola conexión MySQL por petición y fuerza UTF-8 completo.
            self::$connection = new PDO(
                'mysql:host=' .
                    DB_HOST .
                    ';port=' .
                    DB_PORT .
                    ';dbname=' .
                    DB_NAME .
                    ';charset=utf8mb4',
                DB_USER,
                DB_PASSWORD,
                [
                    // Convierte los errores SQL en excepciones para poder hacer rollback.
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    // Cada SELECT devuelve arrays con nombres de columnas como claves.
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    // MySQL prepara realmente las consultas; PDO no reemplaza parámetros localmente.
                    PDO::ATTR_EMULATE_PREPARES => false,
                ],
            );
            // Guarda las marcas de tiempo de la base en UTC, independientemente del servidor.
            self::$connection->exec("SET time_zone = '+00:00'");
        }
        return self::$connection;
    }
    /** SQL parametrizado: los valores de usuarios nunca se concatenan a la consulta. */
    public static function query(string $sql, array $values = []): PDOStatement
    {
        // Prepara la estructura SQL antes de incorporar valores externos.
        $statement = self::connection()->prepare($sql);
        // Sustituye cada ? por su valor correspondiente y ejecuta la consulta.
        $statement->execute($values);
        // Devuelve el resultado para permitir fetch(), fetchAll() o fetchColumn().
        return $statement;
    }
    /** Ejecuta una operación completa: confirma todos sus cambios o no confirma ninguno. */
    public static function transaction(callable $operation): mixed
    {
        $db = self::connection();
        // Desde este punto los cambios quedan pendientes hasta commit().
        $db->beginTransaction();
        try {
            // El servicio ejecuta aquí sus escrituras y el registro de auditoría.
            $result = $operation();
            // Si no hubo excepciones, confirma todos los cambios juntos.
            $db->commit();
            return $result;
        } catch (Throwable $error) {
            if ($db->inTransaction()) {
                // Ante cualquier error revierte todas las escrituras parciales.
                $db->rollBack();
            }
            // Propaga el error para que la capa HTTP construya la respuesta adecuada.
            throw $error;
        }
    }
}
