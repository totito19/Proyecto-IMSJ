<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorialAccionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'accion' => $this->accion,
            'tipo_elemento' => $this->tipo_elemento,
            'elemento_id' => $this->elemento_id,
            'fecha_hora' => $this->fecha_hora?->toIso8601String(),
            'usuario' => [
                'id' => $this->usuario?->id,
                'nombre' => $this->usuario?->nombre,
                'cedula' => $this->usuario?->cedula,
            ],
        ];
    }
}
