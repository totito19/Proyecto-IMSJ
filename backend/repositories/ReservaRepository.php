<?php
declare(strict_types=1);
/** SQL de agenda académica: franjas, disponibilidad y reservas comparten repositorio. */
final class ReservaRepository {
    /** Ejecuta el caso de uso indicado por el controlador. */
    public function franja(int $id, bool $lock = false): ?Franja {
        $row = Database::query('SELECT * FROM franjas_disponibilidad WHERE id = ?' . ($lock ? ' FOR UPDATE' : ''), [$id])->fetch();
        if (!$row) return null;
        $row['reservas_count'] = $this->cantidad($id);
        return new Franja($row);
    }
    /** Cuenta las reservas asociadas a una franja. */
    public function cantidad(int $franja): int {
        return (int)Database::query('SELECT COUNT(*) FROM reservas WHERE franja_disponibilidad_id = ?', [$franja])->fetchColumn();
    }
    /** Consulta franjas y capacidad calculada con las reservas existentes. */
    public function franjas(bool $publico = false, ?string $tipo = null): array {
        $sql='SELECT f.*, (SELECT COUNT(*) FROM reservas r WHERE r.franja_disponibilidad_id = f.id) AS reservas_count FROM franjas_disponibilidad f';
        $where=[]; $values=[];
        if ($publico) { $where[]='f.fecha >= ?'; $values[]=date('Y-m-d'); }
        if ($tipo !== null) { $where[]='f.tipo = ?'; $values[]=$tipo; }
        if ($where) $sql.=' WHERE '.implode(' AND ', $where);
        $sql.=' ORDER BY f.fecha, f.hora_inicio, f.id';
        $rows=Database::query($sql,$values)->fetchAll();
        if ($publico) $rows=array_values(array_filter($rows,fn($r)=>(int)$r['reservas_count']<(int)$r['cupos_totales']));
        return array_map(fn($r)=>new Franja($r),$rows);
    }
    /** Comprueba la combinación única de fecha, horario y tipo, excluyendo la edición actual. */
    public function horarioExiste(array $d, ?int $except = null): bool {
        return Database::query('SELECT id FROM franjas_disponibilidad WHERE fecha = ? AND hora_inicio = ? AND hora_fin = ? AND tipo = ? AND id <> ?', [$d['fecha'],$d['hora_inicio'],$d['hora_fin'],$d['tipo'],$except??0])->fetch() !== false;
    }
    /** Inserta la disponibilidad validada y devuelve sus cupos calculados. */
    public function crearFranja(array $d): Franja {
        Database::query('INSERT INTO franjas_disponibilidad (fecha,hora_inicio,hora_fin,tipo,cupos_totales,created_at,updated_at) VALUES (?,?,?,?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP())',[$d['fecha'],$d['hora_inicio'],$d['hora_fin'],$d['tipo'],$d['cupos_totales']]);
        return $this->franja((int)Database::connection()->lastInsertId());
    }
    /** Persiste el horario y capacidad validados por el servicio. */
    public function actualizarFranja(int $id,array $d): Franja {
        Database::query('UPDATE franjas_disponibilidad SET fecha=?,hora_inicio=?,hora_fin=?,tipo=?,cupos_totales=?,updated_at=UTC_TIMESTAMP() WHERE id=?',[$d['fecha'],$d['hora_inicio'],$d['hora_fin'],$d['tipo'],$d['cupos_totales'],$id]);
        return $this->franja($id);
    }
    /** Elimina la franja cuando las reglas del servicio permiten hacerlo. */
    public function eliminarFranja(int $id): void {
        Database::query('DELETE FROM franjas_disponibilidad WHERE id=?',[$id]);
    }
    /** Comprueba si el ciudadano ya reservó esa franja. */
    public function duplicada(int $usuario,int $franja): bool {
        return Database::query('SELECT id FROM reservas WHERE usuario_id=? AND franja_disponibilidad_id=?',[$usuario,$franja])->fetch() !== false;
    }
    /** Inserta la relación usuario/franja y devuelve sus datos para el cliente. */
    public function crearReserva(int $usuario,int $franja): Reserva {
        Database::query('INSERT INTO reservas (usuario_id,franja_disponibilidad_id,created_at,updated_at) VALUES (?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP())',[$usuario,$franja]);
        $id=(int)Database::connection()->lastInsertId();
        return new Reserva(Database::query('SELECT r.*,f.fecha,f.hora_inicio,f.hora_fin,f.tipo FROM reservas r JOIN franjas_disponibilidad f ON f.id=r.franja_disponibilidad_id WHERE r.id=?',[$id])->fetch());
    }
    /** Filtra por el usuario obtenido del token; no recibe una identidad del navegador. */
    public function propias(int $usuario): array {
        return array_map(fn($r)=>new Reserva($r),Database::query('SELECT r.*,f.fecha,f.hora_inicio,f.hora_fin,f.tipo FROM reservas r JOIN franjas_disponibilidad f ON f.id=r.franja_disponibilidad_id WHERE r.usuario_id=? ORDER BY r.created_at DESC,r.id DESC',[$usuario])->fetchAll());
    }
    /** Consulta el período solicitado y presenta los datos del personal. */
    public function agenda(string $desde,string $hasta): array {
        return array_map(fn($r)=>new Reserva($r),Database::query('SELECT r.*,f.fecha,f.hora_inicio,f.hora_fin,f.tipo,u.cedula FROM reservas r JOIN franjas_disponibilidad f ON f.id=r.franja_disponibilidad_id JOIN usuarios u ON u.id=r.usuario_id WHERE f.fecha BETWEEN ? AND ? ORDER BY f.fecha,f.hora_inicio,r.id',[$desde,$hasta])->fetchAll());
    }
}
