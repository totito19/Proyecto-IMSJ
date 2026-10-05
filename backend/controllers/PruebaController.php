<?php
declare(strict_types=1);
/** Traduce las solicitudes del módulo prueba a casos de uso del servicio. */
final class PruebaController {
    private PruebaService $service;
    public function __construct() { $this->service = new PruebaService(); }
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
    /** El cuestionario público no incluye la respuesta correcta. */
    public function publicIndex(): never { Response::json(['preguntas' => $this->service->publica()]); }
    /** Valida la colección y delega la corrección; no persiste resultados personales. */
    public function corregir(): never {
        $d = Solicitud::body();
        $items = $d['respuestas'] ?? null;
        if (!is_array($items) || !array_is_list($items) || count($items) < 1 || count($items) > 20) Response::invalid('respuestas', 'Envíe entre 1 y 20 respuestas.');
        Response::json($this->service->corregir($items));
    }
    /** Los campos desconocidos no se trasladan a consultas SQL. */
    private function validate(): array {
        $d = Solicitud::body();
        $result = ['pregunta' => Solicitud::text($d, 'pregunta', 500)];
        foreach (['a', 'b', 'c', 'd'] as $letter) $result['opcion_' . $letter] = Solicitud::text($d, 'opcion_' . $letter, 255);
        $result['respuesta_correcta'] = Solicitud::option($d['respuesta_correcta'] ?? null, 'respuesta_correcta', ['A', 'B', 'C', 'D']);
        return $result;
    }
}
