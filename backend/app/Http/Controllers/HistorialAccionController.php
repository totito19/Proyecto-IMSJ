<?php

namespace App\Http\Controllers;

use App\Http\Resources\HistorialAccionResource;
use App\Services\HistorialAccionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Atiende las peticiones HTTP de consulta del historial.
 */
class HistorialAccionController extends Controller
{
    /** Servicio que coordina las consultas del historial. */
    private readonly HistorialAccionService $historialService;

    /**
     * Crea el controlador con su servicio de aplicación.
     */
    public function __construct(HistorialAccionService $historialService)
    {
        $this->historialService = $historialService;
    }

    /**
     * Devuelve las acciones administrativas más recientes.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limite' => ['sometimes', 'integer', 'between:1,50'],
        ]);

        $limite = (int) ($validated['limite'] ?? 20);

        return response()->json([
            'acciones' => HistorialAccionResource::collection(
                $this->historialService->obtenerRecientes($limite),
            ),
        ]);
    }
}
