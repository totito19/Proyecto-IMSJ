<?php

namespace Tests\Feature;

use App\Models\Noticia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NewsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_portal_only_lists_published_news_with_current_validity(): void
    {
        Noticia::factory()->publicada()->create(['titulo' => 'Noticia visible']);
        Noticia::factory()->create(['titulo' => 'Borrador']);
        Noticia::factory()->publicada()->create([
            'titulo' => 'Noticia futura',
            'fecha_inicio_vigencia' => today()->addDay(),
            'fecha_fin_vigencia' => today()->addWeek(),
        ]);
        Noticia::factory()->publicada()->create([
            'titulo' => 'Noticia vencida',
            'fecha_inicio_vigencia' => today()->subWeek(),
            'fecha_fin_vigencia' => today()->subDay(),
        ]);

        $this->getJson('/api/portal/noticias')
            ->assertOk()
            ->assertJsonCount(1, 'noticias')
            ->assertJsonPath('noticias.0.titulo', 'Noticia visible');
    }

    public function test_staff_can_manage_news_and_actions_are_audited(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->personalImsj()->create());

        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
        $cover = UploadedFile::fake()->createWithContent('portada.png', $png);

        $create = $this->withHeader('Accept', 'application/json')->post('/api/noticias', [
            'titulo' => 'Taller de programación',
            'texto' => 'Actividad abierta para estudiantes.',
            'fecha_inicio_vigencia' => today()->toDateString(),
            'fecha_fin_vigencia' => today()->addWeek()->toDateString(),
            'imagen_portada' => $cover,
            'enlaces' => ['https://www.utu.edu.uy'],
        ]);

        $create
            ->assertCreated()
            ->assertJsonPath('noticia.estado', 'NO_PUBLICADO')
            ->assertJsonPath('noticia.enlaces.0.url', 'https://www.utu.edu.uy');

        $noticiaId = (int) $create->json('noticia.id');
        $coverPath = (string) Noticia::query()->findOrFail($noticiaId)->imagen_portada;

        Storage::disk('public')->assertExists($coverPath);
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'CREAR',
            'elemento_id' => $noticiaId,
        ]);

        $this->patchJson("/api/noticias/{$noticiaId}/estado", [
            'estado' => 'PUBLICADO',
        ])
            ->assertOk()
            ->assertJsonPath('noticia.estado', 'PUBLICADO');

        $this->putJson("/api/noticias/{$noticiaId}", [
            'titulo' => 'Taller actualizado',
            'texto' => 'Actividad actualizada.',
            'fecha_inicio_vigencia' => today()->toDateString(),
            'fecha_fin_vigencia' => today()->addWeeks(2)->toDateString(),
            'enlaces' => [],
        ])
            ->assertOk()
            ->assertJsonPath('noticia.titulo', 'Taller actualizado')
            ->assertJsonCount(0, 'noticia.enlaces');

        $this->deleteJson("/api/noticias/{$noticiaId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('noticias', ['id' => $noticiaId]);
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'PUBLICAR',
            'elemento_id' => $noticiaId,
        ]);
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'ACTUALIZAR',
            'elemento_id' => $noticiaId,
        ]);
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'ELIMINAR',
            'elemento_id' => $noticiaId,
        ]);
        Storage::disk('public')->assertMissing($coverPath);
    }

    public function test_only_staff_can_use_news_management_routes(): void
    {
        $this->postJson('/api/noticias', [])
            ->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/noticias', [])
            ->assertForbidden()
            ->assertJsonPath('message', 'No tiene permiso para realizar esta acción.');
    }

    public function test_news_rejects_an_unsafe_cover_file(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->personalImsj()->create());

        $file = UploadedFile::fake()->create('archivo.php', 1, 'application/x-php');

        $this->withHeader('Accept', 'application/json')->post('/api/noticias', [
            'titulo' => 'Noticia inválida',
            'texto' => 'Contenido de prueba.',
            'fecha_inicio_vigencia' => today()->toDateString(),
            'fecha_fin_vigencia' => today()->addWeek()->toDateString(),
            'imagen_portada' => $file,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('imagen_portada');

        $this->assertDatabaseCount('noticias', 0);
    }
}
