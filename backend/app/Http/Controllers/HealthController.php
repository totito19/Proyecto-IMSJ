<?php

namespace App\Http\Controllers;

use App\Services\HealthService;
use Illuminate\Http\JsonResponse;

/**
 * Atiende la petición HTTP de estado de la aplicación.
 */
class HealthController extends Controller
{
    /** Servicio que informa el estado general de la aplicación. */
    private readonly HealthService $healthService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(HealthService $healthService)
    {
        $this->healthService = $healthService;
    }

    /**
     * Devuelve el estado actual de la API.
     */
    public function index(): JsonResponse
    {
        return response()->json($this->healthService->obtenerEstado());
    }
}
