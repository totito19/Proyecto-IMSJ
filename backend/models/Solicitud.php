<?php
declare(strict_types=1);
/** Datos de entrada HTTP y comprobaciones pequeñas reutilizadas por los controladores. */
final class Solicitud {
    private static ?array $body = null;
    public static function body(): array {
        if (self::$body !== null) return self::$body;
        $type = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
        if ($type === 'application/json') {
            $raw = file_get_contents('php://input');
            try { $decoded = json_decode($raw, true, 64, JSON_THROW_ON_ERROR); }
            catch (JsonException) { throw new ApiException(400, 'El cuerpo JSON no es válido.'); }
            if (!is_array($decoded) || !str_starts_with(ltrim($raw), '{')) throw new ApiException(400, 'Se espera un objeto JSON.');
            return self::$body = $decoded;
        }
        // PHP procesa POST multipart. PHP 8.5 también permite procesar PUT multipart directamente.
        if ($type === 'multipart/form-data' && ($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            [$_POST, $_FILES] = request_parse_body();
        }
        if ($type === 'application/x-www-form-urlencoded' && ($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            parse_str(file_get_contents('php://input'), $_POST);
        }
        if ($type === 'multipart/form-data' && $_POST === [] && $_FILES === [] && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
            throw new ApiException(413, 'El formulario supera el tamaño admitido por el servidor.');
        }
        return self::$body = $_POST;
    }
    public static function text(array $data, string $key, ?int $max = null): string {
        if (!isset($data[$key]) || !is_string($data[$key]) || trim($data[$key]) === '') Response::invalid($key, 'El campo es obligatorio y debe ser texto.');
        $value = trim($data[$key]);
        if ($max !== null && mb_strlen($value) > $max) Response::invalid($key, "El campo no puede superar $max caracteres.");
        if (strlen($value) > 65535) Response::invalid($key, 'El texto supera el tamaño admitido por la base.');
        return $value;
    }
    public static function number(mixed $value, string $key, int $min = 1, int $max = PHP_INT_MAX): int {
        if (is_bool($value) || !is_scalar($value) || filter_var($value, FILTER_VALIDATE_INT) === false) Response::invalid($key, 'Debe ser un número entero.');
        $number = (int) $value;
        if ($number < $min || $number > $max) Response::invalid($key, "Debe estar entre $min y $max.");
        return $number;
    }
    public static function option(mixed $value, string $key, array $allowed): string {
        if (!is_string($value) || !in_array($value, $allowed, true)) Response::invalid($key, 'El valor no está permitido.');
        return $value;
    }
    public static function date(mixed $value, string $key): string {
        if (!is_string($value)) Response::invalid($key, 'La fecha debe tener formato AAAA-MM-DD.');
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
        if (!$date || $date->format('Y-m-d') !== $value) Response::invalid($key, 'La fecha no es válida.');
        return $value;
    }
    public static function time(mixed $value, string $key): string {
        if (!is_string($value) || !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/D', $value)) Response::invalid($key, 'La hora debe tener formato HH:MM.');
        return $value;
    }
    public static function cedula(array $data): string {
        if (!isset($data['cedula']) || !is_string($data['cedula'])) Response::invalid('cedula', 'Ingrese una cédula.');
        $value = preg_replace('/\D/', '', $data['cedula']);
        if (!preg_match('/^\d{7,8}$/D', $value)) Response::invalid('cedula', 'La cédula debe tener entre 7 y 8 dígitos.');
        return $value;
    }
    public static function url(mixed $value, string $key): string {
        if (!is_string($value) || strlen($value) > 2048 || !filter_var($value, FILTER_VALIDATE_URL) || !in_array(strtolower((string) parse_url($value, PHP_URL_SCHEME)), ['http', 'https'], true)) Response::invalid($key, 'Se requiere una URL HTTP o HTTPS válida.');
        return $value;
    }
    /** Normaliza $_FILES tanto para archivo único como para galeria[]. */
    public static function files(string $key): array {
        if (!isset($_FILES[$key])) return [];
        $file = $_FILES[$key];
        if (!is_array($file['name'])) return (int) $file['error'] === UPLOAD_ERR_NO_FILE ? [] : [$file];
        $result = [];
        foreach (array_keys($file['name']) as $i) {
            $item = [];
            foreach (['name', 'type', 'tmp_name', 'error', 'size'] as $part) $item[$part] = $file[$part][$i] ?? null;
            if ($item['error'] !== UPLOAD_ERR_NO_FILE) $result[] = $item;
        }
        return $result;
    }
}
