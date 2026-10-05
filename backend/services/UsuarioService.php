<?php
declare(strict_types=1);
/** Administración de personal e historial; se conserva la clave inicial del contrato existente. */
final class UsuarioService {
    public const INITIAL_PASSWORD='imsj1234';
    private UsuarioRepository $repo;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->repo=new UsuarioRepository();
    }
    /** Devuelve la colección del módulo con los filtros previstos para esta consulta. */
    public function listar(): array {
        return $this->repo->personal();
    }
    /** Recupera las acciones recientes y el usuario asociado, respetando el límite. */
    public function historial(int $limit): array {
        return $this->repo->historial($limit);
    }
    /** Inserta los campos validados y devuelve el registro creado. */
    public function crear(string $nombre,string $cedula,Usuario $actor): Usuario {
        return Database::transaction(function() use($nombre,$cedula,$actor) {
            $this->repo->bloquearPersonal();
            $user=$this->repo->buscarCedula($cedula);
            if ($user && $user->rol()==='PUBLICO_GENERAL') Response::invalid('cedula','La cédula ya pertenece a una cuenta ciudadana.');
            if ($user && $user->activo()) Response::invalid('cedula','Ya existe un integrante activo con esa cédula.');
            $accion=$user?'REACTIVAR':'CREAR';
            $hash=password_hash(self::INITIAL_PASSWORD,PASSWORD_BCRYPT,['cost'=>12]);
            if ($user) { (new AuthRepository())->revocarTodos($user->id()); $user=$this->repo->reactivar($user->id(),$nombre,$hash); }
            else $user=$this->repo->crear($nombre,$cedula,$hash,'PERSONAL_IMSJ');
            $this->repo->registrar($actor->id(),$accion,'User',$user->id());
            return $user;
        });
    }
    /** Retira acceso activo conservando las relaciones históricas del usuario. */
    public function desactivar(int $id,Usuario $actor): void {
        Database::transaction(function() use($id,$actor) {
            $personal=$this->repo->bloquearPersonal(); $user=$this->repo->buscar($id);
            if (!$user || !$user->activo() || $user->rol()!=='PERSONAL_IMSJ') throw new ApiException(404,'No existe ese integrante activo.');
            if ($id===$actor->id()) Response::invalid('usuario','No puede quitar su propio acceso.');
            if (count($personal)<=1) Response::invalid('usuario','Debe quedar al menos un integrante del personal IMSJ.');
            (new AuthRepository())->revocarTodos($id);
            $this->repo->desactivar($id); $this->repo->registrar($actor->id(),'DESACTIVAR','User',$id);
        });
    }
}
