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
        Schema::create('noticias', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('texto');
            $table->date('fecha_inicio_vigencia');
            $table->date('fecha_fin_vigencia');
            $table->string('imagen_portada', 2048)->nullable();
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
        Schema::dropIfExists('noticias');
    }
};
