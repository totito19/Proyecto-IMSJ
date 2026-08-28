<?php

namespace App\Http\Controllers;

use App\Http\Resources\PreguntaFrecuenteResource;
use App\Models\HistorialAccion;
use App\Models\PreguntaFrecuente;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PreguntaFrecuenteController extends Controller
{
    public function publicIndex(): JsonResponse
    {
        return response()->json([
            'preguntas' => PreguntaFrecuenteResource::collection(
                PreguntaFrecuente::query()->publicada()->latest()->get(),
            ),
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'preguntas' => PreguntaFrecuenteResource::collection(
                PreguntaFrecuente::query()->latest()->get(),
            ),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        $pregunta = DB::transaction(function () use ($request, $validated): PreguntaFrecuente {
            $pregunta = PreguntaFrecuente::query()->create([
                ...$validated,
                'estado' => 'NO_PUBLICADO',
            ]);
            HistorialAccion::registrar($this->user($request), 'CREAR', $pregunta);

            return $pregunta;
        });

        return response()->json([
            'pregunta' => new PreguntaFrecuenteResource($pregunta),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, PreguntaFrecuente $pregunta): JsonResponse
    {
        $validated = $this->validatePregunta($request);

        DB::transaction(function () use ($pregunta, $request, $validated): void {
            $pregunta->update($validated);
            HistorialAccion::registrar($this->user($request), 'ACTUALIZAR', $pregunta);
        });

        return response()->json([
            'pregunta' => new PreguntaFrecuenteResource($pregunta),
        ]);
    }

    public function updateEstado(Request $request, PreguntaFrecuente $pregunta): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PUBLICADO', 'NO_PUBLICADO'])],
        ]);

        if ($pregunta->estado !== $validated['estado']) {
            DB::transaction(function () use ($pregunta, $request, $validated): void {
                $pregunta->update(['estado' => $validated['estado']]);
                $accion = $validated['estado'] === 'PUBLICADO' ? 'PUBLICAR' : 'DESPUBLICAR';
                HistorialAccion::registrar($this->user($request), $accion, $pregunta);
            });
        }

        return response()->json([
            'pregunta' => new PreguntaFrecuenteResource($pregunta),
        ]);
    }

    public function destroy(Request $request, PreguntaFrecuente $pregunta): Response
    {
        DB::transaction(function () use ($pregunta, $request): void {
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
            'pregunta' => ['required', 'string', 'max:255'],
            'respuesta' => ['required', 'string'],
        ]);
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
