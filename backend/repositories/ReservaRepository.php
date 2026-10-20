<?php
declare(strict_types=1);
/** SQL de agenda académica: franjas, disponibilidad y reservas comparten repositorio. */
final class ReservaRepository
{
    /** Ejecuta el caso de uso indicado por el controlador. */
    public function franja(int $id, bool $lock = false): ?Franja
    {
        // Busca la franja por id. Si $lock es true, FOR UPDATE impide que otra transacción
        // la modifique mientras se comprueba y ocupa el último cupo disponible.
        $row = Database::query(
            'SELECT * FROM franjas_disponibilidad WHERE id = ?' . ($lock ? ' FOR UPDATE' : ''),
            [$id],
        )->fetch();
        if (!$row) {
            return null;
        }
        // Añade al resultado la cantidad real de reservas para calcular los cupos restantes.
        $row['reservas_count'] = $this->cantidad($id);
        return new Franja($row);
    }
    /** Cuenta las reservas asociadas a una franja. */
    public function cantidad(int $franja): int
    {
        // COUNT devuelve cuántas reservas están asociadas a la franja indicada.
        return (int) Database::query(
            'SELECT COUNT(*) FROM reservas WHERE franja_disponibilidad_id = ?',
            [$franja],
        )->fetchColumn();
    }
    /** Consulta franjas y capacidad calculada con las reservas existentes. */
    public function franjas(bool $publico = false, ?string $tipo = null): array
    {
        // La subconsulta calcula reservas_count para cada franja sin traer cada reserva.
        $sql =
            'SELECT f.*, (SELECT COUNT(*) FROM reservas r WHERE r.franja_disponibilidad_id = f.id) AS reservas_count FROM franjas_disponibilidad f';
        $where = [];
        $values = [];
        if ($publico) {
            // El ciudadano solo puede elegir fechas actuales o futuras.
            $where[] = 'f.fecha >= ?';
            $values[] = date('Y-m-d');
        }
        if ($tipo !== null) {
            // Si eligió un trámite, limita la consulta a ese tipo.
            $where[] = 'f.tipo = ?';
            $values[] = $tipo;
        }
        if ($where) {
            // Une los filtros opcionales con AND y mantiene sus valores fuera del texto SQL.
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        // Orden cronológico para mostrar primero las franjas más próximas.
        $sql .= ' ORDER BY f.fecha, f.hora_inicio, f.id';
        $rows = Database::query($sql, $values)->fetchAll();
        if ($publico) {
            // El filtro final retira las franjas llenas del listado ciudadano.
            $rows = array_values(
                array_filter(
                    $rows,
                    fn($r) => (int) $r['reservas_count'] < (int) $r['cupos_totales'],
                ),
            );
        }
        return array_map(fn($r) => new Franja($r), $rows);
    }
    /** Comprueba la combinación única de fecha, horario y tipo, excluyendo la edición actual. */
    public function horarioExiste(array $d, ?int $except = null): bool
    {
        // Busca otra franja con igual fecha, inicio, fin y tipo. Durante una edición se excluye
        // el id actual para que una franja no sea considerada duplicada de sí misma.
        return Database::query(
            'SELECT id FROM franjas_disponibilidad WHERE fecha = ? AND hora_inicio = ? AND hora_fin = ? AND tipo = ? AND id <> ?',
            [$d['fecha'], $d['hora_inicio'], $d['hora_fin'], $d['tipo'], $except ?? 0],
        )->fetch() !== false;
    }
    /** Inserta la disponibilidad validada y devuelve sus cupos calculados. */
    public function crearFranja(array $d): Franja
    {
        // Inserta disponibilidad y cupos; MySQL genera id y marcas de tiempo.
        Database::query(
            'INSERT INTO franjas_disponibilidad (fecha,hora_inicio,hora_fin,tipo,cupos_totales,created_at,updated_at) VALUES (?,?,?,?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP())',
            [$d['fecha'], $d['hora_inicio'], $d['hora_fin'], $d['tipo'], $d['cupos_totales']],
        );
        return $this->franja((int) Database::connection()->lastInsertId());
    }
    /** Persiste el horario y capacidad validados por el servicio. */
    public function actualizarFranja(int $id, array $d): Franja
    {
        // Modifica horario, tipo y capacidad únicamente en la franja seleccionada.
        Database::query(
            'UPDATE franjas_disponibilidad SET fecha=?,hora_inicio=?,hora_fin=?,tipo=?,cupos_totales=?,updated_at=UTC_TIMESTAMP() WHERE id=?',
            [$d['fecha'], $d['hora_inicio'], $d['hora_fin'], $d['tipo'], $d['cupos_totales'], $id],
        );
        return $this->franja($id);
    }
    /** Elimina la franja cuando las reglas del servicio permiten hacerlo. */
    public function eliminarFranja(int $id): void
    {
        // El servicio ya comprobó que no existan reservas asociadas antes de llegar aquí.
        Database::query('DELETE FROM franjas_disponibilidad WHERE id=?', [$id]);
    }
    /** Comprueba si el ciudadano ya reservó esa franja. */
    public function duplicada(int $usuario, int $franja): bool
    {
        // Comprueba si el mismo ciudadano ya tiene una reserva en esa franja.
        return Database::query(
            'SELECT id FROM reservas WHERE usuario_id=? AND franja_disponibilidad_id=?',
            [$usuario, $franja],
        )->fetch() !== false;
    }
    /** Inserta la relación usuario/franja y devuelve sus datos para el cliente. */
    public function crearReserva(int $usuario, int $franja): Reserva
    {
        // Crea la relación entre la cuenta ciudadana y la franja que acaba de bloquearse.
        Database::query(
            'INSERT INTO reservas (usuario_id,franja_disponibilidad_id,created_at,updated_at) VALUES (?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP())',
            [$usuario, $franja],
        );
        // Guarda el id generado para recuperar la reserva recién creada.
        $id = (int) Database::connection()->lastInsertId();
        return new Reserva(
            // JOIN agrega fecha, horario y tipo, datos que viven en la tabla de franjas.
            Database::query(
                'SELECT r.*,f.fecha,f.hora_inicio,f.hora_fin,f.tipo FROM reservas r JOIN franjas_disponibilidad f ON f.id=r.franja_disponibilidad_id WHERE r.id=?',
                [$id],
            )->fetch(),
        );
    }
    /** Filtra por el usuario obtenido del token; no recibe una identidad del navegador. */
    public function propias(int $usuario): array
    {
        return array_map(
            fn($r) => new Reserva($r),
            // Devuelve solo las reservas del usuario autenticado, nunca un id enviado por otro.
            Database::query(
                'SELECT r.*,f.fecha,f.hora_inicio,f.hora_fin,f.tipo FROM reservas r JOIN franjas_disponibilidad f ON f.id=r.franja_disponibilidad_id WHERE r.usuario_id=? ORDER BY r.created_at DESC,r.id DESC',
                [$usuario],
            )->fetchAll(),
        );
    }
    /** Consulta el período solicitado y presenta los datos del personal. */
    public function agenda(string $desde, string $hasta): array
    {
        return array_map(
            fn($r) => new Reserva($r),
            // Une reserva, franja y usuario para que el personal vea horario, trámite y cédula
            // dentro del período inclusivo indicado por BETWEEN.
            Database::query(
                'SELECT r.*,f.fecha,f.hora_inicio,f.hora_fin,f.tipo,u.cedula FROM reservas r JOIN franjas_disponibilidad f ON f.id=r.franja_disponibilidad_id JOIN usuarios u ON u.id=r.usuario_id WHERE f.fecha BETWEEN ? AND ? ORDER BY f.fecha,f.hora_inicio,r.id',
                [$desde, $hasta],
            )->fetchAll(),
        );
    }
}
