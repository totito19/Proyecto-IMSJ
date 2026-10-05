<?php
declare(strict_types=1);
/** Punto único de entrada: carga explícita, CORS, despacho de rutas y errores HTTP. */
require_once dirname(__DIR__) . '/config.php';
foreach (['core/Response.php', 'core/Database.php'] as $file) require_once dirname(__DIR__) . '/' . $file;
foreach (['models', 'repositories', 'services', 'controllers'] as $directory) {
    foreach (glob(dirname(__DIR__) . '/' . $directory . '/*.php') as $file) require_once $file;
}
require_once dirname(__DIR__) . '/core/Auth.php';

// La configuración permite ambos frontends mediante una lista de orígenes exactos.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_filter(array_map('trim', explode(',', FRONTEND_ORIGIN)));
if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, Accept');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        if ($origin !== '' && !in_array($origin, $allowed, true)) throw new ApiException(403, 'Origen no permitido.');
        Response::empty();
    }
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    // Ambos frontends editan archivos usando POST multipart con _method=PUT.
    // Solo se habilita esta compatibilidad para POST; las rutas siguen exigiendo su rol.
    if ($method === 'POST' && isset($_POST['_method'])) {
        $method = Solicitud::option($_POST['_method'], '_method', ['PUT', 'PATCH', 'DELETE']);
    }
    $path = rawurldecode((string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));

    // Los adjuntos se sirven sin exponer .env, SQL o archivos PHP del proyecto.
    if ($method === 'GET' && str_starts_with($path, '/storage/')) {
        $base = realpath(UPLOAD_ROOT);
        $file = realpath(UPLOAD_ROOT . '/' . substr($path, 9));
        if (!$base || !$file || !str_starts_with($file, $base . DIRECTORY_SEPARATOR) || !is_file($file)) throw new ApiException(404, 'Archivo no encontrado.');
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file);
        if (!in_array($mime, ['application/pdf','image/jpeg','image/png','image/webp'], true)) throw new ApiException(404, 'Archivo no disponible.');
        header('Content-Type: ' . $mime);
        header('X-Content-Type-Options: nosniff');
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }
    if (!str_starts_with($path, '/api/')) throw new ApiException(404, 'Ruta no encontrada.');
    $route = trim(substr($path, 5), '/');
    switch (true) {
        // GET /api/health: acceso publico.
        case $method === 'GET' && $route === 'health':
            Response::json(['status' => 'ok']);
        // POST /api/login: acceso publico.
        case $method === 'POST' && $route === 'login':
            (new AuthController())->login();
        // POST /api/register: acceso publico.
        case $method === 'POST' && $route === 'register':
            (new AuthController())->register();
        // GET /api/portal/noticias: acceso publico.
        case $method === 'GET' && $route === 'portal/noticias':
            (new NoticiaController())->publicIndex();
        // GET /api/portal/materiales: acceso publico.
        case $method === 'GET' && $route === 'portal/materiales':
            (new MaterialController())->publicIndex();
        // GET /api/portal/preguntas: acceso publico.
        case $method === 'GET' && $route === 'portal/preguntas':
            (new PreguntaController())->publicIndex();
        // GET /api/portal/prueba: acceso publico.
        case $method === 'GET' && $route === 'portal/prueba':
            (new PruebaController())->publicIndex();
        // POST /api/portal/prueba/corregir: acceso publico.
        case $method === 'POST' && $route === 'portal/prueba/corregir':
            (new PruebaController())->corregir();
        // GET /api/franjas/disponibles: acceso publico.
        case $method === 'GET' && $route === 'franjas/disponibles':
            (new ReservaController())->disponibles();
        // GET /api/me: acceso autenticado.
        case $method === 'GET' && $route === 'me':
            (new AuthController())->me();
        // POST /api/logout: acceso autenticado.
        case $method === 'POST' && $route === 'logout':
            (new AuthController())->logout();
        // POST /api/reservas: acceso ciudadano.
        case $method === 'POST' && $route === 'reservas':
            (new ReservaController())->store();
        // GET /api/reservas/mias: acceso ciudadano.
        case $method === 'GET' && $route === 'reservas/mias':
            (new ReservaController())->mine();
        // GET /api/historial: acceso personal.
        case $method === 'GET' && $route === 'historial':
            (new UsuarioController())->historial();
        // GET /api/usuarios-admin: acceso personal.
        case $method === 'GET' && $route === 'usuarios-admin':
            (new UsuarioController())->index();
        // POST /api/usuarios-admin: acceso personal.
        case $method === 'POST' && $route === 'usuarios-admin':
            (new UsuarioController())->store();
        // DELETE /api/usuarios-admin/{id}: acceso personal.
        case $method === 'DELETE' && preg_match('~^usuarios-admin/([1-9][0-9]*)$~D', $route, $match):
            (new UsuarioController())->destroy(Solicitud::number($match[1], 'id'));
        // GET /api/preguntas-prueba: acceso personal.
        case $method === 'GET' && $route === 'preguntas-prueba':
            (new PruebaController())->index();
        // POST /api/preguntas-prueba: acceso personal.
        case $method === 'POST' && $route === 'preguntas-prueba':
            (new PruebaController())->store();
        // PUT /api/preguntas-prueba/{id}: acceso personal.
        case $method === 'PUT' && preg_match('~^preguntas-prueba/([1-9][0-9]*)$~D', $route, $match):
            (new PruebaController())->update(Solicitud::number($match[1], 'id'));
        // DELETE /api/preguntas-prueba/{id}: acceso personal.
        case $method === 'DELETE' && preg_match('~^preguntas-prueba/([1-9][0-9]*)$~D', $route, $match):
            (new PruebaController())->destroy(Solicitud::number($match[1], 'id'));
        // GET /api/noticias: acceso personal.
        case $method === 'GET' && $route === 'noticias':
            (new NoticiaController())->index();
        // POST /api/noticias: acceso personal.
        case $method === 'POST' && $route === 'noticias':
            (new NoticiaController())->store();
        // GET /api/noticias/{id}: acceso personal.
        case $method === 'GET' && preg_match('~^noticias/([1-9][0-9]*)$~D', $route, $match):
            (new NoticiaController())->show(Solicitud::number($match[1], 'id'));
        // PUT /api/noticias/{id}: acceso personal.
        case $method === 'PUT' && preg_match('~^noticias/([1-9][0-9]*)$~D', $route, $match):
            (new NoticiaController())->update(Solicitud::number($match[1], 'id'));
        // PATCH /api/noticias/{id}/estado: acceso personal.
        case $method === 'PATCH' && preg_match('~^noticias/([1-9][0-9]*)/estado$~D', $route, $match):
            (new NoticiaController())->updateEstado(Solicitud::number($match[1], 'id'));
        // DELETE /api/noticias/{id}: acceso personal.
        case $method === 'DELETE' && preg_match('~^noticias/([1-9][0-9]*)$~D', $route, $match):
            (new NoticiaController())->destroy(Solicitud::number($match[1], 'id'));
        // GET /api/materiales: acceso personal.
        case $method === 'GET' && $route === 'materiales':
            (new MaterialController())->index();
        // POST /api/materiales: acceso personal.
        case $method === 'POST' && $route === 'materiales':
            (new MaterialController())->store();
        // PUT /api/materiales/{id}: acceso personal.
        case $method === 'PUT' && preg_match('~^materiales/([1-9][0-9]*)$~D', $route, $match):
            (new MaterialController())->update(Solicitud::number($match[1], 'id'));
        // PATCH /api/materiales/{id}/estado: acceso personal.
        case $method === 'PATCH' && preg_match('~^materiales/([1-9][0-9]*)/estado$~D', $route, $match):
            (new MaterialController())->updateEstado(Solicitud::number($match[1], 'id'));
        // DELETE /api/materiales/{id}: acceso personal.
        case $method === 'DELETE' && preg_match('~^materiales/([1-9][0-9]*)$~D', $route, $match):
            (new MaterialController())->destroy(Solicitud::number($match[1], 'id'));
        // GET /api/preguntas: acceso personal.
        case $method === 'GET' && $route === 'preguntas':
            (new PreguntaController())->index();
        // POST /api/preguntas: acceso personal.
        case $method === 'POST' && $route === 'preguntas':
            (new PreguntaController())->store();
        // PUT /api/preguntas/{id}: acceso personal.
        case $method === 'PUT' && preg_match('~^preguntas/([1-9][0-9]*)$~D', $route, $match):
            (new PreguntaController())->update(Solicitud::number($match[1], 'id'));
        // PATCH /api/preguntas/{id}/estado: acceso personal.
        case $method === 'PATCH' && preg_match('~^preguntas/([1-9][0-9]*)/estado$~D', $route, $match):
            (new PreguntaController())->updateEstado(Solicitud::number($match[1], 'id'));
        // DELETE /api/preguntas/{id}: acceso personal.
        case $method === 'DELETE' && preg_match('~^preguntas/([1-9][0-9]*)$~D', $route, $match):
            (new PreguntaController())->destroy(Solicitud::number($match[1], 'id'));
        // GET /api/franjas: acceso personal.
        case $method === 'GET' && $route === 'franjas':
            (new ReservaController())->franjas();
        // POST /api/franjas: acceso personal.
        case $method === 'POST' && $route === 'franjas':
            (new ReservaController())->crearFranja();
        // PUT /api/franjas/{id}: acceso personal.
        case $method === 'PUT' && preg_match('~^franjas/([1-9][0-9]*)$~D', $route, $match):
            (new ReservaController())->actualizarFranja(Solicitud::number($match[1], 'id'));
        // DELETE /api/franjas/{id}: acceso personal.
        case $method === 'DELETE' && preg_match('~^franjas/([1-9][0-9]*)$~D', $route, $match):
            (new ReservaController())->eliminarFranja(Solicitud::number($match[1], 'id'));
        // GET /api/agenda: acceso personal.
        case $method === 'GET' && $route === 'agenda':
            (new ReservaController())->agenda();
        default:
            throw new ApiException(404, 'Ruta no encontrada.');
    }
} catch (ApiException $error) {
    Response::error($error);
} catch (PDOException $error) {
    // Un choque de claves únicas por concurrencia es un conflicto recuperable.
    error_log('Error SQL IMSJ: ' . $error->getCode());
    if (($error->errorInfo[1] ?? null) === 1062) Response::json(['message' => 'El registro ya existe.'], 422);
    Response::json(['message' => 'No se pudo completar la operación.'], 500);
} catch (Throwable $error) {
    error_log('Error IMSJ: ' . $error::class . ': ' . $error->getMessage());
    Response::json(['message' => 'No se pudo completar la operación.'], 500);
}
