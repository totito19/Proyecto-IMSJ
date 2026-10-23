<?php
declare(strict_types=1);

/** Prueba aislada del repositorio: SQLite en memoria; MySQL se cubre en integracion.py. */
require dirname(__DIR__) . '/core/Database.php';
require dirname(__DIR__) . '/repositories/UsuarioRepository.php';

$db = new Pdo\Sqlite('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
// Equivalentes locales de las dos funciones MySQL usadas por la búsqueda literal.
$db->createFunction('LOCATE', fn($needle, $haystack) => ($pos = stripos($haystack, $needle)) === false ? 0 : $pos + 1, 2);
$db->createFunction('CONCAT_WS', fn($separator, ...$values) => implode($separator, array_filter($values, fn($v) => $v !== null)), -1);
new ReflectionProperty(Database::class, 'connection')->setValue(null, $db);
$db->exec('CREATE TABLE usuarios (id INTEGER PRIMARY KEY, nombre TEXT, cedula TEXT, activo INTEGER)');
$db->exec('CREATE TABLE historial_acciones (id INTEGER PRIMARY KEY, usuario_id INTEGER, accion TEXT, tipo_elemento TEXT, elemento_id INTEGER, fecha_hora TEXT)');
$db->exec("INSERT INTO usuarios VALUES (1, 'Ana Pérez', '12345672', 1), (2, 'Mario Rodríguez', '44444444', 0)");
for ($id = 1; $id <= 121; $id++) {
    Database::query('INSERT INTO historial_acciones VALUES (?, ?, ?, ?, ?, ?)', [
        $id, $id % 2 ? 1 : 2, $id % 2 ? 'CREAR' : 'ACTUALIZAR',
        $id % 3 ? 'Noticia' : 'User', $id, '2026-10-23 03:00:00',
    ]);
}
Database::query("INSERT INTO historial_acciones VALUES (122, 1, 'CREAR', 'Noticia', 122, '2026-10-23 02:59:59')");
Database::query("INSERT INTO historial_acciones VALUES (123, 1, 'CREAR', 'Noticia', 123, '2026-10-24 02:59:59')");
Database::query("INSERT INTO historial_acciones VALUES (124, 1, 'CREAR', 'Noticia', 124, '2026-10-24 03:00:00')");

$checks = 0;
function check(bool $ok, string $message): void {
    global $checks;
    if (!$ok) throw new RuntimeException($message);
    $checks++;
}
$repo = new UsuarioRepository();
$ids = [];
foreach ([1, 2, 3] as $page) {
    $result = $repo->historialCompleto($page, 50, []);
    check($result['paginacion']['total'] === 124 && $result['paginacion']['paginas'] === 3, 'Total y páginas de todos los registros');
    $ids = [...$ids, ...array_column($result['acciones'], 'id')];
}
check(count($ids) === 124 && count(array_unique($ids)) === 124, 'Todas las páginas sin pérdidas ni duplicados');
check($ids[0] === 124 && $ids[1] === 123 && $ids[2] === 121 && end($ids) === 122, 'Orden cronológico con desempate por identificador');
$filtered = $repo->historialCompleto(1, 50, ['usuario_id' => 2, 'accion' => 'ACTUALIZAR', 'tipo' => 'Noticia']);
check($filtered['paginacion']['total'] === 40, 'Los filtros se combinan antes de paginar');
check(count($filtered['filtros']['usuarios']) === 2, 'Opciones incluyen actores inactivos');
check(count($filtered['filtros']['acciones']) === 2 && count($filtered['filtros']['tipos']) === 2, 'Opciones globales conservadas al filtrar');
$range = $repo->historialCompleto(1, 50, ['desde' => '2026-10-23 03:00:00', 'hasta' => '2026-10-24 03:00:00']);
check($range['paginacion']['total'] === 122 && $range['acciones'][0]['id'] === 123, 'Rango incluye el inicio y último segundo, excluye el día siguiente');
check($range['acciones'][0]['fecha_hora'] === '2026-10-24T02:59:59+00:00', 'Fecha pública ISO 8601 en UTC');
check($repo->historialCompleto(1, 50, ['buscar' => '44444444'])['paginacion']['total'] === 60, 'Búsqueda por cédula');
foreach (['%', '_', "' OR 1=1 --"] as $text) {
    $empty = $repo->historialCompleto(1, 20, ['buscar' => $text]);
    check($empty['acciones'] === [] && $empty['paginacion']['total'] === 0 && $empty['paginacion']['paginas'] === 0, 'Texto literal y sin inyección');
}
check(count($repo->historial(20)) === 20, 'Campana mantiene su límite y formato');
check($repo->historialCompleto(1000, 20, [])['acciones'] === [], 'Página fuera del rango responde vacía');
echo "OK: $checks comprobaciones del historial (SQLite en memoria).\n";
