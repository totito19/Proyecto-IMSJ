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

El [contrato de API](../docs_auxiliares/backend/api.md) complementa esta guía. Los resultados técnicos se consultan en el [registro de verificación](../docs_auxiliares/evidencias/verificacion.md).

## Instalación nueva con Docker

El entorno de entrega es Ubuntu Server 26.04 LTS con Docker Engine y el complemento Docker Compose. Desde la carpeta `backend`:

```bash
cp .env.example .env
nano .env
chmod 600 .env
docker compose config --quiet
docker compose up -d --build --remove-orphans --wait --wait-timeout 180
docker compose ps
```

En `.env` se definen claves seguras, la IP del servidor y el puerto de publicación. La primera ejecución necesita conexión para descargar las imágenes. MySQL importa `database.sql` únicamente cuando el volumen está vacío y la aplicación ejecuta las migraciones necesarias sin borrar registros.

Para crear la primera cuenta de personal:

```bash
read -r -p 'Cédula de la primera cuenta: ' INITIAL_ADMIN_CEDULA
read -r -p 'Nombre de la primera cuenta: ' INITIAL_ADMIN_NOMBRE
read -r -s -p 'Contraseña de la primera cuenta: ' INITIAL_ADMIN_PASSWORD
echo
export INITIAL_ADMIN_CEDULA INITIAL_ADMIN_NOMBRE INITIAL_ADMIN_PASSWORD
docker compose exec \
  -e INITIAL_ADMIN_CEDULA \
  -e INITIAL_ADMIN_NOMBRE \
  -e INITIAL_ADMIN_PASSWORD \
  app php scripts/crear_admin.php
unset INITIAL_ADMIN_PASSWORD
```

La herramienta se niega a crear la cuenta si ya existe personal activo. Las cuentas siguientes se crean desde el panel administrativo.

Con el puerto predeterminado, el portal está en `http://IP_SERVIDOR:8000/frontend-publico/`, el panel en `http://IP_SERVIDOR:8000/frontend-imsj/` y la comprobación de salud en `http://IP_SERVIDOR:8000/api/health`. Para detener los servicios sin borrar datos:

```bash
docker compose down
```

Apache sirve los dos frontends y la API. MySQL permanece en la red interna de Compose. Los volúmenes `db_data`, `app_uploads` y `cache` conservan la base, los adjuntos y los datos técnicos.

Los contenedores se ejecutan con hardening activo desde el `compose.yaml` normal. `app` usa `www-data`, raíz de solo lectura, `no-new-privileges`, descarta todas las capacidades y recupera únicamente `NET_BIND_SERVICE`; `db` usa `mysql`, raíz de solo lectura, `no-new-privileges` y no conserva capacidades. Los volúmenes de datos y los `tmpfs` declarados son las únicas rutas de escritura necesarias. El informe y las capturas de revalidación están en `docs/electiva_ciberseguridad/informe_hardening_contenedores_imsj.pdf`.

La instalación en red controlada publica Apache en la dirección y el puerto definidos mediante `APP_BIND` y `APP_PORT`; MySQL permanece en la red interna. Para una publicación institucional se requiere HTTPS con certificado válido, renovación automática, redirección desde HTTP y valores definitivos de `APP_URL` y `FRONTEND_ORIGIN`.

### Solución de problemas

- **Base previa y claves ausentes/de ejemplo:** recuperar `DB_PASSWORD` y `DB_ROOT_PASSWORD` originales en `.env`. El inicio no cambia credenciales de una base previa ni borra su volumen para resolver este error.
- **Docker no está disponible:** comprobar `docker --version`, `docker compose version` y el estado del servicio con `sudo systemctl status docker`.
- **Falla la construcción o el inicio:** ejecutar `docker compose ps -a` y `docker compose logs --tail 80 app db` desde `backend`.
- **El portal no responde desde otro equipo:** comprobar `APP_BIND`, `APP_PORT`, la IP definida en `APP_URL` y `FRONTEND_ORIGIN`, y la regla correspondiente de UFW.
- **MySQL no queda saludable:** revisar las claves de `.env` y los registros con `docker compose logs --tail 80 db`.

El [procedimiento de reconstrucción](../docs/administracion_ssoo/reconstruccion-infraestructura.md) contiene la instalación completa del servidor, Docker, firewall, acceso remoto, backup y restauración.

## Ejecución local sin Docker

PHP 8.5 con `pdo_mysql`, `mbstring` y `fileinfo`, MySQL 8.4 y una base seleccionada. Completar `.env` con `DB_HOST=127.0.0.1`, puerto y usuario real. Importar `database.sql` en esa base usando el cliente MySQL. Si es nueva, completar las variables `INITIAL_ADMIN_*` y ejecutar `php scripts/crear_admin.php`. Luego:

```bash
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

La versión incorpora el simulador, consultas, Directora, flujo de aprobación, gráficos del test, categorías de preguntas frecuentes, modalidades de renovación normal y urgente y cancelación ciudadana. Agenda y reservas forman parte del alcance entregado.

## Verificación

`php scripts/verificar.php` comprueba sintaxis. La suite `tests/integracion.py` requiere Python 3 estándar y cliente MySQL únicamente para pruebas. Necesita dos procesos PHP contra **la misma base vacía** cuyo nombre empiece por `imsj_test_`; se niega a trabajar sobre una base con tablas. Definir `DB_*`, `IMSJ_TEST_MYSQL`, `IMSJ_TEST_URL` y `IMSJ_TEST_URL_2`; iniciar los dos servidores con el entorno de prueba y ejecutar `python tests/integracion.py`. No apuntarla a datos del equipo. El resultado conserva datos de prueba para inspección.

### Auditoría Bash de seguridad de la API

`tests/security_api.sh` ejecuta comprobaciones HTTP reproducibles contra una instancia local y autorizada. Sin credenciales revisa disponibilidad, cabeceras, autenticación obligatoria, token inválido, JSON mal formado, métodos/rutas, CORS, archivos privados y entradas SQLi/XSS controladas.

Cuando la API se consulta por `127.0.0.1`, el script usa automáticamente el origen local equivalente `http://localhost:PUERTO`, que coincide con la configuración predeterminada de Compose. Una instalación diferente puede indicar el origen exacto mediante `IMSJ_SECURITY_ALLOWED_ORIGIN`.

Ejecución básica desde Ubuntu/Linux:

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
| Dominio institucional | Demostración en localhost; para producción se requiere dominio administrado por la Intendencia. |
| HTTPS | HTTP local; TLS y certificado válido requeridos antes de publicación institucional. |
| Política institucional de cuentas | Condición de operación: cuentas individuales, mínimo privilegio, alta autorizada y revocación al retirar acceso. |
| Responsable operativo | Equipo RC5 durante la entrega; administración posterior por la Intendencia de San José. |
| Respaldo institucional | Transferir SQL, adjuntos, configuración protegida y versión compatible; propuesta diaria y previa a cambios. |
