<?php

namespace App\Repositories\Eloquent;

use App\Models\HistorialAccion;
use App\Models\User;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Implementa el acceso al historial mediante modelos Eloquent.
 */
class EloquentHistorialAccionRepository implements HistorialAccionRepositoryInterface
{
    /**
     * Obtiene las acciones más recientes con su usuario responsable.
     *
     * @return Collection<int, HistorialAccion>
     */
    public function obtenerRecientes(int $limite): Collection
    {
        return HistorialAccion::query()
            ->with('usuario:id,nombre,cedula')
            ->latest('fecha_hora')
            ->latest('id')
            ->limit($limite)
            ->get();
    }

    /**
     * Persiste una nueva entrada de auditoría.
     */
    public function registrar(User $usuario, string $accion, Model $elemento): HistorialAccion
    {
        return HistorialAccion::registrar($usuario, $accion, $elemento);
    }
}
