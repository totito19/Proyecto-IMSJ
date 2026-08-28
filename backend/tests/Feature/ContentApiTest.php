<?php

namespace Tests\Feature;

use App\Models\MaterialEstudio;
use App\Models\PreguntaFrecuente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_portal_only_lists_published_materials_and_questions(): void
    {
        MaterialEstudio::factory()->publicado()->create(['nombre' => 'Material visible']);
        MaterialEstudio::factory()->create(['nombre' => 'Material borrador']);
        PreguntaFrecuente::factory()->publicada()->create(['pregunta' => 'Pregunta visible']);
        PreguntaFrecuente::factory()->create(['pregunta' => 'Pregunta borrador']);

        $this->getJson('/api/portal/materiales')
            ->assertOk()
            ->assertJsonCount(1, 'materiales')
            ->assertJsonPath('materiales.0.nombre', 'Material visible');

        $this->getJson('/api/portal/preguntas')
            ->assertOk()
            ->assertJsonCount(1, 'preguntas')
            ->assertJsonPath('preguntas.0.pregunta', 'Pregunta visible');
    }

    public function test_staff_can_manage_materials_and_questions_with_audit_history(): void
    {
        Sanctum::actingAs(User::factory()->personalImsj()->create());

        $materialResponse = $this->postJson('/api/materiales', [
            'nombre' => 'Video de señales',
            'tipo' => 'VIDEO',
            'ubicacion_recurso' => 'https://www.youtube.com/watch?v=abc123',
        ])
            ->assertCreated()
            ->assertJsonPath('material.estado', 'NO_PUBLICADO');
        $materialId = (int) $materialResponse->json('material.id');

        $this->patchJson("/api/materiales/{$materialId}/estado", ['estado' => 'PUBLICADO'])
            ->assertOk();
        $this->getJson('/api/portal/materiales')
            ->assertJsonPath('materiales.0.nombre', 'Video de señales');
        $this->deleteJson("/api/materiales/{$materialId}")->assertNoContent();

        $questionResponse = $this->postJson('/api/preguntas', [
            'pregunta' => '¿Dónde se realiza el trámite?',
            'respuesta' => 'En el Instituto de Seguridad Vial.',
        ])->assertCreated();
        $questionId = (int) $questionResponse->json('pregunta.id');

        $this->putJson("/api/preguntas/{$questionId}", [
            'pregunta' => '¿Dónde se realiza la prueba?',
            'respuesta' => 'En el Instituto de Seguridad Vial.',
        ])->assertOk();
        $this->patchJson("/api/preguntas/{$questionId}/estado", ['estado' => 'PUBLICADO'])
            ->assertOk();

        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'ELIMINAR',
            'tipo_elemento' => 'MaterialEstudio',
            'elemento_id' => $materialId,
        ]);
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'ACTUALIZAR',
            'tipo_elemento' => 'PreguntaFrecuente',
            'elemento_id' => $questionId,
        ]);
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'PUBLICAR',
            'tipo_elemento' => 'PreguntaFrecuente',
            'elemento_id' => $questionId,
        ]);
    }

    public function test_material_uploads_are_validated_and_deleted_with_the_record(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->personalImsj()->create());

        $response = $this->post('/api/materiales', [
            'nombre' => 'Guía vial',
            'tipo' => 'PDF',
            'archivo' => UploadedFile::fake()->create('guia.pdf', 100, 'application/pdf'),
        ], ['Accept' => 'application/json'])->assertCreated();
        $materialId = (int) $response->json('material.id');
        $path = MaterialEstudio::query()->findOrFail($materialId)->ubicacion_recurso;

        Storage::disk('public')->assertExists($path);
        $this->deleteJson("/api/materiales/{$materialId}")->assertNoContent();
        Storage::disk('public')->assertMissing($path);

        $this->post('/api/materiales', [
            'nombre' => 'Archivo peligroso',
            'tipo' => 'PDF',
            'archivo' => UploadedFile::fake()->create('ataque.php', 1, 'application/x-php'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('archivo');
    }

    public function test_only_staff_can_manage_public_content(): void
    {
        $this->postJson('/api/preguntas', [])->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/materiales', [])->assertForbidden();
        $this->postJson('/api/preguntas', [])->assertForbidden();
    }
}
