<?php

namespace App\Services;

use App\Models\FranjaDisponibilidad;
use App\Models\User;
use App\Repositories\Contracts\FranjaDisponibilidadRepositoryInterface;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Coordina las reglas de negocio de las franjas de disponibilidad.
 */
class FranjaDisponibilidadService
{
    /** Repositorio de franjas de disponibilidad. */
    private readonly FranjaDisponibilidadRepositoryInterface $franjaRepository;

    /** Repositorio de auditoría de acciones administrativas. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(
        FranjaDisponibilidadRepositoryInterface $franjaRepository,
        HistorialAccionRepositoryInterface $historialRepository,
    ) {
        $this->franjaRepository = $franjaRepository;
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene las franjas futuras con cupos disponibles.
     *
     * @return Collection<int, FranjaDisponibilidad>
     */
    public function obtenerDisponibles(?string $tipo = null): Collection
    {
        return $this->franjaRepository->obtenerDisponibles($tipo);
    }

    /**
     * Obtiene todas las franjas para su administración.
     *
     * @return Collection<int, FranjaDisponibilidad>
     */
    public function obtenerTodas(): Collection
    {
        return $this->franjaRepository->obtenerTodas();
    }

    /**
     * Crea una franja y registra la acción administrativa.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos, User $actor): FranjaDisponibilidad
    {
        return DB::transaction(function () use ($datos, $actor): FranjaDisponibilidad {
            $franja = $this->franjaRepository->crear($datos);
            $this->historialRepository->registrar($actor, 'CREAR', $franja);

            return $this->franjaRepository->cargarCantidadReservas($franja);
        });
    }

    /**
     * Actualiza una franja sin permitir menos cupos que reservas existentes.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(FranjaDisponibilidad $franja, array $datos, User $actor): FranjaDisponibilidad
    {
        if ($datos['cupos_totales'] < $this->franjaRepository->contarReservas($franja)) {
            throw ValidationException::withMessages([
                'cupos_totales' => ['Los cupos no pueden ser menores que las reservas existentes.'],
            ]);
        }

        return DB::transaction(function () use ($franja, $datos, $actor): FranjaDisponibilidad {
            $this->franjaRepository->actualizar($franja, $datos);
            $this->historialRepository->registrar($actor, 'ACTUALIZAR', $franja);

            return $this->franjaRepository->cargarCantidadReservas($franja);
        });
    }

    /**
     * Elimina una franja únicamente cuando no tiene reservas.
     */
    public function eliminar(FranjaDisponibilidad $franja, User $actor): void
    {
        if ($this->franjaRepository->tieneReservas($franja)) {
            throw ValidationException::withMessages([
                'franja' => ['No se puede eliminar una franja que tiene reservas.'],
            ]);
        }

        DB::transaction(function () use ($franja, $actor): void {
            $this->historialRepository->registrar($actor, 'ELIMINAR', $franja);
            $this->franjaRepository->eliminar($franja);
        });
    }
}
