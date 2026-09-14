<?php

namespace App\Http\Controllers;

use App\Http\Resources\FranjaDisponibilidadResource;
use App\Models\FranjaDisponibilidad;
use App\Models\User;
use App\Services\FranjaDisponibilidadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de franjas de disponibilidad.
 */
class FranjaDisponibilidadController extends Controller
{
    /** Servicio que coordina los casos de uso de franjas. */
    private readonly FranjaDisponibilidadService $franjaService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(FranjaDisponibilidadService $franjaService)
    {
        $this->franjaService = $franjaService;
    }

    /**
     * Devuelve las franjas futuras que tienen cupos disponibles.
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tipo' => ['sometimes', Rule::in($this->types())],
        ]);

        $franjas = $this->franjaService->obtenerDisponibles($validated['tipo'] ?? null);

        return response()->json([
            'franjas' => FranjaDisponibilidadResource::collection($franjas),
        ]);
    }

    /**
     * Devuelve todas las franjas para la administración.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'franjas' => FranjaDisponibilidadResource::collection(
                $this->franjaService->obtenerTodas(),
            ),
        ]);
    }

    /**
     * Valida y crea una franja de disponibilidad.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateFranja($request);

        $franja = $this->franjaService->crear($validated, $this->user($request));

        return response()->json([
            'franja' => new FranjaDisponibilidadResource($franja),
        ], Response::HTTP_CREATED);
    }

    /**
     * Valida y actualiza una franja de disponibilidad.
     */
    public function update(Request $request, FranjaDisponibilidad $franja): JsonResponse
    {
        $validated = $this->validateFranja($request, $franja);

        $franja = $this->franjaService->actualizar($franja, $validated, $this->user($request));

        return response()->json([
            'franja' => new FranjaDisponibilidadResource($franja),
        ]);
    }

    /**
     * Elimina una franja de disponibilidad sin reservas.
     */
    public function destroy(Request $request, FranjaDisponibilidad $franja): Response
    {
        $this->franjaService->eliminar($franja, $this->user($request));

        return response()->noContent();
    }

    /**
     * Valida los datos de una franja de disponibilidad.
     *
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
     * Devuelve los tipos de trámite aceptados por la API.
     *
     * @return array<int, string>
     */
    private function types(): array
    {
        return ['PRUEBA_MANEJO', 'RENOVACION_NORMAL', 'RENOVACION_URGENTE'];
    }

    /**
     * Obtiene el usuario autenticado que realiza la operación.
     */
    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
