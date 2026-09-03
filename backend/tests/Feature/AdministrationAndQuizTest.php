<?php

namespace Tests\Feature;

use App\Models\PreguntaPrueba;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdministrationAndQuizTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_add_and_deactivate_another_staff_member_with_audit_history(): void
    {
        $actor = User::factory()->personalImsj()->create([
            'nombre' => 'Ana Pérez',
            'cedula' => '12345678',
        ]);
        Sanctum::actingAs($actor);

        $response = $this->postJson('/api/usuarios-admin', [
            'nombre' => 'Luis Rodríguez',
            'cedula' => '4.567.890-1',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('usuario.nombre', 'Luis Rodríguez')
            ->assertJsonPath('usuario.cedula', '45678901')
            ->assertJsonPath('clave_inicial', 'imsj1234');

        $usuarioId = (int) $response->json('usuario.id');

        $this->getJson('/api/usuarios-admin')
            ->assertOk()
            ->assertJsonFragment(['nombre' => 'Luis Rodríguez']);

        $this->deleteJson("/api/usuarios-admin/{$usuarioId}")->assertNoContent();

        $this->assertDatabaseHas('usuarios', [
            'id' => $usuarioId,
            'activo' => false,
        ]);
        $this->assertDatabaseHas('historial_acciones', [
            'usuario_id' => $actor->id,
            'accion' => 'DESACTIVAR',
            'tipo_elemento' => 'User',
            'elemento_id' => $usuarioId,
        ]);

        $this->getJson('/api/historial?limite=10')
            ->assertOk()
            ->assertJsonPath('acciones.0.usuario.nombre', 'Ana Pérez');
    }

    public function test_staff_cannot_deactivate_their_own_account(): void
    {
        $actor = User::factory()->personalImsj()->create();
        Sanctum::actingAs($actor);

        $this->deleteJson("/api/usuarios-admin/{$actor->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('usuario');
    }

    public function test_staff_can_manage_the_quiz_question_bank(): void
    {
        $actor = User::factory()->personalImsj()->create();
        Sanctum::actingAs($actor);

        $response = $this->postJson('/api/preguntas-prueba', $this->questionData());
        $response
            ->assertCreated()
            ->assertJsonPath('pregunta.respuesta_correcta', 'B');

        $preguntaId = (int) $response->json('pregunta.id');

        $this->putJson("/api/preguntas-prueba/{$preguntaId}", [
            ...$this->questionData(),
            'pregunta' => '¿Qué indica una luz roja?',
            'respuesta_correcta' => 'A',
        ])
            ->assertOk()
            ->assertJsonPath('pregunta.pregunta', '¿Qué indica una luz roja?');

        $this->deleteJson("/api/preguntas-prueba/{$preguntaId}")->assertNoContent();

        $this->assertDatabaseHas('historial_acciones', [
            'usuario_id' => $actor->id,
            'accion' => 'ELIMINAR',
            'tipo_elemento' => 'PreguntaPrueba',
            'elemento_id' => $preguntaId,
        ]);
    }

    public function test_public_quiz_hides_answers_and_is_corrected_by_the_backend(): void
    {
        $pregunta = PreguntaPrueba::factory()->create([
            ...$this->questionData(),
            'respuesta_correcta' => 'B',
        ]);

        $this->getJson('/api/portal/prueba')
            ->assertOk()
            ->assertJsonMissingPath('preguntas.0.respuesta_correcta')
            ->assertJsonPath('preguntas.0.opciones.B', 'Detenerse');

        $this->postJson('/api/portal/prueba/corregir', [
            'respuestas' => [[
                'pregunta_id' => $pregunta->id,
                'opcion' => 'B',
            ]],
        ])
            ->assertOk()
            ->assertJsonPath('total', 1)
            ->assertJsonPath('correctas', 1)
            ->assertJsonPath('resultados.0.respuesta_correcta', 'B');
    }

    /**
     * @return array<string, string>
     */
    private function questionData(): array
    {
        return [
            'pregunta' => '¿Qué hacer ante una luz roja?',
            'opcion_a' => 'Acelerar',
            'opcion_b' => 'Detenerse',
            'opcion_c' => 'Tocar bocina',
            'opcion_d' => 'Girar',
            'respuesta_correcta' => 'B',
        ];
    }
}
