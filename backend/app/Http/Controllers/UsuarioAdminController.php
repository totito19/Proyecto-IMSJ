<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UsuarioAdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Atiende las peticiones HTTP de administración del personal IMSJ.
 */
class UsuarioAdminController extends Controller
{
    /** Servicio que coordina la administración del personal. */
    private readonly UsuarioAdminService $usuarioService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(UsuarioAdminService $usuarioService)
    {
        $this->usuarioService = $usuarioService;
    }

    /**
     * Devuelve los integrantes activos del personal IMSJ.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'usuarios' => $this->usuarioService->obtenerPersonalActivo(),
        ]);
    }

    /**
     * Valida y crea o reactiva un integrante del personal.
     */
    public function store(Request $request): JsonResponse
    {
        $request->merge([
            'nombre' => trim((string) $request->input('nombre')),
            'cedula' => preg_replace('/\D/', '', (string) $request->input('cedula')),
        ]);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'cedula' => ['required', 'digits_between:7,8'],
        ]);

        $usuario = $this->usuarioService->crearOReactivar($validated, $this->user($request));

        return response()->json([
            'usuario' => $usuario->only(['id', 'nombre', 'cedula']),
            'clave_inicial' => UsuarioAdminService::INITIAL_PASSWORD,
        ], Response::HTTP_CREATED);
    }

    /**
     * Desactiva el acceso de un integrante del personal.
     */
    public function destroy(Request $request, User $usuario): Response
    {
        $this->usuarioService->desactivar($usuario, $this->user($request));

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
