<?php
declare(strict_types=1);
/** Agenda académica: disponibilidad, reservas atómicas y vistas por período. */
final class ReservaService
{
    private ReservaRepository $repo;
    private UsuarioRepository $audit;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct()
    {
        $this->repo = new ReservaRepository();
        $this->audit = new UsuarioRepository();
    }
    /** Consulta franjas y capacidad calculada con las reservas existentes. */
    public function franjas(bool $publico = false, ?string $tipo = null): array
    {
        return array_map(fn($f) => $f->toArray(), $this->repo->franjas($publico, $tipo));
    }
    /** Coordina validación de unicidad/capacidad, persistencia y auditoría. */
    public function guardarFranja(array $d, Usuario $actor, ?int $id = null): Franja
    {
        // Validación, escritura y auditoría forman una única transacción.
        return Database::transaction(function () use ($d, $actor, $id) {
            // En edición bloquea la franja para que sus reservas no cambien a mitad del control.
            $old = $id !== null ? $this->repo->franja($id, true) : null;
            if ($id !== null && !$old) {
                throw new ApiException(404, 'No existe esa franja.');
            }
            if ($this->repo->horarioExiste($d, $id)) {
                Response::invalid('tipo', 'Ya existe una franja con ese horario y tipo.');
            }
            // Evita ofrecer menos cupos que las reservas que ya fueron confirmadas.
            if ($old && $d['cupos_totales'] < (int) $old->row['reservas_count']) {
                Response::invalid(
                    'cupos_totales',
                    'Los cupos no pueden ser menores que las reservas existentes.',
                );
            }
            // La presencia de $old decide entre UPDATE e INSERT sin duplicar el flujo.
            $saved = $old ? $this->repo->actualizarFranja($id, $d) : $this->repo->crearFranja($d);
            // La auditoría se confirma dentro de la misma transacción que el cambio.
            $this->audit->registrar(
                $actor->id(),
                $old ? 'ACTUALIZAR' : 'CREAR',
                'FranjaDisponibilidad',
                (int) $saved->row['id'],
            );
            return $saved;
        });
    }
    /** Elimina la franja cuando las reglas del servicio permiten hacerlo. */
    public function eliminarFranja(int $id, Usuario $actor): void
    {
        Database::transaction(function () use ($id, $actor) {
            // Bloquea la franja para impedir una reserva mientras se intenta eliminar.
            $franja = $this->repo->franja($id, true);
            if (!$franja) {
                throw new ApiException(404, 'No existe esa franja.');
            }
            if ((int) $franja->row['reservas_count'] > 0) {
                Response::invalid('franja', 'No se puede eliminar una franja que tiene reservas.');
            }
            // Si el DELETE falla, también se revierte este registro de auditoría.
            $this->audit->registrar($actor->id(), 'ELIMINAR', 'FranjaDisponibilidad', $id);
            $this->repo->eliminarFranja($id);
        });
    }
    /** SELECT FOR UPDATE serializa peticiones al último cupo hasta commit/rollback. */
    public function reservar(int $franjaId, Usuario $user): Reserva
    {
        return Database::transaction(function () use ($franjaId, $user) {
            // FOR UPDATE evita que dos solicitudes tomen el último cupo a la vez.
            $franja = $this->repo->franja($franjaId, true);
            if (!$franja) {
                Response::invalid('franja_disponibilidad_id', 'La franja seleccionada no existe.');
            }
            if ($franja->row['fecha'] < date('Y-m-d')) {
                Response::invalid('franja_disponibilidad_id', 'La franja seleccionada ya pasó.');
            }
            // Impide que una cuenta reserve dos veces exactamente la misma franja.
            if ($this->repo->duplicada($user->id(), $franjaId)) {
                Response::invalid(
                    'franja_disponibilidad_id',
                    'Ya tiene una reserva en esta franja.',
                );
            }
            // Compara reservas confirmadas contra la capacidad dentro del bloqueo.
            if ((int) $franja->row['reservas_count'] >= (int) $franja->row['cupos_totales']) {
                Response::invalid(
                    'franja_disponibilidad_id',
                    'La franja seleccionada ya no tiene cupos.',
                );
            }
            // Solo crea la reserva después de superar todas las reglas anteriores.
            return $this->repo->crearReserva($user->id(), $franjaId);
        });
    }
    /** Filtra por el usuario obtenido del token; no recibe una identidad del navegador. */
    public function propias(Usuario $user): array
    {
        return array_map(fn($r) => $r->toArray(), $this->repo->propias($user->id()));
    }
    /** Cancela una reserva sin permitir que el ciudadano afecte reservas ajenas. */
    public function cancelar(int $id, Usuario $user): void
    {
        if (!$this->repo->cancelar($id, $user->id())) {
            throw new ApiException(404, 'Reserva no encontrada.');
        }
    }
    /** Consulta el período solicitado y presenta los datos del personal. */
    public function agenda(string $vista, string $fecha): array
    {
        // El objeto inmutable permite calcular límites sin modificar accidentalmente el cursor.
        $cursor = new DateTimeImmutable($fecha);
        // Día usa una fecha; semana y mes calculan sus extremos inclusivos.
        [$desde, $hasta] = match ($vista) {
            'semana' => [$cursor->modify('monday this week'), $cursor->modify('sunday this week')],
            'mes' => [
                $cursor->modify('first day of this month'),
                $cursor->modify('last day of this month'),
            ],
            default => [$cursor, $cursor],
        };
        // El repositorio consulta BETWEEN desde/hasta y los modelos se preparan para JSON.
        $rows = array_map(
            fn($r) => $r->toArray(),
            $this->repo->agenda($desde->format('Y-m-d'), $hasta->format('Y-m-d')),
        );
        return [
            'reservas' => $rows,
            'resumen' => [
                'total' => count($rows),
                'urgentes' => count(
                    array_filter($rows, fn($r) => $r['tipo'] === 'RENOVACION_URGENTE'),
                ),
            ],
        ];
    }
}
