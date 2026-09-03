<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PreguntaPruebaResource extends JsonResource
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
            'pregunta' => $this->pregunta,
            'opciones' => [
                'A' => $this->opcion_a,
                'B' => $this->opcion_b,
                'C' => $this->opcion_c,
                'D' => $this->opcion_d,
            ],
            'respuesta_correcta' => $this->respuesta_correcta,
        ];
    }
}
