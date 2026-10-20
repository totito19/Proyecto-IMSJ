<?php
declare(strict_types=1);
/** Persistencia mínima de la bandeja de consultas. */
final class ConsultaRepository
{
    public function buscar(int $id): ?Consulta
    {
        // Recupera una consulta por su clave primaria para comprobar que existe.
        $row = Database::query('SELECT * FROM consultas WHERE id = ?', [$id])->fetch();
        return $row ? new Consulta($row) : null;
    }
    public function listar(): array
    {
        return array_map(
            fn($row) => new Consulta($row),
            // Coloca primero las consultas sin leer y, dentro de cada grupo, las más recientes.
            Database::query(
                'SELECT * FROM consultas ORDER BY leida ASC, created_at DESC, id DESC',
            )->fetchAll(),
        );
    }
    public function crear(array $datos): Consulta
    {
        // Inserta el mensaje ciudadano como no leído; las fechas se calculan en MySQL y en UTC.
        Database::query(
            'INSERT INTO consultas (nombre, email, mensaje, leida, created_at, updated_at) VALUES (?, ?, ?, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
            [$datos['nombre'], $datos['email'], $datos['mensaje']],
        );
        // Vuelve a consultar la fila para devolverla con el mismo formato que el resto del módulo.
        return $this->buscar((int) Database::connection()->lastInsertId());
    }
    public function marcarLeida(int $id): Consulta
    {
        // Actualiza únicamente la consulta seleccionada y registra cuándo se modificó.
        Database::query(
            'UPDATE consultas SET leida = 1, updated_at = UTC_TIMESTAMP() WHERE id = ?',
            [$id],
        );
        return $this->buscar($id);
    }
}
