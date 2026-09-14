<?php

namespace App\Repositories\Contracts;

use App\Models\FranjaDisponibilidad;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define las operaciones de persistencia de las franjas de disponibilidad.
 */
interface FranjaDisponibilidadRepositoryInterface
{
    /**
     * Obtiene las franjas futuras que todavía tienen cupos disponibles.
     *
     * @return Collection<int, FranjaDisponibilidad>
     */
    public function obtenerDisponibles(?string $tipo = null): Collection;

    /**
     * Obtiene todas las franjas para la administración.
     *
     * @return Collection<int, FranjaDisponibilidad>
     */
    public function obtenerTodas(): Collection;

    /**
     * Crea una franja de disponibilidad.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): FranjaDisponibilidad;

    /**
     * Cuenta las reservas asociadas a una franja.
     */
    public function contarReservas(FranjaDisponibilidad $franja): int;

    /**
     * Indica si la franja ya posee reservas.
     */
    public function tieneReservas(FranjaDisponibilidad $franja): bool;

    /**
     * Actualiza una franja de disponibilidad.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(FranjaDisponibilidad $franja, array $datos): FranjaDisponibilidad;

    /**
     * Elimina una franja de disponibilidad.
     */
    public function eliminar(FranjaDisponibilidad $franja): void;

    /**
     * Carga la cantidad de reservas de una franja.
     */
    public function cargarCantidadReservas(FranjaDisponibilidad $franja): FranjaDisponibilidad;
}
