<?php
declare(strict_types=1);
/** Archivo recibido: valida el contenido real y controla su ciclo de vida en disco. */
final class Archivo {
    private const IMAGES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    public static function save(array $file, string $folder, int $maxKb, bool $pdf = false): string {
        $key = $folder === 'noticias' ? 'imagen_portada' : 'archivo';
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) Response::invalid($key, 'No se pudo recibir el archivo o supera el límite de subida.');
        if (!is_string($file['tmp_name'] ?? null) || !is_numeric($file['size'] ?? null)) Response::invalid($key, 'La estructura del archivo no es válida.');
        if (!is_uploaded_file($file['tmp_name']) || (int) $file['size'] > $maxKb * 1024) Response::invalid($key, "El archivo debe medir hasta $maxKb KB.");
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if ($pdf) {
            if ($mime !== 'application/pdf' || file_get_contents($file['tmp_name'], false, null, 0, 5) !== '%PDF-') Response::invalid($key, 'Se requiere un PDF válido.');
            $extension = 'pdf';
        } else {
            if (!isset(self::IMAGES[$mime]) || @getimagesize($file['tmp_name']) === false) Response::invalid($key, 'Solo se permiten imágenes JPG, PNG o WEBP válidas.');
            $extension = self::IMAGES[$mime];
        }
        $directory = UPLOAD_ROOT . '/' . $folder;
        if (!is_dir($directory) && !mkdir($directory, 0770, true) && !is_dir($directory)) throw new RuntimeException('No se pudo crear el directorio de archivos.');
        $path = $folder . '/' . bin2hex(random_bytes(20)) . '.' . $extension;
        if (!move_uploaded_file($file['tmp_name'], UPLOAD_ROOT . '/' . $path)) throw new RuntimeException('No se pudo guardar el archivo.');
        return $path;
    }
    public static function url(?string $path): ?string {
        if ($path === null || $path === '') return null;
        return preg_match('#^https?://#i', $path) ? $path : APP_URL . '/storage/' . ltrim($path, '/');
    }
    /** Se borran únicamente archivos bajo el almacenamiento, nunca enlaces externos. */
    public static function delete(?string $path): void {
        if (!$path || preg_match('#^https?://#i', $path)) return;
        $root = realpath(UPLOAD_ROOT);
        $resolved = realpath(UPLOAD_ROOT . '/' . $path);
        if ($root && $resolved && str_starts_with($resolved, $root . DIRECTORY_SEPARATOR) && is_file($resolved) && !unlink($resolved)) error_log('No se pudo quitar un archivo de contenido.');
    }
}
