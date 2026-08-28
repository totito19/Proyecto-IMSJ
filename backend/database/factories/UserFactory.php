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
            'cedula' => fake()->unique()->numerify('########'),
            'password' => static::$password ??= Hash::make('password'),
            'rol' => 'PUBLICO_GENERAL',
        ];
    }

    public function personalImsj(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'PERSONAL_IMSJ',
        ]);
    }
}
