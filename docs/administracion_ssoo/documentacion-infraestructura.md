# Inventario y operación de infraestructura

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización:** 20/10/2026.

## Servicios y datos persistentes

| Elemento | Definición | Información operativa |
|---|---|---|
| `app` | Imagen construida desde `php:8.5-apache`. | Sirve API y frontends; depende de `db` saludable y ejecuta la migración incremental antes de iniciar Apache. |
| `db` | Imagen `mysql:8.4`. | Usa el puerto interno 3306. Importa `database.sql` únicamente si el volumen de MySQL está vacío. |
| `db_data` | Montaje en `/var/lib/mysql`. | Conserva usuarios, contenidos, reservas, consultas, historial y tokens. |
| `app_uploads` | Montaje en `/var/www/html/storage/app/public`. | Conserva adjuntos; el código guarda rutas relativas y construye sus URL. |
| `cache` | Montaje en `/var/www/html/storage/cache`. | Comparte contadores de intentos de autenticación entre procesos. |
| Frontends | Montajes de solo lectura en `/var/www/frontend-publico` y `/var/www/frontend-imsj`. | Apache los sirve mediante alias; el contenedor no modifica los archivos de las interfaces. |

Compose publica un único puerto de `app` en `127.0.0.1`. MySQL se comunica con PHP mediante el nombre de servicio `db`. Se deben conservar el directorio o nombre de proyecto Compose y sus volúmenes para actualizar una instalación existente.

## Archivos de operación

| Archivo del backend | Función |
|---|---|
| `Dockerfile` | Instala PDO MySQL y mbstring, habilita `mod_rewrite`, copia código y configura permisos de almacenamiento. |
| `compose.yaml` | Define servicios, variables, red, montajes, dependencias y salud. |
| `apache.conf` y `public/.htaccess` | Publican únicamente la entrada de API y los alias de interfaces y transmiten las peticiones al punto de entrada. |
| `.env.example` y `config.php` | Describen variables de instalación; la configuración del proceso tiene precedencia sobre `.env`. |
| `.dockerignore` | Excluye secretos, almacenamiento local, caché, pruebas y otras dependencias de la imagen. |
| `iniciar.bat`, `detener.bat`, `scripts/docker.ps1` | Detectan Docker, administran el arranque/detención y mantienen los mensajes de error visibles. |
| `scripts/migrar.php` | Ajusta tablas y estados necesarios para consultas, Directora y gráficos sin borrar los registros. |
| `scripts/crear_admin.php` | Crea explícitamente la primera cuenta; rechaza hacerlo si ya existe personal activo. |
| `scripts/salud.php` | Comprueba MySQL, columnas esenciales y respuesta HTTP de API y portal. |
| `scripts/verificar.php` | Comprueba sintaxis de PHP sin requerir una conexión SQL. |

PHP registra errores sin mostrarlos al cliente. El contenedor establece `upload_max_filesize=10M` y `post_max_size=24M`. Los límites de cada recurso se validan además en la aplicación: imágenes de noticias/pruebas de hasta 2048 KB, imagen de material de hasta 5120 KB y PDF de hasta 10240 KB.

## Variables de configuración

| Variable | Uso y valor de referencia |
|---|---|
| `APP_ENV` | Entorno de ejecución; Compose utiliza `development` por defecto. |
| `APP_PORT` | Puerto local único; 8000 por defecto. El inicio puede elegir y guardar otro disponible. |
| `APP_URL` | Base de las URL de adjuntos. Debe coincidir con la dirección utilizada por el navegador. |
| `FRONTEND_ORIGIN` | Lista de orígenes exactos permitidos en CORS. Compose deriva el origen local del puerto cuando no se define otro. |
| `DB_HOST`, `DB_PORT` | `db:3306` dentro de Compose; host y puerto reales para ejecución externa. |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Base, usuario de aplicación y contraseña de esa instalación. |
| `DB_ROOT_PASSWORD` | Contraseña administrativa de MySQL. La API no utiliza la cuenta root. |
| `INITIAL_ADMIN_*` | Nombre, cédula y contraseña proporcionados a la acción CLI de creación inicial. |
| `UPLOAD_ROOT`, `CACHE_ROOT` | Rutas alternativas para ejecución local; por defecto se utilizan las carpetas `storage`. |

La configuración nativa no utiliza `APP_KEY`, claves JWT ni comandos Artisan. La plantilla no reemplaza las credenciales de una base existente. Si se perdió `.env` y existe un volumen previo, el inicio solicita recuperar sus valores originales.

## Secuencia del inicio y control de salud

En Windows el inicio detecta Docker, abre Desktop cuando corresponde y espera el motor. Prepara `.env` y claves aleatorias solamente para una instalación nueva. Verifica un puerto local disponible, construye e inicia los servicios y espera la salud antes de abrir el navegador.

`GET /api/health` confirma que la entrada PHP responde. El control interno de Compose realiza también consultas sobre usuarios, consultas y el campo de imagen del simulador y abre la página pública por HTTP. Que responda `/health` por sí solo no demuestra que la base y los módulos de negocio funcionen.

## Diagnóstico y persistencia

Desde `backend`, `docker compose ps -a` muestra el estado de los contenedores. `docker compose logs --tail 80 app db` permite revisar un fallo de migración, conexión o arranque. La salida debe revisarse antes de compartirla para evitar publicar información de la instalación.

`detener.bat` utiliza detención sin borrar volúmenes. La recreación de la imagen conserva datos cuando se reutilizan los mismos volúmenes. Un respaldo completo debe relacionar base SQL, adjuntos, configuración protegida y versión del código; copiar solo el código no recupera el estado del servicio.

## Evidencia y operación institucional

El registro del 13/10 documenta arranque Docker aislado y pruebas visuales. No se ha incorporado un ensayo de restauración de un respaldo institucional. Dominio, HTTPS, proveedor, responsable operativo, frecuencia y conservación de copias continúan en el [formulario de información](../../docs_auxiliares/revision/formulario_datos_documentacion.md).

[Reconstrucción](reconstruccion-infraestructura.md), [backend](../../backend/README.md), [respaldo y transición](../../docs_auxiliares/backend/transicion_backend_vanilla.md) y [verificación](../../docs_auxiliares/evidencias/verificacion.md).
