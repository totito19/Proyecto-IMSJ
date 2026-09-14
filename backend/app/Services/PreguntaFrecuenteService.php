<?php

namespace App\Services;

use App\Models\PreguntaFrecuente;
use App\Models\User;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use App\Repositories\Contracts\PreguntaFrecuenteRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Coordina las reglas de negocio de las preguntas frecuentes.
 */
class PreguntaFrecuenteService
{
    /** Repositorio de preguntas frecuentes. */
    private readonly PreguntaFrecuenteRepositoryInterface $preguntaRepository;

    /** Repositorio de auditoría de acciones administrativas. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(
        PreguntaFrecuenteRepositoryInterface $preguntaRepository,
        HistorialAccionRepositoryInterface $historialRepository,
    ) {
        $this->preguntaRepository = $preguntaRepository;
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene las preguntas visibles para el portal ciudadano.
     *
     * @return Collection<int, PreguntaFrecuente>
     */
    public function obtenerPublicadas(): Collection
    {
        return $this->preguntaRepository->obtenerPublicadas();
    }

    /**
     * Obtiene todas las preguntas para su administración.
     *
     * @return Collection<int, PreguntaFrecuente>
     */
    public function obtenerTodas(): Collection
    {
        return $this->preguntaRepository->obtenerTodas();
    }

    /**
     * Crea una pregunta inicialmente no publicada y registra la acción.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos, User $actor): PreguntaFrecuente
    {
        return DB::transaction(function () use ($datos, $actor): PreguntaFrecuente {
            $pregunta = $this->preguntaRepository->crear([
                ...$datos,
                'estado' => 'NO_PUBLICADO',
            ]);
            $this->historialRepository->registrar($actor, 'CREAR', $pregunta);

            return $pregunta;
        });
    }

    /**
     * Actualiza el contenido de una pregunta y registra la acción.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(PreguntaFrecuente $pregunta, array $datos, User $actor): PreguntaFrecuente
    {
        return DB::transaction(function () use ($pregunta, $datos, $actor): PreguntaFrecuente {
            $this->preguntaRepository->actualizar($pregunta, $datos);
            $this->historialRepository->registrar($actor, 'ACTUALIZAR', $pregunta);

            return $pregunta;
        });
    }

    /**
     * Cambia el estado de publicación y registra la acción cuando corresponde.
     */
    public function actualizarEstado(PreguntaFrecuente $pregunta, string $estado, User $actor): PreguntaFrecuente
    {
        if ($pregunta->estado === $estado) {
            return $pregunta;
        }

        return DB::transaction(function () use ($pregunta, $estado, $actor): PreguntaFrecuente {
            $this->preguntaRepository->actualizar($pregunta, ['estado' => $estado]);
            $accion = $estado === 'PUBLICADO' ? 'PUBLICAR' : 'DESPUBLICAR';
            $this->historialRepository->registrar($actor, $accion, $pregunta);

            return $pregunta;
        });
    }

    /**
     * Elimina una pregunta y registra la acción administrativa.
     */
    public function eliminar(PreguntaFrecuente $pregunta, User $actor): void
    {
        DB::transaction(function () use ($pregunta, $actor): void {
            $this->historialRepository->registrar($actor, 'ELIMINAR', $pregunta);
            $this->preguntaRepository->eliminar($pregunta);
        });
    }
}
