<?php

namespace Database\Seeders;

use App\Models\MaterialEstudio;
use Illuminate\Database\Seeder;

class MaterialEstudioSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        MaterialEstudio::query()->updateOrCreate(
            ['nombre' => 'Video básico de seguridad vial'],
            [
                'tipo' => 'VIDEO',
                'ubicacion_recurso' => 'https://www.youtube.com/watch?v=eB7j4XUJm-M',
                'estado' => 'PUBLICADO',
            ],
        );

        MaterialEstudio::query()->updateOrCreate(
            ['nombre' => 'Material en preparación'],
            [
                'tipo' => 'VIDEO',
                'ubicacion_recurso' => 'https://www.youtube.com/',
                'estado' => 'NO_PUBLICADO',
            ],
        );
    }
}
