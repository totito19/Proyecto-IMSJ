# Consolidación documental y fuentes — 21/10/2026

## 1. Criterio de reconstrucción

Esta actualización cruza las actas R-01–R-05, los commits y los resultados guardados con las respuestas del equipo recibidas el 21/10/2026. Los períodos de sprint son los que ya constaban en la planificación. Sus extremos se usan como fechas de referencia, no como constancia de ceremonias celebradas ese día. Las estimaciones añadidas son retrospectivas y no representan horas trabajadas ni velocidad medida.

Los responsables por área describen la distribución del equipo; un autor de commit no identifica por sí solo a todas las personas que participaron. La revisión principal corresponde al líder Tomás Cabrera y al co-líder Juan Robaina, según lo confirmado por el equipo. Una revisión interna no equivale a una firma ni a aceptación final del cliente.

## 2. Fuentes del historial

| Etapa | Período documental | Evidencia Git |
|---|---|---|
| Sprint 1: maquetación y relevamiento | 10/07–23/07 | fb78047: panel; 2b873f4: noticias; fc9c519: requisitos; a9401ad: entrevista. |
| Sprint 2: pantallas e interacción | 24/07–06/08 | a9650d7: materiales, agenda y noticias; 25f5fd9: gestión local; 7b6d2c2: FAQ; 980478d: renovación; 299f83f: historias. |
| Sprint 3: unificación visual | 07/08–20/08 | 59c1a58: segunda versión; 23bf7f4: ingreso; 52237d5: clases; 54ba327: estilos. |
| Sprint 4: integración | 21/08–03/09 | bb37399: portal y sesión; c0016b1: API y acceso; e75dc4c: preguntas y personal; 448eb82: Docker. |
| Cambios posteriores | 08/09–21/10 | 60667ef: planificación; 68d34fb y d9c254c: backend nativo; ac018b7 y 05c1012: consultas y estados; bfd7f52: cancelación; 1a43229: seguridad. |

Las fechas se consultan con `git log --date=short`; los objetos pueden inspeccionarse con `git show IDENTIFICADOR`. El corte documental previo a esta actualización es 258b5e8; el corte técnico de integración y seguridad es 1a43229. El tag propuesto para la futura entrega es `entrega-final-2026-10-29`; su mención no afirma que esté creado.

## 3. Confirmaciones del equipo

| Tema | Confirmación recibida el 21/10/2026 | Alcance del registro |
|---|---|---|
| Organización | Reconstruir el trabajo a partir de commits. | Se cruzó el historial con los períodos ya documentados y los roles. |
| Relación con el cliente | Utilizar las fechas y contenidos de los documentos. | R-01: entrevista del 09/07; R-05: demo del 03/09 y solicitudes CC-02–CC-04. |
| Restauración y segundo equipo | «Sí, lo hicimos los del equipo y todo salió bien». | Confirmación conjunta de restauración de respaldo y prueba en otra computadora con resultado satisfactorio. La fecha indicada aquí es la de confirmación, no la de ejecución. |
| Entrega y defensa | Se entregará el proyecto completo y participará todo el equipo. | Se conserva el cronograma documental: entrega 29/10 y defensa 05/11. |
| Revisión | Principalmente el líder y el co-líder. | Revisión interna atribuida a Tomás Cabrera y Juan Robaina; no se atribuyen firmas individuales. |

La confirmación de restauración es evidencia testimonial del equipo. No se le atribuyen un archivo, hash, versión ejecutada, captura, tiempo de recuperación o mediciones que no formen parte de esa confirmación. Las comprobaciones técnicas detalladas del procedimiento siguen siendo criterios para registrar cada ensayo posterior.

## 4. Decisiones de edición

- Se conservan los estados parciales de RF4, RF9, RF19 y de las historias de calidad; completar un documento no completa una función.
- Las condiciones de producción se expresan como requisitos o propuestas operativas, separados de la instalación local efectivamente descrita.
- Los formularios de incidentes se completan con instrucciones de registro, sin convertirlos en incidentes ocurridos.
- El cierre se prepara para la entrega futura; la recepción y aceptación se formalizan cuando se realice.
- La declaración de herramientas queda fuera de esta actualización por indicación del equipo.

## 5. Verificación de esta edición

Se revisaron los 46 Markdown del conjunto documental, 417 enlaces locales, la continuidad de columnas de las tablas y el cierre de los bloques de código. La comprobación de formato de Git terminó sin errores. Los campos vacíos de los documentos incluidos en esta actualización quedaron completados; la declaración de herramientas conserva su edición anterior y los sufijos de campos API como `galeria[]` conservan su significado técnico.

Estas comprobaciones evalúan la documentación. Los resultados de integración y seguridad citados pertenecen a sus ejecuciones del 21/10; esta actualización no ejecutó nuevamente la aplicación ni modificó su implementación.

## 6. Referencias

[Actas](../../docs/ingenieria_software/actas_reuniones.md), [planning](../../docs/ingenieria_software/sprint_planning.md), [Review](../../docs/ingenieria_software/actas_sprint_review.md), [verificación](../evidencias/verificacion.md) y [preparación del cierre](../../docs/ingenieria_software/acta_cierre.md).
