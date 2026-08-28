<?php

namespace Database\Factories;

use App\Models\MaterialEstudio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MaterialEstudio>
 */
class MaterialEstudioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre' => fake()->sentence(4),
            'tipo' => 'VIDEO',
            'ubicacion_recurso' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'estado' => 'NO_PUBLICADO',
        ];
    }

    public function publicado(): static
    {
        return $this->state(fn (array $attributes): array => ['estado' => 'PUBLICADO']);
    }
}
