# Verificación de la versión PHP nativa - 05/10/2026

**Resultado:** 155 comprobaciones correctas de la suite HTTP/MySQL y cobertura efectiva de las **42 declaraciones de ruta** en public/index.php. Se probaron los archivos definitivos de backend, no una API de ejemplo. [Evidencia por hash](evidencia_backend_nativo.json); revisión interna de Juan Robaina pendiente. Preparado con apoyo externo de IA; crédito y responsabilidad del proyecto corresponden al equipo.

## Entorno y procedimiento ejecutados

PHP 8.5.11 portable, MySQL 8.4.11 portable, Windows; dos servidores PHP independientes en 127.0.0.1:18000/18001, contra la misma base aislada imsj_test_native, con datos sintéticos. El cliente MySQL y Python estándar ejecutaron [integracion.py](../backend/tests/integracion.py). La suite exige una base vacía cuyo nombre empiece por imsj_test_; no se conectó a datos del equipo/Intendencia. Fecha UTC de finalización: 2026-10-05T17:06:56.299299+00:00.

- Sintaxis: 37 archivos PHP válidos mediante scripts/verificar.php.
- Suite: 155 comprobaciones, 55 combinaciones distintas de método/ruta concreta (incluye soporte y casos inválidos); los id/query se normalizaron y cotejaron con las 42 rutas del switch.
- Último cupo: dos peticiones desde procesos PHP distintos, estados 201 y 422; exactamente una reserva persistida en MySQL.
- Rollback: un trigger de prueba hizo fallar la auditoría; se comprobó 500 sin filtrar SQL, ausencia del contenido y eliminación del archivo nuevo. El trigger fue retirado al completar el escenario.
- Sesiones: revocación al cerrar/nuevo login/desactivar, expiración y rechazo de cuenta inactiva; permisos público/personal, registros duplicados y límite 429.
- Archivos: PDF/PNG reales, contenido inseguro rechazado, descarga y reemplazo, PUT multipart y POST multipart con _method=PUT usados por el panel.
- CLI primera cuenta: creación explícita en otra base aislada y rechazo del segundo intento cuando ya hay personal activo.

La evidencia JSON conserva SHA-256 de cada PHP ejecutado para identificar la versión sin inventar un commit de entrega. No contiene tokens o contraseñas de producción. Los procesos de prueba se detienen al terminar; runtimes/base de prueba quedan fuera del repositorio.

## Estado por criterio CC-05

| Criterio | Comprobado en esta versión | Falta para cierre completo |
|---|---|---|
| V-CC05-01 | Arranque PHP, health, 42 rutas, sintaxis, JSON, 204 y errores. | Construcción/arranque Apache y Docker. |
| V-CC05-02 | Login/registro/perfil, hashes, vencimiento, revocación, cuenta activa y rol. | Revisión institucional de política de cuentas y despliegue. |
| V-CC05-03 | CRUD/estado, visibilidad y auditoría de contenidos. | Recorrido visual integral en los dos frontends. |
| V-CC05-04 | Carga/descarga y rechazo por contenido, reemplazo, variantes multipart y rollback de archivo. | Recursos reales, límites de tamaño máximos y persistencia en contenedor. |
| V-CC05-05 | Banco/corrección base; respuesta correcta oculta antes de corregir y rechazo de duplicación. | Definiciones de CC-01/CC-04, sin cierre implícito. |
| V-CC05-06 | Franjas/agenda, propiedad, duplicación y último cupo con dos procesos/MySQL. | Revisión de criterios académicos y prueba visual. |
| V-CC05-07 | Permisos, límite, preflight permitido/ajeno, rutas privadas y archivos inseguros. | Apache/proxy, navegador, SAST/DAST y controles de producción. |
| V-CC05-08 | Esquema no destructivo en base nueva, CLI y preservación local de archivos. | Docker, actualización/restauración sobre una copia de datos/adjuntos reales. |
| V-CC05-09 | Contrato HTTP consumido por el JS conservado; documentación actualizada y PDF revisado. | Integración visual, revisión de Juan Robaina, docentes y aceptación en actas cuando ocurra. |

**Límites materiales:** no se ejecutó la construcción ni el arranque de los contenedores Docker/Apache en esta verificación HTTP/MySQL. El diagnóstico de los BAT que figura abajo corrige la afirmación anterior sobre la ausencia de Docker. No se abrió una sesión visual completa en los frontends. No se restauró una base institucional, no se realizó una auditoría SAST/DAST ni se acredita aceptación del cliente/docentes. CC-01 a CC-04 siguen pendientes y agenda/reservas continúan académicas.

## Diagnóstico y corrección de los BAT — 05/10/2026

**Consulta del grupo:** los BAT no inician Docker. Se encontró Docker Desktop instalado por usuario en `%LOCALAPPDATA%\Programs\DockerDesktop`, fuera del PATH de esta sesión. La CLI responde con Docker 29.8.0 y Compose v5.5.1 al usar su ruta completa; el motor Linux no responde porque no está disponible su conexión `dockerDesktopLinuxEngine`. Falta `backend/.env`. La versión anterior de los BAT terminaba sin pausa y había perdido la preparación de configuración y el arranque/espera de Docker Desktop.

**Corrección:** búsqueda de Docker por PATH o instalaciones habituales; creación de la plantilla `.env` solo si falta y detención hasta completar sus claves; validación silenciosa de Compose; apertura/espera de Docker Desktop desde el BAT de inicio; errores visibles y códigos de salida. `detener.bat` conserva `compose stop` sin borrar volúmenes y no abre Docker Desktop. Uso detallado en [README del backend](../backend/README.md). Intervención asistida por IA; revisión del equipo pendiente.

**Comprobado:** la CLI real validó `compose.yaml` con `.env.example` mediante `config --quiet`, sin iniciar servicios ni imprimir claves. En Windows se ejecutaron 21 escenarios con copias de los BAT y un ejecutable Docker simulado, fuera del proyecto: detección por PATH/usuario/todos los usuarios, rutas con espacios, plantilla ausente/nueva, rechazo de claves de ejemplo, errores de Compose/configuración/motor/construcción/detención, apertura y espera de Desktop, preservación de `.env`, pausa y códigos de salida. Los 21 terminaron correctamente. Estas pruebas comprueban el flujo de los BAT; no acreditan construcción de imágenes ni disponibilidad de la aplicación en contenedores. Los servicios reales siguen pendientes de configurar las claves locales e iniciar el motor.

## Documentación y alcance

Nuevo PDF de 26 páginas con 42 fichas y versión MD del mismo inventario. Se renderizaron e inspeccionaron todas las páginas; tipografía/colores y logo RC5 corresponden a la identidad ya utilizada. El PDF y MD describen inputs, permisos, métodos, tablas, respuestas y errores; los ejemplos se marcan didácticos y la revisión queda pendiente.

Se actualizan estructura, guías, API, modelo/diagramas Mermaid, SSOO, control de cambios y datos pendientes. Se conservan por hash ambos frontends, actas, cuatro PDF anteriores, diagramas PNG, logo y licencia. El backend anterior tiene un resguardo externo; no se conserva ejecutable dentro de backend. La excepción SQL de .gitignore apunta al nuevo database.sql.

Se comprobaron los 31 Markdown, 263 enlaces locales/anclas y 130 tablas; RF1–RF24 y US1–US34 mantienen numeración. Los 54 archivos protegidos conservan su hash y los 37 PHP coinciden con la versión probada. La revisión del diff no registra errores de espacios.

## Registro histórico documental

Los apartados siguientes corresponden a las revisiones del 02/10/2026 y al código anterior, conservados como antecedente. Las pruebas Feature mencionadas ya no forman parte del backend actual; pueden consultarse en Git, commit 68d34fb. Sus estados «pendiente» describen esa fecha, no anulan los resultados actuales de esta sección.

---

# Verificación y evidencia de pruebas

> **Revisión de IA — 02/10/2026:** se inspeccionan archivos, no se certifica una ejecución funcional. Existen siete archivos Feature y 22 métodos de prueba en `df581ab`. No se localizaron resultados versionados ni acta de aceptación vinculada.

## Pruebas disponibles y trazabilidad

Los caminos de esta tabla son relativos a `backend/tests/Feature/`.

| Archivo | Métodos | Cobertura declarada por el archivo | Requisitos / solicitudes |
|---|---:|---|---|
| `AuthenticationTest.php` | 3 | Login, rechazo de credenciales y registro ciudadano. | RF1, RNF1/RNF4; registro ciudadano con origen pendiente. |
| `NewsApiTest.php` | 4 | Visibilidad/vigencia, gestión con auditoría, permisos y rechazo de portada insegura. | RF2, RF7–RF10, RNF1–RNF3, RNF7/RNF10. |
| `ContentApiTest.php` | 4 | Materiales/FAQ publicados, gestión, archivos y permisos. | RF5/RF6/RF17/RF18/RF20, RNF1–RNF3/RNF10. |
| `SchedulingApiTest.php` | 5 | Franjas futuras con cupo, duplicación, capacidad y vistas/permisos de agenda. | RF3/RF4/RF11–RF16, RNF1/RNF8/RNF9. |
| `AdministrationAndQuizTest.php` | 4 | Alta/desactivación de personal, bloqueo de autodesactivación, banco y corrección de simulacro. | RF22/CC-01; administración con origen pendiente. |
| `DatabaseSchemaTest.php` | 1 | Tablas y columnas esperadas por la prueba. | Modelo relacional. El nombre «approved» del método no prueba aprobación del cliente. |
| `HealthEndpointTest.php` | 1 | Respuesta de `/api/health`. | Disponibilidad de la API, no conexión real a MySQL. |

**Estado de todos los resultados:** no ejecutados en esta revisión documental. Se leyeron sus nombres y escenarios; la existencia del archivo no prueba que pase.

## Límites de lo comprobado

- `phpunit.xml` configura SQLite en memoria. Incluso si la suite pasa, eso no acredita concurrencia, bloqueos ni todos los comportamientos de MySQL.
- No se localizaron pruebas específicas de RF19 (categorías), RF21/CC-03 (aprobación), RF23/CC-02 (consultas) ni RF24/CC-04 (gráficos).
- No se localizaron resultados de usabilidad móvil o accesibilidad ni aceptación por el cliente.
- No se localizaron capturas de SAST y correcciones vinculadas, informe DAST, script de auditoría de seguridad o plan final de incidentes.
- Docker instala dependencias con `--no-dev` y `.dockerignore` excluye tests. El contenedor de entrega no es un entorno de ejecución de PHPUnit; no se instruye a correr una suite que no contiene.

## Registro para completar al ejecutar

**IA — Sugerencia documental:** registrar las pruebas sin cambiar el método de trabajo del equipo. Los responsables y las fechas deben ser acordados.

| ID / criterio | Versión/commit | Entorno y datos | Procedimiento | Resultado y evidencia | Responsable / fecha | Aceptación |
|---|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente | No registrado | No registrado | No registrada |

En una instalación de desarrollo que ya tenga PHP y las dependencias de desarrollo, `composer test` es el comando declarado en `composer.json`. Esta revisión no instala dependencias ni ejecuta migraciones/seeders o pruebas sobre datos del equipo.

## Verificación de los documentos modificados

El resultado de la comprobación documental se completa al final de esta intervención: enlaces relativos, anclas internas, tablas, códigos de referencia, integridad del texto original de PDF y revisión visual de las hojas añadidas.

### Resultado de la revisión inicial — 02/10/2026

**IA — Comprobación documental realizada:**

- Los 20 Markdown originales se leyeron y corrigieron; cinco nuevos documentos reúnen índice, revisión, API, verificación y aclaraciones de diagramas. Se comprobaron los 25 Markdown resultantes.
- Los 108 enlaces relativos y anclas internas resuelven; las tablas mantienen número consistente de columnas y los bloques de código están cerrados. No se afirma una comprobación de disponibilidad de cada enlace externo.
- RF1–RF24 y US1–US34 no tienen huecos de numeración. RF19–RF24 y US29–US34 conservan su procedencia y condición de necesidad/borrador, sin aprobación implícita.
- Los cuatro PDF tienen una hoja adicional y 12 comentarios de revisión preparados con apoyo de IA: ahora suman 20 páginas. El crédito documental corresponde al grupo. El texto de las 16 páginas originales se conserva exactamente. Se comparó visualmente la región de contenido original; solo se añadieron iconos de comentario en el margen.
- Las cuatro hojas nuevas se renderizaron y revisaron visualmente: texto legible, sin recortes ni superposiciones. Las páginas originales también se renderizaron para la lectura inicial.
- La revisión del diff no muestra modificaciones de código ejecutable, esquema, configuración, imágenes originales o licencia. `git diff --check` pasa.

Estos resultados comprueban los documentos, no el funcionamiento del producto. No se ejecutaron PHP, migraciones, seeders, Docker, pruebas funcionales, SAST o DAST en esta intervención.

### Actualización de aclaraciones e identidad gráfica — 02/10/2026

Se integraron las aclaraciones proporcionadas por el grupo y se agregó [aclaraciones y pendientes](aclaraciones_y_pendientes.md), con campos que el equipo puede completar. Juan Robaina figura como revisor/aprobador interno; esta actualización sigue pendiente de su revisión. CC-01–CC-04 permanecen pendientes para entrega real, sin fecha ni prioridad distinta, según lo informado por el grupo.

**IA — Comprobación documental realizada:**

- Se comprobaron los 26 Markdown actuales, sus 142 enlaces relativos/anclas y 103 tablas. RF1–RF24 y US1–US34 conservan su numeración completa.
- Las cuatro hojas de PDF y sus 12 comentarios se actualizaron con las aclaraciones. Se conservaron tamaño de página, tipografía visual, colores y tablas de cada original; el logo RC5 se reutiliza sin edición desde la declaración histórica, también en el nuevo Markdown.
- Los PDF suman 20 páginas: cuatro hojas de revisión y 16 páginas históricas con texto intacto. La comparación visual verifica que su contenido permanece idéntico fuera del margen reservado a los iconos de comentario. Las cuatro hojas actuales se renderizaron e inspeccionaron para comprobar legibilidad y ausencia de recortes o superposiciones.
- Las actas de reunión y Sprint Review conservan exactamente los archivos anteriores a esta actualización y quedan a cargo del equipo. Tampoco se modificaron código, configuración, esquema, diagramas originales ni licencia. El crédito continúa atribuido al grupo.
- `git diff --check` pasa. Las comprobaciones fueron documentales; no se ejecutaron pruebas del sistema ni se acreditó aceptación institucional.

Fuentes de estructura: [historias y criterios](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/03_historias_de_usuario.md) y [planning del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/sprint-planning.md).

## Verificación necesaria de la migración PHP — CC-05

**Decisión del grupo:** retirar Laravel. El software todavía no ha migrado. Los siete archivos Feature/22 métodos anteriores dependen de Laravel; son antecedentes de escenarios, no pruebas del destino sin adaptación. `composer test` describe el manifiesto actual, no un comando ya preparado para PHP vanilla. La referencia no acredita una suite ejecutada para IMSJ.

**IA — Criterios derivados de conservar el sistema:** preparación y ejecución pendientes por el equipo. No se presenta un resultado esperado como resultado obtenido.

| ID | Escenario / condición verificable | Entorno / evidencia requerida | Estado |
|---|---|---|---|
| V-CC05-01 | Arranque PHP sin Laravel, GET `/api/health`, las 42 rutas inventariadas, parámetros/sufijos, métodos y errores compatibles. | Imagen, manifiestos/lock y respuestas por ruta/método de la versión migrada. | Pendiente. |
| V-CC05-02 | Login/registro por cédula, perfil, expiración, revocación de token actual/anteriores; rechazo por rol/cuenta según operación. | HTTP con cuenta válida/invalidada, token expirado/revocado y acceso público/personal; transición de sesiones registrada. | Pendiente. |
| V-CC05-03 | Noticias/materiales/FAQ, vigencia/estado, recursos JSON y auditoría conservados. | Casos públicos/administrativos y comparación de campos/respuestas con MySQL IMSJ. | Pendiente. |
| V-CC05-04 | Multipart de alta y POST `_method=PUT` de edición; tipos/límites de archivo, URLs y archivos previos. | Formularios, cargas permitidas/rechazadas y almacenamiento persistente comprobado. | Pendiente. |
| V-CC05-05 | Banco/corrección conservados, sin respuesta correcta pública anticipada; no afirmar cierre de CC-01/CC-04. | Casos existentes del simulacro en API/frontends; reglas nuevas siguen pendientes. | Pendiente. |
| V-CC05-06 | Franjas/reservas/agenda académica: fechas, propiedad, duplicación y último cupo bajo concurrencia. | MySQL y solicitudes simultáneas sin superar cupos; bloqueo/transacción, no solo SQLite. | Pendiente. |
| V-CC05-07 | CORS/OPTIONS con Bearer/métodos usados; login limitado; errores y raíz web sin exponer secretos o archivos ejecutables. | Navegador/HTTP: origen autorizado/no autorizado, entradas inválidas, acceso a `.env`/SQL/código y cargas inseguras. | Pendiente. |
| V-CC05-08 | Instalación nueva y actualización con datos; persistencia/restauración de base/archivos; arranque sin Artisan. | Entorno aislado, respaldo comprobado, comandos implementados y comparación de cuentas/IDs/archivos/historial. | Pendiente. |
| V-CC05-09 | Ambos frontends operan con el contrato PHP; documentos/diagramas/guía final coinciden con versión entregada. | Versión/commit, integración, revisión de Juan Robaina y registro con docentes; aceptación del cliente cuando ocurra en actas. | Pendiente. |

Cada ejecución completará versión, entorno/datos, procedimiento, resultado, evidencia y responsable/fecha en el registro ya previsto. Las tareas TM-01–TM-07 del [plan](migracion_backend_vanilla.md) se vinculan a estos criterios. Las actas y selección de tareas quedan a cargo del equipo.

### Resultado documental de CC-05 — 02/10/2026

**IA — Comprobación realizada:** se revisaron los 29 Markdown resultantes, 226 enlaces relativos/anclas y 121 tablas; bloques de código cerrados, sin enlaces internos rotos ni cambios de numeración RF1–RF24/US1–US34. Se contrastó el total de 42 rutas con `routes/api.php` y se identificaron diez tablas del dominio más la tabla técnica de tokens en el esquema existente.

Los cuatro PDF conservan 20 páginas en total y 12 comentarios de revisión; se actualizaron sus hojas/comentarios para CC-05 con tipografía, colores, tablas y logo ya utilizados. El texto de las 16 páginas históricas permanece exacto respecto de los originales, y la comparación de imágenes confirma contenido idéntico fuera del margen de anotaciones. Las cuatro hojas nuevas se renderizaron e inspeccionaron: legibles y sin recortes/superposiciones.

Los cambios frente al inicio de CC-05 se limitan a Markdown y los cuatro PDF. Se comprobó por hash que actas, código, configuración, esquema, pruebas, diagramas PNG, identidad y licencia no cambiaron en esta intervención. La revisión del diff pasa sin errores de espacios. La comparación de referencia abarcó 38 archivos de `api-completa` y el README raíz, fijados a `d6f61c9`.

Estas son comprobaciones documentales. No se ejecutaron la API de ejemplo, PHP IMSJ, Docker, SQL/migraciones, pruebas funcionales o auditorías; CC-05 continúa pendiente de implementación/verificación, CC-01–CC-04 pendientes y la revisión interna de Juan Robaina pendiente.
