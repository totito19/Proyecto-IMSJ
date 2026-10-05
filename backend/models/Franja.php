<?php
declare(strict_types=1);
/** Franja académica con capacidad total y reservas calculadas por el repositorio. */
final class Franja {
    public function __construct(public readonly array $row) {}
    public function toArray(): array {
        $r=$this->row;$count=(int)($r['reservas_count']??0);
        return ['id'=>(int)$r['id'],'fecha'=>$r['fecha'],'hora_inicio'=>substr($r['hora_inicio'],0,5),'hora_fin'=>substr($r['hora_fin'],0,5),'tipo'=>$r['tipo'],'cupos_totales'=>(int)$r['cupos_totales'],'reservas_count'=>$count,'cupos_disponibles'=>max(0,(int)$r['cupos_totales']-$count)];
    }
}
