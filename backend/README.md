# Backend IMSJ en PHP nativo

Reescrito desde cero el 05/10/2026 por solicitud del grupo, con el recorrido explícito de [api-simple](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple). PHP 8.5, PDO y MySQL 8.4; sin paquetes externos. La demo del 13/10 sumó tres rutas de consultas y alcanzó 45 endpoints. La cancelación del 20/10 amplía el contrato vigente a 46. **Estado documental al 21/10/2026: CC-01–CC-05, Listos.** El crédito y la responsabilidad del proyecto corresponden a Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales.

## Organización y recorrido

```text
backend/
├── public/             index.php y .htaccess: entrada HTTP y rutas
├── config.php          configuración mediante entorno o .env
├── core/               Database.php, Response.php y Auth.php
├── controllers/        Auth, Noticia, Material, Pregunta, Prueba, Reserva, Usuario, Consulta
├── services/           un servicio por cada uno de esos ocho módulos
├── repositories/       un repositorio por módulo, con SQL parametrizado
├── models/             datos de dominio, entrada HTTP y archivos
├── database.sql        esquema no destructivo, sin cuentas automáticas
├── composer.json       requisitos PHP/extensiones y comprobación de sintaxis
├── Dockerfile
├── compose.yaml
├── apache.conf         alias de portal/panel, backend privado fuera de la web
├── scripts/            primera cuenta y comprobación de sintaxis
├── tests/              suite de integración HTTP/MySQL
└── storage/            archivos y contador de intentos, fuera de la raíz web
```

`HTTP → public/index.php → controlador → servicio → repositorio → PDO/MySQL → modelo → Response`. Cada controlador exige el usuario/rol correspondiente. Franjas y agenda se agrupan en Reserva; historial en Usuario. Los comentarios del código explican validación, transacciones, tokens y limpieza de archivos.

El [contrato de API](../docs_auxiliares/backend/api.md) complementa esta guía. Las referencias y los informes técnicos se consultan en [documentación auxiliar](../docs_auxiliares/README.md).

## Instalación nueva con Docker

Requiere Docker con Compose y contenedores Linux. En Windows se puede usar [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/); los BAT utilizan PowerShell incluido en Windows, sin instalar PHP, Composer, MySQL o Python en el equipo. Las rutas se deducen de la carpeta del proyecto y de la instalación de Docker, sin un nombre de usuario o disco particular.

1. Abrir **`iniciar.bat`** con doble clic. Detecta Docker en el PATH o en sus instalaciones habituales y abre Docker Desktop si el motor está apagado, con espera limitada a tres minutos. Genera `.env` desde la plantilla y claves aleatorias locales cuando no hay una base previa; no requiere escribirlas ni las muestra en la consola. Conserva las claves reales de una configuración existente. Si falta configuración pero ya existe el volumen de base, exige recuperar sus claves originales.
2. El inicio comprueba la configuración, utiliza `APP_PORT=8000` o busca uno libre entre los cien siguientes si está ocupado por otro programa, y guarda el puerto elegido. Construye e inicia **`app` (Apache/PHP) y `db` (MySQL)**; retira el antiguo contenedor Nginx del mismo proyecto sin borrar volúmenes. Antes de iniciar Apache ejecuta `scripts/migrar.php`, una migración idempotente que agrega a instalaciones existentes el rol Directora, los estados de aprobación, la bandeja de consultas y el campo de imagen del simulador sin borrar registros. Espera al healthcheck de API/base/portal y comprueba acceso desde Windows antes de abrir el portal en el navegador predeterminado. MySQL importa `database.sql` solo cuando el volumen está vacío; no carga usuarios o contenido de demostración. La primera ejecución necesita conexión para descargar las imágenes.
3. Crear la primera cuenta de personal con la herramienta CLI. Definir estas variables en la terminal con datos elegidos por el equipo; la contraseña no se imprime:

```powershell
$env:INITIAL_ADMIN_CEDULA = '[]'
$env:INITIAL_ADMIN_NOMBRE = '[]'
$env:INITIAL_ADMIN_PASSWORD = '[]'
docker compose exec -e INITIAL_ADMIN_CEDULA -e INITIAL_ADMIN_NOMBRE -e INITIAL_ADMIN_PASSWORD app php scripts/crear_admin.php
Remove-Item Env:INITIAL_ADMIN_PASSWORD
```

La herramienta se niega a crear la cuenta si ya hay personal activo. Las siguientes cuentas se crean desde el panel con el comportamiento previo de `clave_inicial=imsj1234`; el valor inicial se entrega en la respuesta de alta del panel.

4. Con el puerto por defecto: portal `http://localhost:8000/frontend-publico/`, panel `http://localhost:8000/frontend-imsj/` y API `http://localhost:8000/api/health`. El BAT muestra las direcciones con el puerto efectivo. `/` redirige al portal. `/api/health` comprueba PHP; el healthcheck interno de Compose comprueba también esquema MySQL y portal. La primera cuenta sigue siendo una acción explícita del equipo.

Apache sirve los frontends mediante alias de solo lectura, además de la API; no hay Nginx ni servicio `frontend`. Los frontends usan la API del mismo origen, por lo que funcionan con el puerto elegido sin editar JavaScript. El alias de ingreso acepta `login.html` y apunta al archivo histórico `Login.html`, respetando mayúsculas en Linux. Se conservan `db_data`, `app_uploads` y `cache`; usar el mismo proyecto Compose al actualizar. `detener.bat` detiene sin borrar datos.

Los contenedores se ejecutan con hardening activo desde el `compose.yaml` normal. `app` usa `www-data`, raíz de solo lectura, `no-new-privileges`, descarta todas las capacidades y recupera únicamente `NET_BIND_SERVICE`; `db` usa `mysql`, raíz de solo lectura, `no-new-privileges` y no conserva capacidades. Los volúmenes de datos y los `tmpfs` declarados son las únicas rutas de escritura necesarias. El informe y las capturas de revalidación están en `docs/electiva_ciberseguridad/informe_hardening_contenedores_imsj.pdf`.

La configuración local enlaza Apache exclusivamente a `127.0.0.1` y utiliza HTTP para la demostración. Un despliegue real debe terminar el tráfico externo en HTTPS con TLS 1.2 o superior, certificado válido y renovación automática; publicar solo 443/TCP, mantener aplicación y MySQL en red privada, redirigir HTTP a HTTPS y ajustar `APP_URL` y `FRONTEND_ORIGIN` al dominio definitivo. HSTS se habilita únicamente después de comprobar HTTPS en todo el dominio.

Para iniciar manualmente en Windows, Linux o macOS: copiar `.env.example` a `.env`, completar las dos claves y ejecutar desde `backend`:

```text
docker compose up -d --build --remove-orphans --wait --wait-timeout 180
```

Abrir la dirección correspondiente a `APP_PORT`. `APP_URL` y `FRONTEND_ORIGIN` se deducen de ese puerto cuando no se definen explícitamente. Un dominio propio requiere sus valores correspondientes; el BAT ajusta únicamente las URL locales.

### Si los BAT no arrancan o se cierran

Ambos dejan el resultado visible al abrirlos con doble clic. En terminal: `iniciar.bat --sin-pausa`, `detener.bat --sin-pausa`; para automatización se puede añadir `--sin-navegador` al inicio. Devuelven 0 al completar la operación y 1 si falla. Delegan en `scripts/docker.ps1` con una política de ejecución limitada a ese proceso, sin modificar la política del sistema.

- **Base previa y claves ausentes/de ejemplo:** recuperar `DB_PASSWORD` y `DB_ROOT_PASSWORD` originales en `.env`. El inicio no cambia credenciales de una base previa ni borra su volumen para resolver este error.
- **No se encuentra Docker:** comprobar su instalación. Los BAT admiten `%LOCALAPPDATA%\Programs\DockerDesktop` y `%ProgramFiles%\Docker\Docker`; si se instaló en otra ubicación, añadir su carpeta `resources\bin` al PATH y abrir una terminal nueva.
- **El motor no responde:** revisar Docker Desktop; un error de WSL, virtualización o de instalación requiere resolver su mensaje. El proyecto usa contenedores Linux. `detener.bat` informa si no puede conectarse y no abre el motor para detenerlo.
- **WSL no está instalado:** completar el requisito de Windows siguiendo la [guía oficial](https://learn.microsoft.com/en-us/windows/wsl/install), que puede requerir reinicio. El BAT no instala componentes del sistema ni reinicia el equipo automáticamente.
- **Falla la construcción o el inicio:** revisar el error que permanece en la ventana. Desde `backend`, `docker compose ps -a` muestra el estado y `docker compose logs --tail 80 app db` muestra los errores de los servicios. Si Docker no está en el PATH, usar la ruta completa de `docker.exe` entre comillas.

La configuración expandida se procesa internamente y no se imprime, porque contiene claves. El inicio usa [`compose up --wait`](https://docs.docker.com/reference/cli/docker/compose/up/) y un healthcheck de solo lectura para abrir la página cuando responde. Los BAT no crean cuentas, no importan SQL sobre bases existentes ni borran volúmenes.

## Ejecución local sin Docker

PHP 8.5 con `pdo_mysql`, `mbstring` y `fileinfo`, MySQL 8.4 y una base seleccionada. Completar `.env` con `DB_HOST=127.0.0.1`, puerto y usuario real. Importar `database.sql` en esa base usando el cliente MySQL. Si es nueva, completar las variables `INITIAL_ADMIN_*` y ejecutar `php scripts/crear_admin.php`. Luego:

```powershell
php -d upload_max_filesize=10M -d post_max_size=24M -S 127.0.0.1:8000 -t public public/index.php
```

Este servidor es para desarrollo. Servir Apache con `DocumentRoot` en `public/` y `mod_rewrite` al desplegar. PHP y SQL de las demás carpetas no son públicos. Composer no es necesario para arrancar: el manifiesto declara extensiones y `composer check` equivale a `php scripts/verificar.php`.

## Actualización de una instalación con datos

No borrar volúmenes ni importar un esquema histórico que elimine tablas. Respaldar base y `storage/app/public`, conservar `.env`, comprobar nombres de volumen y ensayar la transición sobre una copia. `database.sql` crea tablas que falten y `scripts/migrar.php` aplica únicamente los cambios incrementales requeridos por esta demo. La migración no borra registros; una actualización de producción igualmente debe ensayarse sobre una copia y contar con respaldo.

Los usuarios, hashes bcrypt, identificadores, relaciones, historial y rutas relativas de archivos se conservan. La tabla técnica de sesiones anterior puede quedar en esa base como antecedente, sin consultas desde el nuevo backend. Las sesiones anteriores a la reescritura dejan de ser válidas: volver a iniciar sesión. La migración automática actualiza solo el esquema y convierte el estado histórico `NO_PUBLICADO` de noticias, materiales y preguntas frecuentes a `BORRADOR`.

## Contrato y seguridad implementada

- Bearer opaco `id|secreto`, secreto aleatorio de 32 bytes, hash SHA-256 en MySQL, ocho horas de vigencia. Iniciar sesión revoca sesiones previas; cerrar sesión y desactivar personal revocan tokens. Cada petición comprueba cuenta activa y rol almacenados en la base.
- Respuestas conservadas: `usuario`, `noticias`, `noticia`, `materiales`, `material`, `preguntas`, `pregunta`, `franjas`, `franja`, `reservas`, `reserva`, `acciones`, `usuarios`; consultas agrega `consultas` y `consulta`. Sin envoltorio `datos`. Validación: `message` y `errors`. Eliminaciones/logout: 204 sin cuerpo.
- Cinco intentos por minuto por dirección IP y operación para login/registro, con bloqueo de archivo compartido. Las instancias deben compartir `CACHE_ROOT`; no se interpretan cabeceras de proxy como identidad del cliente.
- Noticias: portada y hasta cinco imágenes JPG/PNG/WEBP, 2048 KB cada una; hasta cinco enlaces. Noticias, materiales y preguntas frecuentes usan el mismo flujo: el personal prepara y envía a revisión, solo Directora aprueba y la publicación es una acción posterior. Materiales: PDF 10240 KB, imagen 5120 KB o video por URL HTTP/HTTPS. Las preguntas del simulador admiten una imagen opcional JPG/PNG/WEBP de hasta 2048 KB. MIME y contenido se verifican; nombres aleatorios, fuera de `public/`.
- Edición acepta PUT JSON/multipart y POST multipart con `_method=PUT`, como envía el panel actual. El límite global de formulario es 24 MB; con un archivo por material y hasta seis imágenes de noticia alcanza para los límites del contrato.
- Reservas: transacción con bloqueo de franja, fecha válida, propiedad, duplicación y capacidad. Auditoría administrativa se confirma en la misma transacción que los datos; un fallo revierte la operación y limpia archivos nuevos.

La versión incorpora el simulador, consultas, Directora, flujo de aprobación y gráficos del test. Categorías, respuestas/notificaciones para consultas y costo urgente permanecen fuera del alcance implementado de CC-01–CC-05. La cancelación académica se añadió posteriormente. Agenda y reservas continúan como alcance académico.

## Verificación

`php scripts/verificar.php` comprueba sintaxis. La suite `tests/integracion.py` requiere Python 3 estándar y cliente MySQL únicamente para pruebas. Necesita dos procesos PHP contra **la misma base vacía** cuyo nombre empiece por `imsj_test_`; se niega a trabajar sobre una base con tablas. Definir `DB_*`, `IMSJ_TEST_MYSQL`, `IMSJ_TEST_URL` y `IMSJ_TEST_URL_2`; iniciar los dos servidores con el entorno de prueba y ejecutar `python tests/integracion.py`. No apuntarla a datos del equipo. El resultado conserva datos de prueba para inspección.

### Auditoría Bash de seguridad de la API

`tests/security_api.sh` ejecuta comprobaciones HTTP reproducibles contra una instancia local y autorizada. Sin credenciales revisa disponibilidad, cabeceras, autenticación obligatoria, token inválido, JSON mal formado, métodos/rutas, CORS, archivos privados y entradas SQLi/XSS controladas.

Cuando la API se consulta por `127.0.0.1`, el script usa automáticamente el origen local equivalente `http://localhost:PUERTO`, que coincide con la configuración predeterminada de Compose. Una instalación diferente puede indicar el origen exacto mediante `IMSJ_SECURITY_ALLOWED_ORIGIN`.

Ejecución básica desde Git Bash, WSL o Linux:

```bash
IMSJ_SECURITY_URL=http://127.0.0.1:8000 \
  bash tests/security_api.sh
```

Las comprobaciones autenticadas aceptan una cuenta de prueba de cualquier rol y verifican el acceso que le corresponde. Una cuenta `PUBLICO_GENERAL` permite comprobar el rechazo `403` del panel; una cuenta `PERSONAL_IMSJ` habilita además la carga maliciosa controlada y la prueba de aprobación exclusiva de Directora. El login revoca sesiones anteriores de esa cuenta y el script hace logout al terminar:

```bash
IMSJ_SECURITY_URL=http://127.0.0.1:8000 \
IMSJ_SECURITY_STAFF_CEDULA=CEDULA_DE_PRUEBA \
IMSJ_SECURITY_STAFF_PASSWORD=CLAVE_DE_PRUEBA \
IMSJ_SECURITY_ALLOW_WRITES=1 \
IMSJ_SECURITY_REPORT=../output/security-api.txt \
  bash tests/security_api.sh
```

`IMSJ_SECURITY_ALLOW_WRITES=1` crea y elimina una FAQ descartable para comprobar que PERSONAL_IMSJ recibe `403` al intentar aprobar. `IMSJ_SECURITY_RATE_LIMIT=1` verifica el `429`, pero bloquea el login de la IP durante un minuto. Un token expirado preparado en la base descartable puede pasarse mediante `IMSJ_SECURITY_EXPIRED_TOKEN`. Para exigir que ninguna prueba quede omitida se usa `IMSJ_SECURITY_REQUIRE_FULL=1`. No guardar credenciales ni tokens en el repositorio ni ejecutar estas pruebas sobre datos reales.

La [evidencia](../docs_auxiliares/evidencias/verificacion.md) registra resultados HTTP/MySQL y límites. Para la versión del 13/10/2026 se comprobó un arranque Docker aislado, 41 verificaciones HTTP de CC-02–CC-04 y un recorrido visual del portal y del panel.

## Comportamiento incorporado el 20/10

`DELETE /api/reservas/{id}` permite al ciudadano cancelar su reserva. La cuenta se obtiene del token y la eliminación exige coincidencia de reserva y propietario; responde 204 al eliminar y 404 si no existe una reserva propia con ese ID. Personal no puede usar esta operación ciudadana. Al eliminar la fila se libera el cupo y no queda un estado de cancelación.

Los listados de franjas y reservas excluyen fechas anteriores a hoy también en el panel. La agenda abre inicialmente en vista mensual. El cierre de sesión administrativo revoca el token y vuelve al ingreso de personal. La suite integral del 21/10 incluye esos casos y registra 192 comprobaciones sobre los 46 endpoints.

## Mapa de lectura para mantenimiento

Una operación empieza en `public/index.php`, pasa por el controlador del módulo y su servicio y termina en consultas del repositorio. Para modificar una regla se debe revisar además el modelo de salida, el consumidor JavaScript y el escenario de integración afectado. La [arquitectura](../docs/administracion_ssoo/arquitectura_propuesta.md), la [justificación de clases](../docs/programacion_full_stack/Justificación%20de%20clases,%20atributos%20y%20métodos.md) y el [contrato](../docs_auxiliares/backend/api.md) desarrollan estas relaciones.

## Verificación del 21/10/2026

La suite integral registró 192 comprobaciones, 60 peticiones distintas y 46 endpoints. La auditoría Bash completa registró 43 aprobadas, 0 fallidas y 0 omitidas. El entorno Docker utiliza usuarios de servicio, raíz de solo lectura, `no-new-privileges` y capacidades reducidas.

| Dato | Valor |
|---|---|
| Dominio institucional | [] |
| HTTPS | [] |
| Política institucional de cuentas | [] |
| Responsable operativo | [] |
| Respaldo institucional | [] |
