<?php
declare(strict_types=1);
/** Casos de uso de PreguntaPrueba; cada modificación confirma también su auditoría. */
final class PruebaService {
    private PruebaRepository $repo;
    private UsuarioRepository $audit;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->repo=new PruebaRepository();
        $this->audit=new UsuarioRepository();
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico=false): array {
        return array_map(fn($m)=>$m->toArray(),$this->repo->listar($publico));
    }
    /** Resuelve el registro o responde con el error de recurso inexistente. */
    public function detalle(int $id): Prueba {
        return $this->repo->buscar($id) ?? throw new ApiException(404,'No existe esa pregunta.');
    }
    /** Coordina alta o edición y confirma la auditoría junto con el cambio. */
    public function guardar(array $datos,Usuario $actor,?int $id=null): Prueba {
        $old=$id!==null?$this->detalle($id):null;
        return Database::transaction(function() use($old,$id,$datos,$actor) {
            $saved=$old?$this->repo->actualizar($id,$datos):$this->repo->crear($datos);
            $this->audit->registrar($actor->id(),$old?'ACTUALIZAR':'CREAR','PreguntaPrueba',(int)$saved->row['id']); return $saved;
        });
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id,Usuario $actor): void {
        $this->detalle($id);
        Database::transaction(function() use($id,$actor) { $this->audit->registrar($actor->id(),'ELIMINAR','PreguntaPrueba',$id); $this->repo->eliminar($id); });
    }
    /** Presenta las preguntas públicas sin incluir la respuesta correcta. */
    public function publica(): array {
        return array_map(fn($p)=>$p->toArray(false),$this->repo->aleatorias());
    }
    /** La respuesta correcta se obtiene de SQL, nunca de lo enviado por el ciudadano. */
    public function corregir(array $respuestas): array {
        $seen=[]; $results=[];
        foreach($respuestas as $answer) {
            if (!is_array($answer)) Response::invalid('respuestas','Cada respuesta debe ser un objeto.');
            $id=Solicitud::number($answer['pregunta_id']??null,'pregunta_id');
            $option=Solicitud::option($answer['opcion']??null,'opcion',['A','B','C','D']);
            if (isset($seen[$id])) Response::invalid('respuestas','Las preguntas no pueden repetirse.');
            $seen[$id]=true; $question=$this->repo->buscar($id);
            if (!$question) Response::invalid('pregunta_id','La pregunta indicada no existe.');
            $results[]=['pregunta_id'=>$id,'correcta'=>$question->row['respuesta_correcta']===$option,'respuesta_correcta'=>$question->row['respuesta_correcta']];
        }
        return ['total'=>count($results),'correctas'=>count(array_filter($results,fn($r)=>$r['correcta'])),'resultados'=>$results];
    }
}
