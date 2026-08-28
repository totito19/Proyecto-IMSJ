<?php

namespace App\Models;

use Database\Factories\ReservaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['usuario_id', 'franja_disponibilidad_id'])]
class Reserva extends Model
{
    /** @use HasFactory<ReservaFactory> */
    use HasFactory;

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function franja(): BelongsTo
    {
        return $this->belongsTo(FranjaDisponibilidad::class, 'franja_disponibilidad_id');
    }
}
