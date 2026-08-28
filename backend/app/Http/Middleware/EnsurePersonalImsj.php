<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePersonalImsj
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->rol !== 'PERSONAL_IMSJ') {
            return response()->json([
                'message' => 'No tiene permiso para realizar esta acción.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
