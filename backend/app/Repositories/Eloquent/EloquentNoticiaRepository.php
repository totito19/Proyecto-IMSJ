<?php

namespace App\Repositories\Eloquent;

use App\Models\Noticia;
use App\Repositories\Contracts\NoticiaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementa la persistencia de noticias, imágenes y enlaces con Eloquent.
 */
class EloquentNoticiaRepository implements NoticiaRepositoryInterface
{
    /**
     * Obtiene las noticias vigentes y publicadas con sus relaciones.
     *
     * @return Collection<int, Noticia>
     */
    public function obtenerVisibles(): Collection
    {
        return Noticia::query()
            ->visibleParaPublico()
            ->with(['imagenes', 'enlaces'])
            ->latest('fecha_inicio_vigencia')
            ->get();
    }

    /**
     * Obtiene todas las noticias con sus relaciones.
     *
     * @return Collection<int, Noticia>
     */
    public function obtenerTodas(): Collection
    {
        return Noticia::query()->with(['imagenes', 'enlaces'])->latest()->get();
    }

    /**
     * Carga las imágenes y enlaces de una noticia.
     */
    public function cargarRelaciones(Noticia $noticia): Noticia
    {
        return $noticia->load(['imagenes', 'enlaces']);
    }

    /**
     * Obtiene las rutas almacenadas de la galería.
     *
     * @return array<int, string>
     */
    public function obtenerRutasGaleria(Noticia $noticia): array
    {
        return $noticia->imagenes()->pluck('ubicacion')->all();
    }

    /**
     * Persiste una nueva noticia.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): Noticia
    {
        return Noticia::query()->create($datos);
    }

    /**
     * Persiste los cambios de una noticia.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(Noticia $noticia, array $datos): Noticia
    {
        $noticia->update($datos);

        return $noticia;
    }

    /**
     * Agrega imágenes a la galería de una noticia.
     *
     * @param  array<int, string>  $rutas
     */
    public function agregarImagenes(Noticia $noticia, array $rutas): void
    {
        foreach ($rutas as $ruta) {
            $noticia->imagenes()->create(['ubicacion' => $ruta]);
        }
    }

    /**
     * Reemplaza todas las imágenes de la galería.
     *
     * @param  array<int, string>  $rutas
     */
    public function reemplazarImagenes(Noticia $noticia, array $rutas): void
    {
        $noticia->imagenes()->delete();
        $this->agregarImagenes($noticia, $rutas);
    }

    /**
     * Agrega enlaces a una noticia.
     *
     * @param  array<int, string>  $enlaces
     */
    public function agregarEnlaces(Noticia $noticia, array $enlaces): void
    {
        foreach ($enlaces as $url) {
            $noticia->enlaces()->create(['url' => $url]);
        }
    }

    /**
     * Reemplaza todos los enlaces de una noticia.
     *
     * @param  array<int, string>  $enlaces
     */
    public function reemplazarEnlaces(Noticia $noticia, array $enlaces): void
    {
        $noticia->enlaces()->delete();
        $this->agregarEnlaces($noticia, $enlaces);
    }

    /**
     * Elimina una noticia y sus relaciones dependientes.
     */
    public function eliminar(Noticia $noticia): void
    {
        $noticia->delete();
    }
}
