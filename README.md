# Educación Vial IMSJ

Plataforma web para la Sección Tránsito de la Intendencia de San José.

## Tecnología y transición del backend

**Decisión del grupo — 02/10/2026, CC-05:** sustituir Laravel por una API en PHP
sin framework, basada en [api-completa de RodrigoCazard](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-completa),
con capas y acceso MySQL mediante PDO. La documentación del destino está preparada;
el código y la infraestructura actuales todavía utilizan Laravel 13.

La [guía de migración](docs/migracion_backend_vanilla.md) describe sustituciones,
compatibilidad con ambos frontends, datos, seguridad y criterios de cierre. El
[análisis de la referencia](docs/referencia_api_completa.md) declara diferencias
de autenticación, JSON y rutas que requieren adaptación. La situación académica
con docentes queda pendiente porque la letra consultada indica Laravel.

## Estructura

```text
Proyecto-IMSJ/
├── backend/            API REST: destino PHP/PDO; código actual Laravel, MySQL
├── frontend-publico/   sitio para la ciudadanía y pantalla de ingreso
├── frontend-imsj/      panel para el personal de la IMSJ
├── docs/               documentación académica y de la entrega real
├── .gitignore
├── LICENSE
└── README.md
```

Las cuatro carpetas tienen responsabilidades distintas y corresponden a la
arquitectura indicada para el proyecto. No se necesitan carpetas paralelas de
versiones, login o archivos compartidos.

## Archivos generados

`backend/vendor` contiene las librerías que descarga Composer. En la versión
actual incluye Laravel; el destino usará bibliotecas puntuales según el manifiesto
que se prepare. No es código del grupo y Git no lo sube. Se reconstruye al preparar
el backend desde su manifiesto y lock correspondientes.

Las instrucciones para iniciar la API están en `backend/README.md`.

## Incorporación al equipo y documentación

El [índice documental](docs/README.md) reúne todos los documentos, su orden de
lectura y los datos que el equipo todavía debe confirmar. La
[revisión documental del 02/10/2026](docs/revision_documental.md), preparada con
apoyo de IA para el grupo, explica los problemas encontrados y las correcciones propuestas.

El crédito del proyecto y su documentación corresponde a Tomás Cabrera, Juan
Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. Los roles confirmados,
la relación con el Inspector de Tránsito y los campos para completar están en
[aclaraciones y pendientes](docs/aclaraciones_y_pendientes.md).

CC-01 a CC-04 están pendientes para la entrega real, sin fecha fijada ni prioridad
distinta entre ellos. La administración y el mantenimiento posteriores corresponden
a la Intendencia, por ahora. Juan Robaina revisa y aprueba internamente la documentación;
las aprobaciones del cliente se registran en las actas a cargo del equipo.

La agenda corresponde a la entrega académica; el relevamiento la excluye de la
entrega al cliente. Los códigos RF/RNF de referencia se mantienen en
[Requerimientos](docs/Requerimientos.md). Las observaciones y sugerencias de IA
están identificadas y no constituyen acuerdos ni aceptación institucional.

## Administración de Sistemas Operativos

La [documentación de SSOO para la segunda entrega](docs/ssoo/README.md) incluye
la justificación tecnológica, el inventario de infraestructura y el
procedimiento completo de reconstrucción.
