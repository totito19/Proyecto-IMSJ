<?php

namespace App\Services;

use App\Models\Noticia;
use App\Models\User;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use App\Repositories\Contracts\NoticiaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

/**
 * Coordina las noticias, sus relaciones y el almacenamiento de imágenes.
 */
class NoticiaService
{
    /** Repositorio de noticias y sus elementos asociados. */
    private readonly NoticiaRepositoryInterface $noticiaRepository;

    /** Repositorio de auditoría de acciones administrativas. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(
        NoticiaRepositoryInterface $noticiaRepository,
        HistorialAccionRepositoryInterface $historialRepository,
    ) {
        $this->noticiaRepository = $noticiaRepository;
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene las noticias vigentes para el portal ciudadano.
     *
     * @return Collection<int, Noticia>
     */
    public function obtenerVisibles(): Collection
    {
        return $this->noticiaRepository->obtenerVisibles();
    }

    /**
     * Obtiene todas las noticias para su administración.
     *
     * @return Collection<int, Noticia>
     */
    public function obtenerTodas(): Collection
    {
        return $this->noticiaRepository->obtenerTodas();
    }

    /**
     * Carga las imágenes y enlaces de una noticia.
     */
    public function obtenerDetalle(Noticia $noticia): Noticia
    {
        return $this->noticiaRepository->cargarRelaciones($noticia);
    }

    /**
     * Crea una noticia con portada, galería y enlaces.
     *
     * @param  array<string, mixed>  $datos
     * @param  array<int, UploadedFile>  $galeria
     */
    public function crear(
        array $datos,
        ?UploadedFile $portada,
        array $galeria,
        User $actor,
    ): Noticia {
        $rutasGuardadas = [];

        try {
            $rutaPortada = $this->guardarImagen($portada, $rutasGuardadas);
            $rutasGaleria = $this->guardarGaleria($galeria, $rutasGuardadas);
            $atributos = Arr::except($datos, ['imagen_portada', 'galeria', 'enlaces']);
            $atributos['imagen_portada'] = $rutaPortada;
            $atributos['estado'] = 'NO_PUBLICADO';

            $noticia = DB::transaction(function () use ($atributos, $rutasGaleria, $datos, $actor): Noticia {
                $noticia = $this->noticiaRepository->crear($atributos);
                $this->noticiaRepository->agregarImagenes($noticia, $rutasGaleria);
                $this->noticiaRepository->agregarEnlaces($noticia, $datos['enlaces'] ?? []);
                $this->historialRepository->registrar($actor, 'CREAR', $noticia);

                return $noticia;
            });
        } catch (Throwable $exception) {
            $this->eliminarImagenes($rutasGuardadas);

            throw $exception;
        }

        return $this->noticiaRepository->cargarRelaciones($noticia);
    }

    /**
     * Actualiza una noticia y reemplaza opcionalmente sus archivos y relaciones.
     *
     * @param  array<string, mixed>  $datos
     * @param  array<int, UploadedFile>  $galeria
     */
    public function actualizar(
        Noticia $noticia,
        array $datos,
        ?UploadedFile $portada,
        array $galeria,
        bool $reemplazarGaleria,
        bool $reemplazarEnlaces,
        User $actor,
    ): Noticia {
        $rutasGuardadas = [];
        $rutasAnteriores = [];

        try {
            $nuevaPortada = $this->guardarImagen($portada, $rutasGuardadas);
            $nuevaGaleria = $reemplazarGaleria
                ? $this->guardarGaleria($galeria, $rutasGuardadas)
                : [];
            $atributos = Arr::except($datos, ['imagen_portada', 'galeria', 'enlaces']);

            if ($nuevaPortada !== null) {
                if ($noticia->imagen_portada !== null) {
                    $rutasAnteriores[] = $noticia->imagen_portada;
                }

                $atributos['imagen_portada'] = $nuevaPortada;
            }

            if ($reemplazarGaleria) {
                $rutasAnteriores = [
                    ...$rutasAnteriores,
                    ...$this->noticiaRepository->obtenerRutasGaleria($noticia),
                ];
            }

            DB::transaction(function () use (
                $noticia,
                $atributos,
                $nuevaGaleria,
                $reemplazarGaleria,
                $reemplazarEnlaces,
                $datos,
                $actor,
            ): void {
                $this->noticiaRepository->actualizar($noticia, $atributos);

                if ($reemplazarGaleria) {
                    $this->noticiaRepository->reemplazarImagenes($noticia, $nuevaGaleria);
                }

                if ($reemplazarEnlaces) {
                    $this->noticiaRepository->reemplazarEnlaces($noticia, $datos['enlaces'] ?? []);
                }

                $this->historialRepository->registrar($actor, 'ACTUALIZAR', $noticia);
            });
        } catch (Throwable $exception) {
            $this->eliminarImagenes($rutasGuardadas);

            throw $exception;
        }

        $this->eliminarImagenes($rutasAnteriores);

        return $this->noticiaRepository->cargarRelaciones($noticia);
    }

    /**
     * Cambia el estado de publicación y registra la acción cuando corresponde.
     */
    public function actualizarEstado(Noticia $noticia, string $estado, User $actor): Noticia
    {
        if ($noticia->estado !== $estado) {
            DB::transaction(function () use ($noticia, $estado, $actor): void {
                $this->noticiaRepository->actualizar($noticia, ['estado' => $estado]);
                $accion = $estado === 'PUBLICADO' ? 'PUBLICAR' : 'DESPUBLICAR';
                $this->historialRepository->registrar($actor, $accion, $noticia);
            });
        }

        return $this->noticiaRepository->cargarRelaciones($noticia);
    }

    /**
     * Elimina una noticia, su auditoría y las imágenes almacenadas.
     */
    public function eliminar(Noticia $noticia, User $actor): void
    {
        $rutas = array_filter([
            $noticia->imagen_portada,
            ...$this->noticiaRepository->obtenerRutasGaleria($noticia),
        ]);

        DB::transaction(function () use ($noticia, $actor): void {
            $this->historialRepository->registrar($actor, 'ELIMINAR', $noticia);
            $this->noticiaRepository->eliminar($noticia);
        });

        $this->eliminarImagenes($rutas);
    }

    /**
     * Guarda una imagen y agrega su ruta a la lista de archivos creados.
     *
     * @param  array<int, string>  $rutasGuardadas
     */
    private function guardarImagen(?UploadedFile $archivo, array &$rutasGuardadas): ?string
    {
        if (! $archivo instanceof UploadedFile) {
            return null;
        }

        $ruta = $archivo->store('noticias', 'public');

        if ($ruta === false) {
            throw new RuntimeException('No se pudo guardar la imagen.');
        }

        $rutasGuardadas[] = $ruta;

        return $ruta;
    }

    /**
     * Guarda todas las imágenes recibidas para una galería.
     *
     * @param  array<int, UploadedFile>  $galeria
     * @param  array<int, string>  $rutasGuardadas
     * @return array<int, string>
     */
    private function guardarGaleria(array $galeria, array &$rutasGuardadas): array
    {
        $rutasGaleria = [];

        foreach ($galeria as $archivo) {
            $ruta = $this->guardarImagen($archivo, $rutasGuardadas);

            if ($ruta !== null) {
                $rutasGaleria[] = $ruta;
            }
        }

        return $rutasGaleria;
    }

    /**
     * Elimina del disco público las imágenes indicadas.
     *
     * @param  array<int, string>  $rutas
     */
    private function eliminarImagenes(array $rutas): void
    {
        Storage::disk('public')->delete($rutas);
    }
}
