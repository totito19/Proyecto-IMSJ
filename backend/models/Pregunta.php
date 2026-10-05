<?php
declare(strict_types=1);
/** Pregunta frecuente y respuesta institucional. */
final class Pregunta {
    public function __construct(public readonly array $row) {}
    public function toArray(): array { return ['id'=>(int)$this->row['id'],'pregunta'=>$this->row['pregunta'],'respuesta'=>$this->row['respuesta'],'estado'=>$this->row['estado']]; }
}
