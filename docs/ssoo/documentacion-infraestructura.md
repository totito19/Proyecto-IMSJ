# Inventario de infraestructura

**05/10/2026 - versión PHP nativa.** Archivos definidos; ejecución Docker no acreditada. Crédito/responsabilidad del grupo; apoyo externo de IA y revisión interna pendiente.

| Servicio / volumen | Definición actual | Responsabilidad |
|---|---|---|
| frontend | nginx:alpine; puerto local 8080; carpetas estáticas montadas en lectura. | Portal y panel bajo /frontend-publico/ y /frontend-imsj/. |
| app | Dockerfile php:8.5-apache; puerto local 8000; depende de db saludable. | API, Apache con DocumentRoot public y mod_rewrite. |
| db | mysql:8.4; puerto 3306 interno, sin publicación al host. | Datos; schema se importa solo en volumen inicialmente vacío. |
| db_data | Nombre conservado, /var/lib/mysql. | Persistencia de tablas. |
| app_uploads | Nombre conservado, storage/app/public. | PDF/imágenes; fuera de public. |
| cache | storage/cache, nuevo volumen técnico. | Contador de intentos compartido por procesos. |

Usar el mismo directorio/proyecto Compose para reutilizar los volúmenes previos; crear otro nombre de proyecto produciría volúmenes distintos. No eliminar volúmenes para actualizar. Los puertos se vinculan a 127.0.0.1 en este entorno local. El JS sigue llamando a localhost:8000; cambiar APP_PORT no cambia el frontend.

## Archivos de operación

Dockerfile instala pdo_mysql y mbstring; fileinfo está disponible en PHP. Configura display_errors apagado, logs, upload_max_filesize=10M y post_max_size=24M. Solo public se publica. .dockerignore excluye .env, adjuntos locales, caché, tests y vendor de la imagen. Almacenamiento con permisos para www-data.

Compose conserva frontend/app/db y transmite al proceso PHP configuración nativa; MySQL healthcheck habilita el inicio de app. `iniciar.bat` exige .env y levanta/reconstruye; `detener.bat` detiene sin borrar volúmenes. `scripts/crear_admin.php` solo CLI, primera cuenta sin personal activo; `scripts/verificar.php` revisa sintaxis sin SQL.

## Variables

| Variable | Uso |
|---|---|
| APP_ENV, APP_URL | Ambiente informativo y base para las URL de adjuntos. |
| FRONTEND_ORIGIN | Lista separada por comas de orígenes exactos para CORS; localhost:8080 por defecto de sitio. |
| APP_PORT, FRONTEND_PORT | Publicación local 8000/8080; configurar con los consumidores. |
| DB_HOST, DB_PORT | db:3306 en Compose; 127.0.0.1/puerto del servidor en ejecución local. |
| DB_DATABASE, DB_USERNAME, DB_PASSWORD | Conexión PDO con credenciales específicas de la instalación. |
| DB_ROOT_PASSWORD | Contraseña administrativa de MySQL, no utilizada por la API. |
| INITIAL_ADMIN_* | Nombre/cédula/contraseña de primera cuenta, solo para acción CLI explícita. |
| UPLOAD_ROOT, CACHE_ROOT | Overrides opcionales de rutas locales; defaults en storage. Compartir caché entre procesos. |

La configuración de proceso tiene precedencia sobre .env. No hay APP_KEY, SECRET_KEY, token JWT o pasos Artisan en el backend actual. No incluir secretos reales en Git. [Reconstrucción](reconstruccion-infraestructura.md), [transición](transicion_backend_vanilla.md), [verificación](../verificacion.md).

Dominio/HTTPS, alojamiento, administrador operativo y plan institucional de respaldos siguen pendientes. Los procedimientos documentados no certifican disponibilidad, seguridad de producción o aceptación.
