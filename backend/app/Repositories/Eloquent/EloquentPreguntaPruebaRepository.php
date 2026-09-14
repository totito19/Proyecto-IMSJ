<?php

namespace App\Repositories\Eloquent;

use App\Models\PreguntaPrueba;
use App\Repositories\Contracts\PreguntaPruebaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

/**
 * Implementa la persistencia de preguntas de prueba con Eloquent.
 */
class EloquentPreguntaPruebaRepository implements PreguntaPruebaRepositoryInterface
{
    /**
     * Obtiene una selección aleatoria de preguntas.
     *
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerAleatorias(int $limite): Collection
    {
        return PreguntaPrueba::query()->inRandomOrder()->limit($limite)->get();
    }

    /**
     * Obtiene las preguntas indicadas y las indexa por identificador.
     *
     * @param  array<int, int>  $identificadores
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerPorIds(array $identificadores): Collection
    {
        return PreguntaPrueba::query()
            ->whereKey($identificadores)
            ->get()
            ->keyBy('id');
    }

    /**
     * Obtiene todas las preguntas ordenadas desde la más reciente.
     *
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerTodas(): Collection
    {
        return PreguntaPrueba::query()->latest()->get();
    }

    /**
     * Persiste una nueva pregunta de prueba.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): PreguntaPrueba
    {
        return PreguntaPrueba::query()->create($datos);
    }

    /**
     * Persiste los cambios de una pregunta de prueba.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(PreguntaPrueba $pregunta, array $datos): PreguntaPrueba
    {
        $pregunta->update($datos);

        return $pregunta;
    }

    /**
     * Elimina una pregunta de prueba.
     */
    public function eliminar(PreguntaPrueba $pregunta): void
    {
        $pregunta->delete();
    }
}
