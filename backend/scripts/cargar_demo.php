<?php
declare(strict_types=1);

/**
 * Carga idempotente para demostraciones del portal IMSJ.
 * Conserva los datos existentes y actualiza únicamente los ejemplos identificados por su texto.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/core/Database.php';

$force = in_array('--force', $argv, true);
if (APP_ENV === 'production' && !$force) {
    throw new RuntimeException(
        'La carga de demostración está deshabilitada en production. Use --force solo en una instalación destinada a demo.',
    );
}

/** Guarda un PDF pequeño y autocontenido sin depender de bibliotecas externas. */
function crearPdfDemo(string $path, string $titulo, array $lineas): void
{
    $escapar = static fn(string $text): string => str_replace(
        ['\\', '(', ')'],
        ['\\\\', '\\(', '\\)'],
        $text,
    );
    $content = "BT\n/F1 18 Tf\n60 790 Td\n(" . $escapar($titulo) . ") Tj\n";
    foreach ($lineas as $linea) {
        $content .= "0 -30 Td\n/F1 11 Tf\n(" . $escapar($linea) . ") Tj\n";
    }
    $content .= "ET\n";

    $objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        "<< /Length " . strlen($content) . " >>\nstream\n{$content}endstream",
    ];
    $pdf = "%PDF-1.4\n";
    $offsets = [0];
    foreach ($objects as $index => $object) {
        $offsets[] = strlen($pdf);
        $number = $index + 1;
        $pdf .= "{$number} 0 obj\n{$object}\nendobj\n";
    }
    $xref = strlen($pdf);
    $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
    foreach (array_slice($offsets, 1) as $offset) {
        $pdf .= sprintf('%010d 00000 n ', $offset) . "\n";
    }
    $pdf .=
        'trailer << /Size ' .
        (count($objects) + 1) .
        " /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF\n";
    if (file_put_contents($path, $pdf) === false) {
        throw new RuntimeException("No se pudo crear {$path}.");
    }
}

/** Busca un recurso visual tanto en ejecución local como dentro de Docker. */
function buscarImagenDemo(string $name): ?string
{
    foreach (
        [
            dirname(__DIR__, 2) . '/frontend-publico/img/' . $name,
            '/var/www/frontend-publico/img/' . $name,
        ]
        as $candidate
    ) {
        if (is_file($candidate)) {
            return $candidate;
        }
    }
    return null;
}

/** Crea o actualiza una fila usando una columna textual estable como identificador. */
function guardarEjemplo(string $table, string $key, array $values): array
{
    $existing = Database::query(
        "SELECT id FROM {$table} WHERE {$key} = ? ORDER BY id LIMIT 1",
        [$values[$key]],
    )->fetch();
    if ($existing) {
        $columns = array_keys($values);
        $assignments = implode(', ', array_map(fn(string $column) => "{$column} = ?", $columns));
        Database::query(
            "UPDATE {$table} SET {$assignments}, updated_at = UTC_TIMESTAMP() WHERE id = ?",
            [...array_values($values), (int) $existing['id']],
        );
        return ['id' => (int) $existing['id'], 'created' => false];
    }
    $columns = array_keys($values);
    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    Database::query(
        'INSERT INTO ' .
            $table .
            ' (' .
            implode(', ', $columns) .
            ", created_at, updated_at) VALUES ({$placeholders}, UTC_TIMESTAMP(), UTC_TIMESTAMP())",
        array_values($values),
    );
    return ['id' => (int) Database::connection()->lastInsertId(), 'created' => true];
}

/** Agrega una entrada de auditoría una sola vez cuando existe personal activo. */
function auditarDemo(?int $actor, string $accion, string $tipo, int $id): void
{
    if ($actor === null) {
        return;
    }
    Database::query(
        'INSERT INTO historial_acciones (usuario_id, accion, tipo_elemento, elemento_id, fecha_hora)
         SELECT ?, ?, ?, ?, UTC_TIMESTAMP()
         WHERE NOT EXISTS (
             SELECT 1 FROM historial_acciones
             WHERE usuario_id = ? AND accion = ? AND tipo_elemento = ? AND elemento_id = ?
         )',
        [$actor, $accion, $tipo, $id, $actor, $accion, $tipo, $id],
    );
}

/** Devuelve fechas hábiles futuras para que la agenda no caduque al día siguiente. */
function fechasHabilesDemo(int $cantidad): array
{
    $dates = [];
    $date = new DateTimeImmutable('tomorrow', new DateTimeZone('America/Montevideo'));
    while (count($dates) < $cantidad) {
        if ((int) $date->format('N') <= 5) {
            $dates[] = $date->format('Y-m-d');
        }
        $date = $date->modify('+1 day');
    }
    return $dates;
}

$storage = rtrim(UPLOAD_ROOT, '/\\');
foreach (['noticias', 'materiales'] as $folder) {
    $directory = $storage . '/' . $folder;
    if (!is_dir($directory) && !mkdir($directory, 0770, true) && !is_dir($directory)) {
        throw new RuntimeException("No se pudo crear {$directory}.");
    }
}

$fachada = buscarImagenDemo('Imagen_fachada.png');
$escudo = buscarImagenDemo('eSanjo.png');
if ($fachada) {
    copy($fachada, $storage . '/noticias/demo-fachada.png');
    copy($fachada, $storage . '/materiales/demo-sede.png');
}
if ($escudo) {
    copy($escudo, $storage . '/noticias/demo-escudo.png');
}
crearPdfDemo($storage . '/materiales/guia-prueba-teorica-demo.pdf', 'GUIA PARA LA PRUEBA TEORICA', [
    'Repase las senales, prioridades de paso y normas de circulacion.',
    'Lea cada pregunta completa antes de elegir una respuesta.',
    'Use el simulador del portal para practicar con diez preguntas.',
    'Este archivo contiene datos ficticios preparados para una demostracion.',
]);
crearPdfDemo($storage . '/materiales/checklist-conduccion-demo.pdf', 'LISTA PREVIA A LA CONDUCCION', [
    'Documentacion vigente y cinturon de seguridad para todos.',
    'Luces, espejos, cubiertas y frenos en condiciones.',
    'Telefono guardado y cero alcohol antes de conducir.',
    'Contenido de ejemplo; confirme siempre la normativa vigente.',
]);

$today = new DateTimeImmutable('today', new DateTimeZone('America/Montevideo'));
$start = $today->modify('-7 days')->format('Y-m-d');
$end = $today->modify('+60 days')->format('Y-m-d');
$actorRow = Database::query(
    "SELECT id FROM usuarios WHERE activo = 1 AND rol IN ('DIRECTORA','PERSONAL_IMSJ') ORDER BY rol = 'DIRECTORA' DESC, id LIMIT 1",
)->fetch();
$actor = $actorRow ? (int) $actorRow['id'] : null;

$resumen = Database::transaction(function () use ($start, $end, $actor): array {
    $counts = [
        'noticias' => 0,
        'materiales' => 0,
        'preguntas_frecuentes' => 0,
        'preguntas_simulacro' => 0,
        'consultas' => 0,
        'franjas' => 0,
        'reservas' => 0,
    ];

    $news = [
        ['Operativo especial de educación vial en centros de estudio', 'Durante las próximas semanas el equipo de Tránsito visitará centros educativos de San José con actividades sobre convivencia, prevención y movilidad segura.', 'noticias/demo-fachada.png', 'PUBLICADO'],
        ['Nuevas fechas para pruebas prácticas de manejo', 'Se habilitaron nuevas fechas y horarios para pruebas prácticas. Las personas registradas pueden consultar los cupos y reservar desde la agenda del portal.', 'noticias/demo-escudo.png', 'PUBLICADO'],
        ['Recordatorio: documentación para renovar la licencia', 'Para iniciar la renovación concurrí con cédula vigente, licencia anterior y la documentación complementaria que corresponda a tu categoría.', 'noticias/demo-fachada.png', 'PUBLICADO'],
        ['Semana de la seguridad vial en San José', 'La Intendencia realizará una semana de sensibilización con propuestas para peatones, ciclistas, motociclistas y conductores.', 'noticias/demo-escudo.png', 'PUBLICADO'],
        ['Ampliación de horarios de atención', 'Se prepara una ampliación temporal de horarios para atender la demanda de trámites de licencia de conducir.', 'noticias/demo-fachada.png', 'PENDIENTE'],
        ['Borrador: jornada de capacitación para motociclistas', 'Contenido en preparación para una futura jornada sobre casco, visibilidad y conducción preventiva.', null, 'BORRADOR'],
    ];
    foreach ($news as [$title, $text, $image, $state]) {
        $saved = guardarEjemplo('noticias', 'titulo', [
            'titulo' => $title,
            'texto' => $text,
            'fecha_inicio_vigencia' => $start,
            'fecha_fin_vigencia' => $end,
            'imagen_portada' => $image,
            'estado' => $state,
        ]);
        Database::query('DELETE FROM noticia_enlaces WHERE noticia_id = ?', [$saved['id']]);
        Database::query(
            'INSERT INTO noticia_enlaces (noticia_id, url, created_at, updated_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
            [$saved['id'], 'https://www.gub.uy/unidad-nacional-seguridad-vial/'],
        );
        auditarDemo($actor, 'CREAR', 'Noticia', $saved['id']);
        if ($state === 'PENDIENTE') {
            auditarDemo($actor, 'ENVIAR_REVISION', 'Noticia', $saved['id']);
        } elseif ($state === 'PUBLICADO') {
            auditarDemo($actor, 'PUBLICAR', 'Noticia', $saved['id']);
        }
        $counts['noticias']++;
    }

    $materials = [
        ['Guía rápida para preparar la prueba teórica', 'PDF', 'materiales/guia-prueba-teorica-demo.pdf', 'PUBLICADO'],
        ['Lista de control antes de conducir', 'PDF', 'materiales/checklist-conduccion-demo.pdf', 'PUBLICADO'],
        ['Referencia visual de la sede de atención', 'IMAGEN', 'materiales/demo-sede.png', 'PUBLICADO'],
        ['Videos de educación y seguridad vial', 'VIDEO', 'https://www.youtube.com/results?search_query=UNASEV+educacion+vial', 'PUBLICADO'],
        ['Curso para motociclistas — próxima publicación', 'VIDEO', 'https://www.youtube.com/results?search_query=UNASEV+motociclistas', 'PENDIENTE'],
        ['Borrador de material para nuevos conductores', 'PDF', 'materiales/guia-prueba-teorica-demo.pdf', 'BORRADOR'],
    ];
    foreach ($materials as [$name, $type, $location, $state]) {
        $saved = guardarEjemplo('materiales_estudio', 'nombre', [
            'nombre' => $name,
            'tipo' => $type,
            'ubicacion_recurso' => $location,
            'estado' => $state,
        ]);
        auditarDemo($actor, 'CREAR', 'MaterialEstudio', $saved['id']);
        if ($state === 'PENDIENTE') {
            auditarDemo($actor, 'ENVIAR_REVISION', 'MaterialEstudio', $saved['id']);
        } elseif ($state === 'PUBLICADO') {
            auditarDemo($actor, 'PUBLICAR', 'MaterialEstudio', $saved['id']);
        }
        $counts['materiales']++;
    }

    $faqs = [
        ['¿Cómo reservo una fecha para la prueba de manejo?', 'Ingresá con tu cuenta, abrí la agenda, elegí una franja de prueba de manejo con cupo y confirmá la reserva.', 'Prueba de manejo', 'PUBLICADO'],
        ['¿Puedo cancelar una reserva?', 'Sí. Desde la sección de tus reservas podés cancelar una fecha futura; el cupo queda disponible nuevamente.', 'Reservas', 'PUBLICADO'],
        ['¿Qué documentación llevo para renovar?', 'Como base, llevá cédula vigente y licencia anterior. Según la categoría o situación pueden solicitarse documentos adicionales.', 'Renovación', 'PUBLICADO'],
        ['¿Dónde consulto los horarios disponibles?', 'La agenda pública muestra únicamente fechas futuras con cupos. Podés filtrar por prueba de manejo o tipo de renovación.', 'Reservas', 'PUBLICADO'],
        ['¿El simulacro reemplaza la prueba oficial?', 'No. Es una herramienta de práctica y orientación; la evaluación oficial se realiza por el procedimiento institucional.', 'Simulacro', 'PUBLICADO'],
        ['¿Cuántas preguntas tiene cada simulacro?', 'Cada intento presenta diez preguntas elegidas del banco disponible y permite revisar las respuestas al finalizar.', 'Simulacro', 'PUBLICADO'],
        ['¿Puedo usar materiales desde el celular?', 'Sí. Los materiales publicados se abren desde el navegador en teléfono, tableta o computadora.', 'Materiales', 'PUBLICADO'],
        ['¿Cómo envío una consulta?', 'Completá el formulario de contacto con tu nombre, correo y mensaje. El equipo podrá marcarla como leída desde el panel.', 'Atención', 'PUBLICADO'],
        ['¿Se habilitarán jornadas especiales?', 'La respuesta está siendo revisada antes de publicarse.', 'Atención', 'PENDIENTE'],
        ['Borrador: requisitos para categorías profesionales', 'Contenido en preparación para validación institucional.', 'Renovación', 'BORRADOR'],
    ];
    foreach ($faqs as [$question, $answer, $category, $state]) {
        $saved = guardarEjemplo('preguntas_frecuentes', 'pregunta', [
            'pregunta' => $question,
            'respuesta' => $answer,
            'categoria' => $category,
            'estado' => $state,
        ]);
        auditarDemo($actor, 'CREAR', 'PreguntaFrecuente', $saved['id']);
        if ($state === 'PENDIENTE') {
            auditarDemo($actor, 'ENVIAR_REVISION', 'PreguntaFrecuente', $saved['id']);
        } elseif ($state === 'PUBLICADO') {
            auditarDemo($actor, 'PUBLICAR', 'PreguntaFrecuente', $saved['id']);
        }
        $counts['preguntas_frecuentes']++;
    }

    $quiz = [
        ['¿Qué corresponde hacer ante una luz roja del semáforo?', 'Detenerse antes de la línea de detención', 'Acelerar para liberar el cruce', 'Tocar bocina y continuar', 'Avanzar si no se ven vehículos', 'A'],
        ['¿Quiénes deben utilizar cinturón de seguridad?', 'Solo quien conduce', 'Quienes viajan adelante', 'Todas las personas ocupantes', 'Solo menores de edad', 'C'],
        ['Al acercarse a un cruce peatonal con personas esperando, ¿qué debe hacer?', 'Aumentar la velocidad', 'Ceder el paso y detenerse si es necesario', 'Circular por la banquina', 'Hacer señas para que esperen', 'B'],
        ['¿Cuál es la conducta segura respecto del teléfono mientras se conduce?', 'Usarlo solo en calles tranquilas', 'Escribir mensajes en los semáforos', 'Sostenerlo con una mano', 'Evitar su uso y detenerse en un lugar seguro si es imprescindible', 'D'],
        ['¿Qué indica la señal PARE?', 'Reducir un poco la velocidad', 'Detener completamente el vehículo y continuar cuando sea seguro', 'Prioridad para quien llega primero', 'Estacionamiento permitido', 'B'],
        ['Si comienza a llover, ¿qué medida mejora la seguridad?', 'Aumentar la distancia con el vehículo de adelante', 'Frenar bruscamente en cada curva', 'Apagar las luces', 'Circular más cerca del vehículo anterior', 'A'],
        ['Antes de cambiar de carril corresponde:', 'Mirar solo el espejo interior', 'Señalizar después de moverse', 'Señalizar, revisar espejos y punto ciego', 'Tocar bocina de forma continua', 'C'],
        ['¿Para qué sirve el casco correctamente abrochado?', 'Solo para evitar multas', 'Para reducir el riesgo de lesiones en la cabeza', 'Para protegerse únicamente de la lluvia', 'Para circular a mayor velocidad', 'B'],
        ['¿Qué debe hacer si siente sueño al conducir?', 'Abrir la ventanilla y seguir', 'Acelerar para llegar antes', 'Detenerse en un lugar seguro y descansar', 'Usar el teléfono para mantenerse despierto', 'C'],
        ['¿Qué implica mantener distancia de seguridad?', 'Tener espacio para reaccionar y frenar', 'Circular pegado para evitar adelantamientos', 'Mirar únicamente las luces traseras', 'Usar siempre las luces largas', 'A'],
        ['Al salir de un estacionamiento, la conducta correcta es:', 'Salir rápidamente para ganar prioridad', 'Verificar el entorno y ceder el paso', 'Confiar solo en la cámara', 'Tocar bocina y avanzar sin mirar', 'B'],
        ['¿Qué debe comprobarse antes de iniciar la marcha?', 'Solo el nivel de combustible', 'Únicamente la radio', 'Entorno, espejos y condiciones básicas del vehículo', 'Que las ventanillas estén cerradas', 'C'],
        ['Frente a un vehículo de emergencia con señales activas corresponde:', 'Facilitarle el paso de forma segura', 'Seguirlo de cerca', 'Bloquear el carril', 'Acelerar para competir por el cruce', 'A'],
        ['¿Cuál es la opción más segura respecto del alcohol y la conducción?', 'Beber café después', 'Esperar diez minutos', 'Conducir despacio', 'No consumir alcohol antes de conducir', 'D'],
        ['Si una pelota cruza la calle cerca de una escuela, conviene:', 'Mantener la velocidad', 'Reducir la velocidad y prepararse para detenerse', 'Adelantar al vehículo anterior', 'Circular por el centro de la calzada', 'B'],
    ];
    foreach ($quiz as [$question, $a, $b, $c, $d, $correct]) {
        $saved = guardarEjemplo('preguntas_prueba', 'pregunta', [
            'pregunta' => $question,
            'imagen' => null,
            'opcion_a' => $a,
            'opcion_b' => $b,
            'opcion_c' => $c,
            'opcion_d' => $d,
            'respuesta_correcta' => $correct,
        ]);
        auditarDemo($actor, 'CREAR', 'PreguntaPrueba', $saved['id']);
        $counts['preguntas_simulacro']++;
    }

    $queries = [
        ['Lucía Fernández', 'lucia.demo@example.org', '¿Qué documentación necesito para renovar una licencia que vence el próximo mes?', 0, -2],
        ['Carlos Méndez', 'carlos.demo@example.org', 'Quisiera saber si hay cupos para una prueba práctica durante la mañana.', 0, -24],
        ['Sofía Rodríguez', 'sofia.demo@example.org', 'No encuentro una reserva que realicé. ¿Pueden orientarme?', 1, -48],
        ['Martín Silva', 'martin.demo@example.org', '¿Los materiales del simulacro se pueden descargar?', 1, -72],
        ['Valentina Pereira', 'valentina.demo@example.org', 'Consulta de ejemplo sobre renovación urgente y plazos de atención.', 0, -4],
    ];
    foreach ($queries as [$name, $email, $message, $read, $hoursAgo]) {
        $saved = guardarEjemplo('consultas', 'email', [
            'nombre' => $name,
            'email' => $email,
            'mensaje' => $message,
            'leida' => $read,
        ]);
        Database::query(
            'UPDATE consultas SET created_at = DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? HOUR) WHERE id = ?',
            [$hoursAgo, $saved['id']],
        );
        if ($read) {
            auditarDemo($actor, 'LEER', 'Consulta', $saved['id']);
        }
        $counts['consultas']++;
    }

    $slots = [
        ['08:30:00', '09:00:00', 'PRUEBA_MANEJO', 4],
        ['09:15:00', '09:45:00', 'RENOVACION_NORMAL', 6],
        ['10:00:00', '10:30:00', 'RENOVACION_URGENTE', 2],
    ];
    $slotIds = [];
    foreach (fechasHabilesDemo(6) as $date) {
        foreach ($slots as [$from, $to, $type, $capacity]) {
            Database::query(
                'INSERT INTO franjas_disponibilidad (fecha, hora_inicio, hora_fin, tipo, cupos_totales, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
                 ON DUPLICATE KEY UPDATE cupos_totales = VALUES(cupos_totales), updated_at = UTC_TIMESTAMP()',
                [$date, $from, $to, $type, $capacity],
            );
            $id = (int) Database::query(
                'SELECT id FROM franjas_disponibilidad WHERE fecha = ? AND hora_inicio = ? AND hora_fin = ? AND tipo = ?',
                [$date, $from, $to, $type],
            )->fetchColumn();
            $slotIds[] = $id;
            auditarDemo($actor, 'CREAR', 'FranjaDisponibilidad', $id);
            $counts['franjas']++;
        }
    }

    $demoUsers = [
        ['Ciudadana Demo', '90000002'],
        ['Conductor Demo', '90000018'],
    ];
    $userIds = [];
    foreach ($demoUsers as [$name, $cedula]) {
        $existing = Database::query('SELECT id, nombre FROM usuarios WHERE cedula = ?', [$cedula])->fetch();
        if (!$existing) {
            Database::query(
                "INSERT INTO usuarios (nombre, cedula, password, rol, activo, created_at, updated_at)
                 VALUES (?, ?, ?, 'PUBLICO_GENERAL', 1, UTC_TIMESTAMP(), UTC_TIMESTAMP())",
                [$name, $cedula, password_hash('DemoVial2026!', PASSWORD_BCRYPT, ['cost' => 12])],
            );
            $userIds[] = (int) Database::connection()->lastInsertId();
        } elseif ($existing['nombre'] === $name) {
            $userIds[] = (int) $existing['id'];
        }
    }
    foreach ($userIds as $index => $userId) {
        foreach (array_slice($slotIds, $index, 2) as $slotId) {
            Database::query(
                'INSERT INTO reservas (usuario_id, franja_disponibilidad_id, created_at, updated_at)
                 VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())
                 ON DUPLICATE KEY UPDATE updated_at = updated_at',
                [$userId, $slotId],
            );
            $counts['reservas']++;
        }
    }
    return $counts;
});

echo "Contenido de demostración listo (sin eliminar datos existentes):\n";
foreach ($resumen as $module => $count) {
    echo '- ' . str_replace('_', ' ', $module) . ": {$count}\n";
}
echo "Cuentas ciudadanas de demo: 90000002 y 90000018 / clave DemoVial2026!\n";

