# Backend IMSJ

API REST del sistema de Educación Vial del Instituto Municipal de Seguridad y Justicia.

## Estado actual

La fase 1 contiene solamente:

- Laravel 13 configurado como API.
- `GET /api/health` para comprobar que el backend responde.
- Un contenedor para PHP 8.5 con Apache.
- Un contenedor para MySQL 8.4.
- Una prueba automática del endpoint de salud.

La base de datos del dominio, la autenticación y los módulos funcionales se implementarán en las fases siguientes.

## Primera configuración con Docker

Desde la carpeta `backend`:

```powershell
Copy-Item .env.example .env
docker compose build
docker compose run --rm app php artisan key:generate
docker compose up -d
```

La copia de `.env` y `php artisan key:generate` se hacen solamente la primera vez. Para iniciar el proyecto después, alcanza con:

```powershell
docker compose up -d
```

Comprobar la API:

```powershell
Invoke-RestMethod http://localhost:8000/api/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

Detener los contenedores:

```powershell
docker compose down
```

Los datos de MySQL permanecen en el volumen `db_data`. Para evitar pérdidas accidentales, el comando anterior no elimina ese volumen.

## Archivos principales

- `routes/api.php`: rutas públicas de la API.
- `bootstrap/app.php`: carga las rutas y configura los errores JSON.
- `Dockerfile`: construye el contenedor de Laravel.
- `compose.yaml`: inicia Laravel y MySQL.
- `tests/Feature/HealthEndpointTest.php`: verifica `/api/health`.
