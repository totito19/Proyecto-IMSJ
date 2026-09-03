<?php

namespace App\Http\Controllers;

use App\Http\Resources\PreguntaPruebaResource;
use App\Models\HistorialAccion;
use App\Models\PreguntaPrueba;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PreguntaPruebaController extends Controller
{
    public function publicIndex(): JsonResponse
    {
        $preguntas = PreguntaPrueba::query()->inRandomOrder()->limit(10)->get();

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

    public function corregir(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'respuestas' => ['required', 'array', 'min:1', 'max:20'],
            'respuestas.*.pregunta_id' => ['required', 'integer', 'distinct', 'exists:preguntas_prueba,id'],
            'respuestas.*.opcion' => ['required', Rule::in(['A', 'B', 'C', 'D'])],
        ]);

        $preguntas = PreguntaPrueba::query()
            ->whereKey(collect($validated['respuestas'])->pluck('pregunta_id'))
            ->get()
            ->keyBy('id');

        $resultados = collect($validated['respuestas'])->map(function (array $respuesta) use ($preguntas): array {
            $pregunta = $preguntas->get($respuesta['pregunta_id']);

            return [
                'pregunta_id' => $respuesta['pregunta_id'],
                'correcta' => $pregunta->respuesta_correcta === $respuesta['opcion'],
                'respuesta_correcta' => $pregunta->respuesta_correcta,
            ];
        });

        return response()->json([
            'total' => $resultados->count(),
            'correctas' => $resultados->where('correcta', true)->count(),
            'resultados' => $resultados,
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'preguntas' => PreguntaPruebaResource::collection(
                PreguntaPrueba::query()->latest()->get(),
            ),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        $pregunta = DB::transaction(function () use ($request, $validated): PreguntaPrueba {
            $pregunta = PreguntaPrueba::query()->create($validated);
            HistorialAccion::registrar($this->user($request), 'CREAR', $pregunta);

            return $pregunta;
        });

        return response()->json([
            'pregunta' => new PreguntaPruebaResource($pregunta),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, PreguntaPrueba $pregunta): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        DB::transaction(function () use ($request, $pregunta, $validated): void {
            $pregunta->update($validated);
            HistorialAccion::registrar($this->user($request), 'ACTUALIZAR', $pregunta);
        });

        return response()->json([
            'pregunta' => new PreguntaPruebaResource($pregunta),
        ]);
    }

    public function destroy(Request $request, PreguntaPrueba $pregunta): Response
    {
        DB::transaction(function () use ($request, $pregunta): void {
            HistorialAccion::registrar($this->user($request), 'ELIMINAR', $pregunta);
            $pregunta->delete();
        });

        return response()->noContent();
    }

    /**
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

    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
