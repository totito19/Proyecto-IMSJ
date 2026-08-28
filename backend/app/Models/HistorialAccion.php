<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['usuario_id', 'accion', 'tipo_elemento', 'elemento_id', 'fecha_hora'])]
class HistorialAccion extends Model
{
    protected $table = 'historial_acciones';

    public $timestamps = false;

    public static function registrar(User $usuario, string $accion, Model $elemento): self
    {
        return self::query()->create([
            'usuario_id' => $usuario->id,
            'accion' => $accion,
            'tipo_elemento' => class_basename($elemento),
            'elemento_id' => $elemento->getKey(),
            'fecha_hora' => now(),
        ]);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_hora' => 'datetime',
        ];
    }
}
