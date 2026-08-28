<?php

namespace Database\Seeders;

use App\Models\PreguntaFrecuente;
use Illuminate\Database\Seeder;

class PreguntaFrecuenteSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        PreguntaFrecuente::query()->updateOrCreate(
            ['pregunta' => '¿Qué documento debo presentar?'],
            [
                'respuesta' => 'Debe presentar su cédula de identidad vigente.',
                'estado' => 'PUBLICADO',
            ],
        );

        PreguntaFrecuente::query()->updateOrCreate(
            ['pregunta' => '¿Cómo preparo la prueba?'],
            [
                'respuesta' => 'Consulte los materiales de estudio publicados.',
                'estado' => 'NO_PUBLICADO',
            ],
        );
    }
}
