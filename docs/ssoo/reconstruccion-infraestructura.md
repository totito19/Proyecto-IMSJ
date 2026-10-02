# Reconstrucción de la infraestructura

> **CC-05 — Decisión del grupo, 02/10/2026:** destino PHP sin Laravel, por capas y con PDO, basado en `api-completa`. El código y los archivos de infraestructura aún utilizan Laravel. El contenido previo se conserva como referencia de esa versión; la migración y sus pruebas están pendientes. Ver [transición documentada](transicion_backend_vanilla.md).

**Proyecto:** Plataforma Web Educación Vial IMSJ  
**Asignatura:** Administración de Sistemas Operativos  
**Entrega:** segunda entrega  
**Fecha:** 2 de septiembre de 2026

> **Revisión de IA — 02/10/2026:** procedimiento para instalación nueva de desarrollo. Casillas sin marcar y respuestas esperadas no son resultados ejecutados. La corrección documental no cambia los scripts ni opera bases de datos.

## 1. Propósito

Esta guía permite reconstruir desde cero la infraestructura de desarrollo y
demostración en otro equipo. Al finalizar deben estar disponibles los dos
frontends, la API Laravel y MySQL con su esquema y datos iniciales.

No es necesario instalar PHP, Composer, Apache, Nginx ni MySQL en el anfitrión:
esas dependencias se obtienen dentro de los contenedores.

## 2. Requisitos previos

- repositorio completo `Proyecto-IMSJ`, no solo `backend`;
- Windows 10/11 con Docker Desktop, o Linux con Docker Engine;
- Docker Compose v2, invocado como `docker compose`;
- Git, salvo que el proyecto se reciba como archivo comprimido;
- Internet durante la primera construcción;
- aproximadamente 5 GB de espacio libre como mínimo;
- puertos 8000 y 8080 libres, o dos puertos alternativos.

Verificar:

```powershell
docker --version
docker compose version
docker info
```

Los comandos deben finalizar correctamente. En Windows, si `docker info`
falla, iniciar Docker Desktop y esperar a que el motor quede listo.

## 3. Obtener el proyecto

Con Git:

```powershell
git clone https://github.com/totito19/Proyecto-IMSJ.git
cd Proyecto-IMSJ/backend
```

Sin Git:

1. descomprimir el proyecto conservando la estructura;
2. abrir una terminal;
3. ingresar a `Proyecto-IMSJ/backend`.

Comprobar que existan:

```text
Proyecto-IMSJ/
├── backend/compose.yaml
├── backend/Dockerfile
├── frontend-publico/
└── frontend-imsj/
```

## 4. Crear la configuración local

Estos pasos son para una instalación nueva. Si `.env` ya existe, conservarlo y revisarlo; no sobrescribirlo con la plantilla. La clave de Laravel también debe conservarse al retomar una instalación existente.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux, macOS, Git Bash o WSL:

```bash
cp .env.example .env
```

Abrir `.env` y revisar como mínimo:

```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_PORT=8000
FRONTEND_PORT=8080

DB_HOST=db
DB_PORT=3306
DB_DATABASE=imsj
DB_USERNAME=imsj
DB_PASSWORD=imsj_local
DB_ROOT_PASSWORD=imsj_root_local
```

En una instalación compartida o publicada, sustituir las contraseñas por
valores únicos y robustos. No subir `.env` a Git. `DB_HOST` debe permanecer como
`db`, nombre del servicio en la red interna.

Si 8000 u 8080 están ocupados, modificar `APP_PORT`, `FRONTEND_PORT` y, si
corresponde, `APP_URL` antes de iniciar.

**IA — Observación:** ambos `js/api.js` fijan `http://localhost:8000/api`. Si la API cambia de puerto, las interfaces no se adaptan por cambiar `.env`. Elegir la configuración y su modificación en código requiere una tarea posterior autorizada. Para completar esta guía sin modificar el software, usar los puertos locales predeterminados cuando estén disponibles.

## 5. Método automático para Windows

Desde `backend`, ejecutar:

```powershell
.\iniciar.bat
```

El script inicia Docker Desktop si hace falta, construye los servicios, genera
la clave de Laravel, aplica migraciones y carga datos iniciales cuando la base
es nueva. Si muestra `Sistema iniciado correctamente`, verificar la sección 7.

## 6. Método manual multiplataforma

### Paso 1: validar la definición

```powershell
docker compose config --quiet
```

Si no hay errores, la sintaxis y las variables de Compose son válidas.

### Paso 2: construir e iniciar

```powershell
docker compose up -d --build
```

En la primera ejecución se descargan Nginx, PHP, Composer y MySQL.

### Paso 3: generar la clave de Laravel

```powershell
docker compose exec -T app php artisan key:generate --force
```

El comando escribe `APP_KEY` en el `.env` del anfitrión.

Generarla únicamente al preparar la nueva instalación sin clave. No regenerar una clave existente como parte de un reinicio habitual.

### Paso 4: crear el esquema

```powershell
docker compose exec -T app php artisan migrate --force
```

Las migraciones crean tablas y restricciones. `app` se conecta a `db` por la
red privada.

### Paso 5: cargar datos iniciales

Ejecutar una sola vez sobre una base nueva:

```powershell
docker compose exec -T app php artisan db:seed --force
```

No repetir indiscriminadamente en una base con datos: el resultado depende de
cómo cada seeder trate los registros existentes.

## 7. Verificar la reconstrucción

### 7.1 Contenedores

```powershell
docker compose ps
```

Deben aparecer `frontend`, `app` y `db`. La base debe indicar estado saludable
después de inicializarse.

### 7.2 API

En PowerShell:

```powershell
Invoke-RestMethod http://localhost:8000/api/health
```

En Linux, macOS, Git Bash o WSL:

```bash
curl http://localhost:8000/api/health
```

Respuesta esperada:

```json
{"status":"ok"}
```

Si cambió `APP_PORT`, reemplazar 8000 por el puerto elegido.

### 7.3 Interfaces web

Abrir:

- `http://localhost:8080/frontend-publico/`
- `http://localhost:8080/frontend-imsj/`

Si cambió `FRONTEND_PORT`, reemplazar 8080.

### 7.4 Migraciones

```powershell
docker compose exec -T app php artisan migrate:status
```

Las migraciones necesarias deben aparecer como ejecutadas.

## 8. Operación posterior

Detener sin borrar datos:

```powershell
docker compose down
```

Volver a iniciar sin reconstruir:

```powershell
docker compose up -d
```

En Windows también se pueden usar:

```powershell
.\detener.bat
.\iniciar.bat
```

Los volúmenes `db_data` y `app_uploads` se conservan.

Si cambia el backend o el `Dockerfile`, reconstruir:

```powershell
docker compose up -d --build app
```

Los cambios de frontend no requieren reconstruir Nginx porque sus directorios
se montan desde el anfitrión.

## 9. Problemas frecuentes

### Docker no responde

Síntoma: `docker info` no puede conectarse al motor.

Solución: iniciar Docker Desktop en Windows o el servicio Docker en Linux y
reintentar cuando esté listo.

### Puerto ocupado

Síntoma: Compose no puede publicar 8000 u 8080.

Solución: cambiar `APP_PORT` o `FRONTEND_PORT` en `.env` y repetir
`docker compose up -d`.

### La API no inicia

```powershell
docker compose logs --tail=200 app
```

Si falta la clave:

```powershell
docker compose exec -T app php artisan key:generate --force
```

### MySQL aún no está disponible

```powershell
docker compose ps db
docker compose logs --tail=200 db
```

Esperar a que aparezca saludable. El primer inicio puede tardar mientras MySQL
crea sus archivos internos.

### Error de conexión a la base

Comprobar `DB_HOST=db`, credenciales y salud de `db`. Luego limpiar la
configuración en caché:

```powershell
docker compose exec -T app php artisan config:clear
```

### Los frontends muestran 404

Comprobar que se obtuvo el repositorio completo y que `frontend-publico` y
`frontend-imsj` están al mismo nivel que `backend`. Usar las rutas completas de
la sección 7.3.

### El backend conserva código anterior

El código se copia en la imagen. Reconstruir:

```powershell
docker compose up -d --build app
```

## 10. Advertencias sobre datos

- No usar `docker compose down -v` en la operación normal: elimina volúmenes.
- Un volumen persistente no es una copia de respaldo externa.
- El respaldo completo y la restauración probada pertenecen a la entrega final.
- Antes de limpiar el entorno, respaldar MySQL y `app_uploads` por separado.

## 11. Lista de aceptación

- [ ] Docker y Compose responden.
- [ ] `docker compose config --quiet` no informa errores.
- [ ] `frontend`, `app` y `db` están iniciados.
- [ ] `db` aparece saludable.
- [ ] `GET /api/health` responde `{"status":"ok"}`.
- [ ] el frontend público abre.
- [ ] el dashboard IMSJ abre.
- [ ] las migraciones aparecen ejecutadas.
- [ ] detener y volver a iniciar conserva base y archivos.

## 12. Evidencia pendiente

| Campo | Registro |
|---|---|
| Versión / commit reconstruido | No registrado. |
| Responsable y fecha efectiva | No registrados. |
| Sistema anfitrión / versiones de Docker | No registrados. |
| Salida de Compose, arranque y migraciones | No adjunta. |
| Comprobación de base y archivos persistentes | No adjunta. |
| Restauración desde respaldo | Pendiente de entrega final; la persistencia de volúmenes no la prueba. |

La verificación de salud por sí sola no prueba conexión a MySQL ni carga de datos. Registrar el resultado de cada paso y vincularlo a [verificación](../verificacion.md).

## Adenda tecnológica CC-05 — 02/10/2026

La decisión del grupo sustituye Laravel por PHP sin framework, con capas y PDO/MySQL según la API completa indicada. Los manifiestos, scripts y comandos Artisan de este documento describen la versión Laravel todavía presente; no son procedimientos finales del destino. Su sustitución se documentará con los archivos y comandos realmente implementados.

Se conserva como base la topología Nginx/Apache-PHP/MySQL, PHP 8.5, MySQL 8.4, puertos 8000/8080 y volúmenes persistentes. El cambio no define nuevo alojamiento ni nuevas medidas de rendimiento. La [transición de infraestructura](transicion_backend_vanilla.md) contiene correspondencia de variables, trabajo de imagen/scripts, instalación/actualización SQL, almacenamiento y criterios de reconstrucción/restauración pendientes. La letra indica Laravel; la aceptación académica del cambio aún debe registrarse.
