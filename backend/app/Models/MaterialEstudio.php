<?php

namespace App\Models;

use Database\Factories\MaterialEstudioFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nombre', 'tipo', 'ubicacion_recurso', 'estado'])]
class MaterialEstudio extends Model
{
    /** @use HasFactory<MaterialEstudioFactory> */
    use HasFactory;

    protected $table = 'materiales_estudio';

    public function scopePublicado(Builder $query): Builder
    {
        return $query->where('estado', 'PUBLICADO');
    }
}
