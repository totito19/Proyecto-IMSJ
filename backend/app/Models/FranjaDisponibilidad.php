<?php

namespace App\Models;

use Database\Factories\FranjaDisponibilidadFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['fecha', 'hora_inicio', 'hora_fin', 'tipo', 'cupos_totales'])]
class FranjaDisponibilidad extends Model
{
    /** @use HasFactory<FranjaDisponibilidadFactory> */
    use HasFactory;

    protected $table = 'franjas_disponibilidad';

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'cupos_totales' => 'integer',
        ];
    }
}
