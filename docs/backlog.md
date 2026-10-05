> **Actualización CC-05 - 05/10/2026:** el backend de trabajo ya fue reescrito en PHP nativo a partir de api-simple, con la estructura de siete módulos solicitada. [Implementación/transición](migracion_backend_vanilla.md), [flujos](flujo_endpoints_backend.md) y [pruebas ejecutadas y límites](verificacion.md). Las menciones siguientes a código Laravel o destino api-completa corresponden al antecedente fechado del 02/10, conservado para trazabilidad. CC-01 a CC-04 siguen pendientes; las actas y aprobaciones permanecen a cargo del equipo.

---

# Backlog de Producto y Épicas de Usuario

> **Revisión asistida por IA — 02/10/2026:** US1–US28, sus prioridades y el estado «Pendiente» se conservan como registro inicial, sin asumir que reflejan la implementación actual. Al final se agrega evidencia separada y criterios sugeridos. La agenda (EP3/EP4) es académica. Las estimaciones, responsables, sprint comprometido y aceptación de cada US no están registrados.

## Épicas de Usuario

| Épica | Nombre | Descripción | Requerimientos cubiertos |
|-------|--------|-------------|--------------------------|
| EP1 | Acceso y control de roles | Inicio de sesión y separación de permisos entre público general y personal de IMSJ. | RF1, RNF1 |
| EP2 | Comunicación pública (Noticias / Cartelera) | Publicación y consulta de noticias de la sección Tránsito, con su contenido, vigencia y estado de publicación. | RF2, RF7, RF8, RF9, RF10, RNF7, RNF10 |
| EP3 | Agendamiento de trámites (ciudadano) | Reserva de prueba de manejo y de renovación de libreta (normal y urgente) por parte del ciudadano. | RF3, RF4, RNF8, RNF9 |
| EP4 | Gestión de agenda (IMSJ) | Carga de franjas horarias disponibles y visualización de la agenda por día, semana y mes. | RF11, RF12, RF13, RF14, RF15, RF16 |
| EP5 | Materiales de estudio | Acceso del aspirante y administración de los materiales de estudio. | RF5, RF17 |
| EP6 | Preguntas frecuentes | Consulta y mantenimiento de la sección de preguntas frecuentes. | RF6, RF18|
| EP7 | Calidad y requisitos transversales | Validaciones, historial de acciones, protección de datos, usabilidad móvil y accesibilidad. | RNF2, RNF3, RNF4, RNF5, RNF6 |

---

## Backlog de Producto

### EP1 — Acceso y control de roles

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US1 | Como usuario, quiero iniciar sesión con cedula y contraseña para acceder al sistema. | RF1 | Alta | Pendiente |
| US2 | Como personal de IMSJ, quiero que haya control de roles y permisos para diferenciar al público general del personal de IMSJ. | RNF1 | Alta | Pendiente |

### EP2 — Comunicación pública (Noticias / Cartelera)

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US3 | Como ciudadano, quiero consultar los anuncios y noticias de la sección Tránsito para mantenerme informado. | RF2 | Alta | Pendiente |
| US4 | Como personal de IMSJ, quiero publicar y administrar noticias visibles para el público. | RF7 | Alta | Pendiente |
| US5 | Como personal de IMSJ, quiero definir el período de vigencia de cada noticia. | RF8 | Media | Pendiente |
| US6 | Como personal de IMSJ, quiero cargar imagen de portada, galería de imágenes, texto y enlaces útiles en las noticias. | RF9 | Media | Pendiente |
| US7 | Como personal de IMSJ, quiero gestionar el estado de una noticia (publicada / no-publicada). | RF10 | Alta | Pendiente |
| US8 | Como personal IMSJ, quiero que se maneje la vigencia automática de las noticias para mostrar solo las vigentes. | RNF7 | Media | Pendiente |
| US9 | Como personal IMSJ, quiero que se separe claramente los contenidos publicados de los no-publicados. | RNF10 | Media | Pendiente |

### EP3 — Agendamiento de trámites (ciudadano)

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US10 | Como ciudadano, quiero agendarme para la prueba de manejo. | RF3 | Alta | Pendiente |
| US11 | Como ciudadano, quiero agendar la renovación de libreta de conducir en modalidad normal. | RF4 | Alta | Pendiente |
| US12 | Como ciudadano, quiero agendar la renovación de libreta de conducir en modalidad urgente (con costo especial). | RF4 | Media | Pendiente |
| US13 | Como personal de IMSJ, quiero que se prevenga la doble reserva de un mismo horario de agenda. | RNF8 | Alta | Pendiente |
| US14 | Como ciudadano, quiero recibir una confirmación visual de mi agenda. | RNF9 | Media | Pendiente |

### EP4 — Gestión de agenda (IMSJ)

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US15 | Como personal de IMSJ, quiero cargar franjas disponibles para trámites normales. | RF11 | Alta | Pendiente |
| US16 | Como personal de IMSJ, quiero cargar franjas disponibles para trámites urgentes. | RF12 | Media | Pendiente |
| US17 | Como personal de IMSJ, quiero cargar franjas disponibles para la prueba de manejo. | RF13 | Alta | Pendiente |
| US18 | Como personal de IMSJ, quiero visualizar la agenda por día. | RF14 | Media | Pendiente |
| US19 | Como personal de IMSJ, quiero visualizar la agenda por semana. | RF15 | Alta | Pendiente |
| US20 | Como personal de IMSJ, quiero visualizar la agenda por mes. | RF16 | Media | Pendiente |

### EP5 — Materiales de estudio

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US21 | Como ciudadano/aspirante, quiero acceder a materiales de estudio para aspirantes. | RF5 | Media | Pendiente |
| US22 | Como personal de IMSJ, quiero administrar los materiales de estudio. | RF17 | Media | Pendiente |

### EP6 — Preguntas frecuentes

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US23 | Como ciudadano, quiero consultar las preguntas frecuentes. | RF6 | Media | Pendiente |
| US24 | Como personal de IMSJ, quiero mantener la sección de preguntas frecuentes. | RF18 | Media | Pendiente |

### EP7 — Calidad y requisitos transversales

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US25 | Como personal de IMSJ, quiero un historial completo de las acciones administrativas. | RNF3 | Media | Pendiente |
| US26 | Como usuario, quiero que los datos personales registrados esten protegidos. | RNF4 | Alta | Pendiente |
| US27 | Como ciudadano, quiero usar el sistema cómodamente desde el móvil (mobile first). | RNF5 | Alta | Pendiente |
| US28 | Como público general, quiero contar con accesibilidad básica al usar el sistema. | RNF6 | Media | Pendiente |

---

## Criterios de aceptación para revisar

**IA — Sugerencia:** las filas siguientes convierten las necesidades ya escritas en verificaciones concretas. El equipo debe elaborarlas/validarlas antes de usarlas como definición de terminado. No son criterios aceptados por el cliente, resultados de prueba ni nuevas reglas aprobadas. Los beneficios de las US que omiten «para» también necesitan redacción y validación del equipo.

| US | Criterio propuesto | Evidencia disponible / límite |
|---|---|---|
| US1 | Credenciales válidas permiten acceder; las inválidas se rechazan; cerrar sesión revoca el acceso. | AuthController/AuthService y AuthenticationTest. Resultado no registrado. |
| US2 | Una cuenta pública no puede ejecutar operaciones administrativas; personal puede acceder a ellas. | Middleware de roles y pruebas de permisos. Directora de CC-03 sigue pendiente. |
| US3 | Solo se muestran noticias publicadas y dentro de vigencia; no se exponen las demás. | NewsApiTest. |
| US4 | Personal puede crear, editar y retirar noticia; cada operación queda asociada a su usuario. | NoticiaService y NewsApiTest; circuito de aprobación no implementado. |
| US5 | Inicio y fin se guardan y no se admite fin anterior al inicio. | Validación de NoticiaController. |
| US6 | Portada, galería y enlaces se conservan y presentan; archivos o enlaces inválidos se rechazan. | API de noticias y pruebas de portada; límites de carga actuales no son acuerdos. |
| US7 | Cambiar publicación modifica la visibilidad pública; aprobación y publicación deben revisarse aparte por CC-03. | Dos estados actuales; no cuatro. |
| US8 | Una noticia fuera de vigencia no aparece públicamente sin requerir modificación manual del estado. | Filtro de Noticia y NewsApiTest. |
| US9 | Administración puede ver no publicados; el portal público no los devuelve. | Rutas administrativas/públicas y filtros. |
| US10 | Público autenticado reserva franja de prueba con cupo y ve confirmación; sin cupo se rechaza. | ReservaService y SchedulingApiTest; solo destino académico. |
| US11 | La reserva normal queda asociada al ciudadano y a la franja seleccionada. | Mismo circuito de reservas; falta aceptación. |
| US12 | Se distingue renovación urgente; el costo especial debe tener regla y registro acordados. | Tipo urgente existente; no hay campo de costo. Esta US no puede cerrarse por distinguir el tipo únicamente. |
| US13 | Se rechaza duplicación por ciudadano/franja y la concurrencia no supera los cupos. | Unicidad, transacción y bloqueo en código; pruebas actuales de capacidad no son evidencia de concurrencia MySQL. |
| US14 | Luego de guardar, el ciudadano ve identificador, trámite, fecha y horario correspondientes a su reserva. | API/resource y frontend; evidencia visual pendiente. |
| US15 | Personal crea franja normal con fecha, intervalo y cupos; se rechazan datos inválidos. | FranjaDisponibilidadController/Service y SchedulingApiTest. |
| US16 | Personal crea franja urgente y puede distinguirla de una normal. | Tipo urgente en esquema; costo sigue pendiente. |
| US17 | Personal crea franja de prueba de manejo, disponible en la consulta ciudadana según cupo/fecha. | API de franjas y pruebas. |
| US18 | La vista diaria devuelve reservas del día elegido, con ciudadano y franja. | `GET /agenda?vista=dia&fecha=...` y SchedulingApiTest. |
| US19 | La vista semanal muestra las reservas del período solicitado; el inicio de semana se confirma con el equipo. | ReservaService usa startOfWeek/endOfWeek; no hay acuerdo registrado sobre calendario. |
| US20 | La vista mensual muestra las reservas del mes solicitado. | ReservaService y SchedulingApiTest. |
| US21 | Ciudadano accede a materiales publicados y no a los no publicados. | ContentApiTest. |
| US22 | Personal administra PDF, imagen y video conforme a formatos acordados; retirar un archivo elimina su referencia válida. | RF17 se amplía con RF20; VIDEO es URL, no archivo, en código actual. |
| US23 | Se muestran FAQ publicadas con sus respuestas; las no publicadas permanecen en administración. | ContentApiTest. Categorías: US29. |
| US24 | Personal crea, modifica y retira FAQ con validación y auditoría. | PreguntaFrecuenteService; enlaces útiles de la letra necesitan definición. |
| US25 | Una acción administrativa registra usuario, acción, fecha y elemento; público no consulta ni modifica el historial. | HistorialAccion y rutas. «Completo» requiere acordar operaciones cubiertas y retención. |
| US26 | Se restringen datos por usuario/rol, se usan hashes y se documentan medidas para entorno real. | AuthService, middleware y borrador legal. HTTPS, retención y respaldo probado pendientes. |
| US27 | Los flujos principales se completan desde móvil sin pérdida de contenido o controles. | HTML/CSS disponibles; dispositivos y resultados no registrados. |
| US28 | Los flujos principales se pueden recorrer con teclado, etiquetas y foco comprensibles. | Propuesta pendiente de revisión; no se adopta una norma ni se certifica accesibilidad. |

## Necesidades que faltaban en el backlog

**IA — Borradores derivados de fuentes existentes:** se reservan US29–US34 para evitar identificadores ambiguos. Puntos, tareas por integrante y sprint quedan **por acordar**. El grupo confirmó CC-01–CC-04 (US30–US33) como pendientes para entrega real, sin fecha ni prioridad distinta entre ellas. Esto no cambia las prioridades históricas de US1–US28 ni asigna prioridad a US29/US34. Los criterios siguientes siguen siendo propuestas documentales, no aceptación del cliente.

| ID | Historia propuesta | Fuente / requisito | Criterio propuesto | Situación observada |
|---|---|---|---|---|
| US29 | Como ciudadano, quiero consultar FAQ por categoría para encontrar información relevante. | Entrevista, RF19; EP6. | Clasificación y consulta por categorías acordadas. | Sin implementación localizada; categorías concretas pendientes. |
| US30 | Como Dirección, quiero validar contenidos antes de publicarlos para controlar la comunicación institucional. | RF21, CC-03; EP2 y alcance adicional pendiente. | Borrador → Pendiente → Aprobado → Publicado; aprobación no publica por sí sola. Permisos y revisión de cambios por acordar. | Pendiente, entrega real; código conserva dos estados/roles. |
| US31 | Como aspirante, quiero resolver un simulacro y revisar la corrección para practicar. | RF22, CC-01. | Preguntas y corrección sin revelar respuestas previamente; configuración y resultado acordados. | Pendiente, entrega real según el grupo; banco/API/frontend existentes no acreditan cierre ni aceptación. |
| US32 | Como ciudadano, quiero enviar una consulta y que el personal pueda leerla para recibir atención. | RF23, CC-02. | Envío desde pie de portal y lectura desplegable en apartado Consultas. | Pendiente, entrega real; sin circuito localizado. No se añade respuesta/notificación no solicitada. |
| US33 | Como personal, quiero adjuntar gráficos a preguntas para representar situaciones de tránsito. | RF24, CC-04. | Gráfico asociado se muestra al resolver; tipos y límites acordados. | Pendiente, entrega real; sin campo/carga localizados. |
| US34 | Como usuario, quiero que las entradas inválidas se rechacen para evitar registros incorrectos. | RNF2; EP7. | Casos inválidos se rechazan en servidor sin persistencia parcial; mensajes claros. | Validaciones existentes; cobertura y resultados por registrar. |

La administración de personal y el registro ciudadano existen en código, pero falta documentar su origen y aceptación. Se inventarían requisitos si se presentaran automáticamente como pedidos del cliente; se conservan en el inventario de API para que el equipo resuelva la trazabilidad.

## Campos pendientes para usar el backlog como plan real

| Campo | Estado |
|---|---|
| Puntos por US y total por épica | No estimados por el equipo en este documento. Los puntos por tarea del planning no se reparten retrospectivamente entre US. |
| Responsable y revisor por US | Roles generales aclarados en [aclaraciones y pendientes](aclaraciones_y_pendientes.md); tareas concretas por US aún no registradas. |
| Sprint seleccionado / capacidad | No registrados como compromiso; ver reconstrucción de [planning](sprint_planning.md). |
| Evidencia de pruebas y aceptación | No registrada; completar [verificación](verificacion.md). |
| Aprobación de criterios propuestos | Revisión/aprobación documental interna por Juan Robaina; aceptación de entregas y cambios por el Inspector de Tránsito, registrada en actas. No se acredita ninguna aprobación ya realizada. |

Fuentes: [historias del curso](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/03_historias_de_usuario.md) y [criterios de historias](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/user-stories.md).

## Trabajo técnico de migración — CC-05

**Decisión del grupo, 02/10/2026:** sustituir Laravel por PHP sin framework basado en `api-completa`, conservando contrato y dominio de IMSJ. El código todavía no migró. Se registra como trabajo técnico transversal; US1–US34 mantienen sus identificadores y estados, sin inventar una nueva historia funcional o prioridad.

**IA — Desglose para revisión del equipo:** las tareas TM-01–TM-07 y sus dependencias se describen en la [guía de migración](migracion_backend_vanilla.md). No se asignan puntos, fechas, sprint ni responsables concretos por deducirlos del rol general.

| Tareas técnicas | Historias / necesidad afectada | Evidencia pendiente |
|---|---|---|
| TM-01/TM-02: contrato y base PHP | Todas las rutas; RNF2, US34 y calidad transversal. | Router/configuración/JSON compatibles. |
| TM-03: cuenta y permisos | US1/US2/US26 y usuarios ya presentes. | Autenticación, expiración, revocación y autorización. |
| TM-04: contenidos, historial y banco | US3–US9, US21–US25, base de US31. | CRUD, visibilidad, archivos y corrección compatibles. No cierra CC-01–CC-04. |
| TM-05: agenda académica | US10–US20, RNF8/RNF9. | Cupos, propiedad y concurrencia MySQL. |
| TM-06/TM-07: entorno y validación | Infraestructura/calidad y todos los módulos migrados. | Reconstrucción/restauración, pruebas adaptadas y frontends operativos. |

La selección real y asignación se hará en reuniones y actas del equipo. CC-01–CC-04 siguen pendientes para entrega real, sin prioridad distinta entre ellos. El registro académico de CC-05 y la revisión de Juan Robaina aún se completarán; ver [control de cambios](control_cambios.md) y [V-CC05](verificacion.md).
