<?php
declare(strict_types=1);

require dirname(__DIR__) . '/core/Response.php';
require dirname(__DIR__) . '/models/Solicitud.php';

$cases = json_decode(file_get_contents(__DIR__ . '/cedula-casos.json'), true, 512, JSON_THROW_ON_ERROR);
$checks = 0;
foreach ($cases as $kind => $values) {
    foreach ($values as $value) {
        try {
            $normalized = Solicitud::cedula(['cedula' => $value]);
            if ($kind !== 'valid' || $normalized !== preg_replace('/\D/', '', $value)) {
                throw new RuntimeException('La cédula no se validó como se esperaba.');
            }
        } catch (ApiException $error) {
            if ($kind !== 'invalid' || $error->status !== 422 || !isset($error->errors['cedula'])) {
                throw $error;
            }
        }
        $checks++;
    }
}
foreach ([[], ['cedula' => null], ['cedula' => 12345672], ['cedula' => []]] as $data) {
    try {
        Solicitud::cedula($data);
        throw new RuntimeException('Se aceptó una estructura inválida.');
    } catch (ApiException $error) {
        if ($error->status !== 422) {
            throw $error;
        }
    }
    $checks++;
}
// El ingreso normaliza credenciales existentes sin exigir un verificador nuevo.
if (Solicitud::cedula(['cedula' => '2.222.222-3'], false) !== '22222223') {
    throw new RuntimeException('El login no debe exigir el dígito verificador.');
}
$checks++;
echo "Cédulas: $checks comprobaciones OK.\n";
