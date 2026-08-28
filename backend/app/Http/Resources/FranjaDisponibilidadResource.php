<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FranjaDisponibilidadResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $reservas = (int) ($this->reservas_count ?? 0);

        return [
            'id' => $this->id,
            'fecha' => $this->fecha->toDateString(),
            'hora_inicio' => substr($this->hora_inicio, 0, 5),
            'hora_fin' => substr($this->hora_fin, 0, 5),
            'tipo' => $this->tipo,
            'cupos_totales' => $this->cupos_totales,
            'reservas_count' => $reservas,
            'cupos_disponibles' => max(0, $this->cupos_totales - $reservas),
        ];
    }
}
