<?php
declare(strict_types=1);
/** Consultas de cuentas y auditoría. Los servicios deciden quién puede efectuar cada cambio. */
final class UsuarioRepository {
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Usuario {
        $row = Database::query('SELECT * FROM usuarios WHERE id = ?', [$id])->fetch();
        return $row ? new Usuario($row) : null;
    }
    /** Busca la identidad normalizada mediante un parámetro SQL. */
    public function buscarCedula(string $cedula): ?Usuario {
        $row = Database::query('SELECT * FROM usuarios WHERE cedula = ?', [$cedula])->fetch();
        return $row ? new Usuario($row) : null;
    }
    /** El bloqueo de cuenta serializa emisión y revocación de sus sesiones. */
    public function bloquear(int $id): ?Usuario {
        $row = Database::query('SELECT * FROM usuarios WHERE id = ? FOR UPDATE', [$id])->fetch();
        return $row ? new Usuario($row) : null;
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(?string $nombre, string $cedula, string $hash, string $rol): Usuario {
        Database::query('INSERT INTO usuarios (nombre, cedula, password, rol, activo, created_at, updated_at) VALUES (?, ?, ?, ?, 1, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$nombre, $cedula, $hash, $rol]);
        return $this->buscar((int)Database::connection()->lastInsertId());
    }
    /** Consulta cuentas de personal activas, sin exponer sus contraseñas. */
    public function personal(): array {
        return array_map(fn($r)=>(new Usuario($r))->adminArray(), Database::query("SELECT * FROM usuarios WHERE rol = 'PERSONAL_IMSJ' AND activo = 1 ORDER BY nombre, id")->fetchAll());
    }
    /** Bloquea en orden estable al personal para evitar dos desactivaciones simultáneas del último acceso. */
    public function bloquearPersonal(): array {
        return Database::query("SELECT id FROM usuarios WHERE rol = 'PERSONAL_IMSJ' AND activo = 1 ORDER BY id FOR UPDATE")->fetchAll();
    }
    /** Recupera una cuenta de personal existente con la nueva clave inicial. */
    public function reactivar(int $id, string $nombre, string $hash): Usuario {
        Database::query('UPDATE usuarios SET nombre = ?, password = ?, activo = 1, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$nombre, $hash, $id]);
        return $this->buscar($id);
    }
    /** Retira acceso activo conservando las relaciones históricas del usuario. */
    public function desactivar(int $id): void {
        Database::query('UPDATE usuarios SET activo = 0, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$id]);
    }
    /** Se llama dentro de la misma transacción que la operación administrativa. */
    public function registrar(int $actor, string $accion, string $tipo, int $elemento): void {
        Database::query('INSERT INTO historial_acciones (usuario_id, accion, tipo_elemento, elemento_id, fecha_hora) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())', [$actor, $accion, $tipo, $elemento]);
    }
    /** Recupera las acciones recientes y el usuario asociado, respetando el límite. */
    public function historial(int $limit): array {
        // $limit ya fue validado como entero y se enlaza con su tipo PDO.
        $query = Database::connection()->prepare('SELECT h.*, u.nombre, u.cedula FROM historial_acciones h JOIN usuarios u ON u.id = h.usuario_id ORDER BY h.fecha_hora DESC, h.id DESC LIMIT ?');
        $query->bindValue(1, $limit, PDO::PARAM_INT); $query->execute();
        return array_map(fn($r)=>['id'=>(int)$r['id'],'accion'=>$r['accion'],'tipo_elemento'=>$r['tipo_elemento'],'elemento_id'=>(int)$r['elemento_id'],'fecha_hora'=>(new DateTimeImmutable($r['fecha_hora'],new DateTimeZone('UTC')))->format(DATE_ATOM),'usuario'=>['id'=>(int)$r['usuario_id'],'nombre'=>$r['nombre'],'cedula'=>$r['cedula']]], $query->fetchAll());
    }
}
