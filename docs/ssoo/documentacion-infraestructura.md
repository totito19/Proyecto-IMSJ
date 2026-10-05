# Inventario de infraestructura

**05/10/2026 - versión PHP nativa.** Archivos definidos; ejecución Docker no acreditada. Crédito/responsabilidad del grupo; apoyo externo de IA y revisión interna pendiente.

| Servicio / volumen | Definición actual | Responsabilidad |
|---|---|---|
| app | Dockerfile php:8.5-apache; APP_PORT local 8000 por defecto; depende de db saludable. | API en public; portal/panel mediante alias de Apache y montajes de lectura. Healthcheck verifica API, esquema y portal. |
| db | mysql:8.4; puerto 3306 interno, sin publicación al host. | Datos; schema se importa solo en volumen inicialmente vacío. |
| db_data | Nombre conservado, /var/lib/mysql. | Persistencia de tablas. |
| app_uploads | Nombre conservado, storage/app/public. | PDF/imágenes; fuera de public. |
| cache | storage/cache, nuevo volumen técnico. | Contador de intentos compartido por procesos. |

Usar el mismo directorio/proyecto Compose para reutilizar los volúmenes previos; crear otro nombre de proyecto produciría volúmenes distintos. No eliminar volúmenes para actualizar. Se retira el servicio frontend/Nginx por solicitud del grupo. Apache publica un solo puerto en 127.0.0.1 y ambos frontends llaman a la API del mismo origen, sin puerto fijo en JavaScript.

## Archivos de operación

Dockerfile instala pdo_mysql y mbstring; fileinfo está disponible en PHP. Configura display_errors apagado, logs, upload_max_filesize=10M y post_max_size=24M. apache.conf habilita public y dos alias de frontends, sin exponer el backend privado. .dockerignore excluye .env, adjuntos locales, caché, tests y vendor de la imagen. Almacenamiento con permisos para www-data.

Compose define app/db y transmite al proceso PHP configuración nativa; MySQL healthcheck habilita app y scripts/salud.php comprueba Apache, esquema y portal. Los BAT delegan en scripts/docker.ps1: detección de Docker, inicio/espera de Desktop, configuración y claves para una base nueva, puerto libre, espera de salud y apertura del navegador. Conserva claves de una base previa; exige recuperarlas si faltan. `detener.bat` detiene sin borrar volúmenes. `scripts/crear_admin.php` sigue siendo CLI explícita; `scripts/verificar.php` revisa sintaxis sin SQL.

## Variables

| Variable | Uso |
|---|---|
| APP_ENV, APP_URL | Ambiente informativo y base para las URL de adjuntos. |
| FRONTEND_ORIGIN | Orígenes exactos para CORS; Compose usa localhost con APP_PORT por defecto. En el despliegue actual la API tiene el mismo origen que las páginas. |
| APP_PORT | Puerto único local, 8000 por defecto; el inicio puede elegir uno libre y guardarlo. FRONTEND_PORT ya no se utiliza. |
| DB_HOST, DB_PORT | db:3306 en Compose; 127.0.0.1/puerto del servidor en ejecución local. |
| DB_DATABASE, DB_USERNAME, DB_PASSWORD | Conexión PDO con credenciales específicas de la instalación. |
| DB_ROOT_PASSWORD | Contraseña administrativa de MySQL, no utilizada por la API. |
| INITIAL_ADMIN_* | Nombre/cédula/contraseña de primera cuenta, solo para acción CLI explícita. |
| UPLOAD_ROOT, CACHE_ROOT | Overrides opcionales de rutas locales; defaults en storage. Compartir caché entre procesos. |

La configuración de proceso tiene precedencia sobre .env. No hay APP_KEY, SECRET_KEY, token JWT o pasos Artisan en el backend actual. No incluir secretos reales en Git. [Reconstrucción](reconstruccion-infraestructura.md), [transición](transicion_backend_vanilla.md), [verificación](../verificacion.md).

Dominio/HTTPS, alojamiento, administrador operativo y plan institucional de respaldos siguen pendientes. Los procedimientos documentados no certifican disponibilidad, seguridad de producción o aceptación.
