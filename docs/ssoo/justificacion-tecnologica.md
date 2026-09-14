# Justificación tecnológica

**Proyecto:** Plataforma Web Educación Vial IMSJ  
**Asignatura:** Administración de Sistemas Operativos  
**Entrega:** segunda entrega  
**Fecha:** 2 de septiembre de 2026

## 1. Objetivo

Este documento justifica las tecnologías usadas para ejecutar la plataforma de
Educación Vial IMSJ. La selección considera los requisitos del proyecto, la
posibilidad de reconstruir el entorno en otra computadora, la separación de
responsabilidades, la persistencia de la información y la simplicidad de
operación para una entrega académica.

La consigna exige un backend PHP/Laravel, una base de datos MySQL, dos
interfaces web separadas y un proyecto completamente dockerizado. Algunas
tecnologías están definidas por el proyecto y otras se eligieron para
instalarlas y administrarlas de manera reproducible.

## 2. Criterios de selección

- **Cumplimiento:** respetar las tecnologías y la estructura de la consigna.
- **Reproducibilidad:** ejecutar el sistema sin instalar PHP, Composer, Apache,
  Nginx o MySQL directamente en cada equipo.
- **Portabilidad:** admitir Windows con Docker Desktop y Linux con Docker
  Engine y Compose.
- **Aislamiento:** separar frontend, API y base de datos en contenedores.
- **Persistencia:** conservar la base y los archivos cargados al recrear los
  contenedores.
- **Mantenibilidad:** usar imágenes oficiales y configuración versionable.
- **Seguridad básica:** no publicar MySQL, excluir la configuración local de Git
  y montar los frontends como solo lectura.

## 3. Solución seleccionada

```text
Navegador
   ├── HTTP :8080 ──> Nginx ──> frontend público y dashboard IMSJ
   └── HTTP :8000 ──> Apache + PHP + Laravel ──> MySQL :3306
                                      │               │
                                      │               └── volumen db_data
                                      └── volumen app_uploads
```

| Tecnología | Uso en el proyecto | Justificación |
|---|---|---|
| Docker y Docker Compose | Construcción, red, arranque y parada de los servicios | Reduce diferencias entre equipos y concentra la infraestructura en `Dockerfile` y `compose.yaml`. |
| Contenedores Linux | Sistema operativo de Nginx, Apache/PHP y MySQL | Ofrecen entornos aislados y más livianos que una máquina virtual completa por componente. |
| Nginx Alpine | Publicación de `frontend-publico` y `frontend-imsj` | Está orientado a contenido HTTP estático y la variante Alpine mantiene pequeño el servicio. |
| PHP 8.5 con Apache | Ejecución y publicación de la API | La imagen oficial integra intérprete y servidor web. PHP satisface el requisito `^8.3` de la aplicación. |
| Laravel 13 | API REST, validación, autenticación y acceso a datos | Es la tecnología indicada y brinda una estructura modular mantenible. |
| Composer 2.10 | Instalación de dependencias PHP desde `composer.lock` | Permite reconstruir las bibliotecas sin versionar `vendor/`. |
| MySQL 8.4 | Persistencia relacional | Cumple la consigna, soporta relaciones y restricciones y pertenece a la línea LTS. |
| Volúmenes Docker | Persistencia de MySQL y archivos subidos | Separan los datos del ciclo de vida de los contenedores. |
| Archivo `.env` | Puertos, base, clave de Laravel y ambiente | Permite configuraciones locales sin publicar secretos en el repositorio. |
| Scripts Batch | Inicio y parada guiados en Windows | Verifican Docker y reducen errores durante desarrollo y demostración. |

## 4. Justificación por componente

### 4.1 Docker Compose

Compose representa servicios, dependencias, puertos, montajes, volúmenes y
comprobaciones de salud en un único archivo. El equipo puede reconstruir la
infraestructura con comandos conocidos y evita instalaciones manuales distintas
en cada computadora.

Frente a instalar cada programa directamente en Windows, ofrece mayor
aislamiento. Frente a una máquina virtual completa, consume menos recursos y
documenta mejor cada servicio. Para el alcance actual no se necesita Kubernetes:
el sistema usa un único host y solamente tres servicios.

### 4.2 Nginx para los frontends

Los frontends contienen HTML, CSS, JavaScript e imágenes y no necesitan un
intérprete en el servidor. Nginx puede publicar ambos desde un contenedor. Los
directorios se montan como solo lectura para que el servidor no modifique el
código fuente.

No se duplicó un contenedor por interfaz porque ambas son aplicaciones estáticas
del mismo proyecto y no requieren configuraciones de servidor diferentes. La
separación lógica permanece mediante directorios y rutas distintas.

### 4.3 PHP, Apache y Laravel

La variante oficial `php:8.5-apache` reúne el lenguaje y el servidor HTTP. El
`Dockerfile` ajusta la raíz pública a `/var/www/html/public`, punto de entrada
correcto de Laravel, e instala las extensiones necesarias: `mbstring` y
`pdo_mysql`.

Nginx con PHP-FPM sería válido para un despliegue productivo más exigente, pero
agregaría configuración y otro servicio sin una ventaja necesaria en esta
entrega. Apache con PHP integrado es más simple de reconstruir y suficiente
para el entorno académico.

### 4.4 MySQL 8.4 LTS

MySQL está definido por la consigna y coincide con el modelo relacional del
proyecto: usuarios, contenidos, franjas, reservas e historial mantienen
relaciones y restricciones. La rama 8.4 LTS prioriza estabilidad y correcciones
durante un período prolongado.

SQLite sería útil para pruebas aisladas, pero no representa la infraestructura
solicitada ni el funcionamiento multiusuario. PostgreSQL también sería posible,
pero se apartaría del requisito y obligaría a adaptar configuración y pruebas.

### 4.5 Volúmenes y variables de entorno

Los contenedores deben poder reemplazarse sin perder información. `db_data`
conserva `/var/lib/mysql` y `app_uploads` conserva
`/var/www/html/storage/app/public`. Los datos variables quedan fuera del sistema
de archivos efímero de cada contenedor.

El archivo `.env` separa configuración y código. El repositorio incluye
`.env.example` como plantilla y excluye `.env` de Git, de modo que cada
instalación tenga su propia clave, contraseñas y puertos.

## 5. Recursos estimados

Las cifras son una estimación para desarrollo y demostración, no un
dimensionamiento definitivo de producción.

| Recurso | Mínimo estimado | Recomendado |
|---|---:|---:|
| CPU disponible para Docker | 2 núcleos | 4 núcleos |
| Memoria RAM disponible | 4 GB | 8 GB |
| Espacio libre inicial | 5 GB | 10 GB o más |
| Puertos del host | 8000 y 8080 | Configurables en `.env` |

Un despliegue real requerirá medir usuarios simultáneos, archivos almacenados,
crecimiento de la base y disponibilidad exigida por la IMSJ.

## 6. Correspondencia con los requisitos

| Necesidad | Decisión de infraestructura |
|---|---|
| Frontend público y dashboard separados | Dos directorios publicados por Nginx en rutas diferentes. |
| API REST en PHP/Laravel | Imagen basada en `php:8.5-apache`. |
| Base de datos MySQL | Servicio `db` basado en `mysql:8.4`. |
| Proyecto dockerizado | Definición en `backend/compose.yaml`. |
| Archivos de contenido | Volumen persistente `app_uploads`. |
| Datos persistentes | Volumen persistente `db_data`. |
| Control de acceso | Laravel Sanctum y middleware de roles en la API. |
| Reconstrucción | `.env.example`, migraciones, seeders, Dockerfile, Compose y guía paso a paso. |

## 7. Límites y trabajo pendiente

La infraestructura actual sirve para desarrollo y demostración local; todavía
no constituye un despliegue productivo completo. Antes de publicarla se deberá:

- incorporar HTTPS mediante un proxy inverso o servicio de alojamiento;
- usar `APP_ENV=production`, `APP_DEBUG=false` y credenciales robustas;
- gestionar los secretos con un mecanismo apropiado para el destino;
- fijar y revisar periódicamente las versiones exactas de las imágenes;
- definir límites de recursos, monitoreo y rotación de registros;
- implementar y probar respaldo y restauración de base y archivos para la
  entrega final;
- medir la carga real para dimensionar servidor, disco y conexión.

## 8. Referencias

- [Requerimientos por asignatura del proyecto 2026](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/main/Lineamientos/requerimientos_por_asignatura.md)
- [Repositorio de apoyo de Ingeniería de Software](https://github.com/portalutu/ing_software-3ro-bt)
- [Docker Compose](https://docs.docker.com/compose/)
- [Variables de entorno en Docker Compose](https://docs.docker.com/compose/how-tos/environment-variables/)
- [Imagen oficial de PHP](https://hub.docker.com/_/php)
- [Imagen oficial de Nginx](https://hub.docker.com/_/nginx)
- [MySQL 8.4: versiones LTS e Innovation](https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html)
- [Configuración por ambiente en Laravel](https://laravel.com/docs/13.x/configuration#environment-configuration)
