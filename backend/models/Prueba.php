<?php
declare(strict_types=1);
/** Pregunta de simulacro: distingue la presentación pública de la administrativa. */
final class Prueba {
    public function __construct(public readonly array $row) {}
    public function toArray(bool $includeAnswer = true): array {
        $r=$this->row;
        $data=['id'=>(int)$r['id'],'pregunta'=>$r['pregunta'],'opciones'=>['A'=>$r['opcion_a'],'B'=>$r['opcion_b'],'C'=>$r['opcion_c'],'D'=>$r['opcion_d']]];
        if ($includeAnswer) $data['respuesta_correcta']=$r['respuesta_correcta'];
        return $data;
    }
}
