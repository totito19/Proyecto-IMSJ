<?php

namespace App\Repositories\Contracts;

use App\Models\FranjaDisponibilidad;
use App\Models\Reserva;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define las operaciones de persistencia de las reservas.
 */
interface ReservaRepositoryInterface
{
    /**
     * Busca y bloquea una franja durante la transacción actual.
     */
    public function buscarFranjaConBloqueo(int $franjaId): FranjaDisponibilidad;

    /**
     * Indica si un usuario ya reservó la franja indicada.
     */
    public function existeParaUsuarioYFranja(int $usuarioId, int $franjaId): bool;

    /**
     * Cuenta las reservas de una franja.
     */
    public function contarPorFranja(int $franjaId): int;

    /**
     * Crea una reserva y carga la franja asociada.
     */
    public function crear(int $usuarioId, int $franjaId): Reserva;

    /**
     * Obtiene las reservas de un usuario.
     *
     * @return Collection<int, Reserva>
     */
    public function obtenerPorUsuario(int $usuarioId): Collection;

    /**
     * Obtiene las reservas comprendidas entre dos fechas.
     *
     * @return Collection<int, Reserva>
     */
    public function obtenerEntre(CarbonImmutable $desde, CarbonImmutable $hasta): Collection;
}
