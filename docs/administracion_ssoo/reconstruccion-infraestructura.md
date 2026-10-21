# Reconstrucción de la infraestructura

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización:** 21/10/2026.

## Alcance y requisitos previos

Este procedimiento describe una instalación local nueva a partir del repositorio. Se necesita Docker con Compose y contenedores Linux, acceso a Internet para descargar imágenes en el primer inicio y la carpeta completa del proyecto, incluidos ambos frontends. Los comandos se ejecutan desde `backend`.

Una instalación existente debe conservar su configuración y volúmenes y seguir primero la [guía de transición](../../docs_auxiliares/backend/transicion_backend_vanilla.md). El procedimiento de transición reúne las operaciones de respaldo, actualización y restauración.

## Instalación nueva en Windows

1. Abrir `backend/iniciar.bat`. La herramienta detecta Docker y abre Desktop si corresponde. Si el motor informa un problema de WSL o virtualización, se debe resolver ese requisito del equipo antes de continuar.
2. Esperar la preparación de `.env`, la descarga/construcción y la salud de los servicios. Las claves se generan para una base nueva. Si se detecta una base previa sin configuración válida, el inicio se detiene y solicita recuperar las claves originales.
3. Leer las direcciones mostradas. El puerto es 8000 por defecto; si está ocupado, el inicio busca uno disponible y lo guarda. El navegador se abre cuando el portal responde.
4. Crear la primera cuenta de personal mediante `scripts/crear_admin.php`, con las variables `INITIAL_ADMIN_*` indicadas en el [README del backend](../../backend/README.md#instalación-nueva-con-docker). Es una acción explícita, separada del arranque.
5. Acceder al panel con esa cuenta y comprobar que las listas vacías corresponden a una instalación sin contenido. El SQL inicial no incorpora usuarios ni datos de demostración.

El inicio ejecuta la migración incremental antes de Apache. Se utiliza para incorporar columnas, roles y estados requeridos por la versión actual; sus cambios se comparan con la estructura de la instalación.

## Inicio manual en otros sistemas

Copiar `.env.example` a `.env` y definir las credenciales de la instalación. Desde `backend`:

```text
docker compose up -d --build --remove-orphans --wait --wait-timeout 180
docker compose ps
```

Con el puerto predeterminado se accede al portal en `http://localhost:8000/frontend-publico/`, al panel en `http://localhost:8000/frontend-imsj/` y a la comprobación PHP en `http://localhost:8000/api/health`. Si se elige otro puerto, las direcciones deben utilizarlo; los clientes JavaScript siguen el origen de la página.

## Comprobaciones posteriores

| Comprobación | Resultado esperado |
|---|---|
| Contenedores | `app` y `db` aparecen iniciados y saludables. |
| Portal y API | Responden las páginas y `/api/health`; la salud interna también consulta tablas y columnas esenciales. |
| Inicio de sesión | La cuenta válida ingresa y una credencial incorrecta es rechazada. |
| Contenidos | El panel permite preparar contenido y el portal solo presenta lo publicado y vigente. |
| Aprobación | La Directora puede aprobar y esa acción no publica por sí sola. |
| Archivos | Una carga permitida puede descargarse y las entradas inválidas se rechazan. |
| Agenda académica | Una franja con cupo admite una reserva propia y su cancelación; se impiden duplicación y cancelación ajena. |
| Persistencia | Al detener e iniciar los mismos servicios se conservan los registros y adjuntos preparados para la prueba. |

Cada ejecución debe registrar versión del código, entorno, fecha, procedimiento, resultado y evidencia.

## Detención, reinicio y diagnóstico

`detener.bat` detiene los contenedores conservando volúmenes. El equivalente manual es `docker compose stop`; para volver a iniciar se utiliza `docker compose up -d`. Mantener el nombre de proyecto evita iniciar accidentalmente otra base vacía.

```text
docker compose ps -a
docker compose logs --tail 80 app db
```

Los mensajes permiten distinguir fallos de motor, descarga, migración, conexión o HTTP. La creación de la primera cuenta rechaza una base que ya tenga personal activo. Si el portal responde pero el panel no permite ingresar, revisar primero la cuenta y las credenciales, sin volver a importar SQL ni borrar datos.

## Ejecución local sin Docker

Se necesitan PHP 8.5 con PDO MySQL, mbstring y fileinfo, MySQL 8.4, el esquema importado en una base seleccionada y las variables de conexión ajustadas. El servidor integrado puede utilizarse para desarrollo de la API:

```text
php -d upload_max_filesize=10M -d post_max_size=24M -S 127.0.0.1:8000 -t public public/index.php
php scripts/verificar.php
```

El servidor integrado atiende la API. Para recorrer el sistema completo se utiliza Docker o Apache con raíz en `public` y los dos alias de frontend. Composer no instala dependencias necesarias para responder en esta versión.

## Recuperación y evidencia disponible

Un respaldo recuperable debe reunir exportación SQL, adjuntos, versión de código y configuración protegida. La restauración se ensaya en un destino aislado, comparando cuentas, relaciones, conteos, permisos y descargas. El procedimiento detallado está en [respaldo y recuperación](../../docs_auxiliares/backend/transicion_backend_vanilla.md).

## Registro de reconstrucción y recuperación

| Dato | Valor |
|---|---|
| Versión | [] |
| Fecha | [] |
| Entorno | [] |
| Responsable | [] |
| Respaldo utilizado | [] |
| Resultado | [] |
| Evidencia | [] |
