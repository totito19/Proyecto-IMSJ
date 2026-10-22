# Sprint Planning

## Puntos de esfuerzo

Los puntos de esfuerzo expresan el tamaño relativo de un trabajo. Consideran la cantidad de tareas, la complejidad técnica, las dependencias con otros componentes y la incertidumbre para implementarlo y verificarlo. Permiten comparar trabajos dentro del proyecto; no equivalen a horas, días ni cantidad de personas.

Las tablas utilizan los siguientes valores:

| Puntos | Esfuerzo relativo | Interpretación |
|---|---|---|
| 3 | Bajo | Trabajo acotado y conocido, con pocas dependencias, como actualizar documentación o unificar estilos existentes. |
| 5 | Medio | Trabajo con varias tareas o componentes relacionados, que requiere coordinación y comprobaciones, como maquetar un conjunto de pantallas o integrar el acceso. |
| 8 | Alto | Trabajo con mayor complejidad, interacción o incertidumbre, como incorporar operaciones con JavaScript o integrar módulos completos con la API y sus validaciones. |

El total de cada sprint es la suma de los puntos asignados a sus trabajos y representa su carga relativa estimada. Por ejemplo, el Sprint 1 suma **5 + 3 + 3 = 11 puntos**. Estos totales no miden horas efectivamente trabajadas ni demuestran por sí solos que las tareas estén terminadas.

## Sprint 1 — Maquetación de los frontends

**Período:** 10/07–23/07/2026.

**Objetivo:** dar forma a las pantallas principales y ordenar los requisitos relevados.

| Trabajo | Puntos |
|---|---:|
| Maquetar el panel IMSJ: noticias, agenda, franjas, materiales y preguntas frecuentes. | 5 |
| Avanzar en el ingreso y las noticias del portal público. | 3 |
| Documentar la entrevista y ordenar los requerimientos. | 3 |
| **Total** | **11** |

## Sprint 2 — Pantallas e interacción con JavaScript

**Período:** 24/07–06/08/2026.

**Objetivo:** ampliar las pantallas y permitir operar el panel con datos de ejemplo.

| Trabajo | Puntos |
|---|---:|
| Completar las pantallas públicas de materiales, agenda, reservas, preguntas frecuentes y renovación. | 5 |
| Agregar JavaScript al panel para formularios, listados y operaciones con datos locales. | 8 |
| Actualizar las historias de usuario y la propuesta de arquitectura. | 3 |
| **Total** | **16** |

## Sprint 3 — Unificación visual y preparación de la integración

**Período:** 07/08–20/08/2026.

**Objetivo:** unificar la presentación del portal y preparar su estructura para conectarla con el backend.

| Trabajo | Puntos |
|---|---:|
| Incorporar la segunda versión del portal público y renovar el acceso. | 5 |
| Unificar encabezados, pie de página, iconos y estilos. | 3 |
| Documentar las clases, atributos y métodos previstos. | 3 |
| **Total** | **11** |

## Sprint 4 — Backend e integración

**Período:** 21/08–03/09/2026.

**Objetivo:** conectar los frontends con la API y preparar una versión local para revisar con el cliente.

| Trabajo | Puntos |
|---|---:|
| Preparar el backend y la estructura de la base de datos. | 5 |
| Integrar el acceso y los roles con los frontends. | 5 |
| Implementar e integrar noticias, materiales y preguntas frecuentes mediante la API. | 8 |
| Implementar e integrar franjas, reservas y consulta de agenda. | 8 |
| Incorporar el simulacro y la gestión del banco de preguntas. | 8 |
| Incorporar la administración de personal y la consulta del historial. | 5 |
| Agregar pruebas automatizadas y herramientas de ejecución con Docker. | 5 |
| **Total** | **44** |

## Sprint 5 — Cambios solicitados por el cliente

**Período:** 04/09–13/10/2026.

**Objetivo:** incorporar los cambios solicitados por el cliente y presentar la versión actualizada.

| Trabajo | Puntos |
|---|---:|
| Incorporar el formulario de consultas y la bandeja de lectura en el panel IMSJ. | 5 |
| Implementar la aprobación de contenidos por la Directora antes de su publicación. | 8 |
| Permitir material gráfico en las preguntas del simulador. | 3 |
| Integrar los cambios y preparar la demostración al cliente. | 3 |
| **Total** | **19** |
