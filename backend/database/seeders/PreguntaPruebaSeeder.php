<?php

namespace Database\Seeders;

use App\Models\PreguntaPrueba;
use Illuminate\Database\Seeder;

class PreguntaPruebaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        $preguntas = [
            [
                'pregunta' => '¿Qué debe hacer ante una luz roja del semáforo?',
                'opcion_a' => 'Detenerse antes de la línea',
                'opcion_b' => 'Acelerar para cruzar',
                'opcion_c' => 'Tocar bocina y continuar',
                'opcion_d' => 'Girar sin detenerse',
                'respuesta_correcta' => 'A',
            ],
            [
                'pregunta' => '¿Para qué se utiliza el cinturón de seguridad?',
                'opcion_a' => 'Para evitar multas solamente',
                'opcion_b' => 'Para sujetar objetos',
                'opcion_c' => 'Para reducir lesiones en un siniestro',
                'opcion_d' => 'Solo para viajes largos',
                'respuesta_correcta' => 'C',
            ],
            [
                'pregunta' => '¿Qué corresponde hacer al acercarse a un cruce peatonal ocupado?',
                'opcion_a' => 'Mantener la velocidad',
                'opcion_b' => 'Ceder el paso y detenerse si es necesario',
                'opcion_c' => 'Pasar por la banquina',
                'opcion_d' => 'Encender las luces largas',
                'respuesta_correcta' => 'B',
            ],
            [
                'pregunta' => '¿Por qué no se debe usar el teléfono mientras se conduce?',
                'opcion_a' => 'Porque consume batería',
                'opcion_b' => 'Porque reduce la atención y aumenta el riesgo',
                'opcion_c' => 'Porque daña el vehículo',
                'opcion_d' => 'Porque afecta la radio',
                'respuesta_correcta' => 'B',
            ],
            [
                'pregunta' => 'Antes de cambiar de carril, ¿qué debe hacer el conductor?',
                'opcion_a' => 'Señalizar y verificar espejos y punto ciego',
                'opcion_b' => 'Frenar bruscamente',
                'opcion_c' => 'Apagar las luces',
                'opcion_d' => 'Acelerar sin mirar',
                'respuesta_correcta' => 'A',
            ],
        ];

        foreach ($preguntas as $pregunta) {
            PreguntaPrueba::query()->updateOrCreate(
                ['pregunta' => $pregunta['pregunta']],
                $pregunta,
            );
        }
    }
}
