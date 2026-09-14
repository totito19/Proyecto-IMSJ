<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

/**
 * Atiende las peticiones HTTP de autenticación de usuarios.
 */
class AuthController extends Controller
{
    /** Servicio que coordina el registro y la autenticación. */
    private readonly AuthService $authService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Valida las credenciales y devuelve un token de acceso.
     */
    public function login(Request $request): JsonResponse
    {
        $request->merge([
            'cedula' => preg_replace('/\D/', '', (string) $request->input('cedula')),
        ]);

        $credentials = $request->validate([
            'cedula' => ['required', 'digits_between:7,8'],
            'password' => ['required', 'string'],
        ]);

        $usuario = $this->authService->autenticar($credentials['cedula'], $credentials['password']);

        return response()->json($this->authService->emitirCredenciales($usuario));
    }

    /**
     * Valida y registra una nueva cuenta ciudadana.
     */
    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'cedula' => preg_replace('/\D/', '', (string) $request->input('cedula')),
        ]);

        $validated = $request->validate([
            'cedula' => ['required', 'digits_between:7,8', Rule::unique('usuarios', 'cedula')],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $usuario = $this->authService->registrarCiudadano(
            $validated['cedula'],
            $validated['password'],
        );

        return response()->json(
            $this->authService->emitirCredenciales($usuario),
            Response::HTTP_CREATED,
        );
    }

    /**
     * Devuelve el perfil del usuario autenticado.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'usuario' => $this->authService->obtenerPerfil($this->user($request)),
        ]);
    }

    /**
     * Revoca el token utilizado en la petición actual.
     */
    public function logout(Request $request): Response
    {
        $this->authService->cerrarSesion($this->user($request));

        return response()->noContent();
    }

    /**
     * Obtiene el usuario autenticado que realiza la operación.
     */
    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
