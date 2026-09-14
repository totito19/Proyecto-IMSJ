<?php

namespace App\Services;

use App\Models\Reserva;
use App\Models\User;
use App\Repositories\Contracts\ReservaRepositoryInterface;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Coordina las reglas de negocio de reservas y agenda.
 */
class ReservaService
{
    /** Repositorio utilizado para consultar y persistir reservas. */
    private readonly ReservaRepositoryInterface $reservaRepository;

    /**
     * Crea el servicio con su dependencia de persistencia.
     */
    public function __construct(ReservaRepositoryInterface $reservaRepository)
    {
        $this->reservaRepository = $reservaRepository;
    }

    /**
     * Crea una reserva respetando fecha, unicidad y capacidad de la franja.
     */
    public function crear(User $usuario, int $franjaId): Reserva
    {
        return DB::transaction(function () use ($usuario, $franjaId): Reserva {
            $franja = $this->reservaRepository->buscarFranjaConBloqueo($franjaId);

            if ($franja->fecha->isBefore(today())) {
                throw ValidationException::withMessages([
                    'franja_disponibilidad_id' => ['La franja seleccionada ya pasó.'],
                ]);
            }

            if ($this->reservaRepository->existeParaUsuarioYFranja($usuario->id, $franja->id)) {
                throw ValidationException::withMessages([
                    'franja_disponibilidad_id' => ['Ya tiene una reserva en esta franja.'],
                ]);
            }

            if ($this->reservaRepository->contarPorFranja($franja->id) >= $franja->cupos_totales) {
                throw ValidationException::withMessages([
                    'franja_disponibilidad_id' => ['La franja seleccionada ya no tiene cupos.'],
                ]);
            }

            return $this->reservaRepository->crear($usuario->id, $franja->id);
        });
    }

    /**
     * Obtiene las reservas pertenecientes a un usuario.
     *
     * @return Collection<int, Reserva>
     */
    public function obtenerDelUsuario(User $usuario): Collection
    {
        return $this->reservaRepository->obtenerPorUsuario($usuario->id);
    }

    /**
     * Obtiene las reservas y el resumen del período de agenda solicitado.
     *
     * @return array{reservas: Collection<int, Reserva>, total: int, urgentes: int}
     */
    public function obtenerAgenda(string $vista, string $fecha): array
    {
        $cursor = CarbonImmutable::parse($fecha);

        [$desde, $hasta] = match ($vista) {
            'semana' => [$cursor->startOfWeek(), $cursor->endOfWeek()],
            'mes' => [$cursor->startOfMonth(), $cursor->endOfMonth()],
            default => [$cursor->startOfDay(), $cursor->endOfDay()],
        };

        $reservas = $this->reservaRepository->obtenerEntre($desde, $hasta);

        return [
            'reservas' => $reservas,
            'total' => $reservas->count(),
            'urgentes' => $reservas->where('franja.tipo', 'RENOVACION_URGENTE')->count(),
        ];
    }
}
