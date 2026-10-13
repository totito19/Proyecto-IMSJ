<?php
declare(strict_types=1);
/** Persistencia mínima de la bandeja de consultas. */
final class ConsultaRepository {
    public function buscar(int $id): ?Consulta {
        $row = Database::query('SELECT * FROM consultas WHERE id = ?', [$id])->fetch();
        return $row ? new Consulta($row) : null;
    }
    public function listar(): array {
        return array_map(fn($row) => new Consulta($row), Database::query('SELECT * FROM consultas ORDER BY leida ASC, created_at DESC, id DESC')->fetchAll());
    }
    public function crear(array $datos): Consulta {
        Database::query('INSERT INTO consultas (nombre, email, mensaje, leida, created_at, updated_at) VALUES (?, ?, ?, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$datos['nombre'], $datos['email'], $datos['mensaje']]);
        return $this->buscar((int) Database::connection()->lastInsertId());
    }
    public function marcarLeida(int $id): Consulta {
        Database::query('UPDATE consultas SET leida = 1, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$id]);
        return $this->buscar($id);
    }
}
