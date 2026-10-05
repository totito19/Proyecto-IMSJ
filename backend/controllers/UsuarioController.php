<?php
declare(strict_types=1);
/** Administración de personal e historial de las operaciones administrativas. */
final class UsuarioController {
    private UsuarioService $service;
    public function __construct() { $this->service = new UsuarioService(); }
    /** Solo lista cuentas de personal activas. */
    public function index(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['usuarios' => $this->service->listar()]);
    }
    /** Conserva el mecanismo de clave inicial existente; requiere cambiarla en la gestión institucional pendiente. */
    public function store(): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $user = $this->service->crear(Solicitud::text($d, 'nombre', 120), Solicitud::cedula($d), $actor);
        $data = $user->adminArray();
        unset($data['created_at']); // El alta conserva id/nombre/cédula; la fecha pertenece al listado.
        Response::json(['usuario' => $data, 'clave_inicial' => UsuarioService::INITIAL_PASSWORD], 201);
    }
    /** La cuenta se desactiva sin borrar sus reservas o registros de auditoría. */
    public function destroy(int $id): never {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $this->service->desactivar($id, $actor);
        Response::empty();
    }
    /** El límite se valida antes de enviarlo como parámetro entero a SQL. */
    public function historial(): never {
        Auth::requireUser('PERSONAL_IMSJ');
        $limit = Solicitud::number($_GET['limite'] ?? 20, 'limite', 1, 50);
        Response::json(['acciones' => $this->service->historial($limit)]);
    }
}
