# Sprint Planning

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Versión documental:** 21/10/2026.

## Plan de trabajo

## Sprint 1 — Maquetación de los frontends

| Dato | Valor |
|---|---|
| Período | 10/07–23/07/2026 |
| Fecha de planning | [] |
| Participantes | [] |
| Facilitador | [] |
| Capacidad del equipo | [] |

### Objetivo del sprint

dar forma a las pantallas principales y ordenar los requisitos relevados.

### Trabajo y estimación

| Trabajo | Puntos |
|---|---|
| Maquetar el panel IMSJ: noticias, agenda, franjas, materiales y preguntas frecuentes. | 5 |
| Avanzar en el ingreso y las noticias del portal público. | 3 |
| Documentar la entrevista y ordenar los requerimientos. | 3 |
| **Total Sprint 1** | **11** |

### Selección y desglose

| Historia | Tarea | Responsable | Estimación | Dependencia |
|---|---|---|---|---|
| [] | [] | [] | [] | [] |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| [] | [] | [] |

**Historias seleccionadas:** []

**Acuerdos:** []

## Sprint 2 — Pantallas e interacción con JavaScript

| Dato | Valor |
|---|---|
| Período | 24/07–06/08/2026 |
| Fecha de planning | [] |
| Participantes | [] |
| Facilitador | [] |
| Capacidad del equipo | [] |

### Objetivo del sprint

ampliar las pantallas y permitir operar el panel con datos de ejemplo.

### Trabajo y estimación

| Trabajo | Puntos |
|---|---|
| Completar las pantallas públicas de materiales, agenda, consulta de reservas, preguntas frecuentes y renovación. | 5 |
| Agregar JavaScript al panel para formularios, listados y operaciones con datos locales. | 8 |
| Actualizar historias de usuario y propuesta de arquitectura. | 3 |
| **Total Sprint 2** | **16** |

### Selección y desglose

| Historia | Tarea | Responsable | Estimación | Dependencia |
|---|---|---|---|---|
| [] | [] | [] | [] | [] |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| [] | [] | [] |

**Historias seleccionadas:** []

**Acuerdos:** []

## Sprint 3 — Unificación visual y preparación de la integración

| Dato | Valor |
|---|---|
| Período | 07/08–20/08/2026 |
| Fecha de planning | [] |
| Participantes | [] |
| Facilitador | [] |
| Capacidad del equipo | [] |

### Objetivo del sprint

unificar la presentación del portal y preparar su estructura para conectarla con el backend.

### Trabajo y estimación

| Trabajo | Puntos |
|---|---|
| Incorporar la segunda versión del portal público y renovar el acceso. | 5 |
| Unificar encabezados, pie de página, iconos y estilos. | 3 |
| Documentar las clases, atributos y métodos previstos. | 3 |
| **Total Sprint 3** | **11** |

### Selección y desglose

| Historia | Tarea | Responsable | Estimación | Dependencia |
|---|---|---|---|---|
| [] | [] | [] | [] | [] |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| [] | [] | [] |

**Historias seleccionadas:** []

**Acuerdos:** []

## Sprint 4 — Backend e integración

| Dato | Valor |
|---|---|
| Período | 21/08–03/09/2026 |
| Fecha de planning | [] |
| Participantes | [] |
| Facilitador | [] |
| Capacidad del equipo | [] |

### Objetivo del sprint

conectar los frontends con la API y preparar una versión local para revisar con el cliente.

### Trabajo y estimación

| Trabajo | Puntos |
|---|---|
| Preparar Laravel y la estructura de base de datos. | 5 |
| Integrar el acceso y los roles con los frontends. | 5 |
| Implementar e integrar noticias, materiales y preguntas frecuentes mediante la API. | 8 |
| Implementar e integrar franjas, reservas y consulta de agenda. | 8 |
| Incorporar el simulacro y la gestión del banco de preguntas. | 8 |
| Incorporar administración de personal y consulta del historial. | 5 |
| Agregar pruebas automatizadas y archivos de arranque y detención con Docker. | 5 |
| **Total Sprint 4** | **44** |

### Selección y desglose

| Historia | Tarea | Responsable | Estimación | Dependencia |
|---|---|---|---|---|
| [] | [] | [] | [] | [] |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| [] | [] | [] |

**Historias seleccionadas:** []

**Acuerdos:** []

## Dependencias de integración

El esquema y la conexión permiten incorporar persistencia a los formularios. El acceso y los roles habilitan la operación administrativa. Los archivos requieren almacenamiento y descarga; la aprobación requiere estados de contenido; las reservas requieren franjas, cuentas y control transaccional de cupos.

## Criterios de cierre

- Cumplimiento del objetivo y de los criterios de aceptación de las historias seleccionadas.
- Validaciones, permisos y manejo de errores aplicados.
- Integración con los componentes utilizados por el recorrido.
- Resultado de pruebas y documentación del incremento.
- Código identificado en Git.

## Trabajo técnico de CC-05

| Tarea | Resultado |
|---|---|
| TM-01 | Estructura PHP nativa, carga explícita y contrato. |
| TM-02 | Autenticación, sesiones y permisos. |
| TM-03 | Persistencia PDO, esquema y transacciones. |
| TM-04 | Contenidos, archivos e historial. |
| TM-05 | Banco del simulador y agenda académica. |
| TM-06 | Docker, Apache y herramientas de operación. |
| TM-07 | Verificación e integración. |

## Referencias

[Backlog](backlog.md), [Sprint Review](actas_sprint_review.md), [plan de entrega](../general/plan_entrega_29-10_y_defensa_05-11.md) y [Sprint Planning del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/sprint-planning.md).
