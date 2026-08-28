<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class NoticiaResource extends JsonResource
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
            'titulo' => $this->titulo,
            'texto' => $this->texto,
            'fecha_inicio_vigencia' => $this->fecha_inicio_vigencia->toDateString(),
            'fecha_fin_vigencia' => $this->fecha_fin_vigencia->toDateString(),
            'imagen_portada' => $this->imagen_portada
                ? Storage::disk('public')->url($this->imagen_portada)
                : null,
            'estado' => $this->estado,
            'imagenes' => $this->imagenes->map(fn ($imagen): array => [
                'id' => $imagen->id,
                'url' => Storage::disk('public')->url($imagen->ubicacion),
            ]),
            'enlaces' => $this->enlaces->map(fn ($enlace): array => [
                'id' => $enlace->id,
                'url' => $enlace->url,
            ]),
        ];
    }
}
