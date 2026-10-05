<?php
declare(strict_types=1);
/** SQL parametrizado del módulo prueba; devuelve objetos sin dependencia de ORM. */
final class PruebaRepository {
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Prueba {
        $row = Database::query('SELECT * FROM preguntas_prueba WHERE id = ?', [$id])->fetch();
        return $row ? new Prueba($row) : null;
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico = false): array {
        $sql = 'SELECT * FROM preguntas_prueba';
        $sql .= ' ORDER BY created_at DESC, id DESC';
        return array_map(fn($row)=>new Prueba($row), Database::query($sql)->fetchAll());
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(array $datos): Prueba {
        Database::query('INSERT INTO preguntas_prueba (pregunta, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$datos['pregunta'], $datos['opcion_a'], $datos['opcion_b'], $datos['opcion_c'], $datos['opcion_d'], $datos['respuesta_correcta']]);
        return $this->buscar((int)Database::connection()->lastInsertId());
    }
    /** Actualiza los campos del registro identificado y devuelve su estado persistido. */
    public function actualizar(int $id, array $datos): Prueba {
        Database::query('UPDATE preguntas_prueba SET pregunta = ?, opcion_a = ?, opcion_b = ?, opcion_c = ?, opcion_d = ?, respuesta_correcta = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$datos['pregunta'], $datos['opcion_a'], $datos['opcion_b'], $datos['opcion_c'], $datos['opcion_d'], $datos['respuesta_correcta'], $id]);
        return $this->buscar($id);
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id): void {
        Database::query('DELETE FROM preguntas_prueba WHERE id = ?', [$id]);
    }
    /** Selección pública limitada; la respuesta correcta la omite el modelo al presentar datos. */
    public function aleatorias(): array {
        return array_map(fn($r)=>new Prueba($r), Database::query('SELECT * FROM preguntas_prueba ORDER BY RAND() LIMIT 10')->fetchAll());
    }
}
