<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('franjas_disponibilidad', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->enum('tipo', [
                'PRUEBA_MANEJO',
                'RENOVACION_NORMAL',
                'RENOVACION_URGENTE',
            ]);
            $table->unsignedSmallInteger('cupos_totales');
            $table->timestamps();

            $table->unique(['fecha', 'hora_inicio', 'hora_fin', 'tipo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('franjas_disponibilidad');
    }
};
