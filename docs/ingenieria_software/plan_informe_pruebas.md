# Plan e informe de pruebas — Portal Vial

**Proyecto:** Educación Vial IMSJ. **Fecha documental:** 21/10/2026. **Línea de implementación:** `1a43229`.

## 1. Objetivo y alcance

Comprobar que la API aplica el contrato HTTP, persiste los datos esperados, protege las operaciones por cuenta y rol y mantiene la integridad ante errores y concurrencia. El alcance incluye autenticación, noticias, materiales, FAQ, simulacros, consultas, usuarios, historial y agenda académica.

La verificación combina una suite de integración HTTP/MySQL, auditoría Bash de seguridad, análisis estático y exploración dinámica del portal local. La matriz relaciona requisitos e historias con escenarios concretos y conserva el alcance de cada resultado.

## 2. Organización y entorno

| Elemento | Configuración |
|---|---|
| Coordinación de testing y documentación | Juan Robaina, según los roles del equipo. |
| Backend | Tomás Cabrera. |
| Base de datos | Gabriela Romero. |
| Frontend | Verónica Romero y Juan Corrales. |
| Suite de integración | [integracion.py](../../backend/tests/integracion.py); Python estándar y cliente MySQL. |
| Runtime registrado | PHP 8.5.11 y MySQL 8.4.11. |
| Base aislada | `imsj_test_final_20261021`. |
| Concurrencia | Dos procesos HTTP independientes conectados a la misma base. |
| Auditoría API | [security_api.sh](../../backend/tests/security_api.sh), contra `http://127.0.0.1:8000`. |
| SAST | Semgrep 1.180.0; [JSON registrado](../../informes-sast-post/semgrep-post.json). |
| DAST | ZAP 2.17.0; baseline del portal local. |
| Puertos | Nmap 7.98; registro de 8000/tcp. |

Los nombres de responsables describen las áreas del equipo. El resultado automatizado identifica su entorno, fecha y artefactos mediante el registro de ejecución.

## 3. Preparación y ejecución

### Integración

1. Preparar una base vacía cuyo nombre comience con `imsj_test_` y una configuración separada de la instalación del equipo.
2. Definir `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` e `IMSJ_TEST_MYSQL` para ese entorno.
3. Iniciar dos procesos PHP contra la misma base y definir sus direcciones en `IMSJ_TEST_URL` e `IMSJ_TEST_URL_2`.
4. Definir `IMSJ_TEST_REPORT` con la ruta del informe de la nueva ejecución.
5. Ejecutar `python tests/integracion.py` desde `backend`.
6. Conservar la salida, revisar el resultado y comparar los hashes de los PHP con la versión evaluada.

La suite crea el esquema y sus datos sintéticos. Comprueba que la base esté vacía antes de importar tablas. Los escenarios de rollback introducen un trigger de fallo en esa base y lo retiran tras comprobar el comportamiento.

### Seguridad de API

Ejecutar el script Bash sobre una instancia de prueba autorizada. Para los escenarios autenticados utilizar cuentas descartables de los perfiles público, personal y Directora. Las opciones de escritura, token vencido y límite de intentos se describen en la [guía de ejecución](../../backend/README.md#auditoría-bash-de-seguridad-de-la-api).

Con `IMSJ_SECURITY_REQUIRE_FULL=1`, cualquier prueba omitida impide considerar completa la ejecución. Conservar por separado los resultados de cada perfil y de la ejecución final.

### Criterios de evaluación

- Una comprobación de integración pasa si coincide el estado HTTP esperado, el contrato de respuesta y las verificaciones de persistencia que contiene el escenario.
- La integración finaliza con resultado OK cuando todas sus aserciones se cumplen y se cubren las declaraciones de ruta extraídas del router.
- La auditoría distingue aprobadas, fallidas y omitidas. Una omisión conserva ese estado hasta una ejecución que cubra el escenario.
- Un aviso SAST o DAST requiere análisis de su ruta, contexto y alcance. Su registro conserva la severidad original de la herramienta.
- Una prueba de API demuestra el comportamiento del servidor evaluado; la aceptación de una pantalla requiere recorrer además su interfaz.

## 4. Matriz de trazabilidad y escenarios

| ID | Requisitos / historias | Escenario y resultado comprobado | Evidencia |
|---|---|---|---|
| PT-01 | RF1, RNF1; US1–US2 | Login y registro, identidad, rechazo de acceso sin token y de rol público en administración. | Integración y auditoría API. |
| PT-02 | RF2, RF7–RF10, RNF7, RNF10; US3–US9 | CRUD de noticias, fechas, borradores ocultos y publicación visible; portada, galería y enlaces mediante API. | Integración. |
| PT-03 | RF21; US30; CC-03 | Personal envía a revisión y recibe 403 al aprobar; Directora aprueba; el personal publica después. | Integración y auditoría API. |
| PT-04 | RF5, RF17, RF20; US21–US22 | VIDEO por URL, PDF cargado y descargado, actualización multipart y rechazo de falso PDF. | Integración. |
| PT-05 | RF6, RF18; US23–US24 | Alta y edición de FAQ, ocultamiento previo a publicar y consulta pública posterior. | Integración. |
| PT-06 | RF22, RF24; US31, US33; CC-01, CC-04 | Pregunta con imagen descargable, respuesta correcta ausente en consulta pública y corrección del servidor; rechazo de respuesta duplicada. | Integración. |
| PT-07 | RF23; US32; CC-02 | Mensaje público guardado, recepción en bandeja sin leer y marca de lectura persistida. | Integración. |
| PT-08 | RF3, RF13, RNF8–RNF9; US10, US13–US14, US17 | Franja de prueba de manejo, reserva propia, duplicación rechazada, franja ocupada protegida y cancelación propia 204. | Integración. |
| PT-09 | RF14–RF16; US18–US20 | Consulta de agenda en vistas día, semana y mes; rechazo de vista anual inválida. | Integración. |
| PT-10 | RNF8; US13 | Dos solicitudes simultáneas para un único cupo: 201 y 422; exactamente una fila en MySQL. | Integración. |
| PT-11 | RNF3; US25 | Historial con acciones persistidas; fallo provocado de auditoría revierte el material y elimina el archivo nuevo. | Integración. |
| PT-12 | RNF1, RNF4; US2, US26 | Token hash, vencimiento, revocación, desactivación y rechazo de cancelación ajena. | Integración y auditoría API. |
| PT-13 | RNF2; US34 | JSON inválido, validación de campos, archivos disfrazados, entradas SQLi/XSS controladas y respuestas sin error interno en esos escenarios. | Integración y auditoría API. |
| PT-14 | RNF4; US26 | Acceso privado bloqueado, CORS permitido/ajeno, cabeceras y rate limit. | Auditoría API. |
| PT-15 | RF9; US6 | Portada, galería, texto y enlaces persistidos por la API y presentados en el portal público. | [Controlador](../../backend/controllers/NoticiaController.php) y [vista pública](../../frontend-publico/js/noticias.js). |
| PT-16 | RF4, RF11–RF12; US11–US12, US15–US16 | Franjas y reservas disponibles para renovación normal y urgente. | [Controlador de reservas](../../backend/controllers/ReservaController.php) y [servicio](../../backend/services/ReservaService.php). |
| PT-17 | RF19; US29 | Alta, edición, listado y filtro de preguntas frecuentes por categoría. | [Controlador](../../backend/controllers/PreguntaController.php) y [vista pública](../../frontend-publico/js/contenido.js). |
| PT-18 | RNF5–RNF6; US27–US28 | Interfaces adaptables, navegación mediante teclado, foco visible y etiquetas en formularios. | [Estilos públicos](../../frontend-publico/css/styles.css) y [estilos del panel](../../frontend-imsj/css/styles.css). |

## 5. Informe de integración del 21/10

| Métrica | Resultado registrado |
|---|---|
| Fecha y hora UTC | 2026-10-21T14:47:36.610545+00:00 |
| Resultado | OK |
| Comprobaciones | 192 |
| Combinaciones distintas de método y ruta solicitada | 60 |
| Declaraciones de endpoint cubiertas | 46 |
| Último cupo concurrente | 201 y 422; una reserva persistida. |
| Archivos PHP identificados por SHA-256 | 43 |

**Registro:** [integracion-final.json](../../output/integracion-final.json).

Las 192 comprobaciones incluyen estados HTTP, claves de respuestas JSON, respuestas 204 sin cuerpo y verificaciones específicas de datos y archivos. La cobertura de 46 declaraciones de ruta se calcula normalizando identificadores numéricos. Esta medida describe cobertura de rutas; la suite no calcula cobertura de líneas de código.

## 6. Informe de seguridad

La [ejecución completa](../../output/security-api-final.txt), del 21/10 a las 14:42:08 UTC, registra **43 aprobadas, 0 fallidas y 0 omitidas**. Las ejecuciones por perfil se conservan en el [registro de verificación](../../docs_auxiliares/evidencias/verificacion.md).

Semgrep registra seis avisos y un diagnóstico de análisis parcial del Dockerfile. ZAP conserva cinco tipos de alerta en su JSON y el resumen de baseline registra 0 FAIL, 4 WARN y 63 PASS. El contexto de cada hallazgo y su relación con el código se desarrolla en el [registro consolidado](../electiva_ciberseguridad/registro_hallazgos.md).

## 7. Alcance de las conclusiones

La integración respalda el funcionamiento de los escenarios de API sobre la base aislada. La auditoría respalda las comprobaciones ejecutadas contra la instancia local. La prueba de concurrencia evalúa dos solicitudes por el último cupo, sin establecer una capacidad objetivo de producción.

Las historias US1–US34 y los requisitos RF1–RF24 y RNF1–RNF10 figuran implementados. Los resultados de integración y de seguridad respaldan los escenarios incluidos en sus respectivas matrices.

| Evaluación de entrega | Registro |
|---|---|
| Recorrido manual de la versión final | Se ejecutará sobre el candidato exacto después del congelamiento de la entrega. |
| Restauración de un respaldo completo | Pendiente de ejecutar y comprobar en Ubuntu Server 24.04 LTS antes de la entrega. |
| Aceptación del cliente | La reunión R-06 registra la demostración del 13/10 y la aprobación del resultado. |

## 8. Referencias

[Especificación](Requerimientos.md), [backlog](backlog.md), [cambios](control_cambios.md), [manual de usuario](manual_usuario.md), [modelo de especificación y trazabilidad del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/ADA.md) y [requisitos de entrega por asignatura](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/main/Lineamientos/requerimientos_por_asignatura.md).
