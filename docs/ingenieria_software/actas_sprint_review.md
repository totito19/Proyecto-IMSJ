# Seguimiento de incrementos y Sprint Review — IMSJ


**Balance retrospectivo original:** 08/09/2026. **Actualización documental:** 20/10/2026.

Balance de los cuatro períodos propuestos en [Sprint Planning](sprint_planning.md), basado en los archivos incorporados por los commits. Las fechas delimitan el análisis, no acreditan reuniones realizadas. La presencia de código o pruebas no certifica su ejecución ni la aceptación del cliente.

## Resumen de puntos

Estimaciones propuestas en el [Planning](sprint_planning.md), aplicadas al alcance de cada período.

| Sprint | Puntos estimados | Puntos terminados confirmados |
|---|---:|---|
| 1 | 11 | Por verificar |
| 2 | 16 | Por verificar |
| 3 | 11 | Por verificar |
| 4 | 44 | Por verificar |
| **Total** | **82** | **Por verificar** |

Los puntos terminados requieren verificar el cumplimiento y las pruebas de cada elemento. La evidencia de commits se conserva debajo; no se convierte automáticamente en una cifra de trabajo terminado. «Por verificar» no significa cero.

## Sprint 1 — Maquetación de los frontends
**Período:** 10/07–23/07/2026.

**Resultado:** se incorporaron las pantallas HTML/CSS del panel IMSJ, se avanzó en la presentación de noticias del portal público y se actualizaron el relevamiento y los requisitos.

**Pendiente al cierre:** completar las demás pantallas públicas y resolver el menú de navegación, señalado en los mensajes de los commits.

**Evidencia:** [fb78047](https://github.com/totito19/Proyecto-IMSJ/commit/fb780477e137307c597d5956e38ea1f851cd7b02) — panel; [2b873f4](https://github.com/totito19/Proyecto-IMSJ/commit/2b873f44ea06933fa6688da14c5c61e418b1cae0) — noticias y pendiente del menú; [fc9c519](https://github.com/totito19/Proyecto-IMSJ/commit/fc9c5198a54fb0fc5a50dd298d9c258460ca1723) y [a9401ad](https://github.com/totito19/Proyecto-IMSJ/commit/a9401adf51233d256b9de84ba3ddcd556966cdc7) — requisitos y entrevista.

## Sprint 2 — Pantallas e interacción con JavaScript
**Período:** 24/07–06/08/2026.

**Resultado:** se ampliaron las pantallas públicas de materiales, agenda, consulta de reserva, preguntas frecuentes y renovación. El panel incorporó JavaScript para formularios, listados y operaciones con datos de ejemplo en memoria y almacenamiento del navegador. También se ampliaron historias de usuario y arquitectura.

**Pendiente al cierre:** corregir la navegación e integrar la persistencia con el backend. En esta etapa, las operaciones del panel utilizaban datos locales.

**Evidencia:** [a9650d7](https://github.com/totito19/Proyecto-IMSJ/commit/a9650d7037fdec718f416a2285f10bdf1c5a7eae), [7b6d2c2](https://github.com/totito19/Proyecto-IMSJ/commit/7b6d2c2afcd5198394ad19214e95d47fb908b853) y [980478d](https://github.com/totito19/Proyecto-IMSJ/commit/980478d1dfe5156a16158464f9dd8ef3715707d0) — pantallas; [25f5fd9](https://github.com/totito19/Proyecto-IMSJ/commit/25f5fd9760472005d7f4127844e40a4507ab2997) — JavaScript y datos locales; [299f83f](https://github.com/totito19/Proyecto-IMSJ/commit/299f83f1fc81d0c1d90da2dbab49bcbaed1420fe) y [fea21d5](https://github.com/totito19/Proyecto-IMSJ/commit/fea21d5dab10bb3156fd58f1f2e81cdd6d3a5dda) — documentación.

## Sprint 3 — Unificación visual y preparación de la integración
**Período:** 07/08–20/08/2026.

**Resultado:** se agregó una segunda versión del portal público, un nuevo acceso y ajustes compartidos de encabezado, pie de página, iconos y estilos. Se incorporó la justificación de clases, atributos y métodos.

**Pendiente al cierre:** conectar las pantallas a la API. El 14/08 se recibió la solicitud de simulacros de pruebas teóricas de los profesores, registrada como CC-01.

**Evidencia:** [59c1a58](https://github.com/totito19/Proyecto-IMSJ/commit/59c1a58f4fe6ef163970ee494014090ba4d17cd4) — portal; [23bf7f4](https://github.com/totito19/Proyecto-IMSJ/commit/23bf7f4e0605275390c5ef66922e5f4ab4525a1f) — acceso; [54ba327](https://github.com/totito19/Proyecto-IMSJ/commit/54ba3276eae924650c9644addf4530e56be542bf) — estilos; [52237d5](https://github.com/totito19/Proyecto-IMSJ/commit/52237d50ee1ca802eb9766a34045319ba33929a4) — clases. Solicitud: [Control de cambios](control_cambios.md).

## Sprint 4 — Backend e integración
**Período:** 21/08–03/09/2026.

**Antecedente de integración observado en el repositorio:**
- Se incorporaron el backend Laravel, modelos, migraciones, rutas, controles de acceso y archivos de pruebas.
- Los frontends incorporaron llamadas a la API para trabajar con contenidos y agenda.
- Se añadieron el simulacro, el banco de preguntas, la administración de personal y la consulta del historial.
- Se agregaron archivos para iniciar y detener el sistema local con Docker.

**Actualización de estado al 15/10/2026:** CC-01–CC-05 están Listos. Los detalles históricos de cada demostración se conservan en las actas y la evidencia técnica en el registro de verificación.

**Documentación de seguimiento:** [API](../../docs_auxiliares/backend/api.md) y [verificación](../../docs_auxiliares/evidencias/verificacion.md). El backend Laravel corresponde al antecedente `df581ab`; sus rutas y pruebas no existen en el árbol actual. El balance no permite atribuir todo ese código al cierre exacto del 03/09.

La [acta R-05](actas_reuniones.md#r-05--03092026) registra la reunión/demo del 03/09 con Directora e Inspector, origen de CC-02–CC-04. Estado vigente: CC-01–CC-05 Listos.

## Campos históricos no registrados

| Período reconstruido | Fecha efectiva de Review / participantes | Incremento demostrado / versión | Feedback, resultado y puntos terminados | Impacto de backlog |
|---|---|---|---|---|
| 1 | No registrados. | El balance de commits no prueba una demo. | No registrados. | No registrado por US. |
| 2 | No registrados. | El balance de commits no prueba una demo. | No registrados. | No registrado por US. |
| 3 | No registrados. | El balance de commits no prueba una demo. | No registrados. | CC-01 registrado; estado vigente **Listo**. |
| 4 | R-05 registra demo, sin confirmar que fuera Review del sprint. | No registrado en detalle. | No registrados; total terminado «Por verificar». | CC-02–CC-04, relacionados actualmente con US30/US32/US33. |

Fuentes: [Review del curso](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/05_sprint_review.md) y [eventos de Scrum](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/scrum-events.md).

## Evolución posterior y alcance de la evidencia

| Fecha | Incremento o comprobación registrada | Límite de interpretación |
|---|---|---|
| 03/09 | Demo con Directora e Inspector; origen de CC-02–CC-04. | El acta no la identifica como Review formal ni adjunta una versión exacta o aceptación final. |
| 05/10 | Reescritura PHP nativa y pruebas HTTP/MySQL de la migración. | No constituye una reunión retrospectiva ni acredita entrega institucional. |
| 13/10 | Consultas, flujo Directora y gráficos del simulador; arranque Docker aislado, 41 verificaciones HTTP y recorrido visual. | Resultado técnico de esa demo y ese entorno. |
| 20/10 | Cancelación de reservas y ajustes de interfaz incorporados al repositorio. | Hay casos de prueba añadidos; no se extiende automáticamente el resultado de la demo anterior. |

## Contenido del registro de una Review efectiva

Para relacionar una Review con este balance se necesita su fecha, participantes, versión demostrada, historias presentadas, observaciones del cliente, decisiones y efectos sobre el backlog. Los puntos terminados se vinculan con resultados verificados, no solo con archivos incorporados.

Las actas del equipo son la fuente de intervenciones y acuerdos. Hasta disponer de ellas, este documento cumple la función de balance técnico y documental por períodos y mantiene los campos históricos sin datos inventados.
