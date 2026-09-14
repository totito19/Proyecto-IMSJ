<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Collection;
use Laravel\Sanctum\NewAccessToken;

/**
 * Define las operaciones de persistencia de usuarios y sus tokens.
 */
interface UserRepositoryInterface
{
    /**
     * Busca un usuario por su cédula.
     */
    public function buscarPorCedula(string $cedula): ?User;

    /**
     * Obtiene el personal IMSJ activo.
     *
     * @return Collection<int, User>
     */
    public function obtenerPersonalActivo(): Collection;

    /**
     * Cuenta los integrantes activos del personal IMSJ.
     */
    public function contarPersonalActivo(): int;

    /**
     * Crea un usuario.
     *
     * @param  array<string, mixed>  $datos
     */
    public function crear(array $datos): User;

    /**
     * Actualiza un usuario.
     *
     * @param  array<string, mixed>  $datos
     */
    public function actualizar(User $usuario, array $datos): User;

    /**
     * Elimina todos los tokens personales de un usuario.
     */
    public function eliminarTokens(User $usuario): void;

    /**
     * Elimina únicamente el token utilizado en la petición actual.
     */
    public function eliminarTokenActual(User $usuario): void;

    /**
     * Crea un token personal con fecha de expiración.
     *
     * @param  array<int, string>  $capacidades
     */
    public function crearToken(
        User $usuario,
        string $nombre,
        array $capacidades,
        DateTimeInterface $expiraEn,
    ): NewAccessToken;
}
