<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservaResource;
use App\Models\User;
use App\Services\ReservaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de reservas y agenda.
 */
class ReservaController extends Controller
{
    /** Servicio que coordina los casos de uso de reservas. */
    private readonly ReservaService $reservaService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(ReservaService $reservaService)
    {
        $this->reservaService = $reservaService;
    }

    /**
     * Valida y crea una reserva para el usuario autenticado.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'franja_disponibilidad_id' => ['required', 'integer', 'exists:franjas_disponibilidad,id'],
        ]);
        $reserva = $this->reservaService->crear(
            $this->user($request),
            $validated['franja_disponibilidad_id'],
        );

        return response()->json([
            'reserva' => new ReservaResource($reserva),
        ], Response::HTTP_CREATED);
    }

    /**
     * Devuelve las reservas del usuario autenticado.
     */
    public function mine(Request $request): JsonResponse
    {
        return response()->json([
            'reservas' => ReservaResource::collection(
                $this->reservaService->obtenerDelUsuario($this->user($request)),
            ),
        ]);
    }

    /**
     * Devuelve la agenda del día, semana o mes solicitado.
     */
    public function agenda(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vista' => ['sometimes', Rule::in(['dia', 'semana', 'mes'])],
            'fecha' => ['sometimes', 'date'],
        ]);
        $vista = $validated['vista'] ?? 'dia';
        $agenda = $this->reservaService->obtenerAgenda(
            $vista,
            $validated['fecha'] ?? today()->toDateString(),
        );

        return response()->json([
            'reservas' => ReservaResource::collection($agenda['reservas']),
            'resumen' => [
                'total' => $agenda['total'],
                'urgentes' => $agenda['urgentes'],
            ],
        ]);
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
