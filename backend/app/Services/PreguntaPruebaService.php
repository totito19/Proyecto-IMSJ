<?php

namespace App\Services;

use App\Models\PreguntaPrueba;
use App\Models\User;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use App\Repositories\Contracts\PreguntaPruebaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\DB;

/**
 * Coordina la prueba pública y la administración de sus preguntas.
 */
class PreguntaPruebaService
{
    /** Repositorio de preguntas de prueba. */
    private readonly PreguntaPruebaRepositoryInterface $preguntaRepository;

    /** Repositorio de auditoría de acciones administrativas. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(
        PreguntaPruebaRepositoryInterface $preguntaRepository,
        HistorialAccionRepositoryInterface $historialRepository,
    ) {
        $this->preguntaRepository = $preguntaRepository;
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene las preguntas que integrarán una prueba pública.
     *
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerPrueba(int $limite = 10): Collection
    {
        return $this->preguntaRepository->obtenerAleatorias($limite);
    }

    /**
     * Corrige las respuestas enviadas por una persona.
     *
     * @param  array<int, array{pregunta_id: int, opcion: string}>  $respuestas
     * @return SupportCollection<int, array{pregunta_id: int, correcta: bool, respuesta_correcta: string}>
     */
    public function corregir(array $respuestas): SupportCollection
    {
        $identificadores = collect($respuestas)->pluck('pregunta_id')->all();
        $preguntas = $this->preguntaRepository->obtenerPorIds($identificadores);

        return collect($respuestas)->map(function (array $respuesta) use ($preguntas): array {
            $pregunta = $preguntas->get($respuesta['pregunta_id']);

            return [
                'pregunta_id' => $respuesta['pregunta_id'],
                'correcta' => $pregunta->respuesta_correcta === $respuesta['opcion'],
                'respuesta_correcta' => $pregunta->respuesta_correcta,
            ];
        });
    }

    /**
     * Obtiene todas las preguntas para su administración.
     *
     * @return Collection<int, PreguntaPrueba>
     */
    public function obtenerTodas(): Collection
    {
        return $this->preguntaRepository->obtenerTodas();
    }

    /**
     * Crea una pregunta y registra la acción administrativa.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos, User $actor): PreguntaPrueba
    {
        return DB::transaction(function () use ($datos, $actor): PreguntaPrueba {
            $pregunta = $this->preguntaRepository->crear($datos);
            $this->historialRepository->registrar($actor, 'CREAR', $pregunta);

            return $pregunta;
        });
    }

    /**
     * Actualiza una pregunta y registra la acción administrativa.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(PreguntaPrueba $pregunta, array $datos, User $actor): PreguntaPrueba
    {
        return DB::transaction(function () use ($pregunta, $datos, $actor): PreguntaPrueba {
            $this->preguntaRepository->actualizar($pregunta, $datos);
            $this->historialRepository->registrar($actor, 'ACTUALIZAR', $pregunta);

            return $pregunta;
        });
    }

    /**
     * Elimina una pregunta y registra la acción administrativa.
     */
    public function eliminar(PreguntaPrueba $pregunta, User $actor): void
    {
        DB::transaction(function () use ($pregunta, $actor): void {
            $this->historialRepository->registrar($actor, 'ELIMINAR', $pregunta);
            $this->preguntaRepository->eliminar($pregunta);
        });
    }
}
