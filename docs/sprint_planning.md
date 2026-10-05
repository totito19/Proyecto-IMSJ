> **Actualización CC-05 - 05/10/2026:** el backend de trabajo ya fue reescrito en PHP nativo a partir de api-simple, con la estructura de siete módulos solicitada. [Implementación/transición](migracion_backend_vanilla.md), [flujos](flujo_endpoints_backend.md) y [pruebas ejecutadas y límites](verificacion.md). Las menciones siguientes a código Laravel o destino api-completa corresponden al antecedente fechado del 02/10, conservado para trazabilidad. CC-01 a CC-04 siguen pendientes; las actas y aprobaciones permanecen a cargo del equipo.

---

# Sprint Planning

> **Revisión asistida por IA — 02/10/2026:** este documento fue incorporado el 08/09/2026 (commit `60667ef`) y propone períodos anteriores. No acredita reuniones de planning, compromisos, capacidad o estimaciones realizadas en esas fechas. La autoría histórica de las propuestas no está identificada. Se conservan los puntos; no son velocidad medida.

## Sprint 1 — Maquetación de los frontends
**Período propuesto:** 10/07–23/07/2026.

**Objetivo:** dar forma a las pantallas principales y ordenar los requisitos relevados.

**Trabajo propuesto:**

| Trabajo | Puntos |
|---|---:|
| Maquetar el panel IMSJ: noticias, agenda, franjas, materiales y preguntas frecuentes. | 5 |
| Avanzar en el ingreso y las noticias del portal público. | 3 |
| Documentar la entrevista y ordenar los requerimientos. | 3 |
| **Total Sprint 1** | **11** |

## Sprint 2 — Pantallas e interacción con JavaScript
**Período propuesto:** 24/07–06/08/2026.

**Objetivo:** ampliar las pantallas y permitir operar el panel con datos de ejemplo.

**Trabajo propuesto:**

| Trabajo | Puntos |
|---|---:|
| Completar las pantallas públicas de materiales, agenda, consulta de reservas, preguntas frecuentes y renovación. | 5 |
| Agregar JavaScript al panel para formularios, listados y operaciones con datos locales. | 8 |
| Actualizar historias de usuario y propuesta de arquitectura. | 3 |
| **Total Sprint 2** | **16** |

## Sprint 3 — Unificación visual y preparación de la integración
**Período propuesto:** 07/08–20/08/2026.

**Objetivo:** unificar la presentación del portal y preparar su estructura para conectarla con el backend.

**Trabajo propuesto:**

| Trabajo | Puntos |
|---|---:|
| Incorporar la segunda versión del portal público y renovar el acceso. | 5 |
| Unificar encabezados, pie de página, iconos y estilos. | 3 |
| Documentar las clases, atributos y métodos previstos. | 3 |
| **Total Sprint 3** | **11** |

## Sprint 4 — Backend e integración
**Período propuesto:** 21/08–03/09/2026.

**Objetivo:** conectar los frontends con la API y preparar una versión local para revisar con el cliente.

**Trabajo propuesto:**

| Trabajo | Puntos |
|---|---:|
| Preparar Laravel y la estructura de base de datos. | 5 |
| Integrar el acceso y los roles con los frontends. | 5 |
| Implementar e integrar noticias, materiales y preguntas frecuentes mediante la API. | 8 |
| Implementar e integrar franjas, reservas y consulta de agenda. | 8 |
| Incorporar el simulacro y la gestión del banco de preguntas. | 8 |
| Incorporar administración de personal y consulta del historial. | 5 |
| Agregar pruebas automatizadas y archivos de arranque y detención con Docker. | 5 |
| **Total Sprint 4** | **44** |

## Relación documental con el backlog

**IA — Correspondencia propuesta, no selección histórica confirmada:** una pantalla maquetada no equivale a terminar sus historias. Los 82 puntos suman tareas propuestas, no US aceptadas.

| Período | Trabajo descrito | Historias relacionadas |
|---|---|---|
| 1 | Panel y noticias/ingreso públicos | US1–US7, US15–US24, solo presentación inicial. |
| 1 | Relevamiento y requisitos | Tarea documental; no se inventa una US de producto. |
| 2 | Portal y operaciones con datos locales | US3–US24, sin evidencia de persistencia completa al cierre. |
| 2 | Historias y arquitectura | Tarea documental. |
| 3 | Portal, ingreso, estilos y modelo | US1/US3/US21/US23/US27/US28 y tareas documentales; no implica accesibilidad validada. |
| 4 | Acceso y roles | US1/US2/US26/US34. |
| 4 | Noticias, materiales y FAQ | US3–US9, US21–US24; US29/US30 pendientes. |
| 4 | Franjas, reservas y agenda | US10–US20; solo versión académica, costo urgente pendiente. |
| 4 | Simulacro | CC-01/US31; CC-04/US33 pendiente. |
| 4 | Personal e historial | US25 y administración con origen pendiente. |
| 4 | Pruebas y Docker | Tareas técnicas; evidencia de ejecución pendiente. |

## Datos ausentes de la planificación real

**Aclaración del grupo — 02/10/2026:** CC-01–CC-04 siguen pendientes para la entrega real, sin fecha fijada ni prioridad distinta entre ellas. Los períodos reconstruidos de este documento no fijan una fecha de entrega. Coordinación y avances se realizan en reuniones y quedan en las actas, a cargo del equipo; esta actualización no modifica las actas ni distribuye tareas.

| Campo | Situación |
|---|---|
| Fecha, participantes y aprobación del planning | No registrados. |
| Responsable, revisor y tareas por integrante | Roles generales confirmados; tareas concretas y selección histórica aún por registrar por el equipo. Ver [aclaraciones y pendientes](aclaraciones_y_pendientes.md). |
| Capacidad por sprint y método de estimación | No registrados. |
| Selección comprometida de US y criterios acordados | No registrada. |
| Trabajo arrastrado entre sprints | No registrado por US. |
| Dependencias y bloqueos | Acceso/API/persistencia aparecen como pendientes en la reconstrucción de Review; registro operativo no localizado. |
| Plan posterior al 03/09 | No localizado. La revisión del código se basa en cambios posteriores hasta `df581ab`. |

**IA — Observación:** el sprint 4 acumula 44 de los 82 puntos propuestos. No hay capacidad documentada que permita juzgar si es realizable. No se redistribuyen tareas ni se recorta alcance con base en la velocidad del ejemplo TamboTrace.

**IA — Sugerencia:** para una planificación futura, completar fecha, asistentes, capacidad, historias/criterios seleccionados, tareas, responsable y evidencia de cierre, según [Sprint Planning](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/sprint-planning.md). No se declara que el equipo ya adopta esos acuerdos.

## Planificación de la migración CC-05 — pendiente de reunión

**Decisión del grupo, 02/10/2026:** backend PHP sin Laravel a partir de la API completa. Los cuatro períodos anteriores se conservan como reconstrucción de la versión previa; no se reescribe el Sprint 4 como si hubiera utilizado PHP vanilla entonces.

**IA — Secuencia técnica para revisar:** TM-01 fija contrato y referencia; TM-02 prepara base PHP; TM-03 migra cuenta/permisos; TM-04 y TM-05 migran contenidos y agenda; TM-06 adapta entorno y TM-07 valida integración y retiro de Laravel. Las dependencias y evidencias están en [migración](migracion_backend_vanilla.md). La secuencia no establece prioridad distinta para CC-01–CC-04, fechas, puntos, capacidad o un Sprint 5 ficticio.

| Dato de planificación de CC-05 | Estado |
|---|---|
| Fecha de reunión y participantes | Por registrar por el equipo. |
| Capacidad, selección y estimación de tareas | Por acordar; no se trasladan los 44 puntos anteriores. |
| Asignaciones concretas y revisión | Roles generales confirmados; tareas por acordar. Juan Robaina revisará la documentación. |
| Decisión sobre tokens/sesiones y conjunto final de bibliotecas | Pendiente, conservando compatibilidad como base. |
| Diferencia académica y evidencia de cierre | Por registrar con docentes y en [verificación](verificacion.md). |

Los acuerdos y las aprobaciones quedan en actas a cargo del equipo. La preparación documental no acredita inicio/cierre de un sprint ni implementación.
