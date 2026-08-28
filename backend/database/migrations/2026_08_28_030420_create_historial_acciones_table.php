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
        Schema::create('historial_acciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->string('accion', 50);
            $table->string('tipo_elemento', 100);
            $table->unsignedBigInteger('elemento_id');
            $table->timestamp('fecha_hora')->useCurrent();

            $table->index(['tipo_elemento', 'elemento_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_acciones');
    }
};
