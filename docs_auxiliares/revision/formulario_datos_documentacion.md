# Información para completar la documentación y preparar los PDF

**Proyecto:** Educación Vial IMSJ. **Formulario preparado:** 13/10/2026.
**Equipo:** Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales.
**Uso:** recopilación de datos del equipo y de la institución. Formulario auxiliar para consolidar datos y referencias.

## Cómo completarlo

Sustituye `[RESPUESTA]` por el dato confirmado. Puedes escribir **Pendiente**, **No existe registro** o **No aplica**, indicando el motivo cuando corresponda. Si prefieres responder en párrafos, conserva los identificadores de las preguntas.

Cuando una respuesta sea una decisión de reunión o un resultado de prueba, añade su fecha y la referencia al acta, archivo o evidencia. Una ruta o enlace es suficiente para localizar material que ya exista. No incluyas contraseñas, tokens ni copias de datos personales reales.

Puedes completar el formulario por etapas. Los contactos institucionales que se agregarán después pueden continuar pendientes. Las respuestas funcionales permitirán documentar lo acordado; cualquier modificación adicional de código se tratará como una tarea separada.

**Completado por:** [Juan Robaina]
**Fecha de las respuestas:** [10/13/2026]
**Apartados que quedan pendientes:** [RESPUESTA]

## Información que ya está confirmada

No hace falta volver a responder estos datos. Si alguno cambió, indícalo en el apartado correspondiente.

| Integrante | Función confirmada |
|---|---|
| Tomás Cabrera | Liderazgo del proyecto y backend. |
| Juan Robaina | Testing, documentación y revisión interna documental. |
| Gabriela Romero | Base de datos. |
| Verónica Romero | Frontend. |
| Juan Corrales | Frontend. |

- El referente del cliente se identifica principalmente como **Inspector de Tránsito de la Intendencia**, conocido como Nacho. Tiene autoridad para aceptar entregas y aprobar cambios; sus decisiones se registran en actas del equipo.
- La elaboración de actas sigue a cargo del equipo. Este formulario no reconstruye reuniones ni sustituye sus registros.
- Agenda y reservas pertenecen al alcance académico; CC-01–CC-04 corresponden a la entrega real. No hay fecha de entrega real fijada ni prioridad distinta entre esas solicitudes.
- La administración y el mantenimiento posteriores corresponden a la Intendencia, por ahora.
- El backend actual es PHP nativo, con PDO/MySQL y Apache. Nginx fue retirado. La demo del 13/10 tuvo ocho módulos y 45 rutas; desde el 20/10 el contrato tiene 46, tras añadir la cancelación propia.
- CC-01–CC-05 están Listos. CC-02–CC-04 surgieron de la reunión/demo del 03/09 con la Directora y el Inspector de Tránsito.
- El crédito de los documentos y del proyecto corresponde a los cinco integrantes del grupo. El uso de IA debe quedar declarado con su revisión humana real.

Los detalles verificables del código —rutas, clases, puertos, campos y límites implementados— se tomarán del proyecto. Las preguntas siguientes solicitan decisiones, datos institucionales, referencias y preferencias que el código no puede acreditar.

## A. Identidad visual de la empresa

Existe el [logo RC5](../../docs/general/identidad/rc5.png) y hay cuatro PDF con estilos previos. Los colores principales son naranja y azul

## B. Datos generales de los documentos

| ID | Información solicitada | Respuesta |
|---|---|---|
| B-01 | Nombre definitivo del producto: los documentos usan Educación Vial IMSJ, Plataforma Web Educación Vial IMSJ y Portal Vial. Indicar la denominación principal y, si corresponde, un subtítulo. | [La idea es que para el publico sea Portal Vial, lo otro se usa para referirnos internamente y academicamente] |
| B-02 | Versión o entrega que deben describir los nuevos PDF. Referencia disponible: demo del 13/10/2026. Indicar versión, etiqueta o commit si existe. | [Usa esa, si] |
| B-03 | Fecha de inicio del proyecto, duración/esfuerzo y presupuesto, únicamente si fueron acordados o registrados. Se puede responder «No definidos». | [Julio de 2026] |
| B-04 | Resultado de la consulta a docentes sobre PHP nativo frente a la mención de Laravel en la letra: fecha, decisión y evidencia, o «Pendiente». | [Miercoles 30 de Setiembre, se retiró laravel para hacer una mejor documentacion y mejor defensa.] |

## C. Datos institucionales para términos y privacidad

Estos datos deben provenir de la institución. Las preguntas de este apartado corresponden a marcadores que ya tienen los borradores; las opciones y decisiones jurídicas requieren la confirmación institucional correspondiente.

| ID | Información solicitada | Respuesta |
|---|---|---|
| C-01 | Denominación oficial del organismo responsable del servicio y del tratamiento de datos. Indicar si esas responsabilidades recaen en el mismo organismo. | [La intendencia es la que usará el programa. Ellos administraran los datos y el uso de la misma en el futuro, luego de entregar el proyecto] |
| C-02 | RUT u otra identificación institucional que deba figurar, si corresponde. | [Itendencia de San José, hecho en conjunto con estudiantes de informatica del Polo Tecnologico de San Jose (No lo tomes tan literal)] |
| C-03 | Domicilio institucional completo y localidad. | [Polo Tecnologico de San Jose de Mayo] |

## E. Reglas del producto que necesitan confirmación

Documentar una regla no acredita que esté implementada. Si una respuesta propone algo distinto de la demo, se registrará la diferencia antes de cualquier cambio de software.

| ID | Información solicitada | Respuesta |
|---|---|---|
| E-01 | CC-01: simulador. | **Listo:** hasta diez preguntas aleatorias, sin temporizador ni umbral; corrección con total y aciertos. |
| E-02 | CC-02: consultas. | **Listo:** nombre, correo y mensaje; bandeja de personal y marcado como leído. |
| E-03 | CC-03: aprobación de contenidos. | **Listo:** noticias, materiales y FAQ; solo Directora aprueba, personal publica y editar devuelve a borrador. |
| E-04 | CC-04: imágenes del simulador. | **Listo:** una imagen opcional JPG/PNG/WEBP de hasta 2048 KB. |
| E-05 | Categorías de FAQ y enlaces útiles: lista o tratamiento acordado, o «Pendiente». Indicar también si se acordó subir videos o usar enlaces; el sistema actual usa enlaces para VIDEO. | [RESPUESTA] |
| E-06 | Separación concreta entre entrega real y académica: qué se incluirá, ocultará o presentará por separado. | [RESPUESTA] |

### Estado de los cambios

| Cambio | Estado |
|---|---|
| CC-01 — Simulacros | **Listo** |
| CC-02 — Consultas | **Listo** |
| CC-03 — Aprobación por Directora | **Listo** |
| CC-04 — Imágenes del simulador | **Listo** |
| CC-05 — Backend PHP nativo | **Listo** |

## F. Relevamiento y registros del equipo

| ID | Información solicitada | Respuesta |
|---|---|---|
| F-01 | Entrevista inicial: fecha, lugar/modalidad, entrevistadores, entrevistado y ubicación de notas o grabación, si existen. | [RESPUESTA] |
| F-02 | Quién revisó el resumen de esa entrevista, cuándo y con qué evidencia. | [RESPUESTA] |
| F-03 | Ubicación de actas de reunión/Sprint Review completas o actualizadas. Si aún deben completarse por el equipo, indicarlo; este formulario no sustituye esas actas. | [RESPUESTA] |
| F-04 | Evidencia disponible del flujo Git usado y de los reportes académicos: enlaces o rutas. | [RESPUESTA] |

R-01 tiene fecha y horario corregidos por el equipo. Las horas R-02–R-05 están pendientes de confirmación. Indicar el horario real en 24 horas o «No existe registro», sin deducirlo del contexto.

| Reunión | Hora registrada | Horario confirmado / referencia |
|---|---|---|
| R-01 — 09/07/2026 | 16:05–16:45 | Confirmado por la corrección del equipo en el acta R-01. |
| R-02 — 22/07/2026 | 4:15–5:15 | [RESPUESTA] |
| R-03 — 28/07/2026 | 4:45–7:00 | [RESPUESTA] |
| R-04 — 11/08/2026 | 4:10–5:00 | [RESPUESTA] |
| R-05 — 03/09/2026 | 4:10–5:00 | [RESPUESTA] |

## G. Backlog y planificación

| ID | Información solicitada | Respuesta |
|---|---|---|
| G-01 | Para los cuatro períodos reconstruidos: si hubo planning/review reales y dónde se encuentran sus registros. Si no pueden acreditarse, indicar qué debe permanecer como reconstrucción. | [RESPUESTA] |
| G-02 | Capacidad, método de estimación, selección de historias y puntos terminados que estén efectivamente registrados. Referencia actual: 82 puntos propuestos, sin velocidad confirmada. | [RESPUESTA] |
| G-03 | Criterios e historias que el equipo adoptó, corrigió o descartó. Identificar US/RF, decisión, revisor y evidencia. Puede indicarse la ubicación del backlog revisado. | [RESPUESTA] |
| G-04 | Asignaciones concretas, dependencias y compromisos de tareas que ya se acordaron. Se pueden aportar mediante una tabla o acta existente. | [RESPUESTA] |

Para cambios por historia, puedes repetir esta fila:

| US/RF/tarea | Decisión o criterio acordado | Responsable, si fue asignado | Fecha/fuente |
|---|---|---|---|
| [RESPUESTA] | [RESPUESTA] | [RESPUESTA] | [RESPUESTA] |

## H. Revisión documental y uso de IA

| ID | Información solicitada | Respuesta |
|---|---|---|
| H-01 | Revisión interna de Juan Robaina: documentos/versiones revisados, fecha, resultado y referencia. | [RESPUESTA] |
| H-02 | Revisión del contenido consolidado: indicar documentos revisados, correcciones y evidencia de las decisiones. El registro de herramientas permanece en la declaración correspondiente. | [RESPUESTA] |
| H-03 | Registro histórico de IA que falte: herramienta, actividad, fecha/período, integrantes que participaron y revisión humana. Incluir los aportes posteriores al 05/08/2026. | [RESPUESTA] |

## I. Seguridad y pruebas

Las 41 comprobaciones de demo del 13/10 y la evidencia anterior ya están [registradas](../evidencias/verificacion.md). Los cinco cambios controlados figuran como **Listos**. Para validaciones adicionales fuera de ese alcance, debe registrarse el resultado real sin recrear capturas o evidencia.

| Entregable o validación | Estado y versión evaluada | Fecha/responsable y ubicación de evidencia |
|---|---|---|
| SAST: hallazgos, capturas y correcciones | [RESPUESTA] | [RESPUESTA] |
| DAST: herramientas, alcance y resultados | [RESPUESTA] | [RESPUESTA] |
| Auditoría de seguridad de la API y script solicitado por el curso | [RESPUESTA] | [RESPUESTA] |
| Hallazgos finales y medidas correctivas | [RESPUESTA] | [RESPUESTA] |
| Hardening de infraestructura/contenedores | [RESPUESTA] | [RESPUESTA] |
| Pruebas móviles: equipos/navegadores y resultados | [RESPUESTA] | [RESPUESTA] |
| Accesibilidad: criterios revisados y resultados | [RESPUESTA] | [RESPUESTA] |
| Reflexión ética de la etapa de pruebas de seguridad | [RESPUESTA] | [RESPUESTA] |

| ID | Información solicitada | Respuesta |
|---|---|---|
| I-01 | Matriz de riesgos del PDF: escala, método, fuente, quién valoró y fecha. Si fue ilustrativa o no hay registro, indicarlo para presentarla correctamente. | [RESPUESTA] |
| I-02 | Plan de respuesta a incidentes: documento disponible o responsables/canales y procedimiento acordado de detección, contención, recuperación y comunicación. Si está pendiente, señalarlo. | [RESPUESTA] |
| I-03 | Política institucional de cuentas: autorización de altas, claves iniciales, recuperación, bajas y revisión de permisos. Separar lo acordado de lo implementado. | [RESPUESTA] |

## J. Infraestructura, respaldo y recuperación

| ID | Información solicitada | Respuesta |
|---|---|---|
| J-01 | Entorno final previsto: alojamiento, dominio, HTTPS y condiciones de instalación, si ya se definieron. Se puede dejar pendiente. | [RESPUESTA] |
| J-02 | Respaldo completo disponible: fecha, versión, qué contiene y ubicación protegida. Aportar una referencia; no incluir claves o bases reales en este formulario. | [RESPUESTA] |
| J-03 | Restauración ensayada: entorno, fecha, responsable, resultado y evidencia de recuperación de datos/archivos. Si no se realizó, indicarlo. | [RESPUESTA] |
| J-04 | Frecuencia y conservación de respaldos, responsable operativo y procedimiento de recuperación que se hayan acordado con la Intendencia. | [RESPUESTA] |

## K. Manual de usuario

El manual describirá pantallas y operaciones reales de la versión indicada en B-02. La base prevista son ciudadanía, personal IMSJ y Directora, separando las funciones académicas de la entrega real.

| ID | Información solicitada | Respuesta |
|---|---|---|
| K-01 | Funciones o perfiles que deban incluirse/excluirse del manual final; indicar si se necesitan manuales separados para cliente y versión académica. | [RESPUESTA] |
| K-02 | Capturas o guía de estilo ya aprobadas para el manual, si existen. Si no hay capturas, indicarlo; podrán prepararse con datos ficticios de la versión correspondiente. | [RESPUESTA] |
| K-03 | Instrucciones institucionales fuera de la aplicación que deban explicarse: acceso inicial, solicitud de cuentas, soporte o capacitación. Solo las que estén acordadas. | [RESPUESTA] |

## L. Estado y organización de los PDF

El acta y la organización del paquete final siguen siendo responsabilidad del equipo. El estado funcional ya consolidado es **CC-01–CC-05: Listos**.

| ID | Información solicitada | Respuesta |
|---|---|---|
| L-01 | Fecha, versión, entregables, observaciones y referencia al acta elaborada por el equipo. | [RESPUESTA] |
| L-02 | Paquete de PDF deseado: por documento, por asignatura o ambos. Indicar qué documentos deben convertirse además de los cuatro PDF existentes. | [RESPUESTA] |
| L-03 | Estado que debe figurar en cada salida: borrador, para revisión o versión final. | [RESPUESTA] |
| L-04 | Pauta requerida para las versiones históricas: archivo separado, anexos o referencias. Se conservará la trazabilidad del proyecto. | [RESPUESTA] |

### Selección de documentos

Marca los que deben integrar la próxima preparación. Los informes auxiliares seguirán separados de la documentación de entrega.

- [ ] Actualizar análisis de ciberseguridad PDF.
- [ ] Actualizar declaración de uso de IA PDF.
- [ ] Actualizar términos y condiciones PDF.
- [ ] Actualizar política de privacidad PDF.
- [ ] Convertir charter, relevamiento, requisitos y análisis del proyecto.
- [ ] Convertir backlog, planning y control de cambios.
- [ ] Convertir arquitectura, modelo/diagramas y documentación SSOO.
- [ ] Preparar manual de usuario PDF.
- [ ] Maquetar actas/Review/cierre ya completados por el equipo.
- [ ] Otro documento: [RESPUESTA]

**Observaciones adicionales para la maquetación o el contenido:** [RESPUESTA]

## Uso de las respuestas

Con los datos confirmados se podrá consolidar la documentación actual, distinguir historial de estado vigente y preparar los PDF con la identidad indicada en A. Los campos sin resolver conservarán su estado de pendiente o borrador. Los documentos de entrega se mantendrán en `docs/` y este formulario, los informes y las referencias continuarán en `docs_auxiliares/`.

Fuentes de trabajo: [revisión del 13/10](revision_2026-10-13.md), [control de cambios](../../docs/ingenieria_software/control_cambios.md), [declaración de IA](../../docs/ingenieria_software/declaracion_etica_ia.md) e [índice de entrega](../../docs/README.md).

## Estado de interpretación de las respuestas del equipo — 20/10/2026

Las respuestas escritas se conservan sin atribuirles datos que no contienen. B-01 define Portal Vial como nombre público; B-02 selecciona la demo del 13/10 para los PDF y B-03 sitúa el inicio en julio. B-04 expresa la decisión y el motivo de retirar Laravel, pero no adjunta la confirmación docente solicitada.

C-01 identifica a la Intendencia como futura administradora. C-02 describe una atribución institucional y estudiantil, sin proporcionar un RUT. C-03 menciona el Polo Tecnológico, sin confirmar el domicilio del organismo responsable. Estas respuestas todavía no permiten cerrar por sí solas los campos legales de términos y privacidad.

La nueva corrección de R-01 identifica la entrevista inicial el 09/07, participantes y horario 16:05–16:45. Falta confirmar su correspondencia con el informe y su validación. La versión de código del 20/10 añade cancelación respecto de la demo elegida en B-02; al preparar los PDF se debe identificar cuál de esos cortes se describirá.
