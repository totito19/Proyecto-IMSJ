<?php
declare(strict_types=1);
/** Validación de materiales PDF, imagen y video; conserva el contrato del frontend. */
final class MaterialController {
    private MaterialService $service;
    public function __construct() { $this->service = new MaterialService(); }
    /** El catálogo ciudadano contiene únicamente materiales publicados. */
    public function publicIndex(): never { Response::json(['materiales' => $this->service->listar(true)]); }
    /** El personal ve todo el catálogo. */
    public function index(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['materiales' => $this->service->listar()]);
    }
    /** Crear material y auditoría se coordinan desde el servicio. */
    public function store(): never { $this->save(); }
    /** Un cambio de tipo exige entregar el recurso del nuevo tipo. */
    public function update(int $id): never { $this->save($id); }
    /** La publicación es una operación distinta de editar los datos. */
    public function updateEstado(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $estado = Solicitud::option($d['estado'] ?? null, 'estado', ['PUBLICADO', 'NO_PUBLICADO']);
        Response::json(['material' => $this->service->estado($id, $estado, $actor)->toArray()]);
    }
    /** Elimina el registro y, si corresponde, su archivo local. */
    public function destroy(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $this->service->eliminar($id, $actor);
        Response::empty();
    }
    /** Solo se aceptan campos conocidos y un archivo por solicitud. */
    private function save(?int $id = null): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $datos = ['nombre' => Solicitud::text($d, 'nombre', 255),
            'tipo' => Solicitud::option($d['tipo'] ?? null, 'tipo', ['PDF', 'IMAGEN', 'VIDEO'])];
        if (isset($d['ubicacion_recurso']) && $d['ubicacion_recurso'] !== '') $datos['ubicacion_recurso'] = Solicitud::url($d['ubicacion_recurso'], 'ubicacion_recurso');
        $files = Solicitud::files('archivo');
        if (count($files) > 1) Response::invalid('archivo', 'Seleccione un solo archivo.');
        $saved = $this->service->guardar($datos, $files, $actor, $id);
        Response::json(['material' => $saved->toArray()], $id === null ? 201 : 200);
    }
}
