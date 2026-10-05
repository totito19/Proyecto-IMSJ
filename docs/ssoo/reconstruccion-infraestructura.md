# Reconstrucción de la infraestructura PHP nativa

**05/10/2026 - instalación nueva local.** Procedimiento basado en archivos implementados. Docker/Apache no se ejecutaron en esta intervención; registrar su resultado antes de presentarlo como reconstrucción comprobada. Preparado con apoyo externo de IA, revisión de Juan Robaina pendiente.

## Instalación nueva

1. Disponer de Docker/Compose con contenedores Linux. En Windows abrir backend/iniciar.bat desde cualquier carpeta; no requiere runtimes PHP/MySQL en el host.
2. El BAT abre/espera Docker Desktop cuando corresponde, prepara .env con claves aleatorias para una base nueva y conserva las existentes. Si detecta un volumen previo sin sus claves, exige recuperarlas y se detiene. APP_PORT es el puerto único; por defecto 8000, con búsqueda de uno libre si otro programa lo ocupa.
3. Inicia Apache/PHP y MySQL con espera de salud y retira el Nginx anterior del mismo proyecto, sin borrar volúmenes. El SQL raíz se importa solo cuando db_data está vacío; no contiene usuarios o contenido de demostración. Para ejecución manual en otros sistemas: copiar .env.example, completar claves y ejecutar `docker compose up -d --build --remove-orphans --wait --wait-timeout 180`.
4. Crear explícitamente la primera cuenta de personal con scripts/crear_admin.php, siguiendo el [README del backend](../../backend/README.md). Si ya hay personal activo, la herramienta rechaza la operación.
5. Consultar /api/health y verificar login/listado con la nueva cuenta; health no consulta MySQL.
6. El BAT abre el portal en el navegador después de comprobar HTTP/base/páginas. Con el puerto por defecto: localhost:8000/frontend-publico/ y localhost:8000/frontend-imsj/; si cambia, usar el puerto mostrado. Verificar ingreso, contenidos/archivos, permisos y agenda académica; registrar versión, entorno, pasos y resultados.

```powershell
docker compose ps
docker compose logs --tail 50 app
docker compose logs --tail 50 db
```

Los logs son diagnóstico; revisar antes de adjuntarlos para no publicar datos de instalación. No se utilizan Composer install/Artisan como paso obligatorio: no hay paquetes externos.

## Reinicio y persistencia

`docker compose stop` detiene; `docker compose up -d` inicia con los volúmenes. Usar el mismo proyecto Compose y los nombres db_data/app_uploads. Probar en entorno aislado que recrear los contenedores conserve cuentas, contenido, archivos, historial y reservas. No borrar volúmenes como parte del arranque normal.

## Backend local sin contenedores

PHP 8.5 con PDO MySQL, mbstring y fileinfo, MySQL 8.4 y esquema importado en la base elegida. Ajustar DB_HOST/DB_PORT de .env; crear primera cuenta solo cuando corresponda. Desde backend:

```powershell
php -d upload_max_filesize=10M -d post_max_size=24M -S 127.0.0.1:8000 -t public public/index.php
php scripts/verificar.php
```

El servidor integrado es de desarrollo. El entorno utilizado para las pruebas reales fue local portable, con dos procesos contra una base MySQL aislada; [evidencia](../verificacion.md).

## Instalación con datos existentes

Este procedimiento nuevo no borra/restaura una instalación anterior. Seguir [transición y recuperación](transicion_backend_vanilla.md): respaldo, copia de prueba, comparación de esquema, SQL no destructivo, configuración/volúmenes conservados y nuevo login. No importar un SQL histórico con DROP ni volver a sembrar datos de demostración.
