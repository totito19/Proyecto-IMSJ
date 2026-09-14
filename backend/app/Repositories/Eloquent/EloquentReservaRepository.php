<?php

namespace App\Repositories\Eloquent;

use App\Models\FranjaDisponibilidad;
use App\Models\Reserva;
use App\Repositories\Contracts\ReservaRepositoryInterface;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementa la persistencia de reservas con Eloquent.
 */
class EloquentReservaRepository implements ReservaRepositoryInterface
{
    /**
     * Busca una franja y bloquea su fila para evitar sobrecupos concurrentes.
     */
    public function buscarFranjaConBloqueo(int $franjaId): FranjaDisponibilidad
    {
        return FranjaDisponibilidad::query()->lockForUpdate()->findOrFail($franjaId);
    }

    /**
     * Indica si un usuario ya posee una reserva en la franja.
     */
    public function existeParaUsuarioYFranja(int $usuarioId, int $franjaId): bool
    {
        return Reserva::query()
            ->where('usuario_id', $usuarioId)
            ->where('franja_disponibilidad_id', $franjaId)
            ->exists();
    }

    /**
     * Cuenta las reservas existentes en una franja.
     */
    public function contarPorFranja(int $franjaId): int
    {
        return Reserva::query()
            ->where('franja_disponibilidad_id', $franjaId)
            ->count();
    }

    /**
     * Persiste una reserva y carga la franja relacionada.
     */
    public function crear(int $usuarioId, int $franjaId): Reserva
    {
        return Reserva::query()->create([
            'usuario_id' => $usuarioId,
            'franja_disponibilidad_id' => $franjaId,
        ])->load('franja');
    }

    /**
     * Obtiene las reservas de un usuario ordenadas desde la más reciente.
     *
     * @return Collection<int, Reserva>
     */
    public function obtenerPorUsuario(int $usuarioId): Collection
    {
        return Reserva::query()
            ->where('usuario_id', $usuarioId)
            ->with('franja')
            ->latest()
            ->get();
    }

    /**
     * Obtiene y ordena las reservas del intervalo solicitado.
     *
     * @return Collection<int, Reserva>
     */
    public function obtenerEntre(CarbonImmutable $desde, CarbonImmutable $hasta): Collection
    {
        return Reserva::query()
            ->with(['usuario', 'franja'])
            ->whereHas('franja', fn ($query) => $query
                ->whereDate('fecha', '>=', $desde->toDateString())
                ->whereDate('fecha', '<=', $hasta->toDateString()))
            ->get()
            ->sortBy(fn (Reserva $reserva): string => $reserva->franja->fecha->toDateString().' '.$reserva->franja->hora_inicio)
            ->values();
    }
}
