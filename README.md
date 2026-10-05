# Educación Vial IMSJ

Plataforma web para la Sección Tránsito de la Intendencia de San José.

## Estado actual - 05/10/2026

Backend reescrito desde cero en **PHP 8.5 nativo, PDO y MySQL 8.4**, con la estructura solicitada por el grupo y el recorrido de [api-simple de RodrigoCazard](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple). Siete controladores, servicios y repositorios; entrada en `backend/public/index.php`; 42 endpoints con el contrato de los frontends conservado. La evidencia HTTP/MySQL está en [verificación](docs/verificacion.md).

```text
Proyecto-IMSJ/
├── backend/            API PHP nativa, comentarios, SQL, Docker y pruebas
├── frontend-publico/   portal ciudadano e ingreso
├── frontend-imsj/      panel administrativo
└── docs/               documentación del proyecto y flujo de endpoints
```

Para iniciar, seguir el [README del backend](backend/README.md). Docker mantiene los servicios `frontend`, `app`, `db` y los volúmenes de datos/archivos; su ejecución todavía requiere comprobación del equipo. Los dos frontends conservan sus archivos y sus direcciones actuales.

## Documentación

- [Índice y orden de lectura](docs/README.md).
- [Flujo de los 42 endpoints](docs/flujo_endpoints_backend.md), con versión PDF en documentación.
- [Contrato API](docs/api.md) y [guía de transición](docs/migracion_backend_vanilla.md).
- [Control de cambios](docs/control_cambios.md), [arquitectura](docs/arquitectura_propuesta.md), [referencia simple](docs/referencia_api_simple.md) y [SSOO](docs/ssoo/README.md).
- [Datos que faltan completar](docs/aclaraciones_y_pendientes.md).

CC-01 a CC-04 siguen pendientes para la entrega real, sin fecha ni prioridad distinta; agenda y reservas corresponden al alcance académico. La aceptación académica de PHP nativo frente a la letra que exige Laravel sigue pendiente de registrar con docentes.

El crédito del proyecto y su documentación corresponde a **Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales**. Implementación/documentación preparadas con apoyo externo de IA; las observaciones y sugerencias no son acuerdos ni aceptación institucional. Juan Robaina revisa y aprueba internamente la documentación; esta versión queda pendiente de su revisión. El Inspector de Tránsito de la Intendencia aprueba o solicita cambios en reuniones; el equipo registra esos hechos en las actas. La administración y el mantenimiento posteriores corresponden a la Intendencia, por ahora.
