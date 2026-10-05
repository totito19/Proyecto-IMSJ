<?php
declare(strict_types=1);
/** Casos de uso de PreguntaFrecuente; cada modificación confirma también su auditoría. */
final class PreguntaService {
    private PreguntaRepository $repo;
    private UsuarioRepository $audit;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->repo=new PreguntaRepository();
        $this->audit=new UsuarioRepository();
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico=false): array {
        return array_map(fn($m)=>$m->toArray(),$this->repo->listar($publico));
    }
    /** Resuelve el registro o responde con el error de recurso inexistente. */
    public function detalle(int $id): Pregunta {
        return $this->repo->buscar($id) ?? throw new ApiException(404,'No existe esa pregunta.');
    }
    /** Coordina alta o edición y confirma la auditoría junto con el cambio. */
    public function guardar(array $datos,Usuario $actor,?int $id=null): Pregunta {
        $old=$id!==null?$this->detalle($id):null;
        $datos['estado']=$old?->row['estado']??'NO_PUBLICADO';
        return Database::transaction(function() use($old,$id,$datos,$actor) {
            $saved=$old?$this->repo->actualizar($id,$datos):$this->repo->crear($datos);
            $this->audit->registrar($actor->id(),$old?'ACTUALIZAR':'CREAR','PreguntaFrecuente',(int)$saved->row['id']); return $saved;
        });
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id,Usuario $actor): void {
        $this->detalle($id);
        Database::transaction(function() use($id,$actor) { $this->audit->registrar($actor->id(),'ELIMINAR','PreguntaFrecuente',$id); $this->repo->eliminar($id); });
    }
    /** Modifica la publicación como una operación administrativa auditada. */
    public function estado(int $id,string $estado,Usuario $actor): Pregunta {
        $old=$this->detalle($id); if ($old->row['estado']===$estado) return $old;
        return Database::transaction(function() use($old,$id,$estado,$actor) {
            $data=$old->row; $data['estado']=$estado; $saved=$this->repo->actualizar($id,$data);
            $this->audit->registrar($actor->id(),$estado==='PUBLICADO'?'PUBLICAR':'DESPUBLICAR','PreguntaFrecuente',$id); return $saved;
        });
    }
}
