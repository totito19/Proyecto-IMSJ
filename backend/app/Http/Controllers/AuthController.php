<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->merge([
            'cedula' => preg_replace('/\D/', '', (string) $request->input('cedula')),
        ]);

        $credentials = $request->validate([
            'cedula' => ['required', 'digits_between:7,8'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('cedula', $credentials['cedula'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'cedula' => ['Las credenciales no son correctas.'],
            ]);
        }

        return $this->authenticatedResponse($user);
    }

    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'cedula' => preg_replace('/\D/', '', (string) $request->input('cedula')),
        ]);

        $validated = $request->validate([
            'cedula' => ['required', 'digits_between:7,8', Rule::unique('usuarios', 'cedula')],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = User::query()->create([
            'cedula' => $validated['cedula'],
            'password' => $validated['password'],
            'rol' => 'PUBLICO_GENERAL',
        ]);

        return $this->authenticatedResponse($user, Response::HTTP_CREATED);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'usuario' => $request->user()->only(['id', 'cedula', 'rol']),
        ]);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->noContent();
    }

    private function authenticatedResponse(User $user, int $status = Response::HTTP_OK): JsonResponse
    {
        $user->tokens()->delete();
        $expiresAt = now()->addHours(8);
        $token = $user->createToken('web', ['*'], $expiresAt);

        return response()->json([
            'token' => $token->plainTextToken,
            'expira_en' => $expiresAt->toIso8601String(),
            'usuario' => $user->only(['id', 'cedula', 'rol']),
        ], $status);
    }
}
