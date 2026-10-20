<?php
declare(strict_types=1);
/** Mensaje ciudadano recibido desde el pie del portal. */
final class Consulta
{
    public function __construct(public readonly array $row) {}
    public function toArray(): array
    {
        $created =
            $this->row['created_at'] === null
                ? null
                : new DateTimeImmutable($this->row['created_at'], new DateTimeZone('UTC'))->format(
                    DATE_ATOM,
                );
        return [
            'id' => (int) $this->row['id'],
            'nombre' => $this->row['nombre'],
            'email' => $this->row['email'],
            'mensaje' => $this->row['mensaje'],
            'leida' => (bool) $this->row['leida'],
            'created_at' => $created,
        ];
    }
}
