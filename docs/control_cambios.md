# Control de cambios

**Proyecto:** Sistema de Gestión para Educación y Tránsito — IMSJ  
**Fecha de registro documental:** 07/09/2026

**Actualización de aclaraciones del grupo:** 02/10/2026

> **Revisión asistida por IA — 02/10/2026:** se conservan solicitudes y fechas registradas. Se agregan impactos documentales y evidencia separada. Las decisiones, estimaciones y aceptación no se deducen de la existencia del código.

Este documento registra los cambios comunicados por el equipo, sus fechas y las aclaraciones posteriores. El grupo confirmó el 02/10/2026 que **CC-01 a CC-04 están pendientes** y corresponden a la **entrega real**. No hay fecha de entrega fijada ni prioridad distinta entre estas cuatro solicitudes. «Pendiente» no acredita implementación terminada, pruebas ni aceptación final. El Inspector de Tránsito tiene autoridad para aceptar entregas y aprobar cambios; su aprobación o solicitud de ajustes se registra en actas a cargo del equipo.

## 1. Registro de solicitudes

| Código | Fecha de solicitud | Cambio | Solicitante o instancia informada | Estado actual |
|---|---|---|---|---|
| CC-01 | 14/08/2026 | Incorporar simulacros de pruebas teóricas. | Profesores, para mantener el nivel del curso. | Pendiente; entrega real |
| CC-02 | 03/09/2026 | Incorporar un formulario de consultas en el pie de página y su lectura en el panel IMSJ. | Auditoría / demo con el cliente. | Pendiente; entrega real |
| CC-03 | 03/09/2026 | Incorporar la validación de contenidos por la Directora y separar la aprobación de la publicación. | Auditoría / demo con el cliente. | Pendiente; entrega real |
| CC-04 | 03/09/2026 | Permitir adjuntar material gráfico a las preguntas de los test. | Auditoría / demo con el cliente. | Pendiente; entrega real |
| CC-05 | 02/10/2026 | Sustituir Laravel por un backend PHP sin framework, basado en `api-completa`. | Grupo, instrucción directa en esta actualización. | Decisión tecnológica confirmada; documentación preparada; implementación pendiente. |

## 2. Detalle de los cambios

### CC-01 — Simulacros de pruebas teóricas

**Solicitud:** agregar simulacros de pruebas teóricas al sistema.

**Motivo informado:** solicitud de los profesores para mantener el nivel del curso.

**Definiciones pendientes:** configuración del simulacro y criterios de resultado. No se establecen cantidades de preguntas, duración ni puntajes en este registro.

### CC-02 — Formulario de consultas y apartado en el panel IMSJ

**Solicitud:** agregar un formulario de consultas en el pie de página del sitio. Las consultas enviadas deben llegar a un apartado **Consultas** del panel IMSJ, donde cada consulta pueda desplegarse para leer su contenido.


### CC-03 — Validación de contenidos por la Directora

**Solicitud:** ampliar el manejo de estados de los contenidos e incorporar el rol **Directora**, responsable de su validación.

El flujo registrado en este documento es (sin evidencia de aprobación formal adjunta):

**Borrador → Pendiente → Aprobado → Publicado**

| Estado | Significado |
|---|---|
| Borrador | Contenido en preparación. |
| Pendiente | Contenido enviado para revisión de la Directora. |
| Aprobado | Contenido validado por la Directora y habilitado para su publicación posterior. |
| Publicado | Contenido publicado mediante una acción independiente de la aprobación. |


### CC-04 — Material gráfico en las preguntas de los test

**Solicitud:** permitir adjuntar material gráfico a las preguntas de los test o simulacros teóricos.

**Relación:** amplía la solicitud de simulacros de CC-01. El código observado contiene una base de banco/corrección, pero el grupo mantiene ambas solicitudes pendientes.

**Aspectos a revisar:** carga de adjuntos, asociación con la pregunta, almacenamiento y presentación al resolver el test.

**Definiciones pendientes:** solicitante e instancia de origen, formatos admitidos, cantidad y tamaño de adjuntos, y si su incorporación será opcional u obligatoria.

## 3. Impacto, decisión y evidencia por cambio

### CC-05 — Sustitución de Laravel por PHP sin framework

**Solicitud del grupo:** retirar Laravel y basar el backend en la [API completa de RodrigoCazard](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-completa). **Motivo registrado:** cambio de tecnología y referencia indicado por el grupo; no se deduce una mejora medida de rendimiento, costo o seguridad.

**Decisión:** cambio de framework confirmado por instrucción directa del grupo el 02/10/2026. No se atribuye a una reunión pasada ni a una aprobación del Inspector o de docentes. **Estado del producto:** pendiente de implementación y pruebas. **Estado documental:** guías y documentos afectados actualizados; revisión de Juan Robaina pendiente.

**Impacto:** router/arranque, validación/DTO, servicios, PDO/modelos, autenticación y revocación, JSON, archivos, esquema/instalación, Composer, Docker/scripts y pruebas. Afecta ambos frontends por su API compartida; se conserva su contrato como condición de compatibilidad. Abarca módulos reales y agenda académica, sin cerrar CC-01–CC-04.

**Documentación y tareas:** [migración](migracion_backend_vanilla.md), [referencia comparada](referencia_api_completa.md), [API](api.md), arquitectura/modelo/diagramas, seguridad, SSOO, backlog TM-01–TM-07, planning y [verificación](verificacion.md). RF/RNF y US mantienen sus identificadores; no se inventa una nueva función ciudadana por cambiar una tecnología.

**Límites:** no se adoptan automáticamente cookie JWT, nuevas rutas, formato `datos`/`mensaje`, roles o datos de productos, puertos y secretos del ejemplo. Esas diferencias se declaran para decisión previa del grupo. La letra académica indica Laravel; aceptación de PHP sin framework por docentes pendiente de registrar. No se impone una fecha, costo, puntos ni prioridad nueva.

**Responsabilidades:** se mantienen los roles generales del equipo: Tomás Cabrera liderazgo/backend, Gabriela Romero base de datos, Verónica Romero y Juan Corrales frontend, Juan Robaina testing/documentación y revisión interna. Las tareas concretas y compromisos los asignará el equipo en reuniones; las actas quedan a su cargo.

**Cierre esperado:** API PHP sin dependencias Laravel/Eloquent/Sanctum ni pasos Artisan; compatibilidad comprobada en los dos frontends; datos/archivos preservados y transición de sesiones registrada; pruebas de seguridad/negocio y concurrencia MySQL; reconstrucción/restauración documentadas; versión y revisión interna registradas. Aceptaciones académicas y del cliente se registrarán cuando ocurran. Ver V-CC05-01–V-CC05-09; no se acredita su cumplimiento actual.

**IA — Observación de trazabilidad:** impactos técnicos/documentales derivados de la solicitud. Tiempo, costo y tareas por integrante no están estimados/asignados aquí. La ausencia de fecha y de prioridad distinta entre CC-01–CC-04 fue confirmada por el grupo; no se inventa un orden de implementación.

| ID | Impacto en alcance / documentos | Backlog / requisitos | Decisión y responsable | Evidencia técnica | Tiempo, costo y aceptación |
|---|---|---|---|---|---|
| CC-01 | Simulacro, banco de preguntas y corrección; falta configuración acordada; destino confirmado: entrega real. | RF22, US31 (borrador). | Pendiente para entrega real, confirmado por el grupo; tarea/responsable concreto no registrado. Origen: profesores. | PreguntaPrueba, servicio/controlador, rutas y AdministrationAndQuizTest; sin resultado adjunto. | Sin fecha fijada; costo no estimado / aceptación no registrada. |
| CC-02 | Formulario de pie de portal, persistencia y lectura en panel; implica datos de consultas y permisos. | RF23, US32 (borrador). | Pendiente para entrega real, confirmado por el grupo; tarea/responsable concreto no registrado. Instancia: demo 03/09. | Sin circuito localizado. La consulta de reservas no cumple este cambio. | Sin fecha fijada; costo no estimado / aceptación no registrada. |
| CC-03 | Estados, aprobación separada y rol Directora; afecta permisos, modelo, UI, API y auditoría. | RF21, US30 (borrador), US2/US7/US9. | Pendiente para entrega real, confirmado por el grupo; tarea/responsable concreto no registrado. Instancia: demo 03/09. | Actual: PUBLICADO/NO_PUBLICADO y PUBLICO_GENERAL/PERSONAL_IMSJ. No se localizó flujo solicitado. | Sin fecha fijada; costo no estimado / aceptación no registrada. |
| CC-04 | Gráficos asociados a preguntas, almacenamiento y presentación; amplía CC-01. | RF24, US33 (borrador). | Pendiente para entrega real, confirmado por el grupo; tarea/responsable concreto y solicitante personal no registrados. | Preguntas de prueba no tienen adjunto ni validación de archivo. | Sin fecha fijada; costo no estimado / aceptación no registrada. |
| CC-05 | Sustitución tecnológica transversal; guías de migración, API, arquitectura, seguridad, SSOO y pruebas. | Todos los módulos ya presentes; RNF1–RNF4/RNF7–RNF10 y tareas TM-01–TM-07. | Decisión tecnológica del grupo confirmada; tareas concretas por acordar; revisión documental de Juan Robaina pendiente. | Código/configuración aún Laravel en `df581ab`; referencia leída en `d6f61c9`; no hay migración ni resultados PHP. | Sin fecha/costo/estimación fijados; aprobación académica y aceptación del cliente no registradas. |

### Definiciones necesarias para cerrar cada solicitud

- **CC-01:** cantidad y selección de preguntas, duración si corresponde, criterios de resultado, responsable del banco y aceptación. Los valores 10 preguntas / máximo 20 respuestas son del código, no acuerdos.
- **CC-02:** campos de formulario, permisos de lectura, tratamiento y conservación; no se añade un sistema de respuestas o notificaciones que la solicitud no pidió.
- **CC-03:** contenidos afectados, quién envía/aprueba/publica, rechazo, cambios después de aprobar y transición de datos existentes. Las reglas no registradas quedan pendientes.
- **CC-04:** solicitante, formatos, límites, obligatoriedad y criterio de presentación/validación del gráfico.

**IA — Sugerencia de evidencia de cierre:** vincular decisión fechada, responsable, versión/commit, criterios revisados, pruebas y aceptación. «Aplicado» debe distinguir modificación documental de implementación y aceptación del producto.

## 4. Aclaración de alcance anterior a estas solicitudes

La exclusión de agenda para el cliente consta en entrevista y charter; la letra académica la mantiene. El commit `e8fa050` del 20/07/2026 registra documentación de alcance excluido, pero no prueba la fecha exacta de la decisión del cliente. Falta identificar su validación y efectos en entrega. No se atribuye a la demo del 03/09.

## 5. Registro de la intervención documental actual

| ID | Fecha | Origen | Cambio | Decisión / estado | Alcance y validación |
|---|---|---|---|---|---|
| DOC-20261002 | 02/10/2026 | Solicitud del grupo de revisar y reparar documentación con IA identificada. | Unificar códigos conservando equivalencias, corregir enlaces/codificación, completar estructura de actas y cambios, añadir trazabilidad, guía/API/verificación y comentarios de PDF. | Correcciones documentales preparadas con apoyo externo de IA; revisión del equipo pendiente. | Crédito y responsabilidad editorial del grupo. Sin cambio de software, decisiones de producto, roles o licencia. Detalle en [revisión](revision_documental.md). |

**Actualización documental autorizada — 02/10/2026:** se integran roles, referente/autoridad, registro en reuniones, entrega real, estado pendiente de los cuatro cambios, ausencia de fecha/prioridad distinta y mantenimiento institucional. Se añade [aclaraciones y pendientes](aclaraciones_y_pendientes.md) y se actualizan las hojas de revisión de los PDF con su identidad gráfica original. Juan Robaina revisará y aprobará internamente esta versión; no se registra esa aprobación como realizada. Las actas y el código no se modifican.

Fuente de estructura: [control de cambios del curso](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/06_control_de_cambios.md).

### DOC-CC05 — Documentación del cambio tecnológico

**02/10/2026, actualización solicitada por el grupo:** documentación del backend PHP de destino y de su migración desde Laravel, con comparación completa de la API base y criterios de compatibilidad. Se actualizan índice, READMEs, arquitectura, API, modelo/diagramas, requisitos, backlog/planning, SSOO, seguridad, revisión, pendientes, registro de IA y hojas/comentarios de PDF. Código, configuración, esquema, pruebas, actas, diagramas PNG y licencia no se modifican en esta intervención. Documentar el cambio no equivale a migrarlo ni a darlo por aceptado. El crédito documental corresponde al grupo.
