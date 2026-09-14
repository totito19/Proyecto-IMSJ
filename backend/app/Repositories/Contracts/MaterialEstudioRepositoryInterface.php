<?php

namespace App\Repositories\Contracts;

use App\Models\MaterialEstudio;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define las operaciones de persistencia de materiales de estudio.
 */
interface MaterialEstudioRepositoryInterface
{
    /**
     * Obtiene los materiales publicados para el portal ciudadano.
     *
     * @return Collection<int, MaterialEstudio>
     */
    public function obtenerPublicados(): Collection;

    /**
     * Obtiene todos los materiales para la administración.
     *
     * @return Collection<int, MaterialEstudio>
     */
    public function obtenerTodos(): Collection;

    /**
     * Crea un material de estudio.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): MaterialEstudio;

    /**
     * Actualiza un material de estudio.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(MaterialEstudio $material, array $datos): MaterialEstudio;

    /**
     * Elimina un material de estudio.
     */
    public function eliminar(MaterialEstudio $material): void;
}
