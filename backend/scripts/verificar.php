<?php
declare(strict_types=1);
/** Comprobación de sintaxis de todos los archivos; no accede a la base. */
if (PHP_SAPI !== 'cli') {
    exit();
}
$root = dirname(__DIR__);
$failed = false;
$count = 0;
foreach (
    new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS),
    )
    as $file
) {
    if (
        $file->getExtension() !== 'php' ||
        str_contains($file->getPathname(), DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR)
    ) {
        continue;
    }
    $pipes = [];
    $process = proc_open(
        [PHP_BINARY, '-l', $file->getPathname()],
        [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
        $pipes,
    );
    if (!is_resource($process)) {
        fwrite(STDERR, "No se pudo comprobar {$file->getPathname()}\n");
        $failed = true;
        continue;
    }
    $output = stream_get_contents($pipes[1]);
    $error = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $status = proc_close($process);
    echo $output;
    if ($error !== '') {
        fwrite(STDERR, $error);
    }
    $failed = $failed || $status !== 0;
    $count++;
}
echo "Archivos PHP comprobados: $count\n";
exit($failed ? 1 : 0);
