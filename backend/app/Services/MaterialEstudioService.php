<?php

namespace App\Services;

use App\Models\MaterialEstudio;
use App\Models\User;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use App\Repositories\Contracts\MaterialEstudioRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

/**
 * Coordina la publicación de materiales y el almacenamiento de sus archivos.
 */
class MaterialEstudioService
{
    /** Repositorio de materiales de estudio. */
    private readonly MaterialEstudioRepositoryInterface $materialRepository;

    /** Repositorio de auditoría de acciones administrativas. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(
        MaterialEstudioRepositoryInterface $materialRepository,
        HistorialAccionRepositoryInterface $historialRepository,
    ) {
        $this->materialRepository = $materialRepository;
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene los materiales visibles para el portal ciudadano.
     *
     * @return Collection<int, MaterialEstudio>
     */
    public function obtenerPublicados(): Collection
    {
        return $this->materialRepository->obtenerPublicados();
    }

    /**
     * Obtiene todos los materiales para su administración.
     *
     * @return Collection<int, MaterialEstudio>
     */
    public function obtenerTodos(): Collection
    {
        return $this->materialRepository->obtenerTodos();
    }

    /**
     * Guarda el recurso, crea el material y registra la acción administrativa.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos, ?UploadedFile $archivo, User $actor): MaterialEstudio
    {
        $recurso = $this->guardarRecurso(
            $archivo,
            $datos['tipo'],
            $datos['ubicacion_recurso'] ?? null,
        );

        try {
            return DB::transaction(function () use ($datos, $recurso, $actor): MaterialEstudio {
                $material = $this->materialRepository->crear([
                    'nombre' => $datos['nombre'],
                    'tipo' => $datos['tipo'],
                    'ubicacion_recurso' => $recurso,
                    'estado' => 'NO_PUBLICADO',
                ]);
                $this->historialRepository->registrar($actor, 'CREAR', $material);

                return $material;
            });
        } catch (Throwable $exception) {
            $this->eliminarRecursoGuardado($recurso);

            throw $exception;
        }
    }

    /**
     * Actualiza un material y reemplaza su archivo cuando corresponde.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(
        MaterialEstudio $material,
        array $datos,
        ?UploadedFile $archivo,
        User $actor,
    ): MaterialEstudio {
        $nuevoRecurso = $this->guardarRecurso(
            $archivo,
            $datos['tipo'],
            $datos['ubicacion_recurso'] ?? null,
            false,
        );
        $recursoAnterior = $material->ubicacion_recurso;

        try {
            DB::transaction(function () use ($material, $datos, $nuevoRecurso, $actor): void {
                $this->materialRepository->actualizar($material, [
                    'nombre' => $datos['nombre'],
                    'tipo' => $datos['tipo'],
                    'ubicacion_recurso' => $nuevoRecurso ?? $material->ubicacion_recurso,
                ]);
                $this->historialRepository->registrar($actor, 'ACTUALIZAR', $material);
            });
        } catch (Throwable $exception) {
            $this->eliminarRecursoGuardado($nuevoRecurso);

            throw $exception;
        }

        if ($nuevoRecurso !== null && $recursoAnterior !== $nuevoRecurso) {
            $this->eliminarRecursoGuardado($recursoAnterior);
        }

        return $material;
    }

    /**
     * Cambia el estado de publicación y registra la acción cuando corresponde.
     */
    public function actualizarEstado(MaterialEstudio $material, string $estado, User $actor): MaterialEstudio
    {
        if ($material->estado === $estado) {
            return $material;
        }

        return DB::transaction(function () use ($material, $estado, $actor): MaterialEstudio {
            $this->materialRepository->actualizar($material, ['estado' => $estado]);
            $accion = $estado === 'PUBLICADO' ? 'PUBLICAR' : 'DESPUBLICAR';
            $this->historialRepository->registrar($actor, $accion, $material);

            return $material;
        });
    }

    /**
     * Elimina el material, registra la acción y quita el archivo local asociado.
     */
    public function eliminar(MaterialEstudio $material, User $actor): void
    {
        $recurso = $material->ubicacion_recurso;

        DB::transaction(function () use ($material, $actor): void {
            $this->historialRepository->registrar($actor, 'ELIMINAR', $material);
            $this->materialRepository->eliminar($material);
        });

        $this->eliminarRecursoGuardado($recurso);
    }

    /**
     * Guarda un archivo local o devuelve la URL de un video.
     */
    private function guardarRecurso(
        ?UploadedFile $archivo,
        string $tipo,
        ?string $url = null,
        bool $obligatorio = true,
    ): ?string {
        if ($tipo === 'VIDEO') {
            return $url;
        }

        if (! $archivo instanceof UploadedFile) {
            if ($obligatorio) {
                throw new RuntimeException('No se recibió el archivo del material.');
            }

            return null;
        }

        $ruta = $archivo->store('materiales', 'public');

        if ($ruta === false) {
            throw new RuntimeException('No se pudo guardar el material.');
        }

        return $ruta;
    }

    /**
     * Elimina un archivo local sin afectar recursos alojados en una URL externa.
     */
    private function eliminarRecursoGuardado(?string $recurso): void
    {
        if ($recurso !== null
            && ! str_starts_with($recurso, 'http://')
            && ! str_starts_with($recurso, 'https://')) {
            Storage::disk('public')->delete($recurso);
        }
    }
}
