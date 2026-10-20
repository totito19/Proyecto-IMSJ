<?php
declare(strict_types=1);
/** Recibe consultas públicas y expone su lectura al personal IMSJ. */
final class ConsultaController
{
    private ConsultaService $service;
    public function __construct()
    {
        $this->service = new ConsultaService();
    }
    public function store(): never
    {
        Auth::limitAttempts('consulta');
        $datos = Solicitud::body();
        $consulta = $this->service->crear([
            'nombre' => Solicitud::text($datos, 'nombre', 120),
            'email' => Solicitud::email($datos['email'] ?? null),
            'mensaje' => Solicitud::text($datos, 'mensaje', 2000),
        ]);
        Response::json(['consulta' => ['id' => $consulta->toArray()['id']]], 201);
    }
    public function index(): never
    {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['consultas' => $this->service->listar()]);
    }
    public function marcarLeida(int $id): never
    {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['consulta' => $this->service->marcarLeida($id, $actor)->toArray()]);
    }
}
