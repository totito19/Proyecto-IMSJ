<?php
declare(strict_types=1);
/** Agrupa franjas y agenda del alcance académico, junto a las reservas ciudadanas. */
final class ReservaController {
    private ReservaService $service;
    public function __construct() { $this->service = new ReservaService(); }
    /** Muestra franjas futuras con cupo; el filtro de tipo es opcional. */
    public function disponibles(): never {
        $tipo = isset($_GET['tipo']) ? Solicitud::option($_GET['tipo'], 'tipo', self::tipos()) : null;
        Response::json(['franjas' => $this->service->franjas(true, $tipo)]);
    }
    /** Listado administrativo, incluyendo franjas llenas o vencidas. */
    public function franjas(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['franjas' => $this->service->franjas()]);
    }
    /** Crea una franja tras validar fecha, horario y cupos. */
    public function crearFranja(): never { $this->saveFranja(); }
    /** No permite reducir cupos por debajo de las reservas ya existentes. */
    public function actualizarFranja(int $id): never { $this->saveFranja($id); }
    /** Las franjas con reservas no se eliminan. */
    public function eliminarFranja(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $this->service->eliminarFranja($id, $actor);
        Response::empty();
    }
    /** El servicio bloquea la franja antes de contar y reservar el último cupo. */
    public function store(): never {
        $user = Auth::requireUser('PUBLICO_GENERAL');
        $d = Solicitud::body();
        $id = Solicitud::number($d['franja_disponibilidad_id'] ?? null, 'franja_disponibilidad_id');
        Response::json(['reserva' => $this->service->reservar($id, $user)->toArray()], 201);
    }
    /** Cada ciudadano accede únicamente a sus propias reservas. */
    public function mine(): never {
        $user = Auth::requireUser('PUBLICO_GENERAL');
        Response::json(['reservas' => $this->service->propias($user)]);
    }
    /** La consulta de agenda calcula el período y un resumen de urgencias. */
    public function agenda(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        $vista = Solicitud::option($_GET['vista'] ?? 'dia', 'vista', ['dia', 'semana', 'mes']);
        $fecha = Solicitud::date($_GET['fecha'] ?? date('Y-m-d'), 'fecha');
        Response::json($this->service->agenda($vista, $fecha));
    }
    /** La unicidad del horario y su capacidad también se verifican en la transacción. */
    private function saveFranja(?int $id = null): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $data = ['fecha' => Solicitud::date($d['fecha'] ?? null, 'fecha'),
            'hora_inicio' => Solicitud::time($d['hora_inicio'] ?? null, 'hora_inicio'),
            'hora_fin' => Solicitud::time($d['hora_fin'] ?? null, 'hora_fin'),
            'tipo' => Solicitud::option($d['tipo'] ?? null, 'tipo', self::tipos()),
            'cupos_totales' => Solicitud::number($d['cupos_totales'] ?? null, 'cupos_totales', 1, 20)];
        if ($data['fecha'] < date('Y-m-d')) Response::invalid('fecha', 'La fecha no puede ser anterior a hoy.');
        if ($data['hora_fin'] <= $data['hora_inicio']) Response::invalid('hora_fin', 'El fin debe ser posterior al inicio.');
        Response::json(['franja' => $this->service->guardarFranja($data, $actor, $id)->toArray()], $id === null ? 201 : 200);
    }
    private static function tipos(): array { return ['PRUEBA_MANEJO', 'RENOVACION_NORMAL', 'RENOVACION_URGENTE']; }
}
