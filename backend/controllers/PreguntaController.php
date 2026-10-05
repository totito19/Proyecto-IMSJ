<?php
declare(strict_types=1);
/** Traduce las solicitudes del módulo pregunta a casos de uso del servicio. */
final class PreguntaController {
    private PreguntaService $service;
    public function __construct() { $this->service = new PreguntaService(); }
    /** Listado administrativo con acceso restringido al personal. */
    public function index(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['preguntas' => $this->service->listar()]);
    }
    /** Crear incluye validación y registro de auditoría en la transacción. */
    public function store(): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['pregunta' => $this->service->guardar($this->validate(), $actor)->toArray()], 201);
    }
    /** La edición conserva el identificador y exige todos los campos editables. */
    public function update(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['pregunta' => $this->service->guardar($this->validate(), $actor, $id)->toArray()]);
    }
    /** El servicio elimina el elemento y registra quién realizó la operación. */
    public function destroy(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $this->service->eliminar($id, $actor);
        Response::empty();
    }
    /** La ciudadanía solo ve preguntas frecuentes publicadas. */
    public function publicIndex(): never { Response::json(['preguntas' => $this->service->listar(true)]); }
    /** Publicar o retirar requiere personal y deja constancia en el historial. */
    public function updateEstado(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $estado = Solicitud::option($d['estado'] ?? null, 'estado', ['PUBLICADO', 'NO_PUBLICADO']);
        Response::json(['pregunta' => $this->service->estado($id, $estado, $actor)->toArray()]);
    }
    /** Los campos desconocidos no se trasladan a consultas SQL. */
    private function validate(): array {
        $d = Solicitud::body();
        return ['pregunta' => Solicitud::text($d, 'pregunta', 255), 'respuesta' => Solicitud::text($d, 'respuesta')];
    }
}
