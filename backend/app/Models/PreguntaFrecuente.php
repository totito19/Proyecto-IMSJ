<?php

namespace App\Models;

use Database\Factories\PreguntaFrecuenteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['pregunta', 'respuesta', 'estado'])]
class PreguntaFrecuente extends Model
{
    /** @use HasFactory<PreguntaFrecuenteFactory> */
    use HasFactory;

    protected $table = 'preguntas_frecuentes';

    public function scopePublicada(Builder $query): Builder
    {
        return $query->where('estado', 'PUBLICADO');
    }
}
