# Backend - Educación Vial IMSJ

## Descripción
API REST desarrollada con Laravel para gestionar noticias, agendas, materiales de estudio y preguntas frecuentes.

## Requisitos
- PHP >= 8.1
- Composer
- MySQL >= 5.7
- Node.js (para assets)

## Instalación

1. Instalar dependencias:
```bash
composer install
```

2. Crear archivo `.env`:
```bash
cp .env.example .env
```

3. Configurar base de datos en `.env`

4. Generar clave de aplicación:
```bash
php artisan key:generate
```

5. Ejecutar migraciones:
```bash
php artisan migrate
```

6. (Opcional) Ejecutar seeders:
```bash
php artisan db:seed
```

## Estructura de carpetas

- `app/` - Modelos, Controllers, Middleware
- `routes/` - Rutas API
- `database/` - Migraciones y seeders
- `resources/` - Vistas y assets

## Comandos útiles

```bash
# Iniciar servidor de desarrollo
php artisan serve

# Ejecutar migraciones
php artisan migrate

# Deshacer última migración
php artisan migrate:rollback

# Limpiar caché
php artisan cache:clear

# Ejecutar tests
php artisan test
```

## Endpoints principales

Ver documentación completa en: `/docs/03-api.md`

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Datos del usuario autenticado

### Noticias
- `POST /api/noticias` - Crear noticia
- `GET /api/noticias/publicadas` - Listar noticias publicadas
- `GET /api/noticias/{id}` - Obtener noticia
- `PATCH /api/noticias/{id}` - Actualizar noticia

### Agenda
- `POST /api/agendas` - Crear agenda
- `GET /api/agendas/my` - Mis agendas
- `POST /api/franjas` - Crear franja

### Materiales
- `GET /api/materiales/publicados` - Materiales publicados

### Preguntas Frecuentes
- `GET /api/preguntas-frecuentes/publicadas` - Preguntas publicadas

## Seguridad

Ver: `/docs/04-seguridad.md`

- Validación de entrada en todos los endpoints
- Autenticación basada en tokens
- Control de roles y permisos
- Protección CSRF
- Validación de datos personales
