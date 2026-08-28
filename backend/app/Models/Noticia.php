<?php

namespace App\Models;

use Database\Factories\NoticiaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['titulo', 'texto', 'fecha_inicio_vigencia', 'fecha_fin_vigencia', 'imagen_portada', 'estado'])]
class Noticia extends Model
{
    /** @use HasFactory<NoticiaFactory> */
    use HasFactory;

    public function imagenes(): HasMany
    {
        return $this->hasMany(NoticiaImagen::class);
    }

    public function enlaces(): HasMany
    {
        return $this->hasMany(NoticiaEnlace::class);
    }

    public function scopeVisibleParaPublico(Builder $query): Builder
    {
        return $query
            ->where('estado', 'PUBLICADO')
            ->whereDate('fecha_inicio_vigencia', '<=', today())
            ->whereDate('fecha_fin_vigencia', '>=', today());
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_inicio_vigencia' => 'date',
            'fecha_fin_vigencia' => 'date',
        ];
    }
}
