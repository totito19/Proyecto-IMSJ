<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Coordina el registro, ingreso y cierre de sesión de usuarios.
 */
class AuthService
{
    /** Repositorio utilizado para usuarios y tokens. */
    private readonly UserRepositoryInterface $userRepository;

    /**
     * Crea el servicio con su dependencia de persistencia.
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Verifica las credenciales y devuelve el usuario autenticado.
     */
    public function autenticar(string $cedula, string $password): User
    {
        $usuario = $this->userRepository->buscarPorCedula($cedula);

        if (! $usuario || ! $usuario->activo || ! Hash::check($password, $usuario->password)) {
            throw ValidationException::withMessages([
                'cedula' => ['Las credenciales no son correctas.'],
            ]);
        }

        return $usuario;
    }

    /**
     * Registra una nueva cuenta ciudadana.
     */
    public function registrarCiudadano(string $cedula, string $password): User
    {
        return $this->userRepository->crear([
            'cedula' => $cedula,
            'password' => $password,
            'rol' => 'PUBLICO_GENERAL',
        ]);
    }

    /**
     * Reemplaza los tokens anteriores y genera las credenciales de acceso.
     *
     * @return array{token: string, expira_en: string, usuario: array<string, mixed>}
     */
    public function emitirCredenciales(User $usuario): array
    {
        $this->userRepository->eliminarTokens($usuario);
        $expiraEn = now()->addHours(8);
        $token = $this->userRepository->crearToken($usuario, 'web', ['*'], $expiraEn);

        return [
            'token' => $token->plainTextToken,
            'expira_en' => $expiraEn->toIso8601String(),
            'usuario' => $this->obtenerPerfil($usuario),
        ];
    }

    /**
     * Devuelve los datos públicos del usuario autenticado.
     *
     * @return array<string, mixed>
     */
    public function obtenerPerfil(User $usuario): array
    {
        return $usuario->only(['id', 'nombre', 'cedula', 'rol']);
    }

    /**
     * Revoca el token utilizado en la petición actual.
     */
    public function cerrarSesion(User $usuario): void
    {
        $this->userRepository->eliminarTokenActual($usuario);
    }
}
