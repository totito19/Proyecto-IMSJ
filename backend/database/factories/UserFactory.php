<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => null,
            'cedula' => fake()->unique()->numerify('########'),
            'password' => static::$password ??= Hash::make('password'),
            'rol' => 'PUBLICO_GENERAL',
            'activo' => true,
        ];
    }

    public function personalImsj(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre' => fake()->name(),
            'rol' => 'PERSONAL_IMSJ',
        ]);
    }
}
