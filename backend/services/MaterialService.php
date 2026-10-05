<?php
declare(strict_types=1);
/** Materiales: VIDEO es una URL; PDF e IMAGEN se guardan en almacenamiento local. */
final class MaterialService {
    private MaterialRepository $repo;
    private UsuarioRepository $audit;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->repo=new MaterialRepository();
        $this->audit=new UsuarioRepository();
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico=false): array {
        return array_map(fn($m)=>$m->toArray(),$this->repo->listar($publico));
    }
    /** Resuelve el registro o responde con el error de recurso inexistente. */
    public function detalle(int $id): Material {
        return $this->repo->buscar($id) ?? throw new ApiException(404,'No existe ese material.');
    }
    /** Coordina alta o edición y confirma la auditoría junto con el cambio. */
    public function guardar(array $datos,array $files,Usuario $actor,?int $id=null): Material {
        $old=$id!==null?$this->detalle($id):null;
        $resource=$old?->row['ubicacion_recurso']??null; $savedPath=null;
        $changedType=$old===null || $old->row['tipo']!==$datos['tipo'];
        if ($datos['tipo']==='VIDEO') {
            if ($files) Response::invalid('archivo','Un video debe usar una URL, no un archivo.');
            if ($changedType && !isset($datos['ubicacion_recurso'])) Response::invalid('ubicacion_recurso','Ingrese la URL del video.');
            $resource=$datos['ubicacion_recurso']??$resource;
        } else {
            if (array_key_exists('ubicacion_recurso',$datos)) Response::invalid('ubicacion_recurso','Para este material se requiere un archivo.');
            if ($changedType && !$files) Response::invalid('archivo','Seleccione el archivo del material.');
            if ($files) { $savedPath=Archivo::save($files[0],'materiales',$datos['tipo']==='PDF'?10240:5120,$datos['tipo']==='PDF'); $resource=$savedPath; }
        }
        $datos['ubicacion_recurso']=$resource; $datos['estado']=$old?->row['estado']??'NO_PUBLICADO';
        try {
            $material=Database::transaction(function() use($old,$id,$datos,$actor) {
                $saved=$old?$this->repo->actualizar($id,$datos):$this->repo->crear($datos);
                $this->audit->registrar($actor->id(),$old?'ACTUALIZAR':'CREAR','MaterialEstudio',(int)$saved->row['id']);
                return $saved;
            });
        } catch (Throwable $error) { Archivo::delete($savedPath); throw $error; }
        if ($old && $old->row['ubicacion_recurso']!==$resource) Archivo::delete($old->row['ubicacion_recurso']);
        return $material;
    }
    /** Modifica la publicación como una operación administrativa auditada. */
    public function estado(int $id,string $estado,Usuario $actor): Material {
        $old=$this->detalle($id); if ($old->row['estado']===$estado) return $old;
        return Database::transaction(function() use($old,$id,$estado,$actor) {
            $data=$old->row; $data['estado']=$estado; $saved=$this->repo->actualizar($id,$data);
            $this->audit->registrar($actor->id(),$estado==='PUBLICADO'?'PUBLICAR':'DESPUBLICAR','MaterialEstudio',$id); return $saved;
        });
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id,Usuario $actor): void {
        $old=$this->detalle($id);
        Database::transaction(function() use($id,$actor) { $this->audit->registrar($actor->id(),'ELIMINAR','MaterialEstudio',$id); $this->repo->eliminar($id); });
        Archivo::delete($old->row['ubicacion_recurso']);
    }
}
