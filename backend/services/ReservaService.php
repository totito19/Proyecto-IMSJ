<?php
declare(strict_types=1);
/** Agenda académica: disponibilidad, reservas atómicas y vistas por período. */
final class ReservaService {
    private ReservaRepository $repo;
    private UsuarioRepository $audit;
    /** Prepara los colaboradores del módulo sin ejecutar una operación HTTP. */
    public function __construct() {
        $this->repo=new ReservaRepository();
        $this->audit=new UsuarioRepository();
    }
    /** Consulta franjas y capacidad calculada con las reservas existentes. */
    public function franjas(bool $publico=false,?string $tipo=null): array {
        return array_map(fn($f)=>$f->toArray(),$this->repo->franjas($publico,$tipo));
    }
    /** Coordina validación de unicidad/capacidad, persistencia y auditoría. */
    public function guardarFranja(array $d,Usuario $actor,?int $id=null): Franja {
        return Database::transaction(function() use($d,$actor,$id) {
            $old=$id!==null?$this->repo->franja($id,true):null;
            if ($id!==null && !$old) throw new ApiException(404,'No existe esa franja.');
            if ($this->repo->horarioExiste($d,$id)) Response::invalid('tipo','Ya existe una franja con ese horario y tipo.');
            if ($old && $d['cupos_totales']<(int)$old->row['reservas_count']) Response::invalid('cupos_totales','Los cupos no pueden ser menores que las reservas existentes.');
            $saved=$old?$this->repo->actualizarFranja($id,$d):$this->repo->crearFranja($d);
            $this->audit->registrar($actor->id(),$old?'ACTUALIZAR':'CREAR','FranjaDisponibilidad',(int)$saved->row['id']); return $saved;
        });
    }
    /** Elimina la franja cuando las reglas del servicio permiten hacerlo. */
    public function eliminarFranja(int $id,Usuario $actor): void {
        Database::transaction(function() use($id,$actor) {
            $franja=$this->repo->franja($id,true);
            if (!$franja) throw new ApiException(404,'No existe esa franja.');
            if ((int)$franja->row['reservas_count']>0) Response::invalid('franja','No se puede eliminar una franja que tiene reservas.');
            $this->audit->registrar($actor->id(),'ELIMINAR','FranjaDisponibilidad',$id); $this->repo->eliminarFranja($id);
        });
    }
    /** SELECT FOR UPDATE serializa peticiones al último cupo hasta commit/rollback. */
    public function reservar(int $franjaId,Usuario $user): Reserva {
        return Database::transaction(function() use($franjaId,$user) {
            $franja=$this->repo->franja($franjaId,true);
            if (!$franja) Response::invalid('franja_disponibilidad_id','La franja seleccionada no existe.');
            if ($franja->row['fecha']<date('Y-m-d')) Response::invalid('franja_disponibilidad_id','La franja seleccionada ya pasó.');
            if ($this->repo->duplicada($user->id(),$franjaId)) Response::invalid('franja_disponibilidad_id','Ya tiene una reserva en esta franja.');
            if ((int)$franja->row['reservas_count']>=(int)$franja->row['cupos_totales']) Response::invalid('franja_disponibilidad_id','La franja seleccionada ya no tiene cupos.');
            return $this->repo->crearReserva($user->id(),$franjaId);
        });
    }
    /** Filtra por el usuario obtenido del token; no recibe una identidad del navegador. */
    public function propias(Usuario $user): array {
        return array_map(fn($r)=>$r->toArray(),$this->repo->propias($user->id()));
    }
    /** Consulta el período solicitado y presenta los datos del personal. */
    public function agenda(string $vista,string $fecha): array {
        $cursor=new DateTimeImmutable($fecha);
        [$desde,$hasta]=match($vista) {
            'semana'=>[$cursor->modify('monday this week'),$cursor->modify('sunday this week')],
            'mes'=>[$cursor->modify('first day of this month'),$cursor->modify('last day of this month')],
            default=>[$cursor,$cursor],
        };
        $rows=array_map(fn($r)=>$r->toArray(),$this->repo->agenda($desde->format('Y-m-d'),$hasta->format('Y-m-d')));
        return ['reservas'=>$rows,'resumen'=>['total'=>count($rows),'urgentes'=>count(array_filter($rows,fn($r)=>$r['tipo']==='RENOVACION_URGENTE'))]];
    }
}
