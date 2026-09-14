<?php

namespace App\Services;

use App\Models\HistorialAccion;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Coordina los casos de uso relacionados con el historial de acciones.
 */
class HistorialAccionService
{
    /** Repositorio utilizado para consultar el historial. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(HistorialAccionRepositoryInterface $historialRepository)
    {
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene las últimas acciones registradas.
     *
     * @return Collection<int, HistorialAccion>
     */
    public function obtenerRecientes(int $limite): Collection
    {
        return $this->historialRepository->obtenerRecientes($limite);
    }
}
