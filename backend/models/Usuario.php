<?php
declare(strict_types=1);
/** Cuenta del dominio; el hash de contraseña nunca forma parte del perfil público. */
final class Usuario {
    public function __construct(private array $row) {}
    public function id(): int { return (int) $this->row['id']; }
    public function rol(): string { return $this->row['rol']; }
    public function activo(): bool { return (bool) $this->row['activo']; }
    public function verify(string $password): bool { return password_verify($password, $this->row['password']); }
    public function toArray(): array {
        return ['id' => $this->id(), 'nombre' => $this->row['nombre'], 'cedula' => $this->row['cedula'], 'rol' => $this->rol()];
    }
    public function adminArray(): array {
        $data = $this->toArray(); unset($data['rol']);
        // ISO 8601 permite al navegador interpretar UTC igual que en la API anterior.
        $data['created_at'] = $this->row['created_at'] === null ? null
            : (new DateTimeImmutable($this->row['created_at'], new DateTimeZone('UTC')))->format(DATE_ATOM);
        return $data;
    }
}
