<?php
declare(strict_types=1);
/** SQL parametrizado del módulo pregunta; devuelve objetos sin dependencia de ORM. */
final class PreguntaRepository
{
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Pregunta
    {
        // Recupera una pregunta frecuente concreta, cualquiera sea su estado editorial.
        $row = Database::query('SELECT * FROM preguntas_frecuentes WHERE id = ?', [$id])->fetch();
        return $row ? new Pregunta($row) : null;
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico = false): array
    {
        // El panel necesita la colección completa para administrar el flujo de estados.
        $sql = 'SELECT * FROM preguntas_frecuentes';
        if ($publico) {
            // El portal no debe mostrar borradores ni contenido pendiente de aprobación.
            $sql .= " WHERE estado = 'PUBLICADO'";
        }
        // Mantiene un orden estable aun cuando dos filas tengan la misma fecha.
        $sql .= ' ORDER BY created_at DESC, id DESC';
        return array_map(fn($row) => new Pregunta($row), Database::query($sql)->fetchAll());
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(array $datos): Pregunta
    {
        // Crea la pregunta con el estado definido por el servicio, normalmente BORRADOR.
        Database::query(
            'INSERT INTO preguntas_frecuentes (pregunta, respuesta, estado, created_at, updated_at) VALUES (?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
            [$datos['pregunta'], $datos['respuesta'], $datos['estado']],
        );
        return $this->buscar((int) Database::connection()->lastInsertId());
    }
    /** Actualiza los campos del registro identificado y devuelve su estado persistido. */
    public function actualizar(int $id, array $datos): Pregunta
    {
        // Reemplaza pregunta, respuesta y estado solamente en la fila seleccionada.
        Database::query(
            'UPDATE preguntas_frecuentes SET pregunta = ?, respuesta = ?, estado = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?',
            [$datos['pregunta'], $datos['respuesta'], $datos['estado'], $id],
        );
        return $this->buscar($id);
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id): void
    {
        // El id parametrizado evita que contenido recibido forme parte del texto SQL.
        Database::query('DELETE FROM preguntas_frecuentes WHERE id = ?', [$id]);
    }
}
