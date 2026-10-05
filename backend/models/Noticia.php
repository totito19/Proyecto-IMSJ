<?php
declare(strict_types=1);
/** Noticia más sus relaciones, serializada sin exponer detalles de persistencia. */
final class Noticia {
    public function __construct(public readonly array $row, private array $images = [], private array $links = []) {}
    public function toArray(): array {
        $r = $this->row;
        return ['id'=>(int)$r['id'], 'titulo'=>$r['titulo'], 'texto'=>$r['texto'], 'fecha_inicio_vigencia'=>$r['fecha_inicio_vigencia'], 'fecha_fin_vigencia'=>$r['fecha_fin_vigencia'], 'imagen_portada'=>Archivo::url($r['imagen_portada']), 'estado'=>$r['estado'],
            'imagenes'=>array_map(fn($i)=>['id'=>(int)$i['id'],'url'=>Archivo::url($i['ubicacion'])], $this->images),
            'enlaces'=>array_map(fn($e)=>['id'=>(int)$e['id'],'url'=>$e['url']], $this->links)];
    }
    public function paths(): array { return array_filter([$this->row['imagen_portada'], ...array_column($this->images, 'ubicacion')]); }
}
