# Reconstrucción de la infraestructura PHP nativa

**05/10/2026 - instalación nueva local.** Procedimiento basado en archivos implementados. Docker/Apache no se ejecutaron en esta intervención; registrar su resultado antes de presentarlo como reconstrucción comprobada. Preparado con apoyo externo de IA, revisión de Juan Robaina pendiente.

## Instalación nueva

1. Disponer de Docker y Compose; desde la carpeta backend, crear .env a partir de .env.example si no existe.
2. Completar DB_PASSWORD y DB_ROOT_PASSWORD; mantener DB_DATABASE y DB_USERNAME acordes a la base elegida. No reutilizar contraseñas de ejemplos. APP_PORT=8000 y FRONTEND_PORT=8080 son las direcciones de los frontends actuales.
3. Ejecutar `docker compose up -d --build`, o `iniciar.bat`. El SQL raíz se importa automáticamente solo cuando db_data está vacío. No contiene usuarios o contenido de demostración.
4. Crear explícitamente la primera cuenta de personal con scripts/crear_admin.php, siguiendo el [README del backend](../../backend/README.md). Si ya hay personal activo, la herramienta rechaza la operación.
5. Consultar /api/health y verificar login/listado con la nueva cuenta; health no consulta MySQL.
6. Abrir localhost:8080/frontend-publico/ y localhost:8080/frontend-imsj/. Verificar portal, ingreso, contenidos/archivos, permisos y agenda académica; registrar versión, entorno, pasos y resultados.

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
