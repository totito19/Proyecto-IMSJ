<?php

namespace App\Http\Controllers;

use App\Http\Resources\PreguntaPruebaResource;
use App\Models\PreguntaPrueba;
use App\Models\User;
use App\Services\PreguntaPruebaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de la prueba teórica.
 */
class PreguntaPruebaController extends Controller
{
    /** Servicio que coordina los casos de uso de la prueba. */
    private readonly PreguntaPruebaService $preguntaService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(PreguntaPruebaService $preguntaService)
    {
        $this->preguntaService = $preguntaService;
    }

    /**
     * Devuelve una selección de preguntas sin revelar las respuestas correctas.
     */
    public function publicIndex(): JsonResponse
    {
        $preguntas = $this->preguntaService->obtenerPrueba();

        return response()->json([
            'preguntas' => $preguntas->map(fn (PreguntaPrueba $pregunta): array => [
                'id' => $pregunta->id,
                'pregunta' => $pregunta->pregunta,
                'opciones' => [
                    'A' => $pregunta->opcion_a,
                    'B' => $pregunta->opcion_b,
                    'C' => $pregunta->opcion_c,
                    'D' => $pregunta->opcion_d,
                ],
            ]),
        ]);
    }

    /**
     * Corrige las respuestas de una prueba pública.
     */
    public function corregir(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'respuestas' => ['required', 'array', 'min:1', 'max:20'],
            'respuestas.*.pregunta_id' => ['required', 'integer', 'distinct', 'exists:preguntas_prueba,id'],
            'respuestas.*.opcion' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
        ]);

        $resultados = $this->preguntaService->corregir($validated['respuestas']);

        return response()->json([
            'total' => $resultados->count(),
            'correctas' => $resultados->where('correcta', true)->count(),
            'resultados' => $resultados,
        ]);
    }

    /**
     * Devuelve todas las preguntas para la administración.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'preguntas' => PreguntaPruebaResource::collection(
                $this->preguntaService->obtenerTodas(),
            ),
        ]);
    }

    /**
     * Valida y crea una pregunta de prueba.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        $pregunta = $this->preguntaService->crear($validated, $this->user($request));

        return response()->json([
            'pregunta' => new PreguntaPruebaResource($pregunta),
        ], Response::HTTP_CREATED);
    }

    /**
     * Valida y actualiza una pregunta de prueba.
     */
    public function update(Request $request, PreguntaPrueba $pregunta): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        $pregunta = $this->preguntaService->actualizar($pregunta, $validated, $this->user($request));

        return response()->json([
            'pregunta' => new PreguntaPruebaResource($pregunta),
        ]);
    }

    /**
     * Elimina una pregunta de prueba.
     */
    public function destroy(Request $request, PreguntaPrueba $pregunta): Response
    {
        $this->preguntaService->eliminar($pregunta, $this->user($request));

        return response()->noContent();
    }

    /**
     * Valida los datos de una pregunta de prueba.
     *
     * @return array<string, mixed>
     */
    private function validatePregunta(Request $request): array
    {
        return $request->validate([
            'pregunta' => ['required', 'string', 'max:500'],
            'opcion_a' => ['required', 'string', 'max:255'],
            'opcion_b' => ['required', 'string', 'max:255'],
            'opcion_c' => ['required', 'string', 'max:255'],
            'opcion_d' => ['required', 'string', 'max:255'],
            'respuesta_correcta' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
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
