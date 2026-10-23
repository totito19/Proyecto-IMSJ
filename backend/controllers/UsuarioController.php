<?php
declare(strict_types=1);
/** Administración de personal e historial de las operaciones administrativas. */
final class UsuarioController
{
    private UsuarioService $service;
    public function __construct()
    {
        $this->service = new UsuarioService();
    }
    /** Solo lista cuentas de personal activas. */
    public function index(): never
    {
        Auth::requireUser('PERSONAL_IMSJ');
        Response::json(['usuarios' => $this->service->listar()]);
    }
    /** Conserva el mecanismo de clave inicial existente; requiere cambiarla en la gestión institucional pendiente. */
    public function store(): never
    {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $d = Solicitud::body();
        $rol = Solicitud::option($d['rol'] ?? 'PERSONAL_IMSJ', 'rol', [
            'PERSONAL_IMSJ',
            'DIRECTORA',
        ]);
        $user = $this->service->crear(
            Solicitud::nombre($d),
            Solicitud::cedula($d),
            $rol,
            $actor,
        );
        $data = $user->adminArray();
        unset($data['created_at']);
        Response::json(
            ['usuario' => $data, 'clave_inicial' => UsuarioService::INITIAL_PASSWORD],
            201,
        );
    }
    /** La cuenta se desactiva sin borrar sus reservas o registros de auditoría. */
    public function destroy(int $id): never
    {
        $actor = Auth::requireUser('PERSONAL_IMSJ');
        $this->service->desactivar($id, $actor);
        Response::empty();
    }
    /** El límite se valida antes de enviarlo como parámetro entero a SQL. */
    public function historial(): never
    {
        Auth::requireUser('PERSONAL_IMSJ');
        $limit = Solicitud::number($_GET['limite'] ?? 20, 'limite', 1, 50);
        // La campana conserva su contrato; Personal solicita el historial paginado.
        if (isset($_GET['pagina'])) {
            $page = Solicitud::number($_GET['pagina'], 'pagina', 1, 1000000);
            $filters = [];
            foreach (['buscar' => 200, 'accion' => 50, 'tipo' => 100] as $key => $max) {
                if (isset($_GET[$key]) && $_GET[$key] !== '') {
                    $filters[$key] = Solicitud::text($_GET, $key, $max);
                }
            }
            if (isset($_GET['usuario_id']) && $_GET['usuario_id'] !== '') {
                $filters['usuario_id'] = Solicitud::number($_GET['usuario_id'], 'usuario_id');
            }
            $dates = [];
            foreach (['desde', 'hasta'] as $key) {
                if (isset($_GET[$key]) && $_GET[$key] !== '') {
                    $dates[$key] = Solicitud::date($_GET[$key], $key);
                }
            }
            if (isset($dates['desde'], $dates['hasta']) && $dates['desde'] > $dates['hasta']) {
                Response::invalid('hasta', 'La fecha final no puede ser anterior a la inicial.');
            }
            // El rango representa días de Uruguay; la base conserva los instantes en UTC.
            foreach ($dates as $key => $date) {
                $boundary = new DateTimeImmutable($date, new DateTimeZone('America/Montevideo'));
                if ($key === 'hasta') {
                    $boundary = $boundary->modify('+1 day');
                }
                $filters[$key] = $boundary->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
            }
            Response::json($this->service->historialCompleto($page, $limit, $filters));
        }
        Response::json(['acciones' => $this->service->historial($limit)]);
    }
}
