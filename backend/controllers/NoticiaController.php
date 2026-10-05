<?php
declare(strict_types=1);
/** Noticias, adjuntos y publicación; no guarda archivos ni ejecuta SQL directamente. */
final class NoticiaController {
    private NoticiaService $service;
    public function __construct() { $this->service = new NoticiaService(); }
    /** El portal filtra por publicación y período de vigencia. */
    public function publicIndex(): never { Response::json(['noticias' => $this->service->listar(true)]); }
    /** El personal puede consultar también borradores y noticias vencidas. */
    public function index(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['noticias' => $this->service->listar()]);
    }
    /** Devuelve una noticia completa, incluyendo galería y enlaces. */
    public function show(int $id): never {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['noticia' => $this->service->detalle($id)->toArray()]);
    }
    /** La creación comienza como NO_PUBLICADO. */
    public function store(): never { $this->save(); }
    /** PUT admite JSON o multipart cuando se reemplazan imágenes. */
    public function update(int $id): never { $this->save($id); }
    /** El cambio de estado queda auditado por el servicio. */
    public function updateEstado(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $estado = Solicitud::option($d['estado'] ?? null, 'estado', ['PUBLICADO', 'NO_PUBLICADO']);
        Response::json(['noticia' => $this->service->estado($id, $estado, $actor)->toArray()]);
    }
    /** Tras confirmar la eliminación se limpian los archivos locales asociados. */
    public function destroy(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $this->service->eliminar($id, $actor);
        Response::empty();
    }
    /** Valida fechas, cantidad de enlaces e imágenes antes de llamar al servicio. */
    private function save(?int $id = null): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $datos = ['titulo' => Solicitud::text($d, 'titulo', 255), 'texto' => Solicitud::text($d, 'texto'),
            'fecha_inicio_vigencia' => Solicitud::date($d['fecha_inicio_vigencia'] ?? null, 'fecha_inicio_vigencia'),
            'fecha_fin_vigencia' => Solicitud::date($d['fecha_fin_vigencia'] ?? null, 'fecha_fin_vigencia')];
        if ($datos['fecha_fin_vigencia'] < $datos['fecha_inicio_vigencia']) Response::invalid('fecha_fin_vigencia', 'El fin debe ser igual o posterior al inicio.');
        if (array_key_exists('enlaces', $d)) {
            if (!is_array($d['enlaces']) || !array_is_list($d['enlaces']) || count($d['enlaces']) > 5) Response::invalid('enlaces', 'Se admiten hasta cinco enlaces.');
            $datos['enlaces'] = array_map(fn($url) => Solicitud::url($url, 'enlaces'), $d['enlaces']);
        }
        $portada = Solicitud::files('imagen_portada');
        $galeria = Solicitud::files('galeria');
        if (count($portada) > 1) Response::invalid('imagen_portada', 'Se admite una portada.');
        if (count($galeria) > 5) Response::invalid('galeria', 'Se admiten hasta cinco imágenes.');
        $saved = $this->service->guardar($datos, $portada, $galeria, $actor, $id);
        Response::json(['noticia' => $saved->toArray()], $id === null ? 201 : 200);
    }
}
