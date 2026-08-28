<?php

namespace Database\Factories;

use App\Models\PreguntaFrecuente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PreguntaFrecuente>
 */
class PreguntaFrecuenteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'pregunta' => fake()->sentence().'?',
            'respuesta' => fake()->paragraph(),
            'estado' => 'NO_PUBLICADO',
        ];
    }

    public function publicada(): static
    {
        return $this->state(fn (array $attributes): array => ['estado' => 'PUBLICADO']);
    }
}
