<?php
declare(strict_types=1);
/** SQL parametrizado del módulo material; devuelve objetos sin dependencia de ORM. */
final class MaterialRepository {
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Material {
        $row = Database::query('SELECT * FROM materiales_estudio WHERE id = ?', [$id])->fetch();
        return $row ? new Material($row) : null;
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico = false): array {
        $sql = 'SELECT * FROM materiales_estudio';
        if ($publico) $sql .= " WHERE estado = 'PUBLICADO'";
        $sql .= ' ORDER BY created_at DESC, id DESC';
        return array_map(fn($row)=>new Material($row), Database::query($sql)->fetchAll());
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(array $datos): Material {
        Database::query('INSERT INTO materiales_estudio (nombre, tipo, ubicacion_recurso, estado, created_at, updated_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$datos['nombre'], $datos['tipo'], $datos['ubicacion_recurso'], $datos['estado']]);
        return $this->buscar((int)Database::connection()->lastInsertId());
    }
    /** Actualiza los campos del registro identificado y devuelve su estado persistido. */
    public function actualizar(int $id, array $datos): Material {
        Database::query('UPDATE materiales_estudio SET nombre = ?, tipo = ?, ubicacion_recurso = ?, estado = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$datos['nombre'], $datos['tipo'], $datos['ubicacion_recurso'], $datos['estado'], $id]);
        return $this->buscar($id);
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id): void {
        Database::query('DELETE FROM materiales_estudio WHERE id = ?', [$id]);
    }
}
