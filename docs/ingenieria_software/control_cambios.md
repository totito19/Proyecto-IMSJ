# Control de cambios

**Proyecto:** Sistema de Gestión para Educación y Tránsito — IMSJ  
**Fecha de registro documental:** 07/09/2026

**Actualización técnica para demo:** 13/10/2026

> **Revisión asistida por IA — 02/10/2026:** se conservan solicitudes y fechas registradas. Se agregan impactos documentales y evidencia separada. Las decisiones, estimaciones y aceptación no se deducen de la existencia del código.

Este documento registra los cambios comunicados por el equipo, sus fechas y las aclaraciones posteriores. **Estado consolidado al 15/10/2026: CC-01–CC-05, Listos.** CC-02–CC-04 surgieron de la reunión/demo del 03/09 con la Directora y el Inspector de Tránsito y fueron implementados y verificados en la versión del 13/10. CC-01 y CC-05 también se encuentran implementados conforme al comportamiento descrito en este documento.

## 1. Registro de solicitudes

| Código | Fecha de solicitud | Cambio | Solicitante o instancia informada | Estado actual |
|---|---|---|---|---|
| CC-01 | 14/08/2026 | Incorporar simulacros de pruebas teóricas. | Profesores, para mantener el nivel del curso. | **Listo** |
| CC-02 | 03/09/2026 | Incorporar un formulario de consultas en el pie de página y su lectura en el panel IMSJ. | Reunión/demo con Directora e Inspector de Tránsito. | **Listo** |
| CC-03 | 03/09/2026 | Incorporar la validación de contenidos por la Directora y separar la aprobación de la publicación. | Reunión/demo con Directora e Inspector de Tránsito. | **Listo** |
| CC-04 | 03/09/2026 | Permitir adjuntar material gráfico a las preguntas de los test. | Reunión/demo con Directora e Inspector de Tránsito. | **Listo** |
| CC-05 | 02/10/2026 | Sustituir Laravel por un backend PHP sin framework, siguiendo `api-simple`. | Grupo, instrucción directa. | **Listo** |

## 2. Detalle de los cambios

### CC-01 — Simulacros de pruebas teóricas

**Solicitud:** agregar simulacros de pruebas teóricas al sistema.

**Motivo informado:** solicitud de los profesores para mantener el nivel del curso.

**Comportamiento implementado:** selección aleatoria de hasta diez preguntas, cuatro opciones, corrección posterior por respuesta y resultado con total/aciertos. No utiliza temporizador ni umbral de aprobación.

### CC-02 — Formulario de consultas y apartado en el panel IMSJ

**Solicitud:** agregar un formulario de consultas en el pie de página del sitio. Las consultas enviadas deben llegar a un apartado **Consultas** del panel IMSJ, donde cada consulta pueda desplegarse para leer su contenido.


### CC-03 — Validación de contenidos por la Directora

**Solicitud:** ampliar el manejo de estados de los contenidos e incorporar el rol **Directora**, responsable de su validación.

El flujo implementado y verificado es:

**Borrador → Pendiente → Aprobado → Publicado**

| Estado | Significado |
|---|---|
| Borrador | Contenido en preparación. |
| Pendiente | Contenido enviado para revisión de la Directora. |
| Aprobado | Contenido validado por la Directora y habilitado para su publicación posterior. |
| Publicado | Contenido publicado mediante una acción independiente de la aprobación. |


### CC-04 — Material gráfico en las preguntas de los test

**Solicitud:** permitir adjuntar material gráfico a las preguntas de los test o simulacros teóricos.

**Relación:** amplía la solicitud de simulacros de CC-01. El banco, la corrección y el material gráfico están implementados.

**Comportamiento implementado:** una imagen opcional por pregunta, JPG/PNG/WEBP de hasta 2048 KB, asociada al registro y presentada al resolver el test.

### Implementación de demo — 13/10/2026

Se implementaron CC-02, CC-03 y CC-04 sobre el backend PHP nativo existente: formulario de pie y bandeja de lectura; rol Directora y flujo de cuatro estados aplicado a noticias, materiales y preguntas frecuentes; una imagen opcional por pregunta del simulador. Se añadió una migración idempotente para instalaciones Docker con volumen existente. La comprobación técnica incluyó arranque aislado con Docker, 41 verificaciones HTTP y revisión visual de portal/panel. Estado: **Listo**.

## 3. Impacto, decisión y evidencia por cambio

### CC-05 — Sustitución de Laravel por PHP sin framework

**Solicitud del grupo:** retirar Laravel y basar el backend en la [API completa de RodrigoCazard](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-completa). **Motivo registrado:** cambio de tecnología y referencia indicado por el grupo; no se deduce una mejora medida de rendimiento, costo o seguridad.

**Decisión:** cambio de framework confirmado por instrucción directa del grupo el 02/10/2026. No se atribuye a la reunión/demo ni a la Directora o al Inspector. El backend nativo y las pruebas HTTP/MySQL quedaron implementados el 05/10; la verificación Docker aislada y visual se completó el 13/10. **Estado actual: Listo.**

**Impacto:** router/arranque, validación/DTO, servicios, PDO/modelos, autenticación y revocación, JSON, archivos, esquema/instalación, Composer, Docker/scripts y pruebas. Afecta ambos frontends por su API compartida; se conserva su contrato como condición de compatibilidad. Abarca los módulos reales y la agenda académica. CC-01–CC-04 también están **Listos**.

**Documentación y tareas:** [migración](../docs_auxiliares/backend/migracion_backend_vanilla.md), [referencia comparada](../docs_auxiliares/backend/referencia_api_completa.md), [API](../docs_auxiliares/backend/api.md), arquitectura/modelo/diagramas, seguridad, SSOO, backlog TM-01–TM-07, planning y [verificación](../docs_auxiliares/evidencias/verificacion.md). RF/RNF y US mantienen sus identificadores; no se inventa una nueva función ciudadana por cambiar una tecnología.

**Límites:** no se adoptaron automáticamente cookie JWT, rutas, formato `datos`/`mensaje`, roles, datos de productos, puertos o secretos del ejemplo. Se implementó el contrato propio del proyecto en PHP sin framework conforme a la instrucción del grupo. No se impone una fecha, costo, puntos ni prioridad nueva.

**Responsabilidades:** se mantienen los roles generales del equipo: Tomás Cabrera liderazgo/backend, Gabriela Romero base de datos, Verónica Romero y Juan Corrales frontend, Juan Robaina testing/documentación y revisión interna. Las tareas concretas y compromisos los asignará el equipo en reuniones; las actas quedan a su cargo.

**Resultado final del alcance acordado:** API PHP sin dependencias Laravel/Eloquent/Sanctum ni pasos Artisan; contrato consumido por ambos frontends; datos/archivos preservados; transición de sesiones, reconstrucción y restauración documentadas; pruebas de negocio, seguridad y concurrencia MySQL registradas. Ver V-CC05-01–V-CC05-09 en [verificación](../docs_auxiliares/evidencias/verificacion.md). **Estado: Listo.**

**IA — Observación de trazabilidad:** impactos técnicos/documentales derivados de la solicitud. Tiempo, costo y tareas por integrante no están estimados/asignados aquí. La ausencia de fecha y de prioridad distinta entre CC-01–CC-04 fue confirmada por el grupo; no se inventa un orden de implementación.

| ID | Impacto en alcance / documentos | Backlog / requisitos | Origen y estado | Evidencia técnica | Notas |
|---|---|---|---|---|---|
| CC-01 | Simulacro, banco de preguntas y corrección. | RF22, US31. | **Listo.** Origen: profesores. | Banco, selección aleatoria y corrección comprobados por HTTP. | Comportamiento vigente documentado. |
| CC-02 | Formulario de pie de portal, persistencia y lectura en panel. | RF23, US32. | **Listo.** Reunión/demo del 03/09 con Directora e Inspector. | Formulario, tabla `consultas`, API y bandeja verificados el 13/10. | Comportamiento vigente documentado. |
| CC-03 | Estados, aprobación separada y rol Directora. | RF21, US30, US2/US7/US9. | **Listo.** Reunión/demo del 03/09 con Directora e Inspector. | BORRADOR/PENDIENTE/APROBADO/PUBLICADO y rol DIRECTORA verificados el 13/10. | Comportamiento vigente documentado. |
| CC-04 | Gráficos asociados a preguntas, almacenamiento y presentación. | RF24, US33. | **Listo.** Reunión/demo del 03/09 con Directora e Inspector. | Carga, persistencia y presentación pública verificadas el 13/10. | Comportamiento vigente documentado. |
| CC-05 | Sustitución tecnológica transversal; guías, API, arquitectura, seguridad, SSOO y pruebas. | Todos los módulos; RNF1–RNF4/RNF7–RNF10 y TM-01–TM-07. | **Listo.** Decisión tecnológica del grupo. | Backend nativo y evidencia HTTP/MySQL en [verificación](../docs_auxiliares/evidencias/verificacion.md); api-simple fijada a `d6f61c9`. | Comportamiento vigente documentado. |

### Configuración aplicada a cada solicitud

- **CC-01:** hasta diez preguntas aleatorias y entre una y veinte respuestas por corrección; sin duración ni umbral de aprobación.
- **CC-02:** nombre, correo y mensaje; envío público, lectura por personal y marcado como leído. No incluye respuestas ni notificaciones.
- **CC-03:** noticias, materiales y FAQ; personal prepara, envía y publica; solo Directora aprueba; editar devuelve a borrador.
- **CC-04:** una imagen opcional JPG/PNG/WEBP de hasta 2048 KB por pregunta.

La evidencia técnica, las rutas y las pruebas asociadas se encuentran en [verificación](../docs_auxiliares/evidencias/verificacion.md).

## 4. Aclaración de alcance anterior a estas solicitudes

La exclusión de agenda para el cliente consta en entrevista y charter; la letra académica la mantiene. El commit `e8fa050` del 20/07/2026 registra documentación de alcance excluido, pero no prueba la fecha exacta de la decisión del cliente. Falta identificar su validación y efectos en entrega. No se atribuye a la demo del 03/09.

## 5. Registro de la intervención documental actual

| ID | Fecha | Origen | Cambio | Decisión / estado | Alcance y validación |
|---|---|---|---|---|---|
| DOC-20261002 | 02/10/2026 | Solicitud del grupo de revisar y reparar documentación con IA identificada. | Unificar códigos conservando equivalencias, corregir enlaces/codificación, completar estructura de actas y cambios, añadir trazabilidad, guía/API/verificación y comentarios de PDF. | Correcciones documentales incorporadas; estado funcional consolidado al 15/10: **CC-01–CC-05, Listos**. | Crédito y responsabilidad editorial del grupo. Sin cambio de licencia. Detalle en [revisión](../docs_auxiliares/revision/revision_documental.md). |

**Actualización documental del 02/10/2026:** se integraron roles, referente, registro en reuniones, distinción entre entrega real y académica, ausencia de fecha/prioridad distinta y mantenimiento institucional. Se añadió [aclaraciones y pendientes](../docs_auxiliares/revision/aclaraciones_y_pendientes.md) y se actualizaron las hojas de revisión de los PDF con su identidad gráfica original. Aquella nota antecede a la implementación posterior; estado vigente al 15/10: **CC-01–CC-05, Listos**.

Fuente de estructura: [control de cambios del curso](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/06_control_de_cambios.md).

### DOC-CC05 — Documentación del cambio tecnológico

**02/10/2026, actualización solicitada por el grupo:** documentación del backend PHP de destino y de su migración desde Laravel, con comparación completa de la API base y criterios de compatibilidad. Se actualizaron índice, READMEs, arquitectura, API, modelo/diagramas, requisitos, backlog/planning, SSOO, seguridad, revisión, pendientes, registro de IA y hojas/comentarios de PDF. En aquel corte todavía se documentaba el destino; la implementación se completó después. Estado vigente al 15/10: **Listo**. El crédito documental corresponde al grupo.


### CC-05 - Reescritura y referencia simple, 05/10/2026

**Instrucción directa del grupo:** reescribir desde cero por rastros de Laravel, usar el ejemplo api-simple, código comentado, estructura explícita de los siete módulos existentes en la línea base del 05/10 y PDF de flujo de cada endpoint. Es un refinamiento de CC-05; no se inventa otra solicitud funcional. CC-02 añadió después el octavo módulo, Consulta.

**Resultado de la línea base del 05/10:** entrada public/index.php, config.php, Database/Response/Auth, siete controladores/servicios/repositorios, modelos nativos, database.sql, Composer, Docker/Compose, scripts operativos y suite HTTP/MySQL. Se retiraron componentes y pruebas del framework y se conservaron 42 rutas, diez tablas de negocio, almacenamiento y nombres de servicios/volúmenes Docker. CC-02–CC-04 ampliaron después la versión actual a ocho módulos, 45 rutas y once tablas del dominio. Sesiones anteriores requieren nuevo login; las sesiones nativas son revocables, duran ocho horas y almacenan el secreto con hash. [Referencia vigente](../docs_auxiliares/backend/referencia_api_simple.md) y [guía](../docs_auxiliares/backend/migracion_backend_vanilla.md).

**Evidencia:** sintaxis PHP y pruebas reales sobre MySQL aislado, incluido último cupo con dos procesos PHP y rollback de datos/archivo cuando falla auditoría. Los resultados detallados y hashes se registran en [verificación](../docs_auxiliares/evidencias/verificacion.md). No se ejecutó Docker/Apache ni una actualización/restauración de datos institucionales, ni recorrido visual integral de ambos frontends. No se declara cierre total por pasar las pruebas.

**Control de alcance de aquel corte:** sin cambios de frontend, actas, cuatro PDF previos, diagramas PNG, identidad o licencia; todavía no se incorporaban CC-02–CC-04 ni nuevas reglas de agenda/costo. Se cambió la excepción SQL de .gitignore para incluir el nuevo database.sql. El estado fue superado por la implementación posterior; al 15/10, **CC-01–CC-05 están Listos**.

### CC-05 — Corrección de los BAT de Docker, 05/10/2026

**Origen:** consulta del grupo sobre el fallo de los archivos de inicio. La reescritura había reducido los BAT y retirado la preparación de `.env`, el arranque/espera de Docker Desktop y la pausa final. El diagnóstico encontró Docker instalado por usuario fuera del PATH, motor sin conexión y configuración `.env` ausente; se corrige la afirmación documental previa sobre la ausencia de Docker.

**Cambio preparado:** `iniciar.bat` y `detener.bat` detectan las instalaciones habituales de Docker, validan Compose y mantienen los errores visibles. Inicio crea únicamente la plantilla ausente, exige completar las claves y abre/espera Docker Desktop cuando corresponde. Detención conserva `compose stop`. Se actualizan la guía del backend y la [evidencia de verificación](../docs_auxiliares/evidencias/verificacion.md). Sin cambios de API, esquema, servicios/volúmenes, frontend o actas; no se incorporan solicitudes funcionales adicionales.

**Validación de aquel corte:** Compose validado con la CLI real; 21 escenarios correctos de los BAT con Docker simulado. No se iniciaron contenedores reales ni se alteraron datos del equipo en esa ejecución. La limitación fue superada por el arranque Docker aislado del 13/10. **Estado actual de CC-05: Listo.**

### CC-05 — Apache único e inicio automático portable, 05/10/2026

**Instrucción directa del grupo:** quitar Nginx, hacer funcionar iniciar.bat y abrir la página, con configuración general para otras instalaciones Docker.

**Cambio:** quedan app/db; Apache sirve API, portal y panel mediante alias de lectura en un puerto configurable. JavaScript toma la API del origen de la página. El inicio prepara .env y claves aleatorias solo para una base nueva, conserva las reales, resuelve un puerto ocupado, espera salud del sistema y abre el navegador predeterminado. Retira el contenedor Nginx anterior del mismo proyecto sin eliminar volúmenes. Los BAT usan rutas del proyecto y de la instalación de Docker, sin rutas particulares de un equipo. El alias de login corrige la diferencia de mayúsculas del archivo histórico al servirlo en Linux.

**Documentación y alcance:** se actualizaron README, arquitectura, SSOO y verificación. Sin cambios de negocio, roles, cuentas o actas; la primera cuenta sigue siendo una acción explícita. La evidencia y sus límites están en [verificación](../docs_auxiliares/evidencias/verificacion.md). **Estado actual de CC-05: Listo.** Apoyo de IA identificado, crédito y responsabilidad del grupo.

**Verificación de esta actualización:** Compose real validado con solo app/db; 38 PHP con sintaxis válida; 22 escenarios de inicio/detención con Docker simulado y HTTP sintético; 12 comprobaciones de los clientes API con distintos orígenes. El primer intento real no pudo iniciar el motor por WSL ausente; esa limitación quedó superada por la ejecución Docker aislada y la revisión visual del 13/10. [Evidencia](../docs_auxiliares/evidencias/evidencia_inicio_docker.json).

### DOC-20261013 — Separación de documentación auxiliar

**Solicitud del grupo:** volver a revisar documentos, identificar notas de IA y datos incompletos y separar materiales ajenos a los entregables exigidos.

**Resultado:** diez archivos trasladados a `docs_auxiliares/`, índice anterior conservado, índices de entrega/apoyo separados y enlaces Markdown ajustados. El [informe del 13/10](../docs_auxiliares/revision/revision_2026-10-13.md) registra pendientes, desactualizaciones y criterios de clasificación. Los flujos MD/PDF retirados previamente no se recrean. Se mantienen declaración de IA, seguridad, términos y privacidad como entregables del curso.

**Alcance:** orden documental y referencias; código, SQL, Docker, frontends y PDF conservados. Las actas no se completan; solo se ajustan enlaces si su destino fue trasladado. Esta tarea no cambió las reglas del producto. Revisión asistida por IA, con crédito y responsabilidad del grupo; estado funcional vigente: **CC-01–CC-05, Listos**.
