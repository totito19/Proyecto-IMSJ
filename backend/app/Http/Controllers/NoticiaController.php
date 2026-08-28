<?php

namespace App\Http\Controllers;

use App\Http\Resources\NoticiaResource;
use App\Models\HistorialAccion;
use App\Models\Noticia;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class NoticiaController extends Controller
{
    public function publicIndex(): JsonResponse
    {
        $noticias = Noticia::query()
            ->visibleParaPublico()
            ->with(['imagenes', 'enlaces'])
            ->latest('fecha_inicio_vigencia')
            ->get();

        return response()->json([
            'noticias' => NoticiaResource::collection($noticias),
        ]);
    }

    public function index(): JsonResponse
    {
        $noticias = Noticia::query()
            ->with(['imagenes', 'enlaces'])
            ->latest()
            ->get();

        return response()->json([
            'noticias' => NoticiaResource::collection($noticias),
        ]);
    }

    public function show(Noticia $noticia): JsonResponse
    {
        return response()->json([
            'noticia' => new NoticiaResource($noticia->load(['imagenes', 'enlaces'])),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateNoticia($request);
        $storedPaths = [];

        try {
            $coverPath = $this->storeImage($request->file('imagen_portada'), $storedPaths);
            $galleryPaths = $this->storeGallery($request, $storedPaths);
            $attributes = Arr::except($validated, ['imagen_portada', 'galeria', 'enlaces']);
            $attributes['imagen_portada'] = $coverPath;
            $attributes['estado'] = 'NO_PUBLICADO';

            $noticia = DB::transaction(function () use ($attributes, $galleryPaths, $request, $validated): Noticia {
                $noticia = Noticia::query()->create($attributes);

                foreach ($galleryPaths as $path) {
                    $noticia->imagenes()->create(['ubicacion' => $path]);
                }

                foreach ($validated['enlaces'] ?? [] as $url) {
                    $noticia->enlaces()->create(['url' => $url]);
                }

                HistorialAccion::registrar($this->user($request), 'CREAR', $noticia);

                return $noticia;
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);

            throw $exception;
        }

        return response()->json([
            'noticia' => new NoticiaResource($noticia->load(['imagenes', 'enlaces'])),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, Noticia $noticia): JsonResponse
    {
        $validated = $this->validateNoticia($request);
        $storedPaths = [];
        $oldPaths = [];

        try {
            $newCoverPath = $this->storeImage($request->file('imagen_portada'), $storedPaths);
            $replaceGallery = $request->hasFile('galeria');
            $newGalleryPaths = $replaceGallery ? $this->storeGallery($request, $storedPaths) : [];
            $attributes = Arr::except($validated, ['imagen_portada', 'galeria', 'enlaces']);

            if ($newCoverPath !== null) {
                if ($noticia->imagen_portada !== null) {
                    $oldPaths[] = $noticia->imagen_portada;
                }

                $attributes['imagen_portada'] = $newCoverPath;
            }

            if ($replaceGallery) {
                $oldPaths = [
                    ...$oldPaths,
                    ...$noticia->imagenes()->pluck('ubicacion')->all(),
                ];
            }

            DB::transaction(function () use ($attributes, $newGalleryPaths, $noticia, $replaceGallery, $request, $validated): void {
                $noticia->update($attributes);

                if ($replaceGallery) {
                    $noticia->imagenes()->delete();

                    foreach ($newGalleryPaths as $path) {
                        $noticia->imagenes()->create(['ubicacion' => $path]);
                    }
                }

                if ($request->has('enlaces')) {
                    $noticia->enlaces()->delete();

                    foreach ($validated['enlaces'] ?? [] as $url) {
                        $noticia->enlaces()->create(['url' => $url]);
                    }
                }

                HistorialAccion::registrar($this->user($request), 'ACTUALIZAR', $noticia);
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);

            throw $exception;
        }

        Storage::disk('public')->delete($oldPaths);

        return response()->json([
            'noticia' => new NoticiaResource($noticia->load(['imagenes', 'enlaces'])),
        ]);
    }

    public function updateEstado(Request $request, Noticia $noticia): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PUBLICADO', 'NO_PUBLICADO'])],
        ]);

        if ($noticia->estado !== $validated['estado']) {
            DB::transaction(function () use ($noticia, $request, $validated): void {
                $noticia->update(['estado' => $validated['estado']]);

                $accion = $validated['estado'] === 'PUBLICADO' ? 'PUBLICAR' : 'DESPUBLICAR';
                HistorialAccion::registrar($this->user($request), $accion, $noticia);
            });
        }

        return response()->json([
            'noticia' => new NoticiaResource($noticia->load(['imagenes', 'enlaces'])),
        ]);
    }

    public function destroy(Request $request, Noticia $noticia): Response
    {
        $paths = array_filter([
            $noticia->imagen_portada,
            ...$noticia->imagenes()->pluck('ubicacion')->all(),
        ]);

        DB::transaction(function () use ($noticia, $request): void {
            HistorialAccion::registrar($this->user($request), 'ELIMINAR', $noticia);
            $noticia->delete();
        });

        Storage::disk('public')->delete($paths);

        return response()->noContent();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateNoticia(Request $request): array
    {
        return $request->validate([
            'titulo' => ['required', 'string', 'max:255'],
            'texto' => ['required', 'string'],
            'fecha_inicio_vigencia' => ['required', 'date'],
            'fecha_fin_vigencia' => ['required', 'date', 'after_or_equal:fecha_inicio_vigencia'],
            'imagen_portada' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'galeria' => ['sometimes', 'array', 'max:5'],
            'galeria.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'enlaces' => ['sometimes', 'array', 'max:5'],
            'enlaces.*' => ['url:http,https', 'max:2048'],
        ]);
    }

    /**
     * @param  array<int, string>  $storedPaths
     */
    private function storeImage(UploadedFile|array|null $file, array &$storedPaths): ?string
    {
        if (! $file instanceof UploadedFile) {
            return null;
        }

        $path = $file->store('noticias', 'public');

        if ($path === false) {
            throw new RuntimeException('No se pudo guardar la imagen.');
        }

        $storedPaths[] = $path;

        return $path;
    }

    /**
     * @param  array<int, string>  $storedPaths
     * @return array<int, string>
     */
    private function storeGallery(Request $request, array &$storedPaths): array
    {
        $galleryPaths = [];

        foreach ($request->file('galeria', []) as $file) {
            $path = $this->storeImage($file, $storedPaths);

            if ($path !== null) {
                $galleryPaths[] = $path;
            }
        }

        return $galleryPaths;
    }

    private function user(Request $request): User
    {
        $user = $request->user();

        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
