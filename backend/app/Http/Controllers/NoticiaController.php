<?php

namespace App\Http\Controllers;

use App\Http\Resources\NoticiaResource;
use App\Models\Noticia;
use App\Models\User;
use App\Services\NoticiaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de noticias.
 */
class NoticiaController extends Controller
{
    /** Servicio que coordina los casos de uso de noticias. */
    private readonly NoticiaService $noticiaService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(NoticiaService $noticiaService)
    {
        $this->noticiaService = $noticiaService;
    }

    /**
     * Devuelve las noticias vigentes para el portal ciudadano.
     */
    public function publicIndex(): JsonResponse
    {
        $noticias = $this->noticiaService->obtenerVisibles();

        return response()->json([
            'noticias' => NoticiaResource::collection($noticias),
        ]);
    }

    /**
     * Devuelve todas las noticias para la administración.
     */
    public function index(): JsonResponse
    {
        $noticias = $this->noticiaService->obtenerTodas();

        return response()->json([
            'noticias' => NoticiaResource::collection($noticias),
        ]);
    }

    /**
     * Devuelve el detalle de una noticia.
     */
    public function show(Noticia $noticia): JsonResponse
    {
        return response()->json([
            'noticia' => new NoticiaResource($this->noticiaService->obtenerDetalle($noticia)),
        ]);
    }

    /**
     * Valida y crea una noticia con sus elementos asociados.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateNoticia($request);
        $noticia = $this->noticiaService->crear(
            $validated,
            $request->file('imagen_portada'),
            $request->file('galeria', []),
            $this->user($request),
        );

        return response()->json([
            'noticia' => new NoticiaResource($noticia),
        ], Response::HTTP_CREATED);
    }

    /**
     * Valida y actualiza una noticia con sus elementos asociados.
     */
    public function update(Request $request, Noticia $noticia): JsonResponse
    {
        $validated = $this->validateNoticia($request);
        $noticia = $this->noticiaService->actualizar(
            $noticia,
            $validated,
            $request->file('imagen_portada'),
            $request->file('galeria', []),
            $request->hasFile('galeria'),
            $request->has('enlaces'),
            $this->user($request),
        );

        return response()->json([
            'noticia' => new NoticiaResource($noticia),
        ]);
    }

    /**
     * Valida y cambia el estado de publicación de una noticia.
     */
    public function updateEstado(Request $request, Noticia $noticia): JsonResponse
    {
        $validated = $request->validate([
            'estado' => ['required', Rule::in(['PUBLICADO', 'NO_PUBLICADO'])],
        ]);

        $noticia = $this->noticiaService->actualizarEstado(
            $noticia,
            $validated['estado'],
            $this->user($request),
        );

        return response()->json([
            'noticia' => new NoticiaResource($noticia),
        ]);
    }

    /**
     * Elimina una noticia y sus imágenes almacenadas.
     */
    public function destroy(Request $request, Noticia $noticia): Response
    {
        $this->noticiaService->eliminar($noticia, $this->user($request));

        return response()->noContent();
    }

    /**
     * Valida los datos, imágenes y enlaces de una noticia.
     *
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
     * Obtiene el usuario autenticado que realiza la operación.
     */
    private function user(Request $request): User
    {
        $user = $request->user();

        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
