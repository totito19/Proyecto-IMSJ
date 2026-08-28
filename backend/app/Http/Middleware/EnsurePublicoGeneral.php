<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePublicoGeneral
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->rol !== 'PUBLICO_GENERAL') {
            return response()->json([
                'message' => 'Solo un ciudadano puede realizar esta acción.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
