# Backend IMSJ

API REST en Laravel 13 y MySQL para el sistema de Educación Vial IMSJ.

## Qué contiene

- `app/Models`: clases que representan usuarios, noticias, materiales,
  preguntas, franjas y reservas.
- `app/Http/Controllers`: recibe las peticiones y ejecuta cada operación.
- `routes/api.php`: lista las direcciones disponibles de la API.
- `database/migrations`: recetas de Laravel para crear las tablas.
- `database/schema.sql`: las mismas tablas expresadas en SQL para la entrega.
- `tests`: comprobaciones automáticas del comportamiento principal.

El resto de los archivos de esta carpeta pertenece a la estructura mínima que
Laravel necesita para arrancar, conectarse a MySQL y responder por HTTP.

## Iniciar con Docker

La primera vez, desde `backend`:

```powershell
Copy-Item .env.example .env
docker compose build
docker compose run --rm app php artisan key:generate
docker compose run --rm app php artisan migrate --seed
docker compose up -d
```

Las veces siguientes:

```powershell
docker compose up -d
```

La API queda disponible en `http://localhost:8000/api`. El endpoint
`GET /api/health` permite comprobar que responde.

## Documentación de SSOO

Los entregables de Administración de Sistemas Operativos para la segunda
entrega están reunidos en [`../docs/ssoo/`](../docs/ssoo/README.md):

- justificación tecnológica;
- documentación de infraestructura;
- procedimiento de reconstrucción paso a paso.

## Qué no se entrega

`vendor` se genera al instalar las dependencias. Está excluida de Git y no debe
copiarse como parte del código del grupo.
