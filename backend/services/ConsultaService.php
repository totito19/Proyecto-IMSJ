<?php
declare(strict_types=1);
/** Casos de uso del formulario público y de la bandeja interna. */
final class ConsultaService {
    private ConsultaRepository $repo;
    private UsuarioRepository $audit;
    public function __construct() {
        $this->repo = new ConsultaRepository();
        $this->audit = new UsuarioRepository();
    }
    public function listar(): array {
        return array_map(fn($consulta) => $consulta->toArray(), $this->repo->listar());
    }
    public function crear(array $datos): Consulta {
        return $this->repo->crear($datos);
    }
    public function marcarLeida(int $id, Usuario $actor): Consulta {
        $consulta = $this->repo->buscar($id) ?? throw new ApiException(404, 'No existe esa consulta.');
        if ((bool) $consulta->row['leida']) return $consulta;
        return Database::transaction(function () use ($id, $actor) {
            $saved = $this->repo->marcarLeida($id);
            $this->audit->registrar($actor->id(), 'LEER', 'Consulta', $id);
            return $saved;
        });
    }
}
