<?php
declare(strict_types=1);
/** Persistencia de noticias y relaciones; la visibilidad pública se filtra en SQL. */
final class NoticiaRepository
{
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Noticia
    {
        // Primera consulta: obtiene los datos principales de la noticia solicitada.
        $row = Database::query('SELECT * FROM noticias WHERE id = ?', [$id])->fetch();
        if (!$row) {
            return null;
        }
        return new Noticia(
            $row,
            // Segunda consulta: obtiene la galería relacionada y conserva el orden de carga.
            Database::query('SELECT * FROM noticia_imagenes WHERE noticia_id = ? ORDER BY id', [
                $id,
            ])->fetchAll(),
            // Tercera consulta: obtiene los enlaces relacionados con la misma noticia.
            Database::query('SELECT * FROM noticia_enlaces WHERE noticia_id = ? ORDER BY id', [
                $id,
            ])->fetchAll(),
        );
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico = false): array
    {
        // Se consultan primero solo los ids para reutilizar buscar(), que completa relaciones.
        $sql = 'SELECT id FROM noticias';
        $values = [];
        if ($publico) {
            // En el portal se exige estado PUBLICADO y una vigencia que incluya la fecha actual.
            $sql .=
                " WHERE estado = 'PUBLICADO' AND fecha_inicio_vigencia <= ? AND fecha_fin_vigencia >= ?";
            $values = [date('Y-m-d'), date('Y-m-d')];
        }
        $sql .= $publico
            ? ' ORDER BY fecha_inicio_vigencia DESC, id DESC'
            : ' ORDER BY created_at DESC, id DESC';
        return array_map(
            // Cada id se transforma en una noticia completa con galería y enlaces.
            fn($r) => $this->buscar((int) $r['id']),
            Database::query($sql, $values)->fetchAll(),
        );
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(array $d): Noticia
    {
        // Inserta el contenido principal; imágenes y enlaces se guardan después en sus tablas.
        Database::query(
            'INSERT INTO noticias (titulo, texto, fecha_inicio_vigencia, fecha_fin_vigencia, imagen_portada, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
            [
                $d['titulo'],
                $d['texto'],
                $d['fecha_inicio_vigencia'],
                $d['fecha_fin_vigencia'],
                $d['imagen_portada'],
                $d['estado'],
            ],
        );
        // Recupera el registro creado para devolver también sus relaciones vacías o agregadas.
        return $this->buscar((int) Database::connection()->lastInsertId());
    }
    /** Actualiza los campos del registro identificado y devuelve su estado persistido. */
    public function actualizar(int $id, array $d): Noticia
    {
        // Actualiza los campos principales sin reemplazar todavía galería ni enlaces.
        Database::query(
            'UPDATE noticias SET titulo = ?, texto = ?, fecha_inicio_vigencia = ?, fecha_fin_vigencia = ?, imagen_portada = ?, estado = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?',
            [
                $d['titulo'],
                $d['texto'],
                $d['fecha_inicio_vigencia'],
                $d['fecha_fin_vigencia'],
                $d['imagen_portada'],
                $d['estado'],
                $id,
            ],
        );
        return $this->buscar($id);
    }
    /** Sustituye únicamente la relación solicitada por el formulario. */
    public function imagenes(int $id, array $paths): void
    {
        // Vacía la galería anterior para reemplazarla por la colección recibida completa.
        Database::query('DELETE FROM noticia_imagenes WHERE noticia_id = ?', [$id]);
        foreach ($paths as $path) {
            // Crea una relación por cada imagen almacenada en disco.
            Database::query(
                'INSERT INTO noticia_imagenes (noticia_id, ubicacion, created_at, updated_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
                [$id, $path],
            );
        }
    }
    /** Reemplaza los enlaces recibidos; la ausencia del campo conserva los anteriores. */
    public function enlaces(int $id, array $urls): void
    {
        // Vacía los enlaces anteriores porque el formulario envía la lista completa.
        Database::query('DELETE FROM noticia_enlaces WHERE noticia_id = ?', [$id]);
        foreach ($urls as $url) {
            // Inserta cada URL como una fila relacionada con la noticia.
            Database::query(
                'INSERT INTO noticia_enlaces (noticia_id, url, created_at, updated_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
                [$id, $url],
            );
        }
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id): void
    {
        // El borrado en cascada quita sus relaciones; el servicio limpia los archivos físicos.
        Database::query('DELETE FROM noticias WHERE id = ?', [$id]);
    }
}
