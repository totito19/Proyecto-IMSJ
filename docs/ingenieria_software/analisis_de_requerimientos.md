# Análisis de requerimientos

## Sistema de Gestión de Educación Vial — IMSJ

**Versión documental:** 1.0
**Fecha de consolidación:** 20/10/2026
**Estado del proyecto:** CC-01–CC-05 implementados
**Propósito:** reunir en un único documento el relevamiento, el alcance, los requisitos, las reglas de negocio y su trazabilidad.

---

## 1. Introducción

La Intendencia Municipal de San José necesita una plataforma web que centralice la información de la sección Tránsito. El sistema permite publicar noticias, facilitar materiales de estudio, responder preguntas frecuentes, ofrecer simulacros de pruebas teóricas y recibir consultas ciudadanas.

El proyecto también contiene un módulo académico de agenda para reservar pruebas de manejo y renovaciones de libreta. Este módulo forma parte de la entrega de egreso, pero fue excluido de la entrega destinada al cliente.

## 2. Objetivo del análisis

Este análisis busca:

- identificar las necesidades de la ciudadanía y del personal de la IMSJ;
- definir el alcance real y el alcance académico del sistema;
- documentar los requisitos funcionales y no funcionales;
- registrar las reglas de negocio y restricciones conocidas;
- relacionar cada requisito con su fuente, estado y evidencia;
- mantener visibles los datos pendientes sin completarlos mediante suposiciones.

## 3. Fuentes del relevamiento

La información fue consolidada a partir de:

- la definición inicial del proyecto;
- la guía de preguntas preparada para el cliente;
- el informe de la entrevista de relevamiento;
- la reunión y demostración del 03/09/2026 con la Directora y el Inspector de Tránsito;
- las solicitudes de cambio CC-01–CC-05;
- el backlog y la implementación disponible.

Documentos de respaldo:

- [Project Charter](project_charter.md)
- [Preguntas de entrevista](Entrevista.md)
- [Informe de entrevista](informe%20entrevista.md)
- [Requerimientos originales](Requerimientos.md)
- [Backlog](backlog.md)
- [Control de cambios](control_cambios.md)
- [Evidencia de verificación](../../docs_auxiliares/evidencias/verificacion.md)

## 4. Interesados y usuarios

| Interesado o usuario | Participación |
|---|---|
| Intendencia Municipal de San José | Patrocinador y destinatario del sistema. |
| Inspector de Tránsito | Referente del cliente y participante en la validación de necesidades y cambios. |
| Directora | Responsable de aprobar contenidos antes de su publicación. |
| Personal de la IMSJ | Administra noticias, materiales, preguntas frecuentes, consultas y demás contenidos habilitados. |
| Ciudadanía | Consulta la información pública, utiliza los materiales y puede enviar consultas. |
| Aspirantes a licencia de conducir | Acceden a materiales y simulacros de pruebas teóricas. |
| Equipo del proyecto | Analiza, desarrolla, prueba y documenta el sistema. |

## 5. Alcance

### 5.1 Alcance de la entrega al cliente

- consulta pública de noticias;
- administración de noticias y su vigencia;
- publicación y consulta de materiales de estudio;
- mantenimiento y consulta de preguntas frecuentes;
- flujo de aprobación de contenidos por la Directora;
- simulacros de pruebas teóricas;
- imágenes opcionales en preguntas de simulacros;
- formulario público de consultas y bandeja de lectura en el panel;
- autenticación, roles, validaciones y registro de acciones administrativas.

### 5.2 Alcance académico

Además de lo anterior, la versión académica incluye:

- reserva de prueba de manejo;
- reserva de renovación de libreta normal o urgente;
- administración de franjas y cupos;
- consulta de agenda por día, semana y mes;
- prevención de reservas duplicadas;
- confirmación visual de la reserva;
- cancelación de reservas propias.

### 5.3 Fuera del alcance confirmado

- la agenda no forma parte de la entrega actual al cliente;
- no se definió pago en línea;
- no se definió una regla de cálculo para el costo del trámite urgente;
- el módulo de consultas no incluye respuesta desde el sistema ni notificaciones automáticas;
- el simulacro no posee temporizador ni umbral de aprobación.

## 6. Requisitos funcionales

| Código | Requisito | Alcance | Estado |
|---|---|---|---|
| RF1 | El sistema debe permitir iniciar sesión con cédula y contraseña. | Cliente y académico | Implementado |
| RF2 | El sistema debe permitir consultar anuncios y noticias de la sección Tránsito. | Cliente y académico | Implementado |
| RF3 | El sistema debe permitir que los ciudadanos reserven una prueba de manejo. | Académico | Implementado |
| RF4 | El sistema debe permitir reservar la renovación de libreta normal o urgente. | Académico | Parcial: no se definió el costo urgente |
| RF5 | El sistema debe permitir acceder a materiales de estudio. | Cliente y académico | Implementado |
| RF6 | El sistema debe permitir consultar preguntas frecuentes. | Cliente y académico | Implementado |
| RF7 | El personal debe poder crear, modificar y administrar noticias. | Cliente y académico | Implementado |
| RF8 | El personal debe poder definir el período de vigencia de una noticia. | Cliente y académico | Implementado |
| RF9 | Las noticias deben admitir portada, galería, texto y enlaces útiles. | Cliente y académico | Parcial: galería y enlaces no están completos en las interfaces |
| RF10 | El sistema debe permitir gestionar el estado de publicación de una noticia. | Cliente y académico | Implementado |
| RF11 | El personal debe poder cargar franjas para trámites normales. | Académico | Implementado |
| RF12 | El personal debe poder cargar franjas para trámites urgentes. | Académico | Implementado |
| RF13 | El personal debe poder cargar franjas para pruebas de manejo. | Académico | Implementado |
| RF14 | El personal debe poder consultar la agenda diaria. | Académico | Implementado |
| RF15 | El personal debe poder consultar la agenda semanal. | Académico | Implementado |
| RF16 | El personal debe poder consultar la agenda mensual. | Académico | Implementado |
| RF17 | El personal debe poder administrar materiales de estudio. | Cliente y académico | Implementado |
| RF18 | El personal debe poder mantener la sección de preguntas frecuentes. | Cliente y académico | Implementado |
| RF19 | Las preguntas frecuentes deben poder clasificarse por categorías. | Cliente y académico | Pendiente |
| RF20 | Los materiales de estudio deben admitir PDF, imágenes y videos. | Cliente y académico | Implementado con videos mediante URL |
| RF21 | Los contenidos deben ser aprobados por la Directora antes de publicarse. | Cliente y académico | Implementado |
| RF22 | El sistema debe ofrecer simulacros de pruebas teóricas. | Cliente y académico | Implementado |
| RF23 | La ciudadanía debe poder enviar consultas y el personal debe poder leerlas en el panel. | Cliente y académico | Implementado |
| RF24 | El personal debe poder adjuntar material gráfico a las preguntas de los simulacros. | Cliente y académico | Implementado |

## 7. Requisitos no funcionales

| Código | Requisito | Estado o criterio actual |
|---|---|---|
| RNF1 | Controlar el acceso según el tipo de usuario y su rol. | Implementado para público, personal y Directora. |
| RNF2 | Validar los datos recibidos antes de almacenarlos. | Implementado en el servidor. |
| RNF3 | Mantener un historial de acciones administrativas. | Parcial: falta acordar cobertura total y retención. |
| RNF4 | Proteger los datos personales. | Parcial: existen roles, hashes y aislamiento; el despliegue debe definir HTTPS, respaldo y retención. |
| RNF5 | Ofrecer una interfaz adaptable a dispositivos móviles. | Parcial: diseño adaptable, sin prueba formal en dispositivos. |
| RNF6 | Proporcionar accesibilidad básica. | Parcial: existen etiquetas, foco y controles semánticos; falta una auditoría formal. |
| RNF7 | Gestionar automáticamente la vigencia de las noticias. | Implementado. |
| RNF8 | Evitar reservas duplicadas y superar los cupos disponibles. | Implementado en el alcance académico. |
| RNF9 | Mostrar una confirmación visual después de reservar. | Implementado en el alcance académico. |
| RNF10 | Separar claramente los contenidos publicados de los no publicados. | Implementado. |

## 8. Reglas de negocio

### 8.1 Autenticación y permisos

- Las operaciones administrativas requieren una sesión válida.
- El público no puede ejecutar acciones reservadas al personal.
- La aprobación de contenidos corresponde únicamente al rol Directora.
- La aprobación y la publicación son acciones diferentes.

### 8.2 Gestión de contenidos

- Noticias, materiales y preguntas frecuentes siguen el flujo: **Borrador → Pendiente → Aprobado → Publicado**.
- Un contenido publicado es visible para el público; los demás estados permanecen en administración.
- Si un contenido aprobado o publicado se modifica, vuelve a borrador y necesita una nueva aprobación.
- Las noticias fuera de su período de vigencia no deben mostrarse públicamente.

### 8.3 Materiales de estudio

- Se admiten documentos PDF e imágenes como archivos.
- Los videos se registran actualmente mediante una dirección web HTTP o HTTPS.
- Los materiales deben estar redactados o seleccionados con un lenguaje comprensible, especialmente para adolescentes.

### 8.4 Simulacros

- Cada simulacro selecciona aleatoriamente hasta diez preguntas.
- Cada pregunta presenta cuatro opciones.
- Las respuestas correctas se muestran únicamente después de la corrección.
- Una pregunta puede incluir una imagen JPG, PNG o WEBP de hasta 2048 KB.
- No se ha establecido tiempo límite ni puntaje mínimo de aprobación.

### 8.5 Consultas ciudadanas

- El formulario solicita nombre, correo electrónico y mensaje.
- El personal puede desplegar y leer cada consulta en el panel.
- Una consulta puede marcarse como leída.
- El sistema no contempla actualmente responder la consulta ni enviar notificaciones.

### 8.6 Agenda académica

- Cada franja posee fecha, horario, tipo de trámite y cupos.
- No se puede superar la cantidad de cupos disponibles.
- Un ciudadano no puede duplicar una reserva para la misma franja.
- Las renovaciones normales y urgentes deben poder distinguirse.
- El costo de la modalidad urgente no se implementará hasta contar con una regla validada.
- Un ciudadano puede cancelar únicamente su propia reserva. La operación elimina el registro y libera el cupo.
- Los listados vigentes excluyen fechas pasadas, también para personal; no incluyen un historial de reservas canceladas.

## 9. Casos de uso principales

| Actor | Caso de uso | Resultado esperado |
|---|---|---|
| Ciudadano | Consultar noticias | Visualiza solamente noticias publicadas y vigentes. |
| Ciudadano | Consultar materiales | Accede únicamente a materiales publicados. |
| Ciudadano | Consultar preguntas frecuentes | Visualiza las preguntas y respuestas publicadas. |
| Aspirante | Resolver simulacro | Responde hasta diez preguntas y obtiene el resultado al finalizar. |
| Ciudadano | Enviar consulta | La consulta queda almacenada y disponible para el personal. |
| Personal IMSJ | Administrar contenido | Crea, modifica y envía contenido a aprobación. |
| Directora | Aprobar contenido | Habilita un contenido para su publicación posterior. |
| Personal IMSJ | Publicar contenido | Publica un contenido previamente aprobado. |
| Ciudadano | Reservar un trámite | Obtiene una reserva y una confirmación, si existe cupo. |
| Ciudadano | Cancelar reserva propia | Se elimina su reserva; una reserva ajena no puede cancelarse. |
| Personal IMSJ | Gestionar agenda | Crea franjas y consulta reservas por período. |

## 10. Criterios generales de aceptación

- Las credenciales válidas permiten acceder y las inválidas son rechazadas.
- Las rutas administrativas rechazan usuarios sin autorización.
- Los datos inválidos no deben generar registros parciales.
- El portal muestra únicamente contenidos publicados y, cuando corresponde, vigentes.
- Solo la Directora puede aprobar contenidos.
- Aprobar un contenido no debe publicarlo automáticamente.
- El simulacro no debe revelar la respuesta correcta antes de su corrección.
- Las consultas enviadas desde el portal deben aparecer en el panel.
- Las reservas no deben superar los cupos ni duplicarse para el mismo ciudadano y franja.
- Las operaciones administrativas relevantes deben quedar asociadas al usuario que las realizó.

Los criterios específicos por historia se encuentran en el [backlog](backlog.md).

## 11. Priorización y estado

La clasificación agrupa prioridades del backlog. No establece una prioridad distinta entre CC-01–CC-04 ni un nuevo orden de entrega al cliente.

### Prioridad alta

- autenticación y control de acceso;
- consulta y administración de noticias;
- flujo de aprobación institucional;
- protección y validación de datos;
- adaptación móvil, conforme a US27 del backlog;
- funcionamiento del simulacro;
- consultas ciudadanas.

### Prioridad media

- materiales de estudio;
- preguntas frecuentes;
- vigencia automática;
- historial administrativo;
- accesibilidad básica.

### Pendientes principales

1. Implementar categorías para preguntas frecuentes.
2. Completar galería y enlaces de noticias en las interfaces.
3. Definir la regla del costo del trámite urgente.
4. Acordar el alcance y la retención del historial de auditoría.
5. Validar formalmente accesibilidad y experiencia móvil.
6. Definir medidas operativas de HTTPS, respaldo y retención de datos para producción.

## 12. Restricciones y decisiones técnicas

- El backend está desarrollado en PHP nativo, organizado por capas y conectado a MySQL mediante PDO.
- Los frontends público y administrativo consumen una API común.
- La sustitución de Laravel por PHP sin framework corresponde a CC-05 y no modifica los requisitos de negocio.
- Las sesiones son revocables y tienen una duración limitada.
- La instalación y el despliegue se apoyan en Docker.
- No deben incorporarse reglas de negocio sin una fuente o validación registrada.

## 13. Trazabilidad de cambios

| Cambio | Necesidad | Requisitos relacionados | Estado |
|---|---|---|---|
| CC-01 | Incorporar simulacros de pruebas teóricas. | RF22 | Listo |
| CC-02 | Incorporar formulario de consultas y bandeja en el panel. | RF23 | Listo |
| CC-03 | Incorporar aprobación de contenidos por la Directora. | RF21, RF7, RF10, RF17, RF18 | Listo |
| CC-04 | Adjuntar imágenes a las preguntas de simulacros. | RF24 | Listo |
| CC-05 | Sustituir Laravel por PHP sin framework. | Decisión técnica transversal | Listo |

## 14. Riesgos y aspectos pendientes de validación

| Riesgo o pendiente | Consecuencia | Acción recomendada |
|---|---|---|
| Faltan categorías concretas de preguntas frecuentes. | RF19 no puede implementarse completamente. | Acordar nombres, mantenimiento y forma de filtrado. |
| No existe una regla de costo urgente. | La reserva urgente no puede informar ni calcular un costo confiable. | Validar importe, responsables y posibilidad de modificación. |
| No se definió la retención de auditoría y datos personales. | Dificultad para evaluar cumplimiento y almacenamiento. | Acordar plazos, responsables y procedimiento de eliminación. |
| Accesibilidad y uso móvil no tienen métricas formales. | No puede demostrarse el cumplimiento completo de RNF5 y RNF6. | Definir dispositivos, navegadores y una lista de verificación. |
| La evidencia original de la entrevista está incompleta. | Reduce la trazabilidad de algunas decisiones. | Completar fecha, participantes, modalidad y validación del entrevistado. |

## 15. Validación del documento

Este documento consolida la información existente, pero no sustituye las actas, entrevistas ni solicitudes de cambio como evidencia de origen. Toda modificación futura debe registrar:

- fecha;
- solicitante;
- descripción de la necesidad;
- impacto en requisitos y alcance;
- decisión adoptada;
- responsable de aprobación;
- estado y evidencia de verificación.

---

## 16. Documentos relacionados

- [Project Charter](project_charter.md)
- [Backlog de producto](backlog.md)
- [Control de cambios](control_cambios.md)
- [Sprint Planning](sprint_planning.md)
- [Actas de reuniones](actas_reuniones.md)
- [Actas de Sprint Review](actas_sprint_review.md)
- [Documentación general del proyecto](documentacion_proyecto_imsj.md)
- [Evidencia técnica](../../docs_auxiliares/evidencias/verificacion.md)

## 17. Recorridos de verificación

| Recorrido | Componentes que intervienen | Evidencia que permite revisarlo |
|---|---|---|
| Ingreso y cierre de sesión | AuthController, AuthService, AuthRepository y `auth_tokens`. | Suite HTTP de credenciales, acceso protegido y revocación. |
| Publicación de contenido | Controladores y servicios de Noticia, Material y Pregunta; Auth y registro de acciones. | Pruebas del flujo Directora y demo del 13/10. |
| Simulacro con gráfico | PruebaController/Service/Repository, modelo Prueba y Archivo. | Consulta pública sin respuesta correcta, carga permitida y corrección en servidor. |
| Consulta ciudadana | ConsultaController/Service/Repository y panel Consultas. | Envío, lectura y marcado registrados en la demo del 13/10. |
| Cupo y reserva | ReservaService/Repository, usuarios, franjas y reservas. | Prueba concurrente con dos procesos y MySQL del registro técnico. |
| Cancelación propia | Ruta DELETE, ReservaController/Service/Repository e interfaz de reservas. | Casos incorporados a `backend/tests/integracion.py`; la revisión actual no acredita una nueva ejecución HTTP. |
| Instalación local | BAT, script de Docker, Compose, migración, Apache y MySQL. | Arranque aislado del 13/10 y procedimiento SSOO. |

Los recorridos facilitan relacionar una necesidad con las capas que la implementan. Para reproducir un resultado se debe utilizar la versión y el entorno de su registro; las pruebas anteriores no cubren automáticamente cambios posteriores.
