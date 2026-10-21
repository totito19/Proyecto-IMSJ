# Product Backlog

| Dato | Valor |
|---|---|
| Proyecto | Educación Vial IMSJ — Portal Vial |
| Referente del cliente | Inspector de Tránsito |
| Revisión documental | Juan Robaina |
| Fecha | 21/10/2026 |

## Objetivo del producto

Centralizar la información de Tránsito y su administración, ofrecer materiales y práctica para la ciudadanía y mantener un circuito de revisión y publicación. La agenda y las reservas integran la versión académica.

## Épicas

| ID | Épica | Requisitos |
|---|---|---|
| EP1 | Acceso y control de roles | RF1; RNF1. |
| EP2 | Comunicación pública y noticias | RF2, RF7–RF10; RNF7, RNF10. |
| EP3 | Reservas ciudadanas académicas | RF3–RF4; RNF8–RNF9. |
| EP4 | Gestión de agenda académica | RF11–RF16. |
| EP5 | Materiales de estudio | RF5, RF17, RF20. |
| EP6 | Preguntas frecuentes | RF6, RF18–RF19. |
| EP7 | Calidad transversal | RNF2–RNF6. |
| EP8 | Práctica de pruebas teóricas | RF22, RF24; CC-01, CC-04. |
| EP9 | Consultas ciudadanas | RF23; CC-02. |

## Historias de usuario

Las estimaciones añadidas el 21/10 son retrospectivas (escala 1, 2, 3, 5, 8 por complejidad relativa), no horas ni estimaciones originales. No se suman a los puntos agregados históricos del planning. Los responsables indican área de trabajo y revisión principal de líder/co-líder; no se atribuye autoría exclusiva.

| ID | Historia | Trazabilidad | Prioridad | Estado | Estimación | Responsable |
|---|---|---|---|---|---|---|
| US1 | Como usuario, quiero iniciar sesión con cedula y contraseña para acceder al sistema. | RF1 | Alta | Lista | 3 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US2 | Como personal de IMSJ, quiero que haya control de roles y permisos para diferenciar al público general del personal de IMSJ. | RNF1 | Alta | Lista | 5 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US3 | Como ciudadano, quiero consultar los anuncios y noticias de la sección Tránsito para mantenerme informado. | RF2 | Alta | Lista | 2 (retrospectiva) | Verónica Romero y Juan Corrales |
| US4 | Como personal de IMSJ, quiero publicar y administrar noticias visibles para el público. | RF7 | Alta | Lista | 5 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US5 | Como personal de IMSJ, quiero definir el período de vigencia de cada noticia, para controlar durante qué período se comunica una noticia. | RF8 | Media | Lista | 2 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US6 | Como personal de IMSJ, quiero cargar imagen de portada, galería de imágenes, texto y enlaces útiles en las noticias, para acompañar la información con recursos gráficos y referencias. | RF9 | Media | Parcial | 5 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US7 | Como personal de IMSJ, quiero gestionar el estado de una noticia (publicada / no-publicada), para controlar su disponibilidad en el portal. | RF10 | Alta | Lista | 3 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US8 | Como personal IMSJ, quiero que se maneje la vigencia automática de las noticias para mostrar solo las vigentes. | RNF7 | Media | Lista | 2 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US9 | Como personal IMSJ, quiero que se separe claramente los contenidos publicados de los no-publicados, para distinguir el trabajo interno de lo que consulta la ciudadanía. | RNF10 | Media | Lista | 2 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US10 | Como ciudadano, quiero agendarme para la prueba de manejo. | RF3 | Alta | Lista | 5 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US11 | Como ciudadano, quiero agendar la renovación de libreta de conducir en modalidad normal, para elegir un horario para renovar mi licencia. | RF4 | Alta | Lista | 3 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US12 | Como ciudadano, quiero agendar la renovación de libreta de conducir en modalidad urgente (con costo especial), para solicitar esa modalidad de trámite. | RF4 | Media | Parcial | 3 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US13 | Como personal de IMSJ, quiero que se prevenga la doble reserva de un mismo horario de agenda, para evitar duplicación y exceso de cupos. | RNF8 | Alta | Lista | 5 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US14 | Como ciudadano, quiero recibir una confirmación visual de mi agenda, para comprobar los datos de mi reserva. | RNF9 | Media | Lista | 2 (retrospectiva) | Verónica Romero y Juan Corrales |
| US15 | Como personal de IMSJ, quiero cargar franjas disponibles para trámites normales. | RF11 | Alta | Lista | 3 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US16 | Como personal de IMSJ, quiero cargar franjas disponibles para trámites urgentes. | RF12 | Media | Lista | 2 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US17 | Como personal de IMSJ, quiero cargar franjas disponibles para la prueba de manejo. | RF13 | Alta | Lista | 2 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US18 | Como personal de IMSJ, quiero visualizar la agenda por día, para organizar la atención de cada jornada. | RF14 | Media | Lista | 2 (retrospectiva) | Verónica Romero y Juan Corrales |
| US19 | Como personal de IMSJ, quiero visualizar la agenda por semana, para planificar la atención de la semana. | RF15 | Alta | Lista | 3 (retrospectiva) | Verónica Romero y Juan Corrales |
| US20 | Como personal de IMSJ, quiero visualizar la agenda por mes, para consultar la distribución mensual de reservas. | RF16 | Media | Lista | 3 (retrospectiva) | Verónica Romero y Juan Corrales |
| US21 | Como ciudadano/aspirante, quiero acceder a materiales de estudio para aspirantes. | RF5 | Media | Lista | 2 (retrospectiva) | Verónica Romero y Juan Corrales |
| US22 | Como personal de IMSJ, quiero administrar los materiales de estudio, para mantener actualizado el contenido educativo. | RF17 | Media | Lista | 5 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US23 | Como ciudadano, quiero consultar las preguntas frecuentes, para resolver dudas sobre trámites y educación vial. | RF6 | Media | Lista | 1 (retrospectiva) | Verónica Romero y Juan Corrales |
| US24 | Como personal de IMSJ, quiero mantener la sección de preguntas frecuentes, para mantener las respuestas actualizadas. | RF18 | Media | Lista | 3 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US25 | Como personal de IMSJ, quiero un historial completo de las acciones administrativas, para conocer quién realizó cada modificación. | RNF3 | Media | Parcial | 5 (retrospectiva) | Tomás Cabrera y Gabriela Romero |
| US26 | Como usuario, quiero que los datos personales registrados esten protegidos, para mantener la privacidad de mi información. | RNF4 | Alta | Parcial | 8 (retrospectiva) | Tomás Cabrera y Juan Robaina |
| US27 | Como ciudadano, quiero usar el sistema cómodamente desde el móvil (mobile first), para consultar y operar desde mi teléfono. | RNF5 | Alta | Parcial | 5 (retrospectiva) | Verónica Romero y Juan Corrales |
| US28 | Como público general, quiero contar con accesibilidad básica al usar el sistema, para utilizar las funciones con controles comprensibles. | RNF6 | Media | Parcial | 5 (retrospectiva) | Verónica Romero y Juan Corrales |
| US29 | Como ciudadano, quiero consultar FAQ por categoría para encontrar información relevante. | RF19 | Media | Pendiente | 3 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US30 | Como Dirección, quiero validar contenidos antes de publicarlos para controlar la comunicación institucional. | RF21, CC-03 | Misma entre CC-01–CC-04 | Lista | 8 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US31 | Como aspirante, quiero resolver un simulacro y revisar la corrección para practicar. | RF22, CC-01 | Misma entre CC-01–CC-04 | Lista | 8 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US32 | Como ciudadano, quiero enviar una consulta y que el personal pueda leerla para recibir atención. | RF23, CC-02 | Misma entre CC-01–CC-04 | Lista | 5 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US33 | Como personal, quiero adjuntar gráficos a preguntas para representar situaciones de tránsito. | RF24, CC-04 | Misma entre CC-01–CC-04 | Lista | 3 (retrospectiva) | Tomás Cabrera; integración con frontend |
| US34 | Como usuario, quiero que las entradas inválidas se rechacen para evitar registros incorrectos. | RNF2 | Alta | Lista | 5 (retrospectiva) | Tomás Cabrera y Juan Robaina |

## Criterios de aceptación

| Historia | Épica | Criterios |
|---|---|---|
| US1 | EP1 | Credenciales válidas permiten acceder; las inválidas se rechazan; el cierre revoca la sesión. |
| US2 | EP1 | Las operaciones administrativas comprueban cuenta y rol; una cuenta pública recibe rechazo. |
| US3 | EP2 | La consulta presenta noticias publicadas dentro de su vigencia. |
| US4 | EP2 | El personal crea, modifica y retira noticias; la operación registra al actor. |
| US5 | EP2 | Se guardan inicio y fin; se rechaza un fin anterior al inicio. |
| US6 | EP2 | La noticia admite portada, galería, texto y enlaces; archivos y URL se validan. |
| US7 | EP2 | Publicar exige contenido aprobado; la aprobación y la publicación son acciones separadas. |
| US8 | EP2 | El filtro público aplica las fechas de vigencia. |
| US9 | EP2 | El panel presenta estados internos y el portal consulta contenidos publicados. |
| US10 | EP3 | La franja de prueba tiene cupo; la reserva se asocia al ciudadano y confirma sus datos. |
| US11 | EP3 | La franja distingue renovación normal; la reserva conserva cuenta y horario. |
| US12 | EP3 | La franja distingue renovación urgente; la tarifa especial no se calcula ni cobra en esta versión; se conserva el estado parcial. |
| US13 | EP3 | Se rechaza duplicación por ciudadano/franja; dos solicitudes por el último cupo producen una aceptación. |
| US14 | EP3 | La confirmación muestra identificador, trámite, fecha y horario. |
| US15 | EP4 | El personal carga fecha, intervalo, tipo normal y cupos válidos. |
| US16 | EP4 | El personal carga una franja identificada como renovación urgente. |
| US17 | EP4 | La franja de prueba aparece entre las disponibles según fecha y capacidad. |
| US18 | EP4 | La consulta diaria filtra el día elegido y presenta reservas vigentes. |
| US19 | EP4 | La consulta semanal calcula lunes a domingo y presenta reservas vigentes. |
| US20 | EP4 | La consulta mensual calcula el intervalo del mes y presenta reservas vigentes. |
| US21 | EP5 | El portal presenta los materiales publicados y permite acceder a sus recursos. |
| US22 | EP5 | PDF e imagen se cargan como archivos; VIDEO utiliza URL; la gestión aplica permisos y auditoría. |
| US23 | EP6 | El portal presenta preguntas y respuestas publicadas. |
| US24 | EP6 | El personal crea, modifica y retira FAQ; se aplican validación y auditoría. |
| US25 | EP7 | El historial identifica usuario, acción, elemento y fecha; su consulta requiere personal. |
| US26 | EP7 | Contraseñas con hash, sesiones revocables, permisos, validación y controles de infraestructura. |
| US27 | EP7 | Los recorridos principales mantienen controles y contenido al variar el tamaño de pantalla; criterio de evaluación manual: recorridos principales, tamaños de pantalla y teclado; no se declara aprobada una matriz completa. |
| US28 | EP7 | Los recorridos utilizan etiquetas, foco y controles semánticos; criterio de evaluación manual: recorridos principales, tamaños de pantalla y teclado; no se declara aprobada una matriz completa. |
| US29 | EP6 | Criterio de aceptación de RF19: un catálogo deberá permitir clasificar y filtrar preguntas; la versión actual conserva US29 pendiente. |
| US30 | EP2 / EP5 / EP6 | Solo Directora aprueba; publicar es posterior y editar devuelve a borrador. |
| US31 | EP8 | Hasta diez preguntas aleatorias, cuatro opciones y corrección posterior con total y aciertos. |
| US32 | EP9 | Nombre, correo y mensaje llegan a la bandeja; el personal puede leer y marcar la consulta. |
| US33 | EP8 | Una imagen opcional JPG/PNG/WEBP de hasta 2048 KB puede asociarse y mostrarse en el simulacro. |
| US34 | EP7 | El servidor rechaza datos inválidos y devuelve un error controlado; las transacciones conservan consistencia. |

## Trabajo técnico

| ID | Trabajo | Estado | Responsable |
|---|---|---|---|
| TM-01 | Estructura PHP nativa y contrato de API. | Listo | Tomás Cabrera; revisión de Juan Robaina. |
| TM-02 | Autenticación, revocación y permisos. | Listo | Tomás Cabrera; pruebas y revisión de Juan Robaina. |
| TM-03 | PDO, esquema y transacciones. | Listo | Tomás Cabrera y Gabriela Romero. |
| TM-04 | Contenidos, archivos e historial. | Listo | Tomás Cabrera; integración con Verónica Romero y Juan Corrales. |
| TM-05 | Simulador y agenda académica. | Listo | Backend y frontend; datos de Gabriela Romero. |
| TM-06 | Docker, Apache y hardening. | Listo | Tomás Cabrera; revisión con Juan Robaina. |
| TM-07 | Integración y comprobaciones de seguridad. | Listo | Tomás Cabrera y Juan Robaina; apoyo del equipo. |

## Funciones y configuración de la versión

La cancelación propia se integra al circuito académico de reservas. El usuario confirma la acción y la API elimina la relación de la cuenta autenticada con la franja. Al recalcular la ocupación se libera el cupo. Los listados de reservas y agenda muestran fechas vigentes y futuras.

| Elemento | Configuración |
|---|---|
| Noticias | API con portada, galería y enlaces; interfaces con portada y texto. |
| Simulacro | Hasta diez preguntas; cuatro opciones; total y aciertos. |
| Videos | URL HTTP/HTTPS. |
| Categorías FAQ | RF19/US29 permanece pendiente de implementación; la versión permite FAQ sin clasificación. |
| Costo urgente | Modalidad académica diferenciada; la versión no calcula ni cobra tarifa especial (RF4/US12 parcial). |
| Conservación de auditoría | El historial permanece en la base; su conservación y eventual depuración requieren política institucional. |
| HTTPS institucional | Requisito de publicación institucional; demostración local mediante HTTP. |

## Verificación

| Registro | Resultado | Evidencia |
|---|---|---|
| Integración del 21/10 | 192 comprobaciones; 46 endpoints. | [Resultado integral](../../output/integracion-final.json). |
| Auditoría Bash del 21/10 | 43 aprobadas, 0 fallidas, 0 omitidas. | [Resultado API](../../output/security-api-final.txt). |
| Concurrencia | Último cupo: 201 y 422. | [Registro de verificación](../../docs_auxiliares/evidencias/verificacion.md). |

## Dependencias del incremento

La aprobación de US30 atraviesa noticias, materiales y FAQ y utiliza el rol Directora. US33 amplía el banco de US31 con una imagen por pregunta. US32 utiliza un envío público y una lectura protegida, con persistencia de la marca de leído. Estas relaciones permiten comprobar cada ampliación tanto en la API como en su pantalla.

La matriz de [pruebas](plan_informe_pruebas.md) relaciona las historias con escenarios y resultados. Los estados Lista, Parcial y Pendiente describen el alcance del producto al corte documental; la columna de estimación ofrece una valoración retrospectiva por historia, distinta de los puntos agregados históricos del sprint.

## Referencias

[Requisitos](Requerimientos.md), [planning](sprint_planning.md), [cambios](control_cambios.md), [Backlog del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/backlog.md) y [Historias de usuario del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/user-stories.md).
