<?php

namespace App\Http\Controllers;

use App\Http\Resources\FranjaDisponibilidadResource;
use App\Models\FranjaDisponibilidad;
use App\Models\HistorialAccion;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class FranjaDisponibilidadController extends Controller
{
    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tipo' => ['sometimes', Rule::in($this->types())],
        ]);

        $franjas = FranjaDisponibilidad::query()
            ->when(isset($validated['tipo']), fn ($query) => $query->where('tipo', $validated['tipo']))
            ->whereDate('fecha', '>=', today())
            ->withCount('reservas')
            ->orderBy('fecha')
            ->orderBy('hora_inicio')
            ->get()
            ->filter(fn (FranjaDisponibilidad $franja): bool => $franja->reservas_count < $franja->cupos_totales)
            ->values();

        return response()->json([
            'franjas' => FranjaDisponibilidadResource::collection($franjas),
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'franjas' => FranjaDisponibilidadResource::collection(
                FranjaDisponibilidad::query()
                    ->withCount('reservas')
                    ->orderBy('fecha')
                    ->orderBy('hora_inicio')
                    ->get(),
            ),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateFranja($request);

        $franja = DB::transaction(function () use ($request, $validated): FranjaDisponibilidad {
            $franja = FranjaDisponibilidad::query()->create($validated);
            HistorialAccion::registrar($this->user($request), 'CREAR', $franja);

            return $franja;
        });

        return response()->json([
            'franja' => new FranjaDisponibilidadResource($franja->loadCount('reservas')),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, FranjaDisponibilidad $franja): JsonResponse
    {
        $validated = $this->validateFranja($request, $franja);

        if ($validated['cupos_totales'] < $franja->reservas()->count()) {
            throw ValidationException::withMessages([
                'cupos_totales' => ['Los cupos no pueden ser menores que las reservas existentes.'],
            ]);
        }

        DB::transaction(function () use ($franja, $request, $validated): void {
            $franja->update($validated);
            HistorialAccion::registrar($this->user($request), 'ACTUALIZAR', $franja);
        });

        return response()->json([
            'franja' => new FranjaDisponibilidadResource($franja->loadCount('reservas')),
        ]);
    }

    public function destroy(Request $request, FranjaDisponibilidad $franja): Response
    {
        if ($franja->reservas()->exists()) {
            throw ValidationException::withMessages([
                'franja' => ['No se puede eliminar una franja que tiene reservas.'],
            ]);
        }

        DB::transaction(function () use ($franja, $request): void {
            HistorialAccion::registrar($this->user($request), 'ELIMINAR', $franja);
            $franja->delete();
        });

        return response()->noContent();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateFranja(Request $request, ?FranjaDisponibilidad $franja = null): array
    {
        return $request->validate([
            'fecha' => ['required', 'date', 'after_or_equal:today'],
            'hora_inicio' => ['required', 'date_format:H:i'],
            'hora_fin' => ['required', 'date_format:H:i', 'after:hora_inicio'],
            'tipo' => [
                'required',
                Rule::in($this->types()),
                Rule::unique('franjas_disponibilidad', 'tipo')
                    ->where(fn ($query) => $query
                        ->where('fecha', $request->input('fecha'))
                        ->where('hora_inicio', $request->input('hora_inicio'))
                        ->where('hora_fin', $request->input('hora_fin')))
                    ->ignore($franja?->id),
            ],
            'cupos_totales' => ['required', 'integer', 'min:1', 'max:20'],
        ]);
    }

    /**
     * @return array<int, string>
     */
    private function types(): array
    {
        return ['PRUEBA_MANEJO', 'RENOVACION_NORMAL', 'RENOVACION_URGENTE'];
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
