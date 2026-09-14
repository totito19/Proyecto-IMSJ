<?php

namespace App\Repositories\Contracts;

use App\Models\HistorialAccion;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Define las operaciones de persistencia del historial de acciones.
 */
interface HistorialAccionRepositoryInterface
{
    /**
     * Obtiene las acciones más recientes con los datos del usuario responsable.
     *
     * @return Collection<int, HistorialAccion>
     */
    public function obtenerRecientes(int $limite): Collection;

    /**
     * Registra una acción realizada por un integrante del personal.
     */
    public function registrar(User $usuario, string $accion, Model $elemento): HistorialAccion;
}
