<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Sanctum\NewAccessToken;

/**
 * Implementa la persistencia de usuarios y tokens con Eloquent y Sanctum.
 */
class EloquentUserRepository implements UserRepositoryInterface
{
    /**
     * Busca un usuario por su cédula.
     */
    public function buscarPorCedula(string $cedula): ?User
    {
        return User::query()->where('cedula', $cedula)->first();
    }

    /**
     * Obtiene el personal activo ordenado por nombre.
     *
     * @return Collection<int, User>
     */
    public function obtenerPersonalActivo(): Collection
    {
        return User::query()
            ->where('rol', 'PERSONAL_IMSJ')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'cedula', 'created_at']);
    }

    /**
     * Cuenta los integrantes activos del personal IMSJ.
     */
    public function contarPersonalActivo(): int
    {
        return User::query()
            ->where('rol', 'PERSONAL_IMSJ')
            ->where('activo', true)
            ->count();
    }

    /**
     * Persiste un nuevo usuario.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): User
    {
        return User::query()->create($datos);
    }

    /**
     * Persiste los cambios de un usuario.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(User $usuario, array $datos): User
    {
        $usuario->update($datos);

        return $usuario;
    }

    /**
     * Elimina todos los tokens personales del usuario.
     */
    public function eliminarTokens(User $usuario): void
    {
        $usuario->tokens()->delete();
    }

    /**
     * Elimina el token utilizado para autenticar la petición actual.
     */
    public function eliminarTokenActual(User $usuario): void
    {
        $usuario->currentAccessToken()?->delete();
    }

    /**
     * Emite un token personal de Sanctum.
     *
     * @param  array<int, string>  $capacidades
     */
    public function crearToken(
        User $usuario,
        string $nombre,
        array $capacidades,
        DateTimeInterface $expiraEn,
    ): NewAccessToken {
        return $usuario->createToken($nombre, $capacidades, $expiraEn);
    }
}
