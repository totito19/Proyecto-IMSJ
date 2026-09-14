# Documentación de infraestructura

**Proyecto:** Plataforma Web Educación Vial IMSJ  
**Asignatura:** Administración de Sistemas Operativos  
**Entrega:** segunda entrega  
**Fecha:** 2 de septiembre de 2026

## 1. Alcance

Este documento registra la infraestructura implementada para ejecutar el
proyecto con Docker. Describe servicios, red, puertos, volúmenes, construcción,
configuración, scripts de operación y verificaciones disponibles.

La infraestructura está orientada a desarrollo y demostración local. Las
medidas necesarias para un despliegue público se identifican como trabajo
posterior.

## 2. Inventario de archivos

Los caminos son relativos a la raíz `Proyecto-IMSJ/`.

| Archivo o directorio | Función |
|---|---|
| `backend/compose.yaml` | Declara `frontend`, `app`, `db` y los volúmenes persistentes. |
| `backend/Dockerfile` | Construye la API con PHP, Apache, extensiones y Composer. |
| `backend/.dockerignore` | Excluye configuración local, dependencias y archivos innecesarios de la imagen. |
| `backend/.env.example` | Plantilla para la configuración local `.env`. |
| `backend/.gitignore` | Excluye `.env`, dependencias, registros y cachés. |
| `backend/iniciar.bat` | Prepara e inicia el sistema en Windows. |
| `backend/detener.bat` | Detiene contenedores sin borrar volúmenes. |
| `backend/database/migrations/` | Reconstruye el esquema mediante Laravel. |
| `backend/database/seeders/` | Carga datos iniciales en una base nueva. |
| `frontend-publico/` | Sitio estático de la ciudadanía. |
| `frontend-imsj/` | Panel estático del personal IMSJ. |

## 3. Topología

```text
HOST
│
├── localhost:${FRONTEND_PORT:-8080}
│      └── frontend (Nginx, puerto 80)
│             ├── /frontend-publico/  [solo lectura]
│             └── /frontend-imsj/     [solo lectura]
│
└── localhost:${APP_PORT:-8000}
       └── app (Apache + PHP + Laravel, puerto 80)
              ├── /var/www/html/.env
              ├── volumen app_uploads
              └── red privada de Compose
                      └── db (MySQL, puerto interno 3306)
                              └── volumen db_data
```

Compose crea una red privada predeterminada. La API encuentra MySQL mediante el
nombre DNS interno `db`. El puerto 3306 no se publica en el host, por lo que la
base no queda accesible directamente desde otros equipos.

## 4. Servicios de `compose.yaml`

### 4.1 `frontend`

| Propiedad | Valor o comportamiento |
|---|---|
| Imagen | `nginx:alpine` |
| Puerto interno | `80/tcp` |
| Puerto del host | `FRONTEND_PORT`; valor predeterminado `8080` |
| Montaje 1 | `../frontend-publico` en `/usr/share/nginx/html/frontend-publico`, solo lectura |
| Montaje 2 | `../frontend-imsj` en `/usr/share/nginx/html/frontend-imsj`, solo lectura |

Los montajes relativos parten de `backend/compose.yaml`. Para reconstruir el
sistema se necesita el repositorio completo: `backend`, `frontend-publico` y
`frontend-imsj` deben conservarse como carpetas hermanas.

### 4.2 `app`

| Propiedad | Valor o comportamiento |
|---|---|
| Imagen | Construida desde `backend/Dockerfile` |
| Servidor | Apache con PHP 8.5 |
| Aplicación | Laravel 13 |
| Puerto interno | `80/tcp` |
| Puerto del host | `APP_PORT`; valor predeterminado `8000` |
| Configuración | `backend/.env` montado en `/var/www/html/.env` |
| Archivos persistentes | `app_uploads` en `/var/www/html/storage/app/public` |
| Dependencia | Espera que `db` pase la comprobación de salud |

`GET /api/health` devuelve `{"status":"ok"}` y verifica que Apache, PHP,
Laravel y el enrutamiento estén respondiendo.

### 4.3 `db`

| Propiedad | Valor o comportamiento |
|---|---|
| Imagen | `mysql:8.4` |
| Puerto | `3306/tcp`, solo en la red Compose |
| Base inicial | `DB_DATABASE` |
| Usuario de aplicación | `DB_USERNAME` |
| Contraseña de aplicación | `DB_PASSWORD` |
| Contraseña administrativa | `DB_ROOT_PASSWORD` |
| Persistencia | `db_data` en `/var/lib/mysql` |
| Salud | `mysqladmin ping` cada 5 s, espera de 5 s y 10 reintentos |

Las variables se leen desde `.env`. Laravel usa `DB_HOST=db`, no `localhost`.

## 5. Persistencia

| Volumen | Contenido | Comportamiento |
|---|---|---|
| `db_data` | Tablas, índices y archivos internos de MySQL | Se conserva al detener o recrear el contenedor. |
| `app_uploads` | Imágenes y materiales cargados | Se conserva al detener o recrear el contenedor. |

`docker compose stop` y `docker compose down` conservan los volúmenes. La
opción `docker compose down -v` los elimina y **no debe usarse durante la
operación habitual**. La persistencia no reemplaza un respaldo independiente.

## 6. Construcción de la API

El `Dockerfile` realiza estas operaciones:

1. parte de `php:8.5-apache`;
2. instala `libonig-dev` y `unzip`;
3. compila y habilita `mbstring` y `pdo_mysql`;
4. habilita `mod_rewrite` y las reglas `.htaccess`;
5. copia Composer 2.10 desde su imagen oficial;
6. define `/var/www/html/public` como raíz de Apache;
7. copia el backend a `/var/www/html`;
8. instala dependencias de producción desde `composer.lock`;
9. crea el enlace público de almacenamiento;
10. asigna a `www-data` los permisos sobre `storage` y `bootstrap/cache`.

`.dockerignore` mantiene fuera del contexto `.env`, `.git`, `vendor`,
`node_modules`, pruebas, registros y cachés. Esto evita incorporar la
configuración privada o archivos generados.

## 7. Configuración por ambiente

`backend/.env` se crea desde `.env.example` y está excluido de Git.

| Variable | Uso | Referencia local |
|---|---|---|
| `APP_NAME` | Nombre de la aplicación | `IMSJ Backend` |
| `APP_ENV` | Tipo de ambiente | `local` |
| `APP_KEY` | Clave criptográfica de Laravel | Se genera por instalación |
| `APP_DEBUG` | Detalle de errores | `true` solo en desarrollo |
| `APP_URL` | URL base de la API | `http://localhost:8000` |
| `APP_PORT` | Puerto de la API | `8000` |
| `FRONTEND_PORT` | Puerto de los frontends | `8080` |
| `DB_HOST` | Servidor MySQL interno | `db` |
| `DB_PORT` | Puerto MySQL interno | `3306` |
| `DB_DATABASE` | Nombre de la base | `imsj` |
| `DB_USERNAME` | Usuario de la aplicación | Valor local modificable |
| `DB_PASSWORD` | Contraseña del usuario | Cambiar fuera de desarrollo |
| `DB_ROOT_PASSWORD` | Contraseña administrativa | Cambiar fuera de desarrollo |

Los valores de `.env.example` son únicamente de arranque local y no deben
reutilizarse en un servidor real.

## 8. Scripts de operación

### 8.1 `iniciar.bat`

El script para Windows:

1. ingresa a `backend/`;
2. comprueba que Docker esté instalado;
3. comprueba que el motor responda;
4. intenta iniciar Docker Desktop si está detenido;
5. crea `.env` desde `.env.example` si falta;
6. construye e inicia los servicios;
7. genera `APP_KEY` si está vacía;
8. aplica las migraciones pendientes;
9. carga datos iniciales solamente si detecta una base nueva;
10. muestra las URLs y abre el frontend público.

El script se detiene y muestra un error si falla una operación necesaria.

### 8.2 `detener.bat`

Comprueba Docker y ejecuta `docker compose down`. Retira contenedores y red,
pero conserva `db_data` y `app_uploads`.

## 9. Operación manual

Ejecutar desde `Proyecto-IMSJ/backend`:

```powershell
# Estado
docker compose ps

# Registros
docker compose logs --tail=100
docker compose logs --tail=100 app
docker compose logs --tail=100 db

# Reinicio de la API
docker compose restart app

# Migraciones pendientes
docker compose exec -T app php artisan migrate --force

# Parada sin borrar datos
docker compose down
```

Como el backend se copia durante la construcción, los cambios de código exigen
reconstruir la imagen:

```powershell
docker compose up -d --build app
```

## 10. Controles actuales

- MySQL no publica su puerto en el host.
- El backend espera que MySQL esté saludable.
- Los frontends se montan como solo lectura.
- `.env` no se incluye en la imagen ni en Git.
- Solo se instalan dependencias PHP de producción.
- Apache publica `public/`, no la raíz de Laravel.
- Los datos residen en volúmenes persistentes.
- La API protege rutas administrativas con Sanctum y middleware de rol; el
  login limita intentos mediante `throttle`.

Para producción siguen pendientes HTTPS, secretos de producción, desactivar la
depuración, respaldo, monitoreo, límites de recursos y actualización controlada
de imágenes.

## 11. Verificación realizada

El 2 de septiembre de 2026 se validó `compose.yaml` con
`docker compose config --quiet`. Compose reconoció:

- servicios: `db`, `app` y `frontend`;
- volúmenes: `db_data` y `app_uploads`.

La reconstrucción funcional completa se verifica mediante la guía
`03-reconstruccion-infraestructura.md`.
