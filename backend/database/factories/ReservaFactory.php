<?php

namespace Database\Factories;

use App\Models\FranjaDisponibilidad;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reserva>
 */
class ReservaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'usuario_id' => User::factory(),
            'franja_disponibilidad_id' => FranjaDisponibilidad::factory(),
        ];
    }
}
