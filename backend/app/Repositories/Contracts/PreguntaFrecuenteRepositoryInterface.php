<?php

namespace App\Repositories\Contracts;

use App\Models\PreguntaFrecuente;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define las operaciones de persistencia de las preguntas frecuentes.
 */
interface PreguntaFrecuenteRepositoryInterface
{
    /**
     * Obtiene las preguntas publicadas para el portal ciudadano.
     *
     * @return Collection<int, PreguntaFrecuente>
     */
    public function obtenerPublicadas(): Collection;

    /**
     * Obtiene todas las preguntas para la administración.
     *
     * @return Collection<int, PreguntaFrecuente>
     */
    public function obtenerTodas(): Collection;

    /**
     * Crea una pregunta frecuente.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): PreguntaFrecuente;

    /**
     * Actualiza una pregunta frecuente.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(PreguntaFrecuente $pregunta, array $datos): PreguntaFrecuente;

    /**
     * Elimina una pregunta frecuente.
     */
    public function eliminar(PreguntaFrecuente $pregunta): void;
}
