# Sprint Review

**Proyecto:** Educación Vial IMSJ — Portal Vial.

Las cuatro fichas se reconstruyen a partir del historial; describen incrementos observables en código. La fecha de corte no acredita una reunión de Review. Solo R-05 acredita la demostración al cliente. Los puntos originales son estimaciones del plan; no se usan como puntos aceptados. Véase [consolidación](../../docs_auxiliares/revision/consolidacion_2026-10-21.md).

## Sprint 1 — Maquetación de los frontends

| Dato | Valor |
|---|---|
| Período | 10/07–23/07/2026 |
| Fecha de corte del período | 23/07/2026; reconstrucción documental. |
| Responsabilidad de revisión interna | Líder y co-líder; en R-05 constan asistentes de la demostración al cliente. |
| Commits del incremento | fb78047, 2b873f4, fc9c519 y a9401ad. |
| Puntos estimados | 11 |
| Criterio de avance | Incremento descrito y commits asociados; no se equipara presencia de código a aceptación de historias. |

### Incremento

se incorporaron las pantallas HTML/CSS del panel IMSJ, se avanzó en la presentación de noticias del portal público y se actualizaron el relevamiento y los requisitos.

### Demostración

| Historia | Función presentada | Resultado | Evidencia |
|---|---|---|---|
| US3–US4, US15–US24 | Pantallas de panel y noticias; requisitos y entrevista. | Incremento de maquetación, sin atribuir persistencia. | fb78047, 2b873f4, fc9c519, a9401ad. |

### Devolución y ajustes

| Participante | Observación | Decisión | Impacto en backlog |
|---|---|---|---|
| Historial de desarrollo | El commit 2b873f4 señala ajustes de menú. | Priorizar navegación en el incremento siguiente. | Trabajo de interfaz; US27–US28. |

### Acciones

| Acción | Responsable | Fecha objetivo |
|---|---|---|
| Completar pantallas e interacción local. | Verónica Romero y Juan Corrales; revisión líder/co-líder | Período siguiente: 24/07–06/08. |

**Referencias:** [fb78047](https://github.com/totito19/Proyecto-IMSJ/commit/fb780477e137307c597d5956e38ea1f851cd7b02) — panel; [2b873f4](https://github.com/totito19/Proyecto-IMSJ/commit/2b873f44ea06933fa6688da14c5c61e418b1cae0) — noticias; [fc9c519](https://github.com/totito19/Proyecto-IMSJ/commit/fc9c5198a54fb0fc5a50dd298d9c258460ca1723) y [a9401ad](https://github.com/totito19/Proyecto-IMSJ/commit/a9401adf51233d256b9de84ba3ddcd556966cdc7) — requisitos y entrevista.

## Sprint 2 — Pantallas e interacción con JavaScript

| Dato | Valor |
|---|---|
| Período | 24/07–06/08/2026 |
| Fecha de corte del período | 06/08/2026; reconstrucción documental. |
| Responsabilidad de revisión interna | Líder y co-líder; en R-05 constan asistentes de la demostración al cliente. |
| Commits del incremento | a9650d7, 25f5fd9, 7b6d2c2 y 980478d. |
| Puntos estimados | 16 |
| Criterio de avance | Incremento descrito y commits asociados; no se equipara presencia de código a aceptación de historias. |

### Incremento

se ampliaron las pantallas públicas de materiales, agenda, consulta de reserva, preguntas frecuentes y renovación. El panel incorporó JavaScript para formularios, listados y operaciones con datos de ejemplo en memoria y almacenamiento del navegador. También se ampliaron historias de usuario y arquitectura.

### Demostración

| Historia | Función presentada | Resultado | Evidencia |
|---|---|---|---|
| US4, US10–US24 | Materiales, noticias, agenda, FAQ, renovación y gestión local. | Pantallas e interacción con datos de ejemplo. | a9650d7, 25f5fd9, 7b6d2c2, 980478d. |

### Devolución y ajustes

| Participante | Observación | Decisión | Impacto en backlog |
|---|---|---|---|
| Historial de desarrollo | a9650d7 y 7b6d2c2 señalan menú y pantallas por completar. | Continuar unificación y acceso. | Preparación del Sprint 3. |

### Acciones

| Acción | Responsable | Fecha objetivo |
|---|---|---|
| Unificar la versión pública y documentar clases. | Frontend, Gabriela Romero y líder/co-líder | Período siguiente: 07/08–20/08. |

**Referencias:** [a9650d7](https://github.com/totito19/Proyecto-IMSJ/commit/a9650d7037fdec718f416a2285f10bdf1c5a7eae), [7b6d2c2](https://github.com/totito19/Proyecto-IMSJ/commit/7b6d2c2afcd5198394ad19214e95d47fb908b853) y [980478d](https://github.com/totito19/Proyecto-IMSJ/commit/980478d1dfe5156a16158464f9dd8ef3715707d0) — pantallas; [25f5fd9](https://github.com/totito19/Proyecto-IMSJ/commit/25f5fd9760472005d7f4127844e40a4507ab2997) — JavaScript y datos locales; [299f83f](https://github.com/totito19/Proyecto-IMSJ/commit/299f83f1fc81d0c1d90da2dbab49bcbaed1420fe) y [fea21d5](https://github.com/totito19/Proyecto-IMSJ/commit/fea21d5dab10bb3156fd58f1f2e81cdd6d3a5dda) — documentación.

## Sprint 3 — Unificación visual y preparación de la integración

| Dato | Valor |
|---|---|
| Período | 07/08–20/08/2026 |
| Fecha de corte del período | 20/08/2026; reconstrucción documental. |
| Responsabilidad de revisión interna | Líder y co-líder; en R-05 constan asistentes de la demostración al cliente. |
| Commits del incremento | 59c1a58, 23bf7f4, 52237d5 y 54ba327. |
| Puntos estimados | 11 |
| Criterio de avance | Incremento descrito y commits asociados; no se equipara presencia de código a aceptación de historias. |

### Incremento

se agregó una segunda versión del portal público, un nuevo acceso y ajustes compartidos de encabezado, pie de página, iconos y estilos. Se incorporó la justificación de clases, atributos y métodos.

### Demostración

| Historia | Función presentada | Resultado | Evidencia |
|---|---|---|---|
| US1, US3, US21, US23, US27–US28 | Segunda versión, acceso y componentes visuales. | Unificación visual y documentación del modelo. | 59c1a58, 23bf7f4, 54ba327, 52237d5. |

### Devolución y ajustes

| Participante | Observación | Decisión | Impacto en backlog |
|---|---|---|---|
| Solicitud docente CC-01 | Incorporar simulacro, registrada el 14/08. | Integrar banco y corrección con backend. | US31/RF22; Sprint 4. |

### Acciones

| Acción | Responsable | Fecha objetivo |
|---|---|---|
| Integrar API, persistencia, roles y simulador. | Tomás Cabrera, Gabriela Romero y frontend; pruebas de Juan Robaina | Período siguiente: 21/08–03/09. |

**Referencias:** [59c1a58](https://github.com/totito19/Proyecto-IMSJ/commit/59c1a58f4fe6ef163970ee494014090ba4d17cd4) — portal; [23bf7f4](https://github.com/totito19/Proyecto-IMSJ/commit/23bf7f4e0605275390c5ef66922e5f4ab4525a1f) — acceso; [54ba327](https://github.com/totito19/Proyecto-IMSJ/commit/54ba3276eae924650c9644addf4530e56be542bf) — estilos; [52237d5](https://github.com/totito19/Proyecto-IMSJ/commit/52237d50ee1ca802eb9766a34045319ba33929a4) — clases. Solicitud: [Control de cambios](control_cambios.md).

## Sprint 4 — Backend e integración

| Dato | Valor |
|---|---|
| Período | 21/08–03/09/2026 |
| Fecha de corte del período | 03/09/2026; reconstrucción documental. |
| Responsabilidad de revisión interna | Líder y co-líder; en R-05 constan asistentes de la demostración al cliente. |
| Commits del incremento | bb37399, c0016b1, e75dc4c y 448eb82. |
| Puntos estimados | 44 |
| Criterio de avance | Incremento descrito y commits asociados; no se equipara presencia de código a aceptación de historias. |

### Incremento

Se conectaron los frontends con acceso y API; se incorporaron gestión de preguntas y personal, persistencia y arranque Docker. La demostración R-05 del 03/09 originó los cambios de consultas, aprobación diferenciada y gráficos. La reescritura PHP nativa pertenece a octubre.

### Demostración

| Historia | Función presentada | Resultado | Evidencia |
|---|---|---|---|
| US1–US28, US31 | Integración de acceso, gestión, agenda, simulador y Docker. | Base funcional demostrada al cliente en R-05; genera CC-02–CC-04. | bb37399, c0016b1, e75dc4c, 448eb82 y R-05. |

### Devolución y ajustes

| Participante | Observación | Decisión | Impacto en backlog |
|---|---|---|---|
| Directora e Inspector, R-05 | Consultas ciudadanas, aprobación separada y gráficos. | Registrar e implementar CC-02–CC-04. | US30, US32 y US33. |
| Equipo, 30/09 | Facilitar documentación y defensa del backend. | Sustituir Laravel mediante CC-05. | Trabajo transversal posterior. |

### Acciones

| Acción | Responsable | Fecha objetivo |
|---|---|---|
| Incorporar cambios del cliente y comprobarlos. | Tomás Cabrera y frontend; base de Gabriela Romero y revisión de Juan Robaina | Seguimiento documentado: 13/10; regresión: 21/10. |

**Referencias:** [Control de cambios](control_cambios.md) y [registro de verificación](../../docs_auxiliares/evidencias/verificacion.md).

## Incrementos posteriores

| Fecha | Incremento | Resultado técnico |
|---|---|---|
| 03/09 | Demo con Directora e Inspector. | Solicitudes CC-02–CC-04. |
| 05/10 | Reescritura PHP nativa. | 155 comprobaciones HTTP/MySQL de la base de 42 rutas. |
| 13/10 | Consultas, Directora y gráficos. | 41 comprobaciones HTTP y recorrido visual. |
| 20/10 | Cancelación y ajustes de interfaz. | Contrato de 46 rutas. |
| 21/10 | Integración y seguridad. | 192 comprobaciones; auditoría Bash 43/43 y revalidación SAST/DAST. |

## Referencias

[Planning](sprint_planning.md), [actas](actas_reuniones.md), [backlog](backlog.md) y [Eventos de Scrum del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/scrum-events.md).
