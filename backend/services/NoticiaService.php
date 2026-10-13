<?php
declare(strict_types=1);
/** Negocio de noticias, transacciones y limpieza de archivos ante errores. */
final class NoticiaService {
    private NoticiaRepository $repo;
    private UsuarioRepository $audit;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->repo=new NoticiaRepository();
        $this->audit=new UsuarioRepository();
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(bool $publico=false): array {
        return array_map(fn($n)=>$n->toArray(),$this->repo->listar($publico));
    }
    /** Resuelve el registro o responde con el error de recurso inexistente. */
    public function detalle(int $id): Noticia {
        return $this->repo->buscar($id) ?? throw new ApiException(404,'No existe esa noticia.');
    }
    /** Primero se guardan archivos nuevos; la base se confirma junto con su auditoría. */
    public function guardar(array $datos,array $portada,array $galeria,Usuario $actor,?int $id=null): Noticia {
        $old=$id!==null?$this->detalle($id):null;
        $newPaths=[]; $remove=[];
        try {
            $cover=$old?->row['imagen_portada']??null;
            if ($portada) { $cover=Archivo::save($portada[0],'noticias',2048); $newPaths[]=$cover; if ($old?->row['imagen_portada']) $remove[]=$old->row['imagen_portada']; }
            $galleryPaths=[];
            foreach ($galeria as $file) { $path=Archivo::save($file,'noticias',2048); $newPaths[]=$path; $galleryPaths[]=$path; }
            if ($old && $galeria) $remove=[...$remove,...array_filter($old->paths(),fn($p)=>$p!==$old->row['imagen_portada'])];
            // Toda edición vuelve a borrador: el contenido modificado debe validarse otra vez.
            $datos['imagen_portada']=$cover; $datos['estado']='BORRADOR';
            $noticia=Database::transaction(function() use($datos,$galleryPaths,$galeria,$old,$id,$actor) {
                $saved=$old?$this->repo->actualizar($id,$datos):$this->repo->crear($datos);
                $savedId=(int)$saved->row['id'];
                if (!$old || $galeria) $this->repo->imagenes($savedId,$galleryPaths);
                if (array_key_exists('enlaces',$datos)) $this->repo->enlaces($savedId,$datos['enlaces']);
                $this->audit->registrar($actor->id(),$old?'ACTUALIZAR':'CREAR','Noticia',$savedId);
                return $this->detalle($savedId);
            });
        } catch (Throwable $error) { foreach($newPaths as $path) Archivo::delete($path); throw $error; }
        // No se destruyen los archivos anteriores hasta que SQL confirmó el cambio.
        foreach($remove as $path) Archivo::delete($path);
        return $noticia;
    }
    /** Aplica el flujo Borrador -> Pendiente -> Aprobado -> Publicado. */
    public function estado(int $id,string $estado,Usuario $actor): Noticia {
        $old=$this->detalle($id);
        if ($old->row['estado']===$estado) return $old;
        $actual=$old->row['estado'];
        $transiciones=[
            'BORRADOR'=>['PENDIENTE'],
            'PENDIENTE'=>['BORRADOR','APROBADO'],
            'APROBADO'=>['BORRADOR','PUBLICADO'],
            'PUBLICADO'=>['BORRADOR'],
        ];
        if (!in_array($estado,$transiciones[$actual]??[],true)) Response::invalid('estado','La transición de estado no está permitida.');
        if ($estado==='APROBADO' && $actor->rol()!=='DIRECTORA') throw new ApiException(403,'Solo la Directora puede aprobar noticias.');
        return Database::transaction(function() use($old,$id,$estado,$actor) {
            $data=$old->row; $data['estado']=$estado;
            $saved=$this->repo->actualizar($id,$data);
            $accion=match($estado) {
                'PENDIENTE'=>'ENVIAR_REVISION',
                'APROBADO'=>'APROBAR',
                'PUBLICADO'=>'PUBLICAR',
                default=>'VOLVER_BORRADOR',
            };
            $this->audit->registrar($actor->id(),$accion,'Noticia',$id);
            return $saved;
        });
    }
    /** Elimina el registro indicado; la transacción la coordina el servicio. */
    public function eliminar(int $id,Usuario $actor): void {
        $old=$this->detalle($id);
        Database::transaction(function() use($id,$actor) { $this->audit->registrar($actor->id(),'ELIMINAR','Noticia',$id); $this->repo->eliminar($id); });
        foreach($old->paths() as $path) Archivo::delete($path);
    }
}
