> **Estado consolidado - 15/10/2026:** CC-01–CC-05 están **Listos**. El backend PHP nativo, el simulador, las consultas, el flujo de Directora y los gráficos de preguntas están implementados. CC-02–CC-04 se trazan a la reunión/demo del 03/09 con la Directora y el Inspector de Tránsito.

---

# Backlog de Producto y Épicas de Usuario

> **Estado revisado al 15/10/2026:** las US se clasifican como **Lista**, **Parcial** o **Pendiente** según el código y la evidencia disponibles. La agenda (EP3/EP4) es académica. Los puntos, responsables concretos y sprint comprometido no se inventan cuando no están registrados.

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
| US1 | Como usuario, quiero iniciar sesión con cedula y contraseña para acceder al sistema. | RF1 | Alta | **Lista** |
| US2 | Como personal de IMSJ, quiero que haya control de roles y permisos para diferenciar al público general del personal de IMSJ. | RNF1 | Alta | **Lista** |

### EP2 — Comunicación pública (Noticias / Cartelera)

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US3 | Como ciudadano, quiero consultar los anuncios y noticias de la sección Tránsito para mantenerme informado. | RF2 | Alta | **Lista** |
| US4 | Como personal de IMSJ, quiero publicar y administrar noticias visibles para el público. | RF7 | Alta | **Lista** |
| US5 | Como personal de IMSJ, quiero definir el período de vigencia de cada noticia. | RF8 | Media | **Lista** |
| US6 | Como personal de IMSJ, quiero cargar imagen de portada, galería de imágenes, texto y enlaces útiles en las noticias. | RF9 | Media | **Parcial:** API completa; las pantallas solo gestionan/muestran portada y texto. |
| US7 | Como personal de IMSJ, quiero gestionar el estado de una noticia (publicada / no-publicada). | RF10 | Alta | **Lista** |
| US8 | Como personal IMSJ, quiero que se maneje la vigencia automática de las noticias para mostrar solo las vigentes. | RNF7 | Media | **Lista** |
| US9 | Como personal IMSJ, quiero que se separe claramente los contenidos publicados de los no-publicados. | RNF10 | Media | **Lista** |

### EP3 — Agendamiento de trámites (ciudadano)

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US10 | Como ciudadano, quiero agendarme para la prueba de manejo. | RF3 | Alta | **Lista** en el alcance académico. |
| US11 | Como ciudadano, quiero agendar la renovación de libreta de conducir en modalidad normal. | RF4 | Alta | **Lista** en el alcance académico. |
| US12 | Como ciudadano, quiero agendar la renovación de libreta de conducir en modalidad urgente (con costo especial). | RF4 | Media | **Parcial:** reserva urgente disponible; costo especial no implementado. |
| US13 | Como personal de IMSJ, quiero que se prevenga la doble reserva de un mismo horario de agenda. | RNF8 | Alta | **Lista** en el alcance académico. |
| US14 | Como ciudadano, quiero recibir una confirmación visual de mi agenda. | RNF9 | Media | **Lista** en el alcance académico. |

### EP4 — Gestión de agenda (IMSJ)

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US15 | Como personal de IMSJ, quiero cargar franjas disponibles para trámites normales. | RF11 | Alta | **Lista** en el alcance académico. |
| US16 | Como personal de IMSJ, quiero cargar franjas disponibles para trámites urgentes. | RF12 | Media | **Lista** en el alcance académico. |
| US17 | Como personal de IMSJ, quiero cargar franjas disponibles para la prueba de manejo. | RF13 | Alta | **Lista** en el alcance académico. |
| US18 | Como personal de IMSJ, quiero visualizar la agenda por día. | RF14 | Media | **Lista** en el alcance académico. |
| US19 | Como personal de IMSJ, quiero visualizar la agenda por semana. | RF15 | Alta | **Lista** en el alcance académico. |
| US20 | Como personal de IMSJ, quiero visualizar la agenda por mes. | RF16 | Media | **Lista** en el alcance académico. |

### EP5 — Materiales de estudio

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US21 | Como ciudadano/aspirante, quiero acceder a materiales de estudio para aspirantes. | RF5 | Media | **Lista** |
| US22 | Como personal de IMSJ, quiero administrar los materiales de estudio. | RF17 | Media | **Lista** |

### EP6 — Preguntas frecuentes

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US23 | Como ciudadano, quiero consultar las preguntas frecuentes. | RF6 | Media | **Lista** |
| US24 | Como personal de IMSJ, quiero mantener la sección de preguntas frecuentes. | RF18 | Media | **Lista** |

### EP7 — Calidad y requisitos transversales

| ID | Historia de Usuario | Trazabilidad | Prioridad | Estado |
|----|---------------------|--------------|-----------|--------|
| US25 | Como personal de IMSJ, quiero un historial completo de las acciones administrativas. | RNF3 | Media | **Parcial:** historial implementado; cobertura total y retención no definidas. |
| US26 | Como usuario, quiero que los datos personales registrados esten protegidos. | RNF4 | Alta | **Parcial:** roles, hashes y aislamiento implementados; HTTPS, retención y respaldo corresponden al despliegue. |
| US27 | Como ciudadano, quiero usar el sistema cómodamente desde el móvil (mobile first). | RNF5 | Alta | **Parcial:** interfaz adaptable implementada; falta prueba formal en dispositivos. |
| US28 | Como público general, quiero contar con accesibilidad básica al usar el sistema. | RNF6 | Media | **Parcial:** etiquetas, foco y navegación básica presentes; falta auditoría formal. |

---

## Criterios verificables y evidencia

Las filas siguientes relacionan cada historia con el comportamiento observable y la evidencia localizada. No agregan reglas nuevas ni sustituyen las fuentes de cada requisito.

| US | Criterio propuesto | Evidencia disponible / límite |
|---|---|---|
| US1 | Credenciales válidas permiten acceder; las inválidas se rechazan; cerrar sesión revoca el acceso. | AuthController/AuthService; comprobado en la suite HTTP/MySQL. |
| US2 | Una cuenta pública no puede ejecutar operaciones administrativas; personal puede acceder a ellas. | `Auth` comprueba cuenta y rol; Directora hereda acceso de personal. Implementado y verificado. |
| US3 | Solo se muestran noticias publicadas y dentro de vigencia; no se exponen las demás. | NewsApiTest. |
| US4 | Personal puede crear, editar y retirar noticia; cada operación queda asociada a su usuario. | `NoticiaService`, auditoría y flujo de aprobación implementados. |
| US5 | Inicio y fin se guardan y no se admite fin anterior al inicio. | Validación de NoticiaController. |
| US6 | Portada, galería y enlaces se conservan y presentan; archivos o enlaces inválidos se rechazan. | El backend conserva portada, galería y enlaces; el panel y el portal todavía no gestionan/presentan galería y enlaces. |
| US7 | Cambiar publicación modifica la visibilidad pública; aprobación y publicación son acciones separadas. | Cuatro estados implementados: BORRADOR, PENDIENTE, APROBADO y PUBLICADO. |
| US8 | Una noticia fuera de vigencia no aparece públicamente sin requerir modificación manual del estado. | Filtro de Noticia y NewsApiTest. |
| US9 | Administración puede ver no publicados; el portal público no los devuelve. | Rutas administrativas/públicas y filtros. |
| US10 | Público autenticado reserva franja de prueba con cupo y ve confirmación; sin cupo se rechaza. | ReservaService y SchedulingApiTest; solo destino académico. |
| US11 | La reserva normal queda asociada al ciudadano y a la franja seleccionada. | Mismo circuito de reservas, implementado y comprobado. |
| US12 | Se distingue renovación urgente; el costo especial debe tener regla y registro acordados. | Tipo urgente existente; no hay campo de costo. Esta US no puede cerrarse por distinguir el tipo únicamente. |
| US13 | Se rechaza duplicación por ciudadano/franja y la concurrencia no supera los cupos. | Unicidad, transacción y bloqueo; concurrencia comprobada con dos procesos y MySQL. |
| US14 | Luego de guardar, el ciudadano ve identificador, trámite, fecha y horario correspondientes a su reserva. | API/resource y confirmación visible en el frontend. |
| US15 | Personal crea franja normal con fecha, intervalo y cupos; se rechazan datos inválidos. | FranjaDisponibilidadController/Service y SchedulingApiTest. |
| US16 | Personal crea franja urgente y puede distinguirla de una normal. | Tipo urgente implementado en esquema, API y panel; el costo pertenece a US12. |
| US17 | Personal crea franja de prueba de manejo, disponible en la consulta ciudadana según cupo/fecha. | API de franjas y pruebas. |
| US18 | La vista diaria devuelve reservas del día elegido, con ciudadano y franja. | `GET /agenda?vista=dia&fecha=...` y SchedulingApiTest. |
| US19 | La vista semanal muestra las reservas del período solicitado. | ReservaService calcula el período semanal y el panel permite recorrerlo. |
| US20 | La vista mensual muestra las reservas del mes solicitado. | ReservaService y SchedulingApiTest. |
| US21 | Ciudadano accede a materiales publicados y no a los no publicados. | ContentApiTest. |
| US22 | Personal administra PDF, imagen y video conforme a formatos acordados; retirar un archivo elimina su referencia válida. | RF17 se amplía con RF20; VIDEO es URL, no archivo, en código actual. |
| US23 | Se muestran FAQ publicadas con sus respuestas; las no publicadas permanecen en administración. | ContentApiTest. Categorías: US29. |
| US24 | Personal crea, modifica y retira FAQ con validación y auditoría. | PreguntaService y panel implementados; categorías se controlan aparte en US29. |
| US25 | Una acción administrativa registra usuario, acción, fecha y elemento; público no consulta ni modifica el historial. | HistorialAccion y rutas. «Completo» requiere acordar operaciones cubiertas y retención. |
| US26 | Se restringen datos por usuario/rol, se usan hashes y se documentan medidas para entorno real. | AuthService, middleware y borrador legal. HTTPS, retención y respaldo probado pendientes. |
| US27 | Los flujos principales se completan desde móvil sin pérdida de contenido o controles. | CSS adaptable disponible; falta una prueba formal en dispositivos. |
| US28 | Los flujos principales se pueden recorrer con teclado, etiquetas y foco comprensibles. | Hay etiquetas ARIA, foco y controles semánticos; falta una auditoría formal. |

## Necesidades que faltaban en el backlog

**Trazabilidad posterior:** se reservan US29–US34 para evitar identificadores ambiguos. US30–US33 corresponden a CC-03, CC-01, CC-02 y CC-04, respectivamente, y están Listas conforme al comportamiento implementado. US29 continúa fuera de esos cambios porque la clasificación de FAQ por categorías no fue incorporada.

| ID | Historia propuesta | Fuente / requisito | Criterio propuesto | Situación observada |
|---|---|---|---|---|
| US29 | Como ciudadano, quiero consultar FAQ por categoría para encontrar información relevante. | Entrevista, RF19; EP6. | Clasificación y consulta por categorías acordadas. | Sin implementación localizada; categorías concretas pendientes. |
| US30 | Como Dirección, quiero validar contenidos antes de publicarlos para controlar la comunicación institucional. | RF21, CC-03; EP2. | Borrador → Pendiente → Aprobado → Publicado; aprobación no publica por sí sola. | **Lista.** Flujo aplicado a noticias, materiales y FAQ; solo Directora aprueba. |
| US31 | Como aspirante, quiero resolver un simulacro y revisar la corrección para practicar. | RF22, CC-01. | Hasta diez preguntas aleatorias; corrección posterior sin revelar respuestas previamente. | **Lista.** Banco, API y frontend implementados. |
| US32 | Como ciudadano, quiero enviar una consulta y que el personal pueda leerla para recibir atención. | RF23, CC-02. | Envío desde pie de portal y lectura desplegable en apartado Consultas. | **Lista.** Formulario, persistencia, bandeja y marcado como leído implementados. |
| US33 | Como personal, quiero adjuntar gráficos a preguntas para representar situaciones de tránsito. | RF24, CC-04. | Una imagen opcional JPG/PNG/WEBP de hasta 2048 KB se muestra al resolver. | **Lista.** Carga, edición, eliminación y presentación implementadas. |
| US34 | Como usuario, quiero que las entradas inválidas se rechacen para evitar registros incorrectos. | RNF2; EP7. | Casos inválidos se rechazan en servidor sin persistencia parcial; mensajes claros. | **Lista.** Validaciones y rollback comprobados en la suite HTTP/MySQL. |

La administración de personal y el registro ciudadano existen en código. Su procedencia no se atribuye a CC-01–CC-05: se conservan en el inventario de API para mantener la trazabilidad sin inventar un origen.

## Campos pendientes para usar el backlog como plan real

| Campo | Estado |
|---|---|
| Puntos por US y total por épica | No estimados por el equipo en este documento. Los puntos por tarea del planning no se reparten retrospectivamente entre US. |
| Responsable y revisor por US | Roles generales aclarados en [aclaraciones y pendientes](../docs_auxiliares/revision/aclaraciones_y_pendientes.md); tareas concretas por US aún no registradas. |
| Sprint seleccionado / capacidad | No registrados como compromiso; ver reconstrucción de [planning](sprint_planning.md). |
| Evidencia de implementación y pruebas | Registrada en [verificación](../docs_auxiliares/evidencias/verificacion.md); los límites de US parciales se mantienen visibles. |
| Estado de los cambios controlados | **CC-01–CC-05, Listos.** CC-02–CC-04 provienen de la reunión/demo con Directora e Inspector de Tránsito. |

Fuentes: [historias del curso](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/03_historias_de_usuario.md) y [criterios de historias](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Teoricos/user-stories.md).

## Trabajo técnico de migración — CC-05

**Decisión del grupo, 02/10/2026; estado Listo:** Laravel fue sustituido por PHP sin framework siguiendo `api-simple`, conservando el contrato y el dominio de IMSJ. Se registra como trabajo técnico transversal; US1–US34 mantienen sus identificadores.

**IA — Desglose para revisión del equipo:** las tareas TM-01–TM-07 y sus dependencias se describen en la [guía de migración](../docs_auxiliares/backend/migracion_backend_vanilla.md). No se asignan puntos, fechas, sprint ni responsables concretos por deducirlos del rol general.

| Tareas técnicas | Historias / necesidad afectada | Implementación / evidencia |
|---|---|---|
| TM-01/TM-02: contrato y base PHP | Todas las rutas; RNF2, US34 y calidad transversal. | Router/configuración/JSON compatibles. |
| TM-03: cuenta y permisos | US1/US2/US26 y usuarios ya presentes. | Autenticación, expiración, revocación y autorización. |
| TM-04: contenidos, historial y banco | US3–US9, US21–US25, base de US31. | CRUD, visibilidad, archivos y corrección compatibles; los límites de US6 y US25 figuran arriba. |
| TM-05: agenda académica | US10–US20, RNF8/RNF9. | Cupos, propiedad y concurrencia MySQL. |
| TM-06/TM-07: entorno y validación | Infraestructura/calidad y todos los módulos migrados. | Reconstrucción/restauración, pruebas adaptadas y frontends operativos. |

CC-01–CC-05 están Listos. La implementación y sus pruebas se consultan en [control de cambios](control_cambios.md) y [verificación](../docs_auxiliares/evidencias/verificacion.md).
