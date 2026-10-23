> **Antecedente del 02/10/2026:** el grupo cambió la referencia de implementación a api-simple el 05/10/2026. La [comparación vigente](referencia_api_simple.md) y el contrato de IMSJ prevalecen. El contenido siguiente documenta el estudio anterior, no la estructura actual.

---

# Análisis de la API de referencia para CC-05

**Fecha de consulta:** 02/10/2026
**Fuente indicada por el grupo:** [RodrigoCazard/api-ejemplo-utu — api-completa](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/main/api-completa).
**Revisión consultada:** `d6f61c999369b754d70bfa0621a154e9a630589a`.

Se leyeron los 38 archivos de `api-completa`, incluido `composer.lock`, y el README de la raíz. El estudio compara el recorrido de capas y el contrato de la referencia con IMSJ. La referencia fijada permite separar lo leído de futuras modificaciones de `main`.

## 1. Funcionamiento leído en los archivos

| Archivos de la referencia | Responsabilidad observada |
|---|---|
| `index.php`, `config.php`, `routes.php`, `.htaccess` | Carga, entorno, CORS, captura de errores, despacho y reescritura Apache. |
| `core/Router.php`, `Response.php`, `Database.php` | Enrutado propio, JSON y conexión PDO MySQL en UTF-8. |
| `core/AuthMiddleware.php`, `Token.php` | JWT HS256 mediante biblioteca; token en cookie `access_token`; comprobación de rol. |
| `core/RateLimiter.php` | Ventana deslizante Symfony: 60 peticiones/minuto por IP, con caché de filesystem. |
| `controllers/` y `validators/` | Lectura HTTP y comprobación de entradas de autenticación/productos. |
| `dtos/` | Entradas tipadas para registro, login, creación, actualización y venta. |
| `services/` | Casos de uso de autenticación y productos. |
| `repositories/`, `models/` | Consultas parametrizadas y objetos PHP con métodos de presentación. |
| `database.sql` | Dos tablas de ejemplo, usuarios/productos, base `utu_demo` y datos de demostración. |
| `compose.yaml`, `docker/php-apache/`, `.env*`, `.dockerignore`, `storage/.gitignore` | Entorno de ejemplo con PHP 8.3/Apache, MySQL 8.4, API 8002 y MySQL publicado en 3308 por defecto; preparación de dependencias y almacenamiento. |

El router recibe método y ruta; ejecuta controles y controlador. Este valida y crea DTO; el servicio aplica reglas y usa repositorios; PDO ejecuta SQL preparado. La respuesta termina la petición con JSON. Los archivos usan cargas explícitas `require_once`; no se configura PSR-4 en ese manifiesto.

## 2. Contrato del ejemplo frente a IMSJ

| Tema | API de ejemplo | IMSJ que debe migrarse |
|---|---|---|
| Dominio | Productos, stock y ventas. | Noticias, materiales, FAQ, historial, usuarios, simulacros y agenda. |
| Rutas de cuenta | POST `/registro`, `/login`, `/logout`; GET `/perfil`. | POST `/register`, `/login`, `/logout`; GET `/me`, con prefijo `/api`. |
| Campos de cuenta | `nombre`, `email`, `clave`; `usuarios.clave_hash`. | Cédula y contraseña; `usuarios.password`, nombres y roles existentes. |
| Roles | `admin` / `usuario`. | `PUBLICO_GENERAL`, `PERSONAL_IMSJ` y `DIRECTORA`; CC-03 Listo. |
| Token | JWT en cookie HttpOnly, SameSite=Lax; duración predeterminada 3600 s. | Token Bearer en `sessionStorage`; ocho horas, revocación de anteriores y logout. |
| Logout | Elimina cookie; ruta pública. | Ruta autenticada que revoca token actual en servidor. |
| Usuario activo / rol | El token conserva claims; el middleware no reconsulta la cuenta en cada petición. | Comprobar identidad y permisos actuales; preservar rechazo de cuentas desactivadas en las rutas que lo exigen. |
| JSON | Éxito `ok`, `mensaje`, `datos`; error `ok`, `mensaje`, `errores`. | Login raíz `token`/`expira_en`/`usuario`; recursos con claves propias (`noticias`, `materiales`, etc.); errores `message`/`errors`. |
| Actualización | PATCH de productos; respuesta de borrado JSON. | PUT de entidades, PATCH de estados; borrados/logout pueden devolver 204. |
| Parámetros | Único marcador `{id}` reconocido por Router. | `{usuario}`, `{noticia}`, `{material}`, `{pregunta}`, `{franja}` y rutas con sufijo `/estado`. |
| Archivos | CRUD de productos sin carga de materiales/noticias. | Multipart, validación, persistencia y URLs de imágenes/PDF; POST con `_method=PUT` en edición. |
| CORS | Origen único configurable, cookies, cabecera Content-Type; GET/POST/PATCH/DELETE/OPTIONS. | Apache sirve frontends y API en el mismo origen/puerto configurable; Bearer/Accept; también PUT y multipart. |
| Límites HTTP | 60/min por IP para todas las rutas, excepto OPTIONS. | Login/registro con límite de cinco intentos por minuto mediante caché compartida. |

## 3. Dependencias y requisitos reales

El ejemplo no utiliza Laravel, pero no carece de bibliotecas. El [manifiesto y su lock](https://github.com/RodrigoCazard/api-ejemplo-utu/blob/d6f61c999369b754d70bfa0621a154e9a630589a/api-completa/composer.json) declaran estas dependencias directas:

| Paquete | Restricción en manifiesto | Versión fijada en lock leído | Uso |
|---|---|---|---|
| `firebase/php-jwt` | `^7.1` | `v7.1.0` | Firma/verificación JWT; necesario solo si se adopta ese mecanismo. |
| `vlucas/phpdotenv` | `^5.6` | `v5.6.4` | Carga de configuración fuera del código. |
| `symfony/rate-limiter` | `7.4.*` | `v7.4.16` | Limitación de peticiones. |
| `symfony/cache` | `7.4.*` | `v7.4.17` | Almacenamiento del limitador. |

Los componentes Symfony 7.4 del lock requieren PHP >=8.2, aunque el manifiesto del ejemplo diga >=8.0. Su plataforma Composer y Docker utilizan 8.3. IMSJ declara PHP 8.5 en su Dockerfile actual: CC-05 no solicita cambiar esa versión ni MySQL 8.4. El manifiesto de IMSJ declara PHP y extensiones; la implementación utiliza carga explícita y utilidades nativas.

## 4. Diferencias de implementación

La adaptación utiliza las siguientes decisiones de implementación:

- La verificación JWT utiliza algoritmo HS256 fijado. Borrar la cookie no invalida una copia del token; el ejemplo no incluye revocación en servidor. IMSJ utiliza revocación de sesiones en servidor.
- El router original trata un método no coincidente como ruta inexistente. Debe documentarse y comprobarse la política HTTP final; no asumir códigos de error del framework solo por copiar el router.
- El cuerpo JSON inválido puede convertirse en un array vacío en el controlador común. La adaptación debe distinguir entradas inválidas y mantener errores que entiendan los frontends.
- La API no trae los módulos de archivos, auditoría o reservas de IMSJ. La venta protege stock con un UPDATE condicional; no aporta por sí sola la transacción y bloqueo de franja que necesitan las reservas.
- El README reconoce límites de producción, CSRF y pruebas/migraciones. La demostración no es evidencia de seguridad o despliegue de IMSJ.
- Compose trae valores y una clave de demostración. No reutilizar esos secretos, cuentas o nombres de base como configuración institucional. Inicializar SQL al crear un volumen vacío no actualiza una instalación con datos.
- `.htaccess` restringe el acceso web y la implementación IMSJ mantiene los archivos internos fuera de la raíz pública.

## 5. Qué se toma y qué necesita otra decisión

En el estudio inicial se tomaban como referencia capas, router, PDO, validadores/DTO y configuración/respuestas. El refinamiento posterior adoptó el recorrido simple con validación común en Solicitud y despacho explícito. Se adaptan al dominio y contrato de IMSJ según [migración](migracion_backend_vanilla.md).

| Dato | Valor |
|---|---|
| Licencia indicada en el manifiesto de referencia | MIT |
| Referencia de permisos de reutilización | El manifiesto de la revisión de referencia declara MIT; conservar sus avisos si se reutilizan archivos. No equivale a una autorización adicional del autor. |

## Lectura de este antecedente

Las dependencias, cookies, puertos y formatos de esta comparación pertenecen a la revisión fijada del ejemplo completo. La implementación vigente de IMSJ utiliza la referencia simple, Bearer opaco revocable, respuestas propias y 46 rutas. Para mantener o instalar el proyecto se utilizan el contrato y el README actuales, no los comandos o credenciales del ejemplo.
