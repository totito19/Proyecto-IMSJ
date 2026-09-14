<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Coordina la administración de integrantes del personal IMSJ.
 */
class UsuarioAdminService
{
    /** Clave inicial asignada a integrantes nuevos o reactivados. */
    public const string INITIAL_PASSWORD = 'imsj1234';

    /** Repositorio utilizado para consultar y persistir usuarios. */
    private readonly UserRepositoryInterface $userRepository;

    /** Repositorio de auditoría de acciones administrativas. */
    private readonly HistorialAccionRepositoryInterface $historialRepository;

    /**
     * Crea el servicio con sus dependencias de persistencia.
     */
    public function __construct(
        UserRepositoryInterface $userRepository,
        HistorialAccionRepositoryInterface $historialRepository,
    ) {
        $this->userRepository = $userRepository;
        $this->historialRepository = $historialRepository;
    }

    /**
     * Obtiene el personal IMSJ que actualmente tiene acceso.
     *
     * @return Collection<int, User>
     */
    public function obtenerPersonalActivo(): Collection
    {
        return $this->userRepository->obtenerPersonalActivo();
    }

    /**
     * Crea o reactiva un integrante del personal IMSJ.
     *
     * @param  array{nombre: string, cedula: string}  $datos
     */
    public function crearOReactivar(array $datos, User $actor): User
    {
        return DB::transaction(function () use ($datos, $actor): User {
            $usuario = $this->userRepository->buscarPorCedula($datos['cedula']);

            if ($usuario?->rol === 'PUBLICO_GENERAL') {
                throw ValidationException::withMessages([
                    'cedula' => ['La cédula ya pertenece a una cuenta ciudadana.'],
                ]);
            }

            if ($usuario?->activo) {
                throw ValidationException::withMessages([
                    'cedula' => ['Ya existe un integrante activo con esa cédula.'],
                ]);
            }

            $accion = $usuario ? 'REACTIVAR' : 'CREAR';

            if ($usuario) {
                $this->userRepository->actualizar($usuario, [
                    'nombre' => $datos['nombre'],
                    'password' => self::INITIAL_PASSWORD,
                    'activo' => true,
                ]);
            } else {
                $usuario = $this->userRepository->crear([
                    'nombre' => $datos['nombre'],
                    'cedula' => $datos['cedula'],
                    'password' => self::INITIAL_PASSWORD,
                    'rol' => 'PERSONAL_IMSJ',
                    'activo' => true,
                ]);
            }

            $this->historialRepository->registrar($actor, $accion, $usuario);

            return $usuario;
        });
    }

    /**
     * Desactiva un integrante sin permitir el auto-bloqueo ni dejar el sistema sin personal.
     */
    public function desactivar(User $usuario, User $actor): void
    {
        abort_unless($usuario->rol === 'PERSONAL_IMSJ' && $usuario->activo, 404);

        if ($actor->is($usuario)) {
            throw ValidationException::withMessages([
                'usuario' => ['No puede quitar su propio acceso.'],
            ]);
        }

        if ($this->userRepository->contarPersonalActivo() <= 1) {
            throw ValidationException::withMessages([
                'usuario' => ['Debe quedar al menos un integrante del personal IMSJ.'],
            ]);
        }

        DB::transaction(function () use ($actor, $usuario): void {
            $this->userRepository->eliminarTokens($usuario);
            $this->userRepository->actualizar($usuario, ['activo' => false]);
            $this->historialRepository->registrar($actor, 'DESACTIVAR', $usuario);
        });
    }
}
