# Sprint Planning

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Versión documental:** 21/10/2026.

## Plan de trabajo

Reconstrucción documental a partir de actas y commits. Los puntos del trabajo agregado ya figuraban en el plan; los puntos por tarea añadidos son una distribución retrospectiva. Se usan los extremos del período como referencia, sin atribuir reuniones en esas fechas. La capacidad describe integrantes y carga relativa, no disponibilidad horaria medida. Fuentes: [consolidación](../../docs_auxiliares/revision/consolidacion_2026-10-21.md).

## Sprint 1 — Maquetación de los frontends

| Dato | Valor |
|---|---|
| Período | 10/07–23/07/2026 |
| Referencia de inicio del período | 10/07/2026; reconstrucción retrospectiva. |
| Equipo asignado por roles | Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. |
| Coordinación | Tomás Cabrera; apoyo de Juan Robaina. |
| Capacidad de referencia | Cinco integrantes; carga del plan: 11 puntos. No representa horas ni velocidad medida. |

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
| US4, US15–US24 | Maquetar panel y navegación. | Juan Corrales y Verónica Romero | 5 puntos retrospectivos | Relevamiento R-01. |
| US1, US3 | Preparar ingreso y noticias públicas. | Verónica Romero y Juan Corrales | 3 puntos retrospectivos | Estructura HTML/CSS. |
| US1–US28 | Ordenar requisitos y entrevista. | Tomás Cabrera y Juan Robaina; apoyo de Gabriela Romero | 3 puntos retrospectivos | R-01 y R-02. |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| Diferencias entre pantallas y relevamiento | Contrastar con R-01/R-02 y requisitos. | Tomás Cabrera y Juan Robaina |

**Historias relacionadas con el incremento:** US1, US3–US4, US15–US24; alcance de maquetación.

**Criterio de trabajo reconstruido:** conservar el alcance del período, revisar con líder/co-líder y vincular el incremento con los commits de la Review.

## Sprint 2 — Pantallas e interacción con JavaScript

| Dato | Valor |
|---|---|
| Período | 24/07–06/08/2026 |
| Referencia de inicio del período | 24/07/2026; reconstrucción retrospectiva. |
| Equipo asignado por roles | Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. |
| Coordinación | Tomás Cabrera; apoyo de Juan Robaina. |
| Capacidad de referencia | Cinco integrantes; carga del plan: 16 puntos. No representa horas ni velocidad medida. |

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
| US10–US11, US14, US21, US23 | Completar pantallas públicas y renovación. | Verónica Romero y Juan Corrales | 5 puntos retrospectivos | Maquetación Sprint 1. |
| US4, US15–US24 | Formularios y listados con datos locales. | Juan Corrales y Verónica Romero | 8 puntos retrospectivos | Pantallas de gestión. |
| US10–US20 | Actualizar historias, arquitectura y relaciones previstas. | Tomás Cabrera, Juan Robaina y Gabriela Romero | 3 puntos retrospectivos | R-03 y alcance académico. |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| Confundir datos locales con persistencia | Identificar el prototipo y preparar integración de API. | Tomás Cabrera y frontend |

**Historias relacionadas con el incremento:** US4, US10–US24; interacción con datos locales.

**Criterio de trabajo reconstruido:** conservar el alcance del período, revisar con líder/co-líder y vincular el incremento con los commits de la Review.

## Sprint 3 — Unificación visual y preparación de la integración

| Dato | Valor |
|---|---|
| Período | 07/08–20/08/2026 |
| Referencia de inicio del período | 07/08/2026; reconstrucción retrospectiva. |
| Equipo asignado por roles | Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. |
| Coordinación | Tomás Cabrera; apoyo de Juan Robaina. |
| Capacidad de referencia | Cinco integrantes; carga del plan: 11 puntos. No representa horas ni velocidad medida. |

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
| US1, US3, US21, US23 | Incorporar segunda versión pública y acceso. | Verónica Romero y Juan Corrales; integración de Juan Robaina | 5 puntos retrospectivos | Pantallas Sprint 2. |
| US27–US28 | Unificar encabezados, pie, iconos y estilos. | Verónica Romero y Juan Corrales | 3 puntos retrospectivos | Versión pública unificada. |
| US1–US28 | Justificar clases, atributos y métodos. | Gabriela Romero, Tomás Cabrera y Juan Robaina | 3 puntos retrospectivos | R-04 y requisitos. |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| Estilos y menús divergentes | Unificar componentes y revisar navegación. | Verónica Romero y Juan Corrales |

**Historias relacionadas con el incremento:** US1, US3, US21, US23, US27–US28; alcance visual y modelado.

**Criterio de trabajo reconstruido:** conservar el alcance del período, revisar con líder/co-líder y vincular el incremento con los commits de la Review.

## Sprint 4 — Backend e integración

| Dato | Valor |
|---|---|
| Período | 21/08–03/09/2026 |
| Referencia de inicio del período | 21/08/2026; reconstrucción retrospectiva. |
| Equipo asignado por roles | Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. |
| Coordinación | Tomás Cabrera; apoyo de Juan Robaina. |
| Capacidad de referencia | Cinco integrantes; carga del plan: 44 puntos. No representa horas ni velocidad medida. |

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
| US1–US28 | Preparar backend Laravel y esquema inicial. | Tomás Cabrera y Gabriela Romero | 5 puntos retrospectivos | Modelo y configuración. |
| US1–US2 | Integrar acceso y permisos. | Tomás Cabrera; frontend de Verónica Romero y Juan Corrales | 5 puntos retrospectivos | API y cuentas. |
| US3–US9, US21–US24 | Integrar noticias, materiales y FAQ. | Tomás Cabrera, Verónica Romero y Juan Corrales | 8 puntos retrospectivos | Acceso y persistencia. |
| US10–US20 | Integrar franjas, reservas y agenda. | Tomás Cabrera, Gabriela Romero y frontend | 8 puntos retrospectivos | Esquema, cuentas y cupos. |
| US31 | Banco de preguntas y simulacro. | Tomás Cabrera y frontend | 8 puntos retrospectivos | CC-01 del 14/08. |
| US2, US25 | Personal e historial. | Tomás Cabrera y Gabriela Romero | 5 puntos retrospectivos | Roles y registro de acciones. |
| US26, US34 | Pruebas y arranque Docker. | Tomás Cabrera y Juan Robaina | 5 puntos retrospectivos | Integración de módulos. |

### Riesgos y acuerdos

| Riesgo o supuesto | Tratamiento | Responsable |
|---|---|---|
| Integración, permisos y cupos | Revisar contrato y esquema; comprobar acceso y transacciones. | Tomás Cabrera, Gabriela Romero y Juan Robaina |

**Historias relacionadas con el incremento:** US1–US28 y US31; integración inicial, conservando parciales del backlog.

**Criterio de trabajo reconstruido:** conservar el alcance del período, revisar con líder/co-líder y vincular el incremento con los commits de la Review.

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
