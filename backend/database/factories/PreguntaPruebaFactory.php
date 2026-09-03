<?php

namespace Database\Factories;

use App\Models\PreguntaPrueba;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PreguntaPrueba>
 */
class PreguntaPruebaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pregunta' => fake()->sentence().'?',
            'opcion_a' => fake()->sentence(3),
            'opcion_b' => fake()->sentence(3),
            'opcion_c' => fake()->sentence(3),
            'opcion_d' => fake()->sentence(3),
            'respuesta_correcta' => fake()->randomElement(['A', 'B', 'C', 'D']),
        ];
    }
}
