> **Actualización CC-05 - 05/10/2026:** el backend de trabajo ya fue reescrito en PHP nativo a partir de api-simple, con la estructura de siete módulos solicitada. [Implementación/transición](migracion_backend_vanilla.md), [flujos](flujo_endpoints_backend.md) y [pruebas ejecutadas y límites](verificacion.md). Las menciones siguientes a código Laravel o destino api-completa corresponden al antecedente fechado del 02/10, conservado para trazabilidad. CC-01 a CC-04 siguen pendientes; las actas y aprobaciones permanecen a cargo del equipo.

---

# Revisión documental del proyecto

**Fecha:** 02/10/2026. **Base revisada:** commit `df581ab`.
**Equipo responsable y destinatario del crédito:** Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales.
**Preparación:** apoyo externo de IA, sin crédito individual al asistente.
**Estado:** correcciones documentales y observaciones para revisión humana; no constituye aceptación del cliente.

## Comprensión actual del proyecto

Educación Vial IMSJ centraliza noticias, materiales y preguntas frecuentes de la Sección Tránsito de la Intendencia de San José. Tiene dos interfaces estáticas y una API Laravel con MySQL. La agenda se conserva para la evaluación académica y está excluida de la entrega al cliente según el relevamiento y el charter. El código también contiene un simulacro teórico y administración de personal.

La entrevista inicial describe administrativos con iguales permisos y aprobación institucional de noticias. CC-03 registra después un rol Directora y cuatro estados. El código revisado conserva dos roles y dos estados: documentar la solicitud no demuestra que esté implementada.

## Dificultades de incorporación detectadas

Las siguientes son **observaciones de IA con evidencia**, no testimonios de reuniones ni decisiones nuevas del equipo.

| ID | Dificultad e impacto para incorporarse | Evidencia encontrada | Solución documental aplicada o pendiente |
|---|---|---|---|
| D-01 | RF3 es ambiguo sin identificar el documento: significa agenda en uno y materiales en otro. | `Requerimientos.md` y sección 11 de `documentacion_proyecto_imsj.md`; también cambian RNF8 y EP3–EP5. | Se conserva la numeración usada por el backlog y la justificación; el documento general remite a ella y conserva una equivalencia de los códigos anteriores. |
| D-02 | No queda claro qué debe prepararse para el cliente y qué corresponde solo a la evaluación académica. | El charter excluye agenda para IMSJ, pero sus criterios de éxito la incluyen sin distinguir destino; el documento general mezcla ambos alcances. | Se explicitan ambos destinos y se separan las solicitudes posteriores de los compromisos iniciales. Falta confirmar cómo se entregarán técnicamente las dos variantes. |
| D-03 | Los integrantes están identificados; falta saber a quién acudir para revisar una tarea o resolver un bloqueo. | Hay cinco nombres en actas y declaración; no hay asignaciones de líder, backend, frontend, base/seguridad o pruebas/documentación. | Resuelto en esta actualización mediante aclaración directa del grupo: Tomás lidera/backend; Juan Robaina testing/documentación y revisión/aprobación interna; Gabriela base de datos; Verónica y Juan Corrales frontend. No se deducen roles de commits. |
| D-04 | Las actas cuentan qué se conversó, pero no permiten retomar acuerdos ni tareas. | R-01–R-05 tienen discusiones breves, sin decisiones detalladas, responsables, vencimientos ni desacuerdos. Horas 4:15–5:15 sin indicación AM/PM. | Se conservan los registros y se agregan campos explícitos «No registrado». El equipo debe completarlos con evidencia, no recuerdos presentados como certeza. |
| D-05 | No se puede comprobar cuándo ocurrió la entrevista inicial ni quién validó sus respuestas. | Fecha y entrevistadores en blanco en `informe entrevista.md`; el nombre completo de la síntesis no fue confirmado por el grupo. | Se conserva el informe histórico. El referente actual se identifica por instrucción del grupo como Inspector de Tránsito, conocido como Nacho, sin apellido confirmado. Fecha/participantes y validación de la entrevista quedan para el equipo. |
| D-06 | El control de cambios no identifica quién decidió, qué documento afecta ni cuándo debe cerrarse. | CC-01–CC-04 estaban solo «Registrado», sin impacto, decisión o evidencia de aceptación. | Se añaden impacto, trazabilidad, evidencia técnica y pendientes por solicitud; se registra aparte la revisión actual, sin aprobar solicitudes anteriores. |
| D-07 | Falta información para considerar terminada una historia y estimar el trabajo restante. | US1–US28 estaban «Pendiente», sin criterios ni puntos; RNF2 no tenía historia propia; faltaban CC-01–CC-04. | Se conservan los estados históricos, se añade evidencia separada y criterios propuestos por IA. Las historias derivadas de solicitudes se marcan como borradores; las estimaciones quedan pendientes. |
| D-08 | Los cuatro períodos reconstruidos no acreditan ceremonias Scrum ni velocidad real. | Planning creado el 08/09 con períodos anteriores; Review ya reconoce reconstrucción y termina sin cierre del sprint 4. | Se refuerza la distinción entre reconstrucción y acta; se relacionan tareas con US y se completan los campos del cierre como pendientes. No se inventan participantes, citas, aprobación ni puntos terminados. |
| D-09 | El modelo conceptual y el UML necesitan una lectura conjunta que explique el sistema actual. | Justificación omite `PreguntaPrueba`, afirma que categorías/aprobación no forman parte del alcance; UML atribuye lógica a controladores, pero existen servicios y repositorios. | Se añade correspondencia conceptual–implementación y una nota de actualización junto a las imágenes. El MER ya incluye preguntas de prueba: no se lo acusa de omitirlas. Faltan tokens y restricciones en esa vista simplificada. |
| D-10 | Falta claridad sobre las direcciones de API actuales y las operaciones de la consigna que siguen pendientes. | La letra usa `/auth/login`, `/agendas` y cancelación; las rutas actuales usan `/login`, `/reservas` y no incluyen cancelación. | Se documenta la API observada y las diferencias. Costo urgente y enlaces útiles de FAQ requieren decisión; no se agregan funciones al código. |
| D-11 | La reconstrucción tiene enlaces rotos y promete que basta cambiar un puerto. | Índice SSOO enlaza nombres `01-`, `02-`, `03-` inexistentes; ambos `js/api.js` fijan `localhost:8000`. | Se corrigen enlaces y se aclaran límites de puertos/acceso remoto. La validación de Compose declarada el 02/09 no tiene salida adjunta. |
| D-12 | Los requisitos de seguridad necesitan distinguirse de las medidas probadas. | Análisis inicial en futuro, PDF con matriz sin método de valoración; existen pruebas, pero no resultados versionados. | Se añaden controles observados, pruebas disponibles y carencias de evidencia. SQLite en memoria no prueba concurrencia real en MySQL. |
| D-13 | Los PDF parecen entregables institucionales, pero todavía tienen supuestos y campos sin completar. | Política y términos tienen `[COMPLETAR]`; incluyen reservas, aceptación y conservación no cerradas. No existe evidencia de validación jurídica/institucional. | Se añaden notas de revisión de IA en los PDF, conservando el texto original y sus fechas. No se inventan contactos, bases jurídicas ni plazos. |
| D-14 | No está identificado qué uso de IA fue validado ni por quién. | Declaración general sin firmas; R-04 reconoce ordenar el modelo con IA; planificación retrospectiva sin autoría identificada. | Se conserva la declaración histórica, se distingue de la revisión actual y se añade registro de herramienta, documento, uso, evidencia y validación humana pendiente. El estilo de un texto no se usa como detector de IA. |
| D-15 | Falta información para reproducir el flujo de contribución y comprobar entregas completas. | Solo se observan `main` y `origin/main` localmente; no hay guía interna de ramas/revisión ni acuses. La consigna pide PR y reportes quincenales. | Se documenta lo exigido y lo que falta confirmar. No se afirma que nunca hubo PR ni se cambia la estrategia de ramas. |
| D-16 | La titularidad de los derechos sobre el software necesita confirmación. | `LICENSE` nombra «Instituto Municipal de Seguridad y Justicia», distinto de la Intendencia usada por el proyecto. | Se deja pendiente confirmar titular y denominación; no se cambia un aviso legal sin información del equipo. |

## Cómo se usaron los repositorios de referencia

Consulta del 02/10/2026, fijada a las revisiones siguientes para poder repetir la comparación:

- `portalutu/proyecto-3ro-bt-2026`: `841e992a88e4be1d38feaa93e10b02d69c31f8cc`.
- `portalutu/ing_software-3ro-bt`: `ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a`.

| Fuente | Aplicación en este proyecto |
|---|---|
| [Letra IMSJ](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Proyectos/proyecto_educacion_vial_IMSJ.md) | Comparar arquitectura, agenda, API, roles de equipo, Git y entregables. Sus tablas sugeridas no se copian como diseño aprobado. |
| [Requisitos por asignatura](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Lineamientos/requerimientos_por_asignatura.md) | Separar entregables existentes de evidencias y documentos pendientes. |
| [Charter](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/01_project_charter.md), [actas](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/09_actas_de_reuniones.md) y [cambios](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/06_control_de_cambios.md) | Conservar el charter inicial y registrar las aclaraciones fechadas; añadir acuerdos, pendientes, impactos y decisiones a los registros. |
| [Historias](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/03_historias_de_usuario.md), [backlog](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/04_backlog_por_sprint.md) y [Review](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/05_sprint_review.md) | Añadir criterios y vínculos entre solicitud, US, sprint y evidencia. No trasladar puntos, velocidad o aprobaciones de TamboTrace. |
| [Historias de usuario](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/user-stories.md) y [Sprint Planning](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/sprint-planning.md) | Relacionar necesidad, criterio, tarea y capacidad. Proponer criterios sin presentarlos como acuerdos existentes. |
| [Modelado TamboTrace](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Practicos/ada-tambotrace.md) | Distinguir derivación conceptual, clases implementadas y relaciones físicas. |
| [Ética de IA](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/08_etica_uso_de_ia.md) y [estilo Markdown](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/documentos/manual_estilo_markdown.md) | Identificar asistencia y revisión humana, corregir enlaces, jerarquía y tablas. Las observaciones de esta auditoría no son contenido validado por estudiantes. |

Los ejemplos también contienen inconsistencias: la Review de TamboTrace referencia códigos CC distintos de los del registro, y su sprint 4 sigue sumando 33 puntos después de mencionar recortes. Se toma la estructura, no esos valores ni la afirmación de que resuelven automáticamente la capacidad.

## Información pendiente para acoplarse al flujo

**Aclarado por el grupo:** roles individuales; revisión/aprobación documental interna por Juan Robaina; Inspector de Tránsito como referente con autoridad para aceptar entregas y cambios; coordinación y registro en reuniones/actas; administración y mantenimiento posteriores por la Intendencia, por ahora. Las agendas son exclusivamente académicas y CC-01–CC-04 están pendientes para entrega real, sin fecha ni prioridad distinta.

**Pendiente del equipo:** completar las actas, los datos históricos y las evidencias concretas de pruebas, Git y entregas. Las reglas de los cambios, la configuración de la entrega real y los campos institucionales se reúnen en [aclaraciones y pendientes](aclaraciones_y_pendientes.md). El contacto oficial se añadirá posteriormente. Esta actualización no interviene en las actas.

**IA — Sugerencia para completar los documentos:** al resolver un pendiente, incorporar el dato y su fuente o enlace a evidencia. Solo se registran responsables y fechas si el equipo los acuerda; no se exige inventar una fecha de entrega ni prioridades distintas.

## Correspondencia de entregables

| Entregable de referencia | Situación al revisar |
|---|---|
| Requisitos, modelado, arquitectura y planificación | Existen; se corrige coherencia y se marcan brechas. |
| API y testing en Markdown | Se añaden inventario de rutas observadas y matriz de verificación, sin certificar ejecución. |
| Entrevistas y actas | Existen registros parciales; faltan procedencia, decisiones y validaciones. |
| Autenticación/criptografía y hardening | Hay código y documentación de infraestructura; falta evidencia de ejecución y revisión completa. |
| SAST con capturas y correcciones | No se localizaron evidencias en los archivos versionados. |
| Manual de usuario y acta de cierre | No localizados. Deben describir la versión aceptada; no se fabrica un cierre. |
| Backup completo Docker + datos, DAST, pruebas de seguridad y respuesta a incidentes | No localizados como entregables completos. |
| Acuses de recibo y reportes quincenales | No localizados; Git no sustituye esos registros. |

La referencia anuncia tercera entrega el **15/10/2026** y defensa con fecha por establecer ([lineamientos](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Lineamientos/README.md)). La letra IMSJ menciona demo de 15 minutos y los lineamientos una defensa de 60: el equipo debe confirmar con docentes cómo se integran, sin inventar un cronograma.

## Límite de esta intervención

Se corrigen documentos, vínculos y trazabilidad; los PDF reciben comentarios y una hoja de revisión que distingue aclaraciones del grupo de observaciones de IA y conserva la identidad visual original. Se conservan registros históricos y se evita atribuir nuevas decisiones a reuniones anteriores.

**Requiere decisión y autorización posterior:** modificar código para completar CC-01–CC-04, categorías, costo urgente, cancelaciones, direcciones de API o despliegue; adoptar reglas de producto aún no acordadas; cambiar el flujo Git, cláusulas legales o licencia. La asignación de roles, autoridad del referente, estado/destino de cambios y responsabilidad institucional ya fue proporcionada por el grupo y se integra aquí; los datos institucionales restantes siguen pendientes. Esas acciones quedan declaradas y pendientes.

La revisión de IA no determina la validez jurídica de los PDF ni la autoría histórica de textos sin evidencia. Las leyes citadas en ellos no fueron revalidadas en esta intervención.

**Actualización autorizada — 02/10/2026:** se añade el Markdown de aclaraciones y campos pendientes; se actualizan las referencias afectadas y las cuatro hojas/comentarios de PDF con la tipografía, tablas y colores originales. Se reutiliza el logo RC5 extraído de la declaración de IA. No se modifican actas, funciones del sistema ni avisos legales históricos. La revisión interna de Juan Robaina queda pendiente.

El inventario completo de archivos y el orden de lectura están en [el índice documental](README.md). La comprobación final de enlaces, tablas, referencias y PDF se registra en [verificación](verificacion.md).

## Actualización tecnológica solicitada — CC-05, 02/10/2026

El grupo decide retirar Laravel y basar el backend en PHP sin framework a partir de la API completa de RodrigoCazard. La comprensión inicial de este informe conserva el estado Laravel leído en `df581ab`; el destino se actualiza con esta decisión posterior, sin alterar hechos históricos.

**IA — Análisis realizado:** se leyeron los 38 archivos de `api-completa` y el README raíz en `d6f61c999369b754d70bfa0621a154e9a630589a`. Se contrastaron capas, dependencias, rutas, PDO, validación/DTO, JWT/cookie, respuestas, limitador y Docker/SQL con código, frontends y esquema IMSJ. La [comparación completa](referencia_api_completa.md) documenta diferencias y límites; no se ejecutó ni incorporó el ejemplo al código.

La [guía de migración](migracion_backend_vanilla.md) y la [transición SSOO](ssoo/transicion_backend_vanilla.md) son documentos nuevos. Se actualizan READMEs, índice, control CC-05, arquitectura/diagramas/modelo, API, requisitos, backlog/planning, seguridad, pendientes, registro de IA y hojas/comentarios de PDF. Los diagramas Mermaid muestran el destino; las vistas PNG y responsabilidades Eloquent se conservan como antecedentes.

**Decisión confirmada:** PHP sin Laravel, por capas/PDO. **Trabajo pendiente:** código, infraestructura, SQL/procedimientos, diseño de tokens/sesiones y pruebas V-CC05. **Alternativas sin adopción:** cookie JWT, otro JSON/rutas, puertos/roles/datos del ejemplo. No se cambian funciones ni contratos del producto por copiar la referencia. La letra pide Laravel; registrar con docentes la diferencia queda pendiente, sin afirmar su aprobación.

La sustitución no cierra CC-01–CC-04 ni cambia la agenda exclusivamente académica. Actas, código, configuración, esquema, pruebas, PNG originales y licencia se conservan respecto del inicio de esta intervención. El crédito corresponde al grupo y la revisión de Juan Robaina está pendiente. La [verificación](verificacion.md) registra la comprobación documental, separada de pruebas del producto.
