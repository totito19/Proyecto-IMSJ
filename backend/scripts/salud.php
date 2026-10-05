<?php
declare(strict_types=1);
/** Comprobacion interna de Apache, esquema MySQL y portal, sin modificar datos. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/core/Database.php';
try {
    // Un volumen MySQL sano todavia puede estar importando el esquema inicial.
    Database::query('SELECT id FROM usuarios LIMIT 1');
    $context = stream_context_create(['http' => ['timeout' => 2]]);
    $health = @file_get_contents('http://127.0.0.1/api/health', false, $context);
    $portal = @file_get_contents('http://127.0.0.1/frontend-publico/', false, $context);
    if (!$health || (json_decode($health, true)['status'] ?? null) !== 'ok' || !$portal) {
        throw new RuntimeException('HTTP no disponible.');
    }
    echo "API, base y portal disponibles.\n";
    exit(0);
} catch (Throwable $error) {
    // El healthcheck no expone SQL, claves o trazas en sus resultados.
    fwrite(STDERR, "API, base o portal aun no disponibles.\n");
    exit(1);
}
