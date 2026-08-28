<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservaResource;
use App\Models\FranjaDisponibilidad;
use App\Models\Reserva;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ReservaController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'franja_disponibilidad_id' => ['required', 'integer', 'exists:franjas_disponibilidad,id'],
        ]);
        $user = $this->user($request);

        $reserva = DB::transaction(function () use ($user, $validated): Reserva {
            $franja = FranjaDisponibilidad::query()
                ->lockForUpdate()
                ->findOrFail($validated['franja_disponibilidad_id']);

            if ($franja->fecha->isBefore(today())) {
                throw ValidationException::withMessages([
                    'franja_disponibilidad_id' => ['La franja seleccionada ya pasó.'],
                ]);
            }

            if ($franja->reservas()->where('usuario_id', $user->id)->exists()) {
                throw ValidationException::withMessages([
                    'franja_disponibilidad_id' => ['Ya tiene una reserva en esta franja.'],
                ]);
            }

            if ($franja->reservas()->count() >= $franja->cupos_totales) {
                throw ValidationException::withMessages([
                    'franja_disponibilidad_id' => ['La franja seleccionada ya no tiene cupos.'],
                ]);
            }

            return Reserva::query()->create([
                'usuario_id' => $user->id,
                'franja_disponibilidad_id' => $franja->id,
            ]);
        });

        return response()->json([
            'reserva' => new ReservaResource($reserva->load('franja')),
        ], Response::HTTP_CREATED);
    }

    public function mine(Request $request): JsonResponse
    {
        return response()->json([
            'reservas' => ReservaResource::collection(
                $this->user($request)->reservas()
                    ->with('franja')
                    ->latest()
                    ->get(),
            ),
        ]);
    }

    public function agenda(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vista' => ['sometimes', Rule::in(['dia', 'semana', 'mes'])],
            'fecha' => ['sometimes', 'date'],
        ]);
        $vista = $validated['vista'] ?? 'dia';
        $cursor = CarbonImmutable::parse($validated['fecha'] ?? today()->toDateString());

        [$desde, $hasta] = match ($vista) {
            'semana' => [$cursor->startOfWeek(), $cursor->endOfWeek()],
            'mes' => [$cursor->startOfMonth(), $cursor->endOfMonth()],
            default => [$cursor->startOfDay(), $cursor->endOfDay()],
        };

        $reservas = Reserva::query()
            ->with(['usuario', 'franja'])
            ->whereHas('franja', fn ($query) => $query
                ->whereDate('fecha', '>=', $desde->toDateString())
                ->whereDate('fecha', '<=', $hasta->toDateString()))
            ->get()
            ->sortBy(fn (Reserva $reserva): string => $reserva->franja->fecha->toDateString().' '.$reserva->franja->hora_inicio)
            ->values();

        return response()->json([
            'reservas' => ReservaResource::collection($reservas),
            'resumen' => [
                'total' => $reservas->count(),
                'urgentes' => $reservas->where('franja.tipo', 'RENOVACION_URGENTE')->count(),
            ],
        ]);
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
