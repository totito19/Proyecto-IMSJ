<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_tables_and_columns_exist(): void
    {
        $schema = [
            'usuarios' => ['nombre', 'cedula', 'password', 'rol', 'activo'],
            'noticias' => ['titulo', 'texto', 'fecha_inicio_vigencia', 'fecha_fin_vigencia', 'imagen_portada', 'estado'],
            'noticia_imagenes' => ['noticia_id', 'ubicacion'],
            'noticia_enlaces' => ['noticia_id', 'url'],
            'materiales_estudio' => ['nombre', 'tipo', 'ubicacion_recurso', 'estado'],
            'preguntas_frecuentes' => ['pregunta', 'respuesta', 'estado'],
            'preguntas_prueba' => ['pregunta', 'opcion_a', 'opcion_b', 'opcion_c', 'opcion_d', 'respuesta_correcta'],
            'franjas_disponibilidad' => ['fecha', 'hora_inicio', 'hora_fin', 'tipo', 'cupos_totales'],
            'reservas' => ['usuario_id', 'franja_disponibilidad_id'],
            'historial_acciones' => ['usuario_id', 'accion', 'tipo_elemento', 'elemento_id', 'fecha_hora'],
        ];

        foreach ($schema as $table => $columns) {
            $this->assertTrue(Schema::hasTable($table));
            $this->assertTrue(Schema::hasColumns($table, $columns));
        }
    }
}
