<?php
declare(strict_types=1);
/** Herramienta CLI: crear la primera cuenta, sin endpoint público de privilegios. */
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__) . '/config.php';
require dirname(__DIR__) . '/core/Database.php';
require dirname(__DIR__) . '/core/Response.php';
require dirname(__DIR__) . '/models/Solicitud.php';
$cedula = Solicitud::cedula(['cedula' => getenv('INITIAL_ADMIN_CEDULA') ?: '']);
$nombre = Solicitud::text(['nombre' => getenv('INITIAL_ADMIN_NOMBRE') ?: ''], 'nombre', 120);
$password = getenv('INITIAL_ADMIN_PASSWORD') ?: '';
if (mb_strlen($password) < 6 || strlen($password) > 72) throw new RuntimeException('INITIAL_ADMIN_PASSWORD debe tener al menos seis caracteres y hasta 72 bytes.');
if (Database::query("SELECT id FROM usuarios WHERE rol = 'PERSONAL_IMSJ' AND activo = 1 LIMIT 1")->fetch()) {
    throw new RuntimeException('Ya existe personal activo. Crear nuevas cuentas desde el panel.');
}
Database::query("INSERT INTO usuarios (nombre,cedula,password,rol,activo,created_at,updated_at) VALUES (?,?,?,'PERSONAL_IMSJ',1,UTC_TIMESTAMP(),UTC_TIMESTAMP())", [$nombre,$cedula,password_hash($password,PASSWORD_BCRYPT,['cost'=>12])]);
echo "Primera cuenta creada. No se imprime la contraseña.\n";
