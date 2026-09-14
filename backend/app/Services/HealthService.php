<?php

namespace App\Services;

/**
 * Proporciona el estado básico de disponibilidad de la aplicación.
 */
class HealthService
{
    /**
     * Construye la información pública de estado de la API.
     *
     * @return array{status: string}
     */
    public function obtenerEstado(): array
    {
        return ['status' => 'ok'];
    }
}
