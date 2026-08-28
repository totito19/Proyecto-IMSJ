<?php

namespace App\Http\Controllers;

use App\Http\Resources\MaterialEstudioResource;
use App\Models\HistorialAccion;
use App\Models\MaterialEstudio;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class MaterialEstudioController extends Controller
{
    public function publicIndex(): JsonResponse
    {
        return response()->json([
            'materiales' => MaterialEstudioResource::collection(
                MaterialEstudio::query()->publicado()->latest()->get(),
            ),
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'materiales' => MaterialEstudioResource::collection(
                MaterialEstudio::query()->latest()->get(),
            ),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateMaterial($request);
        $resource = $this->storeResource($request, $validated['tipo']);

        try {
            $material = DB::transaction(function () use ($request, $resource, $validated): MaterialEstudio {
                $material = MaterialEstudio::query()->create([
                    'nombre' => $validated['nombre'],
                    'tipo' => $validated['tipo'],
                    'ubicacion_recurso' => $resource,
                    'estado' => 'NO_PUBLICADO',
                ]);

                HistorialAccion::registrar($this->user($request), 'CREAR', $material);

                return $material;
            });
        } catch (Throwable $exception) {
            $this->deleteStoredResource($resource);

            throw $exception;
        }

        return response()->json([
            'material' => new MaterialEstudioResource($material),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, MaterialEstudio $material): JsonResponse
    {
        $validated = $this->validateMaterial($request, $material);
        $newResource = $this->storeResource($request, $validated['tipo'], false);
        $oldResource = $material->ubicacion_recurso;

        if ($newResource === null && $validated['tipo'] === 'VIDEO' && $request->filled('ubicacion_recurso')) {
            $newResource = $validated['ubicacion_recurso'];
        }

        try {
            DB::transaction(function () use ($material, $newResource, $request, $validated): void {
                $material->update([
                    'nombre' => $validated['nombre'],
                    'tipo' => $validated['tipo'],
                    'ubicacion_recurso' => $newResource ?? $material->ubicacion_recurso,
                ]);

                HistorialAccion::registrar($this->user($request), 'ACTUALIZAR', $material);
            });
        } catch (Throwable $exception) {
            if ($newResource !== null) {
                $this->deleteStoredResource($newResource);
            }

            throw $exception;
        }

        if ($newResource !== null && $oldResource !== $newResource) {
            $this->deleteStoredResource($oldResource);
        }

        return response()->json([
            'material' => new MaterialEstudioResource($material),
        ]);
    }

    public function updateEstado(Request $request, MaterialEstudio $material): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PUBLICADO', 'NO_PUBLICADO'])],
        ]);

        if ($material->estado !== $validated['estado']) {
            DB::transaction(function () use ($material, $request, $validated): void {
                $material->update(['estado' => $validated['estado']]);
                $accion = $validated['estado'] === 'PUBLICADO' ? 'PUBLICAR' : 'DESPUBLICAR';
                HistorialAccion::registrar($this->user($request), $accion, $material);
            });
        }

        return response()->json([
            'material' => new MaterialEstudioResource($material),
        ]);
    }

    public function destroy(Request $request, MaterialEstudio $material): Response
    {
        $resource = $material->ubicacion_recurso;

        DB::transaction(function () use ($material, $request): void {
            HistorialAccion::registrar($this->user($request), 'ELIMINAR', $material);
            $material->delete();
        });

        $this->deleteStoredResource($resource);

        return response()->noContent();
    }

    /**
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

    private function storeResource(Request $request, string $tipo, bool $required = true): ?string
    {
        if ($tipo === 'VIDEO') {
            return $request->filled('ubicacion_recurso')
                ? (string) $request->input('ubicacion_recurso')
                : null;
        }

        $file = $request->file('archivo');

        if (! $file instanceof UploadedFile) {
            if ($required) {
                throw new RuntimeException('No se recibió el archivo del material.');
            }

            return null;
        }

        $path = $file->store('materiales', 'public');

        if ($path === false) {
            throw new RuntimeException('No se pudo guardar el material.');
        }

        return $path;
    }

    private function deleteStoredResource(string $resource): void
    {
        if (! str_starts_with($resource, 'http://') && ! str_starts_with($resource, 'https://')) {
            Storage::disk('public')->delete($resource);
        }
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
