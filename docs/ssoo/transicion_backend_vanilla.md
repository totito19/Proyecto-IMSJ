# Transición, respaldo y recuperación del backend

**05/10/2026 - CC-05, PHP nativo implementado.** Procedimiento preparado con apoyo externo de IA; no se ejecutó sobre una instalación institucional. El equipo debe ensayar respaldo/restauración sobre una copia y registrar resultados. Revisión de Juan Robaina pendiente.

## Qué se conserva

Nginx para frontends, Apache/PHP para app, MySQL db y volúmenes db_data/app_uploads. Las diez tablas de dominio conservan nombres/relaciones; database.sql no tiene DROP ni cuentas de demo y añade auth_tokens. Credenciales bcrypt y rutas de adjuntos existentes siguen siendo compatibles. No cambian el JS o las 42 rutas de la API.

La nueva autenticación no consulta la tabla técnica de tokens anterior. Volver a iniciar sesión después del cambio; no se convierte una sesión heredada ni se crea SECRET_KEY/JWT. La tabla técnica previa puede quedar sin uso en una base existente hasta que el equipo decida su tratamiento. [Transición general](../migracion_backend_vanilla.md).

## Preparar respaldo sobre una instalación revisada

Identificar versión, configuración, proyecto Compose y volúmenes antes de operar. La carpeta de respaldo será elegida por el equipo y protegida; contiene datos personales y configuración. Detener escrituras durante el respaldo para coordinar base/adjuntos.

Los siguientes comandos son una guía para el Compose actual. Usan las credenciales de entorno dentro del contenedor y un archivo de salida para evitar que PowerShell cambie la codificación del SQL. Desde backend, con ../respaldo ya creado para esta operación:

```powershell
docker compose stop app
docker compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump -u "$MYSQL_USER" --single-transaction --no-tablespaces --default-character-set=utf8mb4 "$MYSQL_DATABASE" -r /tmp/imsj-respaldo.sql'
docker compose cp db:/tmp/imsj-respaldo.sql ../respaldo/base.sql
docker compose cp app:/var/www/html/storage/app/public ../respaldo/archivos
docker compose start app
```

Conservar además la versión de código y .env en ubicación protegida, con permisos adecuados. No subir el respaldo al repositorio. Si mysqldump falla, no considerar completo el respaldo y corregir el diagnóstico. La coordinación de escrituras incluye otros accesos a MySQL si existen; no se presume que detener app detenga integraciones externas.

## Actualizar con datos

1. Ensayar primero en otra instalación/proyecto Compose con una copia de respaldo. Verificar qué volúmenes son de prueba; no apuntar esa copia a volúmenes institucionales.
2. Comparar las columnas/FK/índices existentes con database.sql. CREATE TABLE IF NOT EXISTS no altera tablas existentes incompatibles. Cualquier transformación adicional de datos/esquema requiere una propuesta explícita del equipo, no se ejecuta por esta guía.
3. Con el esquema de dominio compatible, importar database.sql para crear auth_tokens/tablas ausentes, sin borrar datos:

```powershell
docker compose cp database.sql db:/tmp/imsj-schema.sql
docker compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u "$MYSQL_USER" --default-character-set=utf8mb4 "$MYSQL_DATABASE" < /tmp/imsj-schema.sql'
docker compose up -d --build app
```

4. Mantener el mismo proyecto y volúmenes de la instalación, conservar DB_* y APP_URL/orígenes pertinentes. Configuración de proceso vence a .env; confirmar los valores efectivos sin imprimir secretos.
5. Iniciar sesión nuevamente. Comparar cuentas/IDs, contenidos, adjuntos, reservas e historial; verificar permisos, publicación y formularios del panel. No ejecutar crear_admin si ya hay personal activo.

## Restaurar sobre una copia aislada

Crear un destino de prueba vacío identificado por el equipo y cargar el respaldo antes de cualquier uso. El usuario MySQL debe poder crear las tablas. No aplicar estos comandos a una base con datos que se necesiten conservar; la restauración reemplaza el estado por el respaldo seleccionado.

```powershell
docker compose stop app
docker compose cp ../respaldo/base.sql db:/tmp/imsj-restaurar.sql
docker compose exec -T db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u "$MYSQL_USER" --default-character-set=utf8mb4 "$MYSQL_DATABASE" < /tmp/imsj-restaurar.sql'
docker compose cp ../respaldo/archivos/. app:/var/www/html/storage/app/public
docker compose run --rm --user root app chown -R www-data:www-data storage/app/public
docker compose start app
```

Importar una copia no elimina archivos que sobren de un destino anterior; usar un destino de prueba vacío o un conjunto de archivos revisado, sin inventar limpieza destructiva. Comprobar permisos/propiedad, listados, descargas y coherencia de claves y conteos. Registrar integridad del respaldo, versión compatible y resultados. Si se necesita volver al código anterior, utilizar la versión y respaldo compatibles; restaurar solo código no recupera datos.

## Estado de ejecución y pendientes

En esta intervención se preservaron archivos locales previos al reemplazar el backend y se creó una copia de resguardo del código anterior fuera del proyecto. No se usó una base institucional ni se borraron volúmenes. Las pruebas HTTP usaron PHP/MySQL portable y datos sintéticos. Docker, Apache, actualización real y restauración de respaldo requieren ejecución del equipo; [verificación](../verificacion.md).

Alojamiento, dominio/HTTPS, referente operativo, frecuencia y conservación de respaldos se completarán cuando la Intendencia/equipo los definan. Esta guía no incorpora servicios externos ni cambia la administración posterior confirmada.
