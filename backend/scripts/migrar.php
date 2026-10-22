<?php
declare(strict_types=1);
/**
 * Actualiza de forma idempotente tanto bases nuevas como volúmenes Docker existentes.
 * No elimina registros: normaliza el estado histórico NO_PUBLICADO a BORRADOR.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/core/Database.php';

// En una base nueva, mysqladmin puede responder mientras el entrypoint aún
// reinicia el servidor temporal. Esperar aquí evita que Apache termine por esa carrera.
for ($attempt = 1; $attempt <= 45; $attempt++) {
    try {
        Database::connection();
        break;
    } catch (PDOException $error) {
        if ($attempt === 45) {
            throw $error;
        }
        sleep(2);
    }
}

$statements = [
    // Incorpora DIRECTORA a los roles válidos sin modificar las cuentas existentes.
    "ALTER TABLE usuarios MODIFY rol ENUM('PUBLICO_GENERAL','PERSONAL_IMSJ','DIRECTORA') NOT NULL DEFAULT 'PUBLICO_GENERAL'",
    // Admite temporalmente el estado histórico para poder migrarlo sin perder filas.
    "ALTER TABLE noticias MODIFY estado ENUM('NO_PUBLICADO','BORRADOR','PENDIENTE','APROBADO','PUBLICADO') NOT NULL DEFAULT 'BORRADOR'",
    // Convierte el estado antiguo de noticias al nuevo estado inicial del flujo editorial.
    "UPDATE noticias SET estado = 'BORRADOR' WHERE estado = 'NO_PUBLICADO'",
    // Retira el valor antiguo una vez que ninguna noticia lo utiliza.
    "ALTER TABLE noticias MODIFY estado ENUM('BORRADOR','PENDIENTE','APROBADO','PUBLICADO') NOT NULL DEFAULT 'BORRADOR'",
    // Repite la transición de estados para los materiales de estudio.
    "ALTER TABLE materiales_estudio MODIFY estado ENUM('NO_PUBLICADO','BORRADOR','PENDIENTE','APROBADO','PUBLICADO') NOT NULL DEFAULT 'BORRADOR'",
    "UPDATE materiales_estudio SET estado = 'BORRADOR' WHERE estado = 'NO_PUBLICADO'",
    "ALTER TABLE materiales_estudio MODIFY estado ENUM('BORRADOR','PENDIENTE','APROBADO','PUBLICADO') NOT NULL DEFAULT 'BORRADOR'",
    // Repite la transición de estados para las preguntas frecuentes.
    "ALTER TABLE preguntas_frecuentes MODIFY estado ENUM('NO_PUBLICADO','BORRADOR','PENDIENTE','APROBADO','PUBLICADO') NOT NULL DEFAULT 'BORRADOR'",
    "UPDATE preguntas_frecuentes SET estado = 'BORRADOR' WHERE estado = 'NO_PUBLICADO'",
    "ALTER TABLE preguntas_frecuentes MODIFY estado ENUM('BORRADOR','PENDIENTE','APROBADO','PUBLICADO') NOT NULL DEFAULT 'BORRADOR'",
    // Crea la bandeja de consultas solamente si el volumen antiguo todavía no la tiene.
    "CREATE TABLE IF NOT EXISTS consultas (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL,
        email VARCHAR(254) NOT NULL,
        mensaje TEXT NOT NULL,
        leida BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NULL,
        updated_at TIMESTAMP NULL,
        INDEX consultas_bandeja_index (leida, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
];

// Consulta el catálogo de MySQL para saber si preguntas_prueba ya admite imágenes.
$columns = Database::query("SHOW COLUMNS FROM preguntas_prueba LIKE 'imagen'")->fetch();
if (!$columns) {
    // La migración es idempotente: agrega la columna únicamente cuando está ausente.
    $statements[] =
        'ALTER TABLE preguntas_prueba ADD COLUMN imagen VARCHAR(2048) NULL AFTER pregunta';
}

// Las preguntas existentes quedan en General y las nuevas pueden clasificarse libremente.
$categoryColumn = Database::query(
    "SHOW COLUMNS FROM preguntas_frecuentes LIKE 'categoria'",
)->fetch();
if (!$categoryColumn) {
    $statements[] =
        "ALTER TABLE preguntas_frecuentes ADD COLUMN categoria VARCHAR(80) NOT NULL DEFAULT 'General' AFTER respuesta";
}
$categoryIndex = Database::query(
    "SHOW INDEX FROM preguntas_frecuentes WHERE Key_name = 'preguntas_categoria_estado_index'",
)->fetch();
if (!$categoryIndex) {
    $statements[] =
        'ALTER TABLE preguntas_frecuentes ADD INDEX preguntas_categoria_estado_index (categoria, estado)';
}

foreach ($statements as $statement) {
    // Ejecuta cada modificación de esquema o normalización reunida arriba.
    Database::connection()->exec($statement);
}
echo "Esquema IMSJ actualizado.\n";
