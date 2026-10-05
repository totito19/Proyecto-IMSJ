<?php
declare(strict_types=1);
/** Error HTTP recuperable. Las excepciones permiten revertir transacciones antes de responder. */
final class ApiException extends RuntimeException {
    public function __construct(public readonly int $status, string $message, public readonly array $errors = []) {
        parent::__construct($message);
    }
}
/** Salida HTTP uniforme, manteniendo las claves que consumen los dos frontends. */
final class Response {
    public static function json(array $body, int $status = 200): never {
        $encoded = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        echo $encoded;
        exit;
    }
    /** 204 significa éxito sin contenido: no se imprime JSON. */
    public static function empty(): never {
        http_response_code(204);
        exit;
    }
    public static function error(ApiException $error): never {
        $body = ['message' => $error->getMessage()];
        if ($error->errors !== []) $body['errors'] = $error->errors;
        self::json($body, $error->status);
    }
    public static function invalid(string $field, string $message): never {
        throw new ApiException(422, 'Los datos no son válidos.', [$field => [$message]]);
    }
}
