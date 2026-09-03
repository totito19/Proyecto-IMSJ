<?php

namespace App\Http\Controllers;

use App\Models\HistorialAccion;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UsuarioAdminController extends Controller
{
    private const string INITIAL_PASSWORD = 'imsj1234';

    public function index(): JsonResponse
    {
        return response()->json([
            'usuarios' => User::query()
                ->where('rol', 'PERSONAL_IMSJ')
                ->where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'cedula', 'created_at']),
        ]);
    }

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

        $actor = $this->user($request);

        $usuario = DB::transaction(function () use ($actor, $validated): User {
            $usuario = User::query()->where('cedula', $validated['cedula'])->first();

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
                $usuario->update([
                    'nombre' => $validated['nombre'],
                    'password' => self::INITIAL_PASSWORD,
                    'activo' => true,
                ]);
            } else {
                $usuario = User::query()->create([
                    'nombre' => $validated['nombre'],
                    'cedula' => $validated['cedula'],
                    'password' => self::INITIAL_PASSWORD,
                    'rol' => 'PERSONAL_IMSJ',
                    'activo' => true,
                ]);
            }

            HistorialAccion::registrar($actor, $accion, $usuario);

            return $usuario;
        });

        return response()->json([
            'usuario' => $usuario->only(['id', 'nombre', 'cedula']),
            'clave_inicial' => self::INITIAL_PASSWORD,
        ], Response::HTTP_CREATED);
    }

    public function destroy(Request $request, User $usuario): Response
    {
        abort_unless($usuario->rol === 'PERSONAL_IMSJ' && $usuario->activo, Response::HTTP_NOT_FOUND);

        $actor = $this->user($request);

        if ($actor->is($usuario)) {
            throw ValidationException::withMessages([
                'usuario' => ['No puede quitar su propio acceso.'],
            ]);
        }

        if (User::query()->where('rol', 'PERSONAL_IMSJ')->where('activo', true)->count() <= 1) {
            throw ValidationException::withMessages([
                'usuario' => ['Debe quedar al menos un integrante del personal IMSJ.'],
            ]);
        }

        DB::transaction(function () use ($actor, $usuario): void {
            $usuario->tokens()->delete();
            $usuario->update(['activo' => false]);
            HistorialAccion::registrar($actor, 'DESACTIVAR', $usuario);
        });

        return response()->noContent();
    }

    private function user(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, Response::HTTP_UNAUTHORIZED);

        return $user;
    }
}
