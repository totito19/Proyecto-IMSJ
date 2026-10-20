# Planificación por períodos del proyecto

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización documental:** 20/10/2026.

## Alcance del registro

El documento conserva cuatro períodos propuestos, incorporados al repositorio el 08/09 mediante el commit `60667ef`. Sus tablas organizan tareas históricas y suman 82 puntos. No hay un registro adjunto de reuniones de planning, método de estimación, capacidad o compromisos que permita presentarlos como sprints formalmente acordados.

Los períodos se utilizan para comprender la evolución del producto. Los puntos son los valores del documento original y no una medida de velocidad o de trabajo aceptado. La sustitución posterior de Laravel no cambia la tecnología que se menciona en las tareas de agosto.

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


## Relación con el backlog

| Período | Necesidad de trabajo | Relación documental |
|---|---|---|
| 1 | Pantallas del panel, ingreso y noticias públicas. | Presentación de US1–US7 y US15–US24; no acredita su funcionamiento con datos persistentes. |
| 2 | Pantallas públicas y operaciones con datos locales. | US3–US24 en interacción de frontend; persistencia e integración aún por resolver en ese momento. |
| 3 | Portal, acceso, presentación y modelo. | US1, US3, US21, US23, US27 y US28; diseño adaptable no equivale a una auditoría. |
| 4 | Backend, integración, banco, agenda, personal e historial. | Trabajo transversal sobre acceso, contenidos, agenda y calidad; el estado actual de las historias se consulta en el backlog. |

El catálogo actual conserva US1–US34. Los cambios de septiembre y octubre se siguen por sus fuentes y no se atribuyen automáticamente a la selección original de un período.

## Dependencias técnicas

El acceso a datos persistentes depende de un esquema compatible y de la conexión del backend. Los formularios administrativos necesitan autenticación y permisos antes de operar datos reales. La publicación necesita estados y revisión de la Directora; los materiales y gráficos necesitan almacenamiento y rutas de descarga. La agenda depende de franjas, cuentas y control de cupos.

Estas dependencias explican el orden de integración. No representan una nueva prioridad entre CC-01–CC-04 ni una reasignación de tareas que el equipo no haya acordado.

## Trabajo técnico posterior: CC-05

| Tarea | Resultado documentado |
|---|---|
| TM-01 | Estructura nativa, carga explícita y contrato de rutas. |
| TM-02 | Autenticación, sesiones revocables y permisos. |
| TM-03 | Persistencia PDO, esquema y transacciones. |
| TM-04 | Contenidos, archivos, visibilidad e historial. |
| TM-05 | Banco del simulador y agenda académica. |
| TM-06 | Docker, Apache y herramientas de operación. |
| TM-07 | Pruebas y documentación de los resultados y límites. |

La reescritura se realizó el 05/10 y la demo Docker se verificó el 13/10. CC-01–CC-05 figuran como Listos. El código actual tiene 46 rutas después de añadir la cancelación ciudadana el 20/10. Este trabajo posterior no constituye un quinto sprint histórico ni hereda los 44 puntos del cuarto período.

## Datos de planificación aún sin registro

Faltan fechas y participantes de los planning efectivos, selección comprometida de historias, capacidad, responsables por tarea, puntos terminados y trabajo trasladado entre períodos. El equipo conserva los roles generales, pero estos no permiten asignar retrospectivamente cada tarea. La información se reúne en el formulario auxiliar.

El plan de preparación para el 29/10 y la defensa del 05/11 se encuentra separado de estos períodos históricos. Sus actividades y responsables deben distinguirse de las reuniones efectivamente realizadas.

## Referencias

[Backlog](backlog.md), [balance por períodos](actas_sprint_review.md), [actas](actas_reuniones.md), [migración](../../docs_auxiliares/backend/migracion_backend_vanilla.md), [formulario](../../docs_auxiliares/revision/formulario_datos_documentacion.md) y [plan de entrega](../general/plan_entrega_29-10_y_defensa_05-11.md).
