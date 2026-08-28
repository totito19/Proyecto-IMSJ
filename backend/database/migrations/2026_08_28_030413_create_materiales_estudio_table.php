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
        Schema::create('materiales_estudio', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->enum('tipo', ['PDF', 'IMAGEN', 'VIDEO']);
            $table->string('ubicacion_recurso', 2048);
            $table->enum('estado', ['PUBLICADO', 'NO_PUBLICADO'])
                ->default('NO_PUBLICADO');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materiales_estudio');
    }
};
