<?php
declare(strict_types=1);
/** Material de estudio: conserva la URL de video o presenta una URL de archivo. */
final class Material {
    public function __construct(public readonly array $row) {}
    public function toArray(): array {
        $r=$this->row;
        return ['id'=>(int)$r['id'],'nombre'=>$r['nombre'],'tipo'=>$r['tipo'],'ubicacion_recurso'=>Archivo::url($r['ubicacion_recurso']),'estado'=>$r['estado']];
    }
}
