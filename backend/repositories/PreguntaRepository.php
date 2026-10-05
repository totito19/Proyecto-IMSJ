<?php
declare(strict_types=1);
/** SQL parametrizado del módulo pregunta; devuelve objetos sin dependencia de ORM. */
final class PreguntaRepository {
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Pregunta {
        $row = Database::query('SELECT * FROM preguntas_frecuentes WHERE id = ?', [$id])->fetch();
        return $row ? new Pregunta($row) : null;
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico = false): array {
        $sql = 'SELECT * FROM preguntas_frecuentes';
        if ($publico) $sql .= " WHERE estado = 'PUBLICADO'";
        $sql .= ' ORDER BY created_at DESC, id DESC';
        return array_map(fn($row)=>new Pregunta($row), Database::query($sql)->fetchAll());
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(array $datos): Pregunta {
        Database::query('INSERT INTO preguntas_frecuentes (pregunta, respuesta, estado, created_at, updated_at) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$datos['pregunta'], $datos['respuesta'], $datos['estado']]);
        return $this->buscar((int)Database::connection()->lastInsertId());
    }
    /** Actualiza los campos del registro identificado y devuelve su estado persistido. */
    public function actualizar(int $id, array $datos): Pregunta {
        Database::query('UPDATE preguntas_frecuentes SET pregunta = ?, respuesta = ?, estado = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$datos['pregunta'], $datos['respuesta'], $datos['estado'], $id]);
        return $this->buscar($id);
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id): void {
        Database::query('DELETE FROM preguntas_frecuentes WHERE id = ?', [$id]);
    }
}
