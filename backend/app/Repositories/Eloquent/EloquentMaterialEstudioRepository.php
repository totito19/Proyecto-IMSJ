<?php

namespace App\Repositories\Eloquent;

use App\Models\MaterialEstudio;
use App\Repositories\Contracts\MaterialEstudioRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementa la persistencia de materiales de estudio con Eloquent.
 */
class EloquentMaterialEstudioRepository implements MaterialEstudioRepositoryInterface
{
    /**
     * Obtiene los materiales publicados desde el más reciente.
     *
     * @return Collection<int, MaterialEstudio>
     */
    public function obtenerPublicados(): Collection
    {
        return MaterialEstudio::query()->publicado()->latest()->get();
    }

    /**
     * Obtiene todos los materiales desde el más reciente.
     *
     * @return Collection<int, MaterialEstudio>
     */
    public function obtenerTodos(): Collection
    {
        return MaterialEstudio::query()->latest()->get();
    }

    /**
     * Persiste un nuevo material de estudio.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): MaterialEstudio
    {
        return MaterialEstudio::query()->create($datos);
    }

    /**
     * Persiste los cambios de un material de estudio.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(MaterialEstudio $material, array $datos): MaterialEstudio
    {
        $material->update($datos);

        return $material;
    }

    /**
     * Elimina un material de estudio.
     */
    public function eliminar(MaterialEstudio $material): void
    {
        $material->delete();
    }
}
