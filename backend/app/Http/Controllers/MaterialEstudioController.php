<?php

namespace App\Http\Controllers;

use App\Http\Resources\MaterialEstudioResource;
use App\Models\MaterialEstudio;
use App\Models\User;
use App\Services\MaterialEstudioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de materiales de estudio.
 */
class MaterialEstudioController extends Controller
{
    /** Servicio que coordina los casos de uso de materiales. */
    private readonly MaterialEstudioService $materialService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(MaterialEstudioService $materialService)
    {
        $this->materialService = $materialService;
    }

    /**
     * Devuelve los materiales publicados para el portal ciudadano.
     */
    public function publicIndex(): JsonResponse
    {
        return response()->json([
            'materiales' => MaterialEstudioResource::collection(
                $this->materialService->obtenerPublicados(),
            ),
        ]);
    }

    /**
     * Devuelve todos los materiales para la administración.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'materiales' => MaterialEstudioResource::collection(
                $this->materialService->obtenerTodos(),
            ),
        ]);
    }

    /**
     * Valida y crea un material de estudio.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateMaterial($request);
        $material = $this->materialService->crear(
            $validated,
            $request->file('archivo'),
            $this->user($request),
        );

        return response()->json([
            'material' => new MaterialEstudioResource($material),
        ], Response::HTTP_CREATED);
    }

    /**
     * Valida y actualiza un material de estudio.
     */
    public function update(Request $request, MaterialEstudio $material): JsonResponse
    {
        $validated = $this->validateMaterial($request, $material);
        $material = $this->materialService->actualizar(
            $material,
            $validated,
            $request->file('archivo'),
            $this->user($request),
        );

        return response()->json([
            'material' => new MaterialEstudioResource($material),
        ]);
    }

    /**
     * Valida y cambia el estado de publicación de un material.
     */
    public function updateEstado(Request $request, MaterialEstudio $material): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PUBLICADO', 'NO_PUBLICADO'])],
        ]);

        $material = $this->materialService->actualizarEstado(
            $material,
            $validated['estado'],
            $this->user($request),
        );

        return response()->json([
            'material' => new MaterialEstudioResource($material),
        ]);
    }

    /**
     * Elimina un material y su recurso local asociado.
     */
    public function destroy(Request $request, MaterialEstudio $material): Response
    {
        $this->materialService->eliminar($material, $this->user($request));

        return response()->noContent();
    }

    /**
     * Valida los datos y el recurso de un material de estudio.
     *
     * @return array<string, mixed>
     */
    private function validateMaterial(Request $request, ?MaterialEstudio $material = null): array
    {
        $tipo = (string) $request->input('tipo');
        $needsResource = $material === null || $material->tipo !== $tipo;
        $fileRules = [Rule::requiredIf($needsResource), 'nullable', 'file'];

        if ($tipo === 'PDF') {
            $fileRules = [...$fileRules, 'mimes:pdf', 'max:10240'];
        } elseif ($tipo === 'IMAGEN') {
            $fileRules = [...$fileRules, 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'];
        } else {
            $fileRules = ['prohibited'];
        }

        return $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'tipo' => ['required', Rule::in(['PDF', 'IMAGEN', 'VIDEO'])],
            'archivo' => $fileRules,
            'ubicacion_recurso' => $tipo === 'VIDEO'
                ? [Rule::requiredIf($needsResource), 'nullable', 'url:http,https', 'max:2048']
                : ['prohibited'],
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
