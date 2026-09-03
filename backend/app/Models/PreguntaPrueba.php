<?php

namespace App\Models;

use Database\Factories\PreguntaPruebaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['pregunta', 'opcion_a', 'opcion_b', 'opcion_c', 'opcion_d', 'respuesta_correcta'])]
class PreguntaPrueba extends Model
{
    /** @use HasFactory<PreguntaPruebaFactory> */
    use HasFactory;

    protected $table = 'preguntas_prueba';
}
