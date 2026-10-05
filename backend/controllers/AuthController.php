<?php
declare(strict_types=1);
/** Valida credenciales HTTP; el servicio administra contraseñas y sesiones. */
final class AuthController {
    private AuthService $service;
    public function __construct() { $this->service = new AuthService(); }
    /** Iniciar sesión consume uno de los cinco intentos permitidos por minuto. */
    public function login(): never {
        Auth::limitAttempts('login');
        $data = Solicitud::body();
        Response::json($this->service->login(Solicitud::cedula($data), $this->password($data)));
    }
    /** Las cuentas registradas públicamente siempre tienen rol ciudadano. */
    public function register(): never {
        Auth::limitAttempts('register');
        $data = Solicitud::body();
        $password = $this->password($data);
        if (mb_strlen($password) < 6) Response::invalid('password', 'Use al menos seis caracteres.');
        if (($data['password_confirmation'] ?? null) !== $password) Response::invalid('password', 'Las contraseñas no coinciden.');
        Response::json($this->service->register(Solicitud::cedula($data), $password), 201);
    }
    /** Las contraseñas no se recortan: los espacios forman parte del secreto. */
    private function password(array $data): string {
        Solicitud::text($data, 'password');
        if (strlen($data['password']) > 72) Response::invalid('password', 'La contraseña supera los 72 bytes admitidos por bcrypt.');
        return $data['password'];
    }
    /** Revalida token, vencimiento y cuenta antes de devolver sus datos públicos. */
    public function me(): never { Response::json(['usuario' => Auth::requireUser()->toArray()]); }
    /** Cerrar sesión borra el token utilizado y responde sin contenido. */
    public function logout(): never {
        Auth::requireUser();
        $this->service->logout();
        Response::empty();
    }
}
