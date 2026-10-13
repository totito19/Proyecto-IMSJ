> Índice anterior conservado como antecedente del 13/10/2026. Para la documentación actual, consultar [el índice de entrega](../../docs/README.md).

## Documentación vigente del backend - 05/10/2026

Backend reescrito en PHP nativo con api-simple. Para esta versión, leer [arranque y estructura](../../backend/README.md), [referencia simple](../backend/referencia_api_simple.md), flujos de los 42 endpoints (documento auxiliar retirado del árbol actual) y su PDF (documento auxiliar retirado del árbol actual), [API](../backend/api.md), [arquitectura](../../docs/arquitectura_propuesta.md), [transición](../backend/migracion_backend_vanilla.md), [SSOO](../../docs/ssoo/README.md) y [evidencia](../evidencias/verificacion.md). [Control de cambios](../../docs/control_cambios.md) y [pendientes para completar](aclaraciones_y_pendientes.md) distinguen implementación de revisión/aceptación.

Los apartados fechados el 02/10 y el análisis de api-completa se conservan como antecedentes. Los cuatro PDF previos mantienen su contenido/identidad; el nuevo PDF documenta la implementación actual. Crédito del equipo, apoyo externo de IA declarado y revisión de Juan Robaina pendiente. Actas y PNG no se modifican.

---

# Documentación y guía de incorporación

> **Revisión asistida por IA — 02/10/2026:** índice de archivos y aclaraciones a partir de `df581ab`. Las sugerencias requieren revisión del equipo; los campos «No registrado» no prueban ausencia de una actividad.

**Actualización CC-05:** el grupo decide backend PHP sin Laravel, basado en la API completa de RodrigoCazard. El destino está documentado; el código y la infraestructura aún usan Laravel. Ver [guía de migración](../backend/migracion_backend_vanilla.md), [análisis de referencia](../backend/referencia_api_completa.md) y [transición SSOO](../backend/transicion_backend_vanilla.md). Revisión interna de Juan Robaina pendiente.

## Orden de lectura

1. [Aclaraciones y pendientes del equipo](aclaraciones_y_pendientes.md), luego [revisión y dudas de incorporación](revision_documental.md).
2. [Charter](../../docs/project_charter.md), [informe de entrevista](../../docs/informe%20entrevista.md) y [concepción](../../docs/documentacion_proyecto_imsj.md).
3. [Requisitos](../../docs/Requerimientos.md), [backlog](../../docs/backlog.md) y [control de cambios](../../docs/control_cambios.md).
4. [Arquitectura](../../docs/arquitectura_propuesta.md), [modelo](../../docs/Justificaci%C3%B3n%20de%20clases,%20atributos%20y%20m%C3%A9todos.md), [diagramas](../../docs/Diagramas/README.md) y [API](../backend/api.md).
   Para CC-05, leer después [migración](../backend/migracion_backend_vanilla.md) y [comparación con la API base](../backend/referencia_api_completa.md).
5. [Planificación](../../docs/sprint_planning.md), [Review](../../docs/actas_sprint_review.md), [actas](../../docs/actas_reuniones.md) y [verificación](../evidencias/verificacion.md).
6. [Infraestructura SSOO](../../docs/ssoo/README.md), [seguridad](../../docs/analisis_ciberseguridad.md) y [declaración de IA](../../docs/declaracion_etica_ia.md).

## Inventario de la documentación original revisada

Se leyeron **20 Markdown, cuatro PDF (16 páginas originales), dos diagramas PNG**, `LICENSE` y `backend/public/robots.txt`. No se consideran documentación del equipo las dependencias generadas. El código, las rutas, el esquema, la configuración y las pruebas se consultaron como evidencia de correspondencia.

| Archivo original | Función y limitación encontrada |
|---|---|
| [README principal](../../README.md) | Estructura y acceso; faltaba una guía de incorporación. |
| [README backend](../../backend/README.md) | Inicio; se unifica con la guía SSOO y se explica la separación controlador/servicio/repositorio. |
| [project_charter.md](../../docs/project_charter.md) | Acuerdo inicial; adenda con roles, autoridad del referente y destinos confirmados. |
| [Entrevista.md](../../docs/Entrevista.md) | Preguntas previas; codificación corregida. |
| [informe entrevista.md](../../docs/informe%20entrevista.md) | Respuestas; fecha y autoría incompletas. |
| [documentacion_proyecto_imsj.md](../../docs/documentacion_proyecto_imsj.md) | Síntesis; códigos unificados y separación temporal de decisiones. |
| [Requerimientos.md](../../docs/Requerimientos.md) | Catálogo RF/RNF; se conserva la numeración original usada por US. |
| [backlog.md](../../docs/backlog.md) | US1–US28; criterios propuestos y cambios trazados. |
| [actas_reuniones.md](../../docs/actas_reuniones.md) | Cinco registros; acuerdos y tareas no registrados. |
| [actas_sprint_review.md](../../docs/actas_sprint_review.md) | Reconstrucción, no evidencia de cuatro reuniones. |
| [sprint_planning.md](../../docs/sprint_planning.md) | Períodos y puntos propuestos; capacidad no registrada. |
| [control_cambios.md](../../docs/control_cambios.md) | CC-01–CC-04 pendientes para entrega real, sin fecha ni prioridad distinta; aceptación futura en actas. |
| [Migración del backend](../backend/migracion_backend_vanilla.md) | Nuevo: CC-05, capas, compatibilidad, datos, seguridad, tareas TM y cierre pendiente. |
| [Referencia api-completa](../backend/referencia_api_completa.md) | Nuevo: 38 archivos y README raíz leídos; comparación fijada a `d6f61c9`. |
| [Transición SSOO](../backend/transicion_backend_vanilla.md) | Nuevo: adaptación pendiente de infraestructura y operación sin Laravel. |
| [arquitectura_propuesta.md](../../docs/arquitectura_propuesta.md) | Arquitectura e infraestructura; se aclara implementación observada. |
| [Justificación de clases, atributos y métodos.md](../../docs/Justificaci%C3%B3n%20de%20clases,%20atributos%20y%20m%C3%A9todos.md) | Modelo conceptual inicial; se añade correspondencia con el código actual. |
| [analisis_ciberseguridad.md](../../docs/analisis_ciberseguridad.md) | Diseño seguro; controles observados no equivalen a auditoría ejecutada. |
| [declaracion_etica_ia.md](../../docs/declaracion_etica_ia.md) | Declaración del 05/08 y adenda de esta intervención. |
| [ssoo/README.md](../../docs/ssoo/README.md) | Índice; enlaces corregidos. |
| [justificacion-tecnologica.md](../../docs/ssoo/justificacion-tecnologica.md) | Tecnologías y límites de producción. |
| [documentacion-infraestructura.md](../../docs/ssoo/documentacion-infraestructura.md) | Inventario de servicios; evidencia de reconstrucción pendiente. |
| [reconstruccion-infraestructura.md](../../docs/ssoo/reconstruccion-infraestructura.md) | Procedimiento local; se aclara cambio de puertos y uso sobre base nueva. |
| [MER.png](../../docs/Diagramas/MER.png) | Vista simplificada; ya contiene preguntas de prueba. |
| [UML.png](../../docs/Diagramas/UML.png) | Clases del dominio; nota de responsabilidad desactualizada. |
| [analisis_ciberseguridad.pdf](../../docs/analisis_ciberseguridad.pdf) | Tres páginas originales; matriz adicional sin método de valoración documentado. |
| [declaracion_etica_ia.pdf](../../docs/declaracion_etica_ia.pdf) | Seis páginas originales, con firmas en blanco. |
| [Política de privacidad](../../docs/Politica_de_Privacidad_IMSJ_Uruguay.pdf) | Cuatro páginas originales; borrador con datos y decisiones pendientes. |
| [Términos y condiciones](../../docs/Terminos_y_Condiciones_IMSJ_Uruguay.pdf) | Tres páginas originales; borrador con alcance y aceptación pendientes. |
| [LICENSE](../../LICENSE) | Titular/denominación a confirmar; sin modificación. |
| robots.txt (archivo de la versión anterior) | Permite rastreo; no constituye autorización ni política de privacidad. |

## Roles y flujo aclarados por el grupo

Las aclaraciones proporcionadas por el equipo el 02/10/2026 están reunidas en [aclaraciones y pendientes](aclaraciones_y_pendientes.md). No se deducen responsabilidades a partir de commits.

| Integrante | Rol / área confirmada |
|---|---|
| Tomás Cabrera | Líder de proyecto y desarrollador backend. |
| Juan Robaina | Testing y documentación; revisión y aprobación interna de documentos. |
| Gabriela Romero | Base de datos. |
| Verónica Romero | Desarrollo frontend. |
| Juan Corrales | Desarrollo frontend. |

| Aspecto del flujo | Aclaración / evidencia pendiente |
|---|---|
| Coordinación y avances | Se realizan en reuniones y se registran en las actas, a cargo del equipo. |
| Referente y aceptación del cliente | Inspector de Tránsito de la Intendencia, conocido como Nacho, con autoridad para aceptar entregas y aprobar cambios de alcance. Sus aprobaciones y solicitudes se registran en las actas. |
| Validación de documentos | Juan Robaina revisa y aprueba internamente. La revisión de esta actualización aún está pendiente; no equivale a aceptación del cliente ni a firma de todos los integrantes. |
| CC-01 a CC-04 | Pendientes para la entrega real, sin fecha fijada y sin prioridad distinta entre las cuatro solicitudes. |
| CC-05 | Backend PHP sin Laravel decidido por el grupo; documentación actualizada, implementación pendiente. La letra pide Laravel y su diferencia académica se registrará con docentes. |
| Alcance académico | Las agendas son el único módulo señalado como exclusivamente académico hasta el momento. |
| Operación posterior | Administración y mantenimiento por la Intendencia, por ahora. Contacto institucional se completará posteriormente. |
| Ramas, PR y reportes | La consigna exige ramas/PR y reportes quincenales. Las evidencias concretas y su relación con lo acordado en reuniones quedan para completar por el equipo. No se cambia el flujo Git. |

El trabajo de las actas queda a cargo del equipo. La lista de campos por completar está en el nuevo Markdown; esta actualización no completa ni modifica las actas.

## Cómo interpretar notas de IA

- **IA — Observación:** lectura comprobable de un archivo; incluye su fuente.
- **IA — Sugerencia:** propuesta documental o criterio que el equipo debe revisar.
- **IA — Suposición no confirmada:** interpretación que no puede tratarse como acuerdo.
- **No registrado / pendiente de validación:** falta evidencia, sin afirmar que la actividad no ocurrió.

El crédito del proyecto y la documentación corresponde a Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. El apoyo de IA se registra para distinguir sugerencias y suposiciones, sin crédito individual al asistente. La asistencia histórica solo se identifica cuando un documento la declara; no se deduce autoría por el estilo.
