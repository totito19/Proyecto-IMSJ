<?php

namespace Database\Factories;

use App\Models\Noticia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Noticia>
 */
class NoticiaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titulo' => fake()->sentence(5),
            'texto' => fake()->paragraph(),
            'fecha_inicio_vigencia' => today(),
            'fecha_fin_vigencia' => today()->addWeek(),
            'imagen_portada' => null,
            'estado' => 'NO_PUBLICADO',
        ];
    }

    public function publicada(): static
    {
        return $this->state(fn (array $attributes): array => [
            'fecha_inicio_vigencia' => today()->subDay(),
            'fecha_fin_vigencia' => today()->addWeek(),
            'estado' => 'PUBLICADO',
        ]);
    }
}
