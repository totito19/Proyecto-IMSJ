<?php

namespace App\Repositories\Eloquent;

use App\Models\PreguntaFrecuente;
use App\Repositories\Contracts\PreguntaFrecuenteRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementa la persistencia de preguntas frecuentes con Eloquent.
 */
class EloquentPreguntaFrecuenteRepository implements PreguntaFrecuenteRepositoryInterface
{
    /**
     * Obtiene las preguntas visibles en el portal.
     *
     * @return Collection<int, PreguntaFrecuente>
     */
    public function obtenerPublicadas(): Collection
    {
        return PreguntaFrecuente::query()->publicada()->latest()->get();
    }

    /**
     * Obtiene todas las preguntas ordenadas desde la más reciente.
     *
     * @return Collection<int, PreguntaFrecuente>
     */
    public function obtenerTodas(): Collection
    {
        return PreguntaFrecuente::query()->latest()->get();
    }

    /**
     * Persiste una nueva pregunta frecuente.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): PreguntaFrecuente
    {
        return PreguntaFrecuente::query()->create($datos);
    }

    /**
     * Persiste los cambios de una pregunta frecuente.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(PreguntaFrecuente $pregunta, array $datos): PreguntaFrecuente
    {
        $pregunta->update($datos);

        return $pregunta;
    }

    /**
     * Elimina una pregunta frecuente.
     */
    public function eliminar(PreguntaFrecuente $pregunta): void
    {
        $pregunta->delete();
    }
}
