<?php

namespace Database\Seeders;

use App\Models\Noticia;
use Illuminate\Database\Seeder;

class NoticiaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        Noticia::query()->updateOrCreate(
            ['titulo' => 'Inscripciones abiertas'],
            [
                'texto' => 'Se encuentran abiertas las inscripciones para las actividades del instituto.',
                'fecha_inicio_vigencia' => today()->subDay(),
                'fecha_fin_vigencia' => today()->addMonth(),
                'estado' => 'PUBLICADO',
            ],
        );

        Noticia::query()->updateOrCreate(
            ['titulo' => 'Noticia en preparación'],
            [
                'texto' => 'Esta noticia todavía no está visible para el público.',
                'fecha_inicio_vigencia' => today(),
                'fecha_fin_vigencia' => today()->addMonth(),
                'estado' => 'NO_PUBLICADO',
            ],
        );
    }
}
