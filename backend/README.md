# Backend IMSJ

API REST para Educación Vial IMSJ. **Destino confirmado por el grupo el 02/10/2026:
PHP sin Laravel, por capas y con PDO/MySQL, basado en `api-completa`.** El código
presente todavía es Laravel 13; CC-05 registra la sustitución con implementación
pendiente.

## Documentación de la migración

- [Guía de migración CC-05](../docs/migracion_backend_vanilla.md): organización,
  compatibilidad, datos, tareas y condiciones para cerrar el cambio.
- [Análisis de la API base](../docs/referencia_api_completa.md): revisión fija del
  ejemplo y diferencias que no se adoptan automáticamente.
- [Contrato de API](../docs/api.md): rutas y respuestas de IMSJ a conservar.
- [Infraestructura de destino](../docs/ssoo/transicion_backend_vanilla.md): adaptación
  de entorno, Docker, almacenamiento y scripts, todavía pendiente.

Composer puede seguir instalando bibliotecas específicas sin un framework de
aplicación. La letra académica indica Laravel; su aceptación con docentes debe
registrarse. Las secciones siguientes describen únicamente la versión actual.

## Qué contiene la versión actual Laravel

- `app/Models`: clases que representan usuarios, noticias, materiales,
  preguntas, franjas y reservas.
- `app/Http/Controllers`: recibe las peticiones, valida datos y delega en servicios.
- `app/Services`: coordina los casos de uso y la lógica del negocio.
- `app/Repositories`: interfaces e implementaciones de acceso a datos.
- `routes/api.php`: lista las direcciones disponibles de la API.
- `database/migrations`: recetas de Laravel para crear las tablas.
- `database/schema.sql`: esquema SQL para la entrega; contiene borrado de tablas y no debe importarse como actualización sobre datos existentes.
- `tests`: comprobaciones automáticas del comportamiento principal.

El resto de los archivos de esta carpeta pertenece a la estructura mínima que
Laravel necesita para arrancar, conectarse a MySQL y responder por HTTP.

## Iniciar la versión actual con Docker

> **Corrección documental asistida por IA — 02/10/2026:** se unifica el arranque con la guía SSOO. El procedimiento describe una instalación local nueva; no acredita ejecución ni aceptación del sistema.

En Windows, desde `backend`, el procedimiento existente es:

```powershell
.\iniciar.bat
```

Para instalación manual y comprobación, seguir
[reconstrucción de infraestructura](../docs/ssoo/reconstruccion-infraestructura.md).
Crear `.env` solo si falta; generar clave y cargar seeders solo cuando corresponda a
la nueva instalación. No sobrescribir configuración ni volver a sembrar una base con datos.

Con la configuración y base ya preparadas, las veces siguientes:

```powershell
docker compose up -d
```

La API queda disponible en `http://localhost:8000/api`. El endpoint
`GET /api/health` permite comprobar que responde.

Los frontends están en `http://localhost:8080/frontend-publico/` y
`http://localhost:8080/frontend-imsj/`. Ambos llaman a `localhost:8000` fijado en
JavaScript; cambiar puertos en `.env` no actualiza esas direcciones.

El [inventario de API](../docs/api.md) describe rutas, permisos y diferencias con
la letra. La [matriz de verificación](../docs/verificacion.md) separa pruebas
disponibles de resultados ejecutados. El contenedor de entrega excluye pruebas y
dependencias de desarrollo; no se presenta como entorno PHPUnit.

## Documentación de SSOO

Los entregables de Administración de Sistemas Operativos para la segunda
entrega están reunidos en [`../docs/ssoo/`](../docs/ssoo/README.md):

- justificación tecnológica;
- documentación de infraestructura;
- procedimiento de reconstrucción paso a paso.

## Qué no se entrega

`vendor` se genera al instalar las dependencias. Está excluida de Git y no debe
copiarse como parte del código del grupo.
