<?php
declare(strict_types=1);
/** Una conexión PDO por petición; los repositorios comparten la misma transacción. */
final class Database {
    private static ?PDO $connection = null;
    public static function connection(): PDO {
        if (self::$connection === null) {
            self::$connection = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASSWORD, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            self::$connection->exec("SET time_zone = '+00:00'");
        }
        return self::$connection;
    }
    /** SQL parametrizado: los valores de usuarios nunca se concatenan a la consulta. */
    public static function query(string $sql, array $values = []): PDOStatement {
        $statement = self::connection()->prepare($sql);
        $statement->execute($values);
        return $statement;
    }
    public static function transaction(callable $operation): mixed {
        $db = self::connection();
        $db->beginTransaction();
        try {
            $result = $operation();
            $db->commit();
            return $result;
        } catch (Throwable $error) {
            if ($db->inTransaction()) $db->rollBack();
            throw $error;
        }
    }
}
