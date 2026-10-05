<?php
// Configuración PHP nativa: el entorno del proceso tiene precedencia sobre .env.
declare(strict_types=1);
foreach (is_file(__DIR__ . '/.env') ? file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES) : [] as $line) {
    $line = trim($line);
    if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
    [$key, $value] = explode('=', $line, 2);
    $key = trim($key);
    if (!preg_match('/^[A-Z_][A-Z0-9_]*$/D', $key) || getenv($key) !== false) continue;
    $value = trim($value);
    if (strlen($value) >= 2 && (($value[0] === '"' && str_ends_with($value, '"')) || ($value[0] === "'" && str_ends_with($value, "'")))) {
        $value = substr($value, 1, -1);
    }
    putenv($key . '=' . $value);
}
/** Lee una variable sin interpretar ni ejecutar el contenido del archivo. */
function envValue(string $key, string $default = ''): string {
    $value = getenv($key);
    return $value === false ? $default : $value;
}
define('APP_ENV', envValue('APP_ENV', 'production'));
define('APP_URL', rtrim(envValue('APP_URL', 'http://localhost:8000'), '/'));
define('FRONTEND_ORIGIN', envValue('FRONTEND_ORIGIN', 'http://localhost:8080'));
define('DB_HOST', envValue('DB_HOST', 'db'));
define('DB_PORT', envValue('DB_PORT', '3306'));
define('DB_NAME', envValue('DB_DATABASE', 'imsj'));
define('DB_USER', envValue('DB_USERNAME', 'imsj'));
define('DB_PASSWORD', envValue('DB_PASSWORD'));
define('UPLOAD_ROOT', envValue('UPLOAD_ROOT', __DIR__ . '/storage/app/public'));
define('CACHE_ROOT', envValue('CACHE_ROOT', __DIR__ . '/storage/cache'));
// Las fechas civiles se interpretan en Uruguay; los timestamps de SQL se guardan UTC.
date_default_timezone_set('America/Montevideo');
