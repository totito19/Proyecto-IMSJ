<?php

namespace App\Http\Controllers;

use App\Http\Resources\HistorialAccionResource;
use App\Models\HistorialAccion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistorialAccionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limite' => ['sometimes', 'integer', 'between:1,50'],
        ]);

        $limite = (int) ($validated['limite'] ?? 20);

        return response()->json([
            'acciones' => HistorialAccionResource::collection(
                HistorialAccion::query()
                    ->with('usuario:id,nombre,cedula')
                    ->latest('fecha_hora')
                    ->latest('id')
                    ->limit($limite)
                    ->get(),
            ),
        ]);
    }
}
