<?php

namespace Tests\Feature;

use App\Models\FranjaDisponibilidad;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SchedulingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_list_only_shows_future_slots_with_available_capacity(): void
    {
        FranjaDisponibilidad::factory()->create([
            'fecha' => today()->subDay(),
            'tipo' => 'PRUEBA_MANEJO',
        ]);
        $available = FranjaDisponibilidad::factory()->create([
            'fecha' => today()->addDay(),
            'tipo' => 'RENOVACION_NORMAL',
            'cupos_totales' => 2,
        ]);
        $full = FranjaDisponibilidad::factory()->create([
            'fecha' => today()->addDays(2),
            'tipo' => 'RENOVACION_NORMAL',
            'cupos_totales' => 1,
        ]);
        Reserva::factory()->create(['franja_disponibilidad_id' => $full->id]);

        $this->getJson('/api/franjas/disponibles?tipo=RENOVACION_NORMAL')
            ->assertOk()
            ->assertJsonCount(1, 'franjas')
            ->assertJsonPath('franjas.0.id', $available->id)
            ->assertJsonPath('franjas.0.cupos_disponibles', 2);
    }

    public function test_citizen_can_reserve_once_and_see_the_reservation(): void
    {
        $citizen = User::factory()->create();
        $slot = FranjaDisponibilidad::factory()->create([
            'fecha' => today()->addDay(),
            'cupos_totales' => 1,
        ]);
        Sanctum::actingAs($citizen);

        $this->postJson('/api/reservas', ['franja_disponibilidad_id' => $slot->id])
            ->assertCreated()
            ->assertJsonPath('reserva.fecha', today()->addDay()->toDateString());

        $this->postJson('/api/reservas', ['franja_disponibilidad_id' => $slot->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('franja_disponibilidad_id');

        $this->getJson('/api/reservas/mias')
            ->assertOk()
            ->assertJsonCount(1, 'reservas')
            ->assertJsonPath('reservas.0.franja_disponibilidad_id', $slot->id);
    }

    public function test_capacity_is_enforced_for_different_citizens(): void
    {
        $slot = FranjaDisponibilidad::factory()->create([
            'fecha' => today()->addDay(),
            'cupos_totales' => 1,
        ]);
        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/reservas', ['franja_disponibilidad_id' => $slot->id])
            ->assertCreated();

        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/reservas', ['franja_disponibilidad_id' => $slot->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('franja_disponibilidad_id');

        $this->assertDatabaseCount('reservas', 1);
    }

    public function test_staff_can_manage_slots_and_read_day_week_month_agenda(): void
    {
        $staff = User::factory()->personalImsj()->create();
        Sanctum::actingAs($staff);

        $createResponse = $this->postJson('/api/franjas', [
            'fecha' => today()->addDay()->toDateString(),
            'hora_inicio' => '14:00',
            'hora_fin' => '14:30',
            'tipo' => 'RENOVACION_URGENTE',
            'cupos_totales' => 3,
        ])->assertCreated();
        $slotId = (int) $createResponse->json('franja.id');

        $this->putJson("/api/franjas/{$slotId}", [
            'fecha' => today()->addDay()->toDateString(),
            'hora_inicio' => '14:00',
            'hora_fin' => '14:30',
            'tipo' => 'RENOVACION_URGENTE',
            'cupos_totales' => 4,
        ])->assertOk()->assertJsonPath('franja.cupos_totales', 4);

        Reserva::factory()->create([
            'franja_disponibilidad_id' => $slotId,
            'usuario_id' => User::factory()->create()->id,
        ]);

        foreach (['dia', 'semana', 'mes'] as $view) {
            $this->getJson('/api/agenda?vista='.$view.'&fecha='.today()->addDay()->toDateString())
                ->assertOk()
                ->assertJsonCount(1, 'reservas')
                ->assertJsonPath('resumen.urgentes', 1);
        }

        $this->deleteJson("/api/franjas/{$slotId}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('franja');
        $this->assertDatabaseHas('historial_acciones', [
            'accion' => 'ACTUALIZAR',
            'tipo_elemento' => 'FranjaDisponibilidad',
            'elemento_id' => $slotId,
        ]);
    }

    public function test_roles_protect_slot_management_and_reservations(): void
    {
        $slot = FranjaDisponibilidad::factory()->create();
        Sanctum::actingAs(User::factory()->personalImsj()->create());

        $this->postJson('/api/reservas', ['franja_disponibilidad_id' => $slot->id])
            ->assertForbidden();

        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/franjas', [])->assertForbidden();
        $this->getJson('/api/agenda')->assertForbidden();
    }
}
