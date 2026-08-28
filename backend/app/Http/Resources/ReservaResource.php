<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reserva_id' => $this->id,
            'cedula' => $this->whenLoaded('usuario', fn (): string => $this->usuario->cedula),
            'franja_disponibilidad_id' => $this->franja_disponibilidad_id,
            'fecha' => $this->franja->fecha->toDateString(),
            'hora_inicio' => substr($this->franja->hora_inicio, 0, 5),
            'hora_fin' => substr($this->franja->hora_fin, 0, 5),
            'tipo' => $this->franja->tipo,
            'tipo_tramite' => $this->franja->tipo,
            'creada_en' => $this->created_at->toIso8601String(),
        ];
    }
}
