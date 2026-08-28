<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_use_protected_route_and_logout(): void
    {
        User::factory()->personalImsj()->create([
            'cedula' => '12345678',
            'password' => 'clave-segura',
        ]);

        $login = $this->postJson('/api/login', [
            'cedula' => '1.234.567-8',
            'password' => 'clave-segura',
        ]);

        $login
            ->assertOk()
            ->assertJsonPath('usuario.cedula', '12345678')
            ->assertJsonPath('usuario.rol', 'PERSONAL_IMSJ')
            ->assertJsonStructure(['token', 'expira_en']);

        $token = (string) $login->json('token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('usuario.cedula', '12345678');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
        Auth::forgetGuards();

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertUnauthorized();
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'cedula' => '87654321',
            'password' => 'clave-correcta',
        ]);

        $this->postJson('/api/login', [
            'cedula' => '87654321',
            'password' => 'clave-incorrecta',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('cedula');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_citizen_can_register_and_receives_a_token(): void
    {
        $response = $this->postJson('/api/register', [
            'cedula' => '3.456.789-0',
            'password' => 'clave123',
            'password_confirmation' => 'clave123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('usuario.cedula', '34567890')
            ->assertJsonPath('usuario.rol', 'PUBLICO_GENERAL')
            ->assertJsonStructure(['token', 'expira_en']);

        $this->assertDatabaseHas('usuarios', [
            'cedula' => '34567890',
            'rol' => 'PUBLICO_GENERAL',
        ]);
    }
}
