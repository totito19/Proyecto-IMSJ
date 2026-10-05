# Backend IMSJ en PHP nativo

Reescrito desde cero el 05/10/2026 por solicitud del grupo, con el recorrido explícito de [api-simple](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple). PHP 8.5, PDO y MySQL 8.4; sin paquetes externos. Los 42 endpoints conservan rutas, claves JSON y formularios de los frontends. El crédito y la responsabilidad del proyecto corresponden a Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. Implementación y documentación preparadas con apoyo externo de IA; revisión interna de Juan Robaina pendiente.

## Organización y recorrido

```text
backend/
├── public/             index.php y .htaccess: entrada HTTP y rutas
├── config.php          configuración mediante entorno o .env
├── core/               Database.php, Response.php y Auth.php
├── controllers/        Auth, Noticia, Material, Pregunta, Prueba, Reserva, Usuario
├── services/           un servicio por cada uno de esos siete módulos
├── repositories/       un repositorio por módulo, con SQL parametrizado
├── models/             datos de dominio, entrada HTTP y archivos
├── database.sql        esquema no destructivo, sin cuentas automáticas
├── composer.json       requisitos PHP/extensiones y comprobación de sintaxis
├── Dockerfile
├── compose.yaml
├── scripts/            primera cuenta y comprobación de sintaxis
├── tests/              suite de integración HTTP/MySQL
└── storage/            archivos y contador de intentos, fuera de la raíz web
```

`HTTP → public/index.php → controlador → servicio → repositorio → PDO/MySQL → modelo → Response`. Cada controlador exige el usuario/rol correspondiente. Franjas y agenda se agrupan en Reserva; historial en Usuario. Los comentarios del código explican validación, transacciones, tokens y limpieza de archivos.

El [flujo de cada endpoint](../docs/flujo_endpoints_backend.md), su PDF y el [contrato de API](../docs/api.md) completan esta guía.

## Instalación nueva con Docker

1. Desde esta carpeta, copiar `.env.example` a `.env` **solo si falta** y completar `DB_PASSWORD` y `DB_ROOT_PASSWORD` con valores propios. Mantener `APP_PORT=8000` y `FRONTEND_PORT=8080` mientras los frontends conserven sus direcciones actuales.
2. Ejecutar `docker compose up -d --build` o `iniciar.bat`. MySQL importa `database.sql` únicamente cuando su volumen está vacío. El esquema no carga noticias, reservas ni usuarios de demostración.
3. Crear la primera cuenta de personal con la herramienta CLI. Definir estas variables en la terminal con datos elegidos por el equipo; la contraseña no se imprime:

```powershell
$env:INITIAL_ADMIN_CEDULA = '<cedula de 7 u 8 digitos>'
$env:INITIAL_ADMIN_NOMBRE = '<nombre del integrante autorizado>'
$env:INITIAL_ADMIN_PASSWORD = '<clave elegida de 6 a 72 bytes>'
docker compose exec -e INITIAL_ADMIN_CEDULA -e INITIAL_ADMIN_NOMBRE -e INITIAL_ADMIN_PASSWORD app php scripts/crear_admin.php
Remove-Item Env:INITIAL_ADMIN_PASSWORD
```

La herramienta se niega a crear la cuenta si ya hay personal activo. Las siguientes cuentas se crean desde el panel con el comportamiento previo de `clave_inicial=imsj1234`; su política institucional definitiva sigue pendiente y no se agrega un endpoint de cambio de contraseña en esta reescritura.

4. Consultar `http://localhost:8000/api/health`, `http://localhost:8080/frontend-publico/` y `http://localhost:8080/frontend-imsj/`. La salud solo comprueba que PHP responde; comprobar `/login` y un listado para verificar también MySQL.

Se conservan los servicios `frontend`, `app`, `db` y los volúmenes `db_data`, `app_uploads`; se añade `cache` para coordinar intentos entre procesos. Usar el mismo proyecto Compose al actualizar. `docker compose stop` detiene sin borrar datos. La configuración de estos contenedores es local; dominio y HTTPS institucional siguen pendientes.

## Ejecución local sin Docker

PHP 8.5 con `pdo_mysql`, `mbstring` y `fileinfo`, MySQL 8.4 y una base seleccionada. Completar `.env` con `DB_HOST=127.0.0.1`, puerto y usuario real. Importar `database.sql` en esa base usando el cliente MySQL. Si es nueva, completar las variables `INITIAL_ADMIN_*` y ejecutar `php scripts/crear_admin.php`. Luego:

```powershell
php -d upload_max_filesize=10M -d post_max_size=24M -S 127.0.0.1:8000 -t public public/index.php
```

Este servidor es para desarrollo. Servir Apache con `DocumentRoot` en `public/` y `mod_rewrite` al desplegar. PHP y SQL de las demás carpetas no son públicos. Composer no es necesario para arrancar: el manifiesto declara extensiones y `composer check` equivale a `php scripts/verificar.php`.

## Actualización de una instalación con datos

No borrar volúmenes ni importar un esquema histórico que elimine tablas. Respaldar base y `storage/app/public`, conservar `.env`, comprobar nombres de volumen y ensayar la transición sobre una copia. `database.sql` crea tablas que falten; no corrige automáticamente un esquema divergente. La estructura de negocio mantiene las diez tablas originales y añade `auth_tokens` para sesiones nativas.

Importar el esquema en la base existente después de comprobar su compatibilidad; los usuarios, hashes bcrypt, identificadores, relaciones, historial y rutas relativas de archivos se conservan. La tabla técnica de sesiones anterior puede quedar en esa base como antecedente, sin consultas desde el nuevo backend. Las sesiones anteriores dejan de ser válidas: volver a iniciar sesión. No se ejecuta ninguna transformación automática sobre datos institucionales en esta intervención.

## Contrato y seguridad implementada

- Bearer opaco `id|secreto`, secreto aleatorio de 32 bytes, hash SHA-256 en MySQL, ocho horas de vigencia. Iniciar sesión revoca sesiones previas; cerrar sesión y desactivar personal revocan tokens. Cada petición comprueba cuenta activa y rol almacenados en la base.
- Respuestas conservadas: `usuario`, `noticias`, `noticia`, `materiales`, `material`, `preguntas`, `pregunta`, `franjas`, `franja`, `reservas`, `reserva`, `acciones`, `usuarios`; sin envoltorio `datos`. Validación: `message` y `errors`. Eliminaciones/logout: 204 sin cuerpo.
- Cinco intentos por minuto por dirección IP y operación para login/registro, con bloqueo de archivo compartido. Las instancias deben compartir `CACHE_ROOT`; no se interpretan cabeceras de proxy como identidad del cliente.
- Noticias: portada y hasta cinco imágenes JPG/PNG/WEBP, 2048 KB cada una; hasta cinco enlaces. Materiales: PDF 10240 KB, imagen 5120 KB o video por URL HTTP/HTTPS. MIME y contenido se verifican; nombres aleatorios, fuera de `public/`.
- Edición acepta PUT JSON/multipart y POST multipart con `_method=PUT`, como envía el panel actual. El límite global de formulario es 24 MB; con un archivo por material y hasta seis imágenes de noticia alcanza para los límites del contrato.
- Reservas: transacción con bloqueo de franja, fecha válida, propiedad, duplicación y capacidad. Auditoría administrativa se confirma en la misma transacción que los datos; un fallo revierte la operación y limpia archivos nuevos.

No incorpora consultas, Directora, categorías o adjuntos del test, ni cierra CC-01 a CC-04. Agenda y reservas continúan como alcance académico.

## Verificación

`php scripts/verificar.php` comprueba sintaxis. La suite `tests/integracion.py` requiere Python 3 estándar y cliente MySQL únicamente para pruebas. Necesita dos procesos PHP contra **la misma base vacía** cuyo nombre empiece por `imsj_test_`; se niega a trabajar sobre una base con tablas. Definir `DB_*`, `IMSJ_TEST_MYSQL`, `IMSJ_TEST_URL` y `IMSJ_TEST_URL_2`; iniciar los dos servidores con el entorno de prueba y ejecutar `python tests/integracion.py`. No apuntarla a datos del equipo. El resultado conserva datos de prueba para inspección.

La [evidencia](../docs/verificacion.md) registra resultados HTTP/MySQL y límites. Docker/Apache y recorrido visual completo de ambos frontends requieren comprobación del equipo; no se presentan como ejecutados.
