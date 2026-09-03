<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FranjaDisponibilidadController;
use App\Http\Controllers\HistorialAccionController;
use App\Http\Controllers\MaterialEstudioController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\PreguntaFrecuenteController;
use App\Http\Controllers\PreguntaPruebaController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\UsuarioAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json([
    'status' => 'ok',
]));

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::get('/portal/noticias', [NoticiaController::class, 'publicIndex']);
Route::get('/portal/materiales', [MaterialEstudioController::class, 'publicIndex']);
Route::get('/portal/preguntas', [PreguntaFrecuenteController::class, 'publicIndex']);
Route::get('/portal/prueba', [PreguntaPruebaController::class, 'publicIndex']);
Route::post('/portal/prueba/corregir', [PreguntaPruebaController::class, 'corregir']);
Route::get('/franjas/disponibles', [FranjaDisponibilidadController::class, 'publicIndex']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'publico.general'])->group(function (): void {
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::get('/reservas/mias', [ReservaController::class, 'mine']);
});

Route::middleware(['auth:sanctum', 'personal.imsj'])->group(function (): void {
    Route::get('/historial', [HistorialAccionController::class, 'index']);

    Route::get('/usuarios-admin', [UsuarioAdminController::class, 'index']);
    Route::post('/usuarios-admin', [UsuarioAdminController::class, 'store']);
    Route::delete('/usuarios-admin/{usuario}', [UsuarioAdminController::class, 'destroy']);

    Route::get('/preguntas-prueba', [PreguntaPruebaController::class, 'index']);
    Route::post('/preguntas-prueba', [PreguntaPruebaController::class, 'store']);
    Route::put('/preguntas-prueba/{pregunta}', [PreguntaPruebaController::class, 'update']);
    Route::delete('/preguntas-prueba/{pregunta}', [PreguntaPruebaController::class, 'destroy']);

    Route::get('/noticias', [NoticiaController::class, 'index']);
    Route::post('/noticias', [NoticiaController::class, 'store']);
    Route::get('/noticias/{noticia}', [NoticiaController::class, 'show']);
    Route::put('/noticias/{noticia}', [NoticiaController::class, 'update']);
    Route::patch('/noticias/{noticia}/estado', [NoticiaController::class, 'updateEstado']);
    Route::delete('/noticias/{noticia}', [NoticiaController::class, 'destroy']);

    Route::get('/materiales', [MaterialEstudioController::class, 'index']);
    Route::post('/materiales', [MaterialEstudioController::class, 'store']);
    Route::put('/materiales/{material}', [MaterialEstudioController::class, 'update']);
    Route::patch('/materiales/{material}/estado', [MaterialEstudioController::class, 'updateEstado']);
    Route::delete('/materiales/{material}', [MaterialEstudioController::class, 'destroy']);

    Route::get('/preguntas', [PreguntaFrecuenteController::class, 'index']);
    Route::post('/preguntas', [PreguntaFrecuenteController::class, 'store']);
    Route::put('/preguntas/{pregunta}', [PreguntaFrecuenteController::class, 'update']);
    Route::patch('/preguntas/{pregunta}/estado', [PreguntaFrecuenteController::class, 'updateEstado']);
    Route::delete('/preguntas/{pregunta}', [PreguntaFrecuenteController::class, 'destroy']);

    Route::get('/franjas', [FranjaDisponibilidadController::class, 'index']);
    Route::post('/franjas', [FranjaDisponibilidadController::class, 'store']);
    Route::put('/franjas/{franja}', [FranjaDisponibilidadController::class, 'update']);
    Route::delete('/franjas/{franja}', [FranjaDisponibilidadController::class, 'destroy']);

    Route::get('/agenda', [ReservaController::class, 'agenda']);
});
