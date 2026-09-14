<?php

namespace App\Providers;

use App\Repositories\Contracts\FranjaDisponibilidadRepositoryInterface;
use App\Repositories\Contracts\HistorialAccionRepositoryInterface;
use App\Repositories\Contracts\MaterialEstudioRepositoryInterface;
use App\Repositories\Contracts\NoticiaRepositoryInterface;
use App\Repositories\Contracts\PreguntaFrecuenteRepositoryInterface;
use App\Repositories\Contracts\PreguntaPruebaRepositoryInterface;
use App\Repositories\Contracts\ReservaRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\EloquentFranjaDisponibilidadRepository;
use App\Repositories\Eloquent\EloquentHistorialAccionRepository;
use App\Repositories\Eloquent\EloquentMaterialEstudioRepository;
use App\Repositories\Eloquent\EloquentNoticiaRepository;
use App\Repositories\Eloquent\EloquentPreguntaFrecuenteRepository;
use App\Repositories\Eloquent\EloquentPreguntaPruebaRepository;
use App\Repositories\Eloquent\EloquentReservaRepository;
use App\Repositories\Eloquent\EloquentUserRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Registra las dependencias principales de la aplicación.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Relaciona cada contrato de repositorio con su implementación Eloquent.
     */
    public function register(): void
    {
        $this->app->bind(
            HistorialAccionRepositoryInterface::class,
            EloquentHistorialAccionRepository::class,
        );
        $this->app->bind(
            FranjaDisponibilidadRepositoryInterface::class,
            EloquentFranjaDisponibilidadRepository::class,
        );
        $this->app->bind(
            MaterialEstudioRepositoryInterface::class,
            EloquentMaterialEstudioRepository::class,
        );
        $this->app->bind(
            NoticiaRepositoryInterface::class,
            EloquentNoticiaRepository::class,
        );
        $this->app->bind(
            PreguntaFrecuenteRepositoryInterface::class,
            EloquentPreguntaFrecuenteRepository::class,
        );
        $this->app->bind(
            PreguntaPruebaRepositoryInterface::class,
            EloquentPreguntaPruebaRepository::class,
        );
        $this->app->bind(
            ReservaRepositoryInterface::class,
            EloquentReservaRepository::class,
        );
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class,
        );
    }

    /**
     * Inicializa los servicios propios de la aplicación.
     */
    public function boot(): void
    {
        //
    }
}
