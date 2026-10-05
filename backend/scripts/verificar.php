<?php
declare(strict_types=1);
/** Comprobación de sintaxis de todos los archivos; no accede a la base. */
if (PHP_SAPI !== 'cli') exit;
$root = dirname(__DIR__);
$failed = false;
$count = 0;
foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)) as $file) {
    if ($file->getExtension() !== 'php' || str_contains($file->getPathname(), DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR)) continue;
    passthru(escapeshellarg(PHP_BINARY) . ' -l ' . escapeshellarg($file->getPathname()), $status);
    $failed = $failed || $status !== 0;
    $count++;
}
echo "Archivos PHP comprobados: $count\n";
exit($failed ? 1 : 0);
