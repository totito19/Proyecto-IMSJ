<?php
declare(strict_types=1);
/** Persistencia de noticias y relaciones; la visibilidad pública se filtra en SQL. */
final class NoticiaRepository {
    /** Consulta por identificador; devuelve null si el registro no existe. */
    public function buscar(int $id): ?Noticia {
        $row = Database::query('SELECT * FROM noticias WHERE id = ?', [$id])->fetch();
        if (!$row) return null;
        return new Noticia($row, Database::query('SELECT * FROM noticia_imagenes WHERE noticia_id = ? ORDER BY id', [$id])->fetchAll(), Database::query('SELECT * FROM noticia_enlaces WHERE noticia_id = ? ORDER BY id', [$id])->fetchAll());
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico = false): array {
        $sql = 'SELECT id FROM noticias'; $values = [];
        if ($publico) { $sql .= " WHERE estado = 'PUBLICADO' AND fecha_inicio_vigencia <= ? AND fecha_fin_vigencia >= ?"; $values = [date('Y-m-d'), date('Y-m-d')]; }
        $sql .= $publico ? ' ORDER BY fecha_inicio_vigencia DESC, id DESC' : ' ORDER BY created_at DESC, id DESC';
        return array_map(fn($r)=>$this->buscar((int)$r['id']), Database::query($sql, $values)->fetchAll());
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(array $d): Noticia {
        Database::query('INSERT INTO noticias (titulo, texto, fecha_inicio_vigencia, fecha_fin_vigencia, imagen_portada, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$d['titulo'],$d['texto'],$d['fecha_inicio_vigencia'],$d['fecha_fin_vigencia'],$d['imagen_portada'],$d['estado']]);
        return $this->buscar((int)Database::connection()->lastInsertId());
    }
    /** Actualiza los campos del registro identificado y devuelve su estado persistido. */
    public function actualizar(int $id, array $d): Noticia {
        Database::query('UPDATE noticias SET titulo = ?, texto = ?, fecha_inicio_vigencia = ?, fecha_fin_vigencia = ?, imagen_portada = ?, estado = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?', [$d['titulo'],$d['texto'],$d['fecha_inicio_vigencia'],$d['fecha_fin_vigencia'],$d['imagen_portada'],$d['estado'],$id]);
        return $this->buscar($id);
    }
    /** Sustituye únicamente la relación solicitada por el formulario. */
    public function imagenes(int $id, array $paths): void {
        Database::query('DELETE FROM noticia_imagenes WHERE noticia_id = ?', [$id]);
        foreach ($paths as $path) Database::query('INSERT INTO noticia_imagenes (noticia_id, ubicacion, created_at, updated_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$id,$path]);
    }
    /** Reemplaza los enlaces recibidos; la ausencia del campo conserva los anteriores. */
    public function enlaces(int $id, array $urls): void {
        Database::query('DELETE FROM noticia_enlaces WHERE noticia_id = ?', [$id]);
        foreach ($urls as $url) Database::query('INSERT INTO noticia_enlaces (noticia_id, url, created_at, updated_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())', [$id,$url]);
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id): void {
        Database::query('DELETE FROM noticias WHERE id = ?', [$id]);
    }
}
