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
        Schema::create('preguntas_prueba', function (Blueprint $table) {
            $table->id();
            $table->string('pregunta', 500);
            $table->string('opcion_a');
            $table->string('opcion_b');
            $table->string('opcion_c');
            $table->string('opcion_d');
            $table->enum('respuesta_correcta', ['A', 'B', 'C', 'D']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preguntas_prueba');
    }
};
