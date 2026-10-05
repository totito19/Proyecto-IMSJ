<?php
declare(strict_types=1);
/** Reserva más datos de franja; los alias mantienen compatibilidad con el portal. */
final class Reserva {
    public function __construct(private array $row) {}
    public function toArray(): array {
        $r=$this->row;
        $data=['id'=>(int)$r['id'],'reserva_id'=>(int)$r['id'],'franja_disponibilidad_id'=>(int)$r['franja_disponibilidad_id'],'fecha'=>$r['fecha'],'hora_inicio'=>substr($r['hora_inicio'],0,5),'hora_fin'=>substr($r['hora_fin'],0,5),'tipo'=>$r['tipo'],'tipo_tramite'=>$r['tipo'],'creada_en'=>(new DateTimeImmutable($r['created_at'],new DateTimeZone('UTC')))->format(DATE_ATOM)];
        if (array_key_exists('cedula',$r)) $data['cedula']=$r['cedula'];
        return $data;
    }
}
