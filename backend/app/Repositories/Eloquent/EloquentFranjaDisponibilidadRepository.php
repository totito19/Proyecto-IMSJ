<?php

namespace App\Repositories\Eloquent;

use App\Models\FranjaDisponibilidad;
use App\Repositories\Contracts\FranjaDisponibilidadRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementa la persistencia de franjas de disponibilidad con Eloquent.
 */
class EloquentFranjaDisponibilidadRepository implements FranjaDisponibilidadRepositoryInterface
{
    /**
     * Obtiene las franjas futuras con al menos un cupo libre.
     *
     * @return Collection<int, FranjaDisponibilidad>
     */
    public function obtenerDisponibles(?string $tipo = null): Collection
    {
        return FranjaDisponibilidad::query()
            ->when($tipo !== null, fn ($query) => $query->where('tipo', $tipo))
            ->whereDate('fecha', '>=', today())
            ->withCount('reservas')
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->filter(fn (FranjaDisponibilidad $franja): bool => $franja->reservas_count < $franja->cupos_totales)
            ->values();
    }

    /**
     * Obtiene todas las franjas con su cantidad de reservas.
     *
     * @return Collection<int, FranjaDisponibilidad>
     */
    public function obtenerTodas(): Collection
    {
        return FranjaDisponibilidad::query()
            ->withCount('reservas')
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get();
    }

    /**
     * Persiste una nueva franja.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): FranjaDisponibilidad
    {
        return FranjaDisponibilidad::query()->create($datos);
    }

    /**
     * Cuenta las reservas asociadas a la franja.
     */
    public function contarReservas(FranjaDisponibilidad $franja): int
    {
        return $franja->reservas()->count();
    }

    /**
     * Indica si la franja ya posee alguna reserva.
     */
    public function tieneReservas(FranjaDisponibilidad $franja): bool
    {
        return $franja->reservas()->exists();
    }

    /**
     * Persiste los cambios de una franja.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(FranjaDisponibilidad $franja, array $datos): FranjaDisponibilidad
    {
        $franja->update($datos);

        return $franja;
    }

    /**
     * Elimina una franja.
     */
    public function eliminar(FranjaDisponibilidad $franja): void
    {
        $franja->delete();
    }

    /**
     * Carga la cantidad de reservas para construir la respuesta pública.
     */
    public function cargarCantidadReservas(FranjaDisponibilidad $franja): FranjaDisponibilidad
    {
        return $franja->loadCount('reservas');
    }
}
