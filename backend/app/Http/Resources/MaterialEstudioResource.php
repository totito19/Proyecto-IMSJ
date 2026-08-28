<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MaterialEstudioResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $resource = (string) $this->ubicacion_recurso;

        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo' => $this->tipo,
            'ubicacion_recurso' => str_starts_with($resource, 'http://') || str_starts_with($resource, 'https://')
                ? $resource
                : Storage::disk('public')->url($resource),
            'estado' => $this->estado,
        ];
    }
}
