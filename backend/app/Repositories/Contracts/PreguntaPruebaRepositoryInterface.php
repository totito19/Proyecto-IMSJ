<?php

namespace App\Repositories\Contracts;

use App\Models\PreguntaPrueba;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define las operaciones de persistencia de las preguntas de prueba.
 */
interface PreguntaPruebaRepositoryInterface
{
    /**
     * Obtiene una selección aleatoria de preguntas.
     *
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerAleatorias(int $limite): Collection;

    /**
     * Obtiene las preguntas indicadas por sus identificadores.
     *
     * @param  array<int, int>  $identificadores
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerPorIds(array $identificadores): Collection;

    /**
     * Obtiene todas las preguntas para la administración.
     *
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerTodas(): Collection;

    /**
     * Crea una pregunta de prueba.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): PreguntaPrueba;

    /**
     * Actualiza una pregunta de prueba.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(PreguntaPrueba $pregunta, array $datos): PreguntaPrueba;

    /**
     * Elimina una pregunta de prueba.
     */
    public function eliminar(PreguntaPrueba $pregunta): void;
}
