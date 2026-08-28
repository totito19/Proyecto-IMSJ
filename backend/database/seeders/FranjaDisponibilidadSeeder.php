<?php

namespace Database\Seeders;

use App\Models\FranjaDisponibilidad;
use Illuminate\Database\Seeder;

class FranjaDisponibilidadSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        foreach ([
            ['tipo' => 'PRUEBA_MANEJO', 'hora_inicio' => '09:00', 'hora_fin' => '09:30'],
            ['tipo' => 'RENOVACION_NORMAL', 'hora_inicio' => '10:00', 'hora_fin' => '10:30'],
            ['tipo' => 'RENOVACION_URGENTE', 'hora_inicio' => '11:00', 'hora_fin' => '11:30'],
        ] as $datos) {
            FranjaDisponibilidad::query()->updateOrCreate(
                [
                    'fecha' => today()->addDay(),
                    'hora_inicio' => $datos['hora_inicio'],
                    'hora_fin' => $datos['hora_fin'],
                    'tipo' => $datos['tipo'],
                ],
                ['cupos_totales' => 6],
            );
        }
    }
}
