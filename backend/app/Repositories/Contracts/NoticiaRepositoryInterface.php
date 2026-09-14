<?php

namespace App\Repositories\Contracts;

use App\Models\Noticia;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define las operaciones de persistencia de noticias y sus elementos asociados.
 */
interface NoticiaRepositoryInterface
{
    /**
     * Obtiene las noticias visibles para el portal ciudadano.
     *
     * @return Collection<int, Noticia>
     */
    public function obtenerVisibles(): Collection;

    /**
     * Obtiene todas las noticias para la administración.
     *
     * @return Collection<int, Noticia>
     */
    public function obtenerTodas(): Collection;

    /**
     * Carga las imágenes y enlaces de una noticia.
     */
    public function cargarRelaciones(Noticia $noticia): Noticia;

    /**
     * Obtiene las ubicaciones de las imágenes de galería.
     *
     * @return array<int, string>
     */
    public function obtenerRutasGaleria(Noticia $noticia): array;

    /**
     * Crea una noticia.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): Noticia;

    /**
     * Actualiza una noticia.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(Noticia $noticia, array $datos): Noticia;

    /**
     * Agrega imágenes a la galería de una noticia.
     *
     * @param  array<int, string>  $rutas
     */
    public function agregarImagenes(Noticia $noticia, array $rutas): void;

    /**
     * Reemplaza todas las imágenes de la galería.
     *
     * @param  array<int, string>  $rutas
     */
    public function reemplazarImagenes(Noticia $noticia, array $rutas): void;

    /**
     * Agrega enlaces a una noticia.
     *
     * @param  array<int, string>  $enlaces
     */
    public function agregarEnlaces(Noticia $noticia, array $enlaces): void;

    /**
     * Reemplaza todos los enlaces de una noticia.
     *
     * @param  array<int, string>  $enlaces
     */
    public function reemplazarEnlaces(Noticia $noticia, array $enlaces): void;

    /**
     * Elimina una noticia.
     */
    public function eliminar(Noticia $noticia): void;
}
