<?php

namespace Database\Factories;

use App\Models\FranjaDisponibilidad;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FranjaDisponibilidad>
 */
class FranjaDisponibilidadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'fecha' => today()->addDays(fake()->numberBetween(1, 20)),
            'hora_inicio' => '09:00',
            'hora_fin' => '09:30',
            'tipo' => fake()->randomElement([
                'PRUEBA_MANEJO',
                'RENOVACION_NORMAL',
                'RENOVACION_URGENTE',
            ]),
            'cupos_totales' => fake()->numberBetween(1, 10),
        ];
    }
}
