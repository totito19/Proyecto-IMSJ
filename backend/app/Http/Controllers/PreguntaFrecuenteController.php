<?php

namespace App\Http\Controllers;

use App\Http\Resources\PreguntaFrecuenteResource;
use App\Models\PreguntaFrecuente;
use App\Models\User;
use App\Services\PreguntaFrecuenteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de preguntas frecuentes.
 */
class PreguntaFrecuenteController extends Controller
{
    /** Servicio que coordina los casos de uso de preguntas frecuentes. */
    private readonly PreguntaFrecuenteService $preguntaService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(PreguntaFrecuenteService $preguntaService)
    {
        $this->preguntaService = $preguntaService;
    }

    /**
     * Devuelve las preguntas publicadas para el portal ciudadano.
     */
    public function publicIndex(): JsonResponse
    {
        return response()->json([
            'preguntas' => PreguntaFrecuenteResource::collection(
                $this->preguntaService->obtenerPublicadas(),
            ),
        ]);
    }

    /**
     * Devuelve todas las preguntas para la administración.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'preguntas' => PreguntaFrecuenteResource::collection(
                $this->preguntaService->obtenerTodas(),
            ),
        ]);
    }

    /**
     * Valida y crea una pregunta frecuente.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        $pregunta = $this->preguntaService->crear($validated, $this->user($request));

        return response()->json([
            'pregunta' => new PreguntaFrecuenteResource($pregunta),
        ], Response::HTTP_CREATED);
    }

    /**
     * Valida y actualiza una pregunta frecuente.
     */
    public function update(Request $request, PreguntaFrecuente $pregunta): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        $pregunta = $this->preguntaService->actualizar($pregunta, $validated, $this->user($request));

        return response()->json([
            'pregunta' => new PreguntaFrecuenteResource($pregunta),
        ]);
    }

    /**
     * Valida y cambia el estado de publicación de una pregunta.
     */
    public function updateEstado(Request $request, PreguntaFrecuente $pregunta): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PUBLICADO', 'NO_PUBLICADO'])],
        ]);

        $pregunta = $this->preguntaService->actualizarEstado(
            $pregunta,
            $validated['estado'],
            $this->user($request),
        );

        return response()->json([
            'pregunta' => new PreguntaFrecuenteResource($pregunta),
        ]);
    }

    /**
     * Elimina una pregunta frecuente.
     */
    public function destroy(Request $request, PreguntaFrecuente $pregunta): Response
    {
        $this->preguntaService->eliminar($pregunta, $this->user($request));

        return response()->noContent();
    }

    /**
     * Valida los datos de una pregunta frecuente.
     *
     * @return array<string, mixed>
     */
    private function validatePregunta(Request $request): array
    {
        return $request->validate([
            'pregunta' => ['required', 'string', 'max:255'],
            'respuesta' => ['required', 'string'],
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
