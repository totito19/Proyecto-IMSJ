# Constitución del proyecto — Educación Vial IMSJ

**Producto público:** Portal Vial.

**Denominación académica:** Plataforma Web Educación Vial IMSJ.

**Organismo destinatario:** Intendencia de San José, Sección Tránsito.

**Inicio:** julio de 2026. **Actualización documental:** 20/10/2026.

## Propósito y necesidad

El proyecto desarrolla una plataforma web que reúne noticias de Tránsito, materiales de estudio y preguntas frecuentes en un mismo canal de consulta. El relevamiento identifica información dispersa y la necesidad de comunicarla con un lenguaje comprensible, especialmente para adolescentes y aspirantes a la licencia de conducir. La administración de los contenidos requiere controlar su vigencia y conocer qué persona realizó cada modificación.

Portal Vial ofrece una interfaz para la ciudadanía y un panel para el personal de la Intendencia. Ambos utilizan la misma API y base de datos. Esta organización permite mantener los contenidos en un único lugar y aplicar las reglas de acceso y publicación desde el servidor.

La letra inicial también incluye agenda de pruebas de manejo y renovaciones. El cliente excluyó ese módulo de su entrega actual; el equipo lo conserva en la versión académica para cumplir el alcance del proyecto de egreso. Esta distinción se aplica a los requisitos, las pruebas y la presentación del producto.

## Objetivos

1. Centralizar la consulta de noticias, materiales y respuestas frecuentes.
2. Permitir que el personal mantenga los contenidos sin modificar archivos del sitio.
3. Separar preparación, revisión de la Directora y publicación efectiva.
4. Incorporar simulacros con corrección y un canal de consultas ciudadanas.
5. Identificar las acciones administrativas y proteger el acceso según la cuenta y su rol.
6. Entregar una versión local reproducible con Docker y documentación que permita instalarla, comprenderla y verificarla.

## Alcance y entregables

| Destino | Funciones y entregables |
|---|---|
| Cliente | Portal público; noticias y vigencia; materiales PDF, imágenes y videos mediante URL; preguntas frecuentes; simulador y gráficos opcionales; formulario de consultas y bandeja de lectura; panel, roles, aprobación y publicación de contenidos. |
| Académico | Todo lo anterior y agenda de prueba de manejo y renovación normal/urgente, administración de franjas y cupos, reservas propias, cancelación y vistas diaria, semanal y mensual. |
| Técnico | Código de los dos frontends y backend PHP nativo, esquema SQL, configuración Docker, herramientas de inicio y suite de integración. |
| Documental | Relevamiento, requisitos, backlog, seguimiento, control de cambios, arquitectura, modelo de datos, infraestructura, seguridad y declaración de uso de herramientas. El índice identifica los documentos disponibles y los entregables aún sin desarrollar. |

CC-01–CC-05 constan como **Listos**. Esta clasificación corresponde a los cambios controlados; no convierte en terminadas todas las necesidades del catálogo. Permanecen parciales la galería/enlaces de noticias en las interfaces, el costo urgente, la cobertura y conservación de auditoría y la validación formal móvil y de accesibilidad. Las categorías de preguntas frecuentes están pendientes.

## Límites del compromiso actual

La agenda no constituye un servicio institucional comprometido para la ciudadanía en esta entrega. No se han definido pagos en línea, costo de renovación urgente, respuesta a consultas desde el panel ni notificaciones automáticas. El simulador no tiene temporizador ni un puntaje mínimo de aprobación.

La forma de distribuir la versión para el cliente separada de la académica, el dominio, alojamiento, HTTPS, canales de soporte y política institucional de respaldos requieren definición. La fecha de entrega real a la Intendencia no está fijada. El plan académico contempla entrega el 29/10 y defensa el 05/11, con respaldo de la comunicación docente todavía por incorporar.

## Equipo y participantes

| Integrante o interesado | Responsabilidad |
|---|---|
| Tomás Cabrera | Liderazgo y desarrollo backend. |
| Juan Robaina | Testing, documentación y revisión documental interna. |
| Gabriela Romero | Base de datos. |
| Verónica Romero | Desarrollo frontend. |
| Juan Corrales | Desarrollo frontend. |
| Inspector de Tránsito | Referente del cliente, con autoridad para aceptar entregas y aprobar cambios de alcance. Sus decisiones se registran en actas del equipo. |
| Directora de Tránsito | Participa en la validación de necesidades y aprueba contenidos dentro del sistema. |
| Personal de la Intendencia | Utiliza el panel para mantener los contenidos y consultar la información habilitada. |
| Ciudadanía | Consulta el portal, utiliza materiales y simulacros y envía consultas. |

El referente se identifica por su cargo; se conoce su nombre Nacho y no se dispone de su apellido. La administración y el mantenimiento posteriores corresponden a la Intendencia, por ahora. Los roles generales no constituyen asignaciones retrospectivas de tareas a cada integrante.

## Organización del trabajo y cambios

Las reuniones son la instancia de coordinación y seguimiento. Las actas registran solicitudes, decisiones y observaciones del cliente. El control de cambios relaciona cada solicitud con su motivo, impacto, implementación y evidencia; el backlog expresa el estado de cada historia. La revisión interna de documentación corresponde a Juan Robaina y la aceptación del cliente se registra según las decisiones del Inspector de Tránsito.

El backend se sustituyó por PHP nativo dentro de CC-05. El formulario del equipo sitúa la decisión de retirar Laravel el 30/09 y el control conserva su registro documental del 02/10. La reescritura con referencia a `api-simple` se realizó el 05/10. Se conservan los identificadores RF1–RF24, RNF1–RNF10 y US1–US34.

## Criterios de evaluación del resultado

| Área | Comportamiento que debe comprobarse | Referencia |
|---|---|---|
| Comunicación | El portal presenta contenidos publicados; las noticias respetan su vigencia. | RF2, RF5, RF6, RF8, RNF7 y RNF10. |
| Publicación | Solo Directora aprueba; aprobar no publica y editar obliga a revisar nuevamente. | RF21 y CC-03. |
| Simulacro y consultas | Se corrigen las respuestas sin anticipar la solución; una consulta enviada puede leerse en el panel. | RF22–RF24. |
| Acceso e integridad | Se rechazan operaciones sin autorización y datos inválidos; las modificaciones administrativas conservan su auditoría. | RNF1–RNF4. |
| Agenda académica | Se respeta propiedad, duplicación y cupo; se confirma la reserva y su cancelación. | RF3–RF4, RF11–RF16, RNF8 y RNF9. |
| Instalación | El sistema inicia con configuración propia, conserva volúmenes y permite acceder a API y páginas. | Documentación SSOO y evidencia técnica. |
| Calidad de uso | Los flujos principales son utilizables en móvil y con teclado. La evidencia formal todavía debe incorporarse. | RNF5–RNF6. |

La ejecución de pruebas técnicas no sustituye el registro de aceptación del cliente. Presupuesto, esfuerzo total y aprobación formal del charter no tienen un registro adjunto.

## Riesgos y seguimiento

| Riesgo | Consecuencia | Tratamiento documental y operativo |
|---|---|---|
| Cambios de requisitos | Diferencias entre expectativas y versión entregada. | Registrar el cambio y actualizar requisitos, backlog, implementación y pruebas afectadas. |
| Confusión entre alcance real y académico | Ofrecer agenda como servicio institucional sin acuerdo. | Mantener la separación explícita en entregables y demostraciones. |
| Documentación y código desalineados | Dificultad de instalación, revisión y defensa. | Vincular documentos con archivos actuales y distinguir resultados históricos. |
| Pérdida de datos o archivos | Imposibilidad de reconstruir una instalación. | Respaldar base, adjuntos y configuración; ensayar recuperación antes del despliegue real. |
| Datos institucionales incompletos | Términos y privacidad sin condiciones definitivas. | Completar esos datos con la Intendencia en el formulario auxiliar. |

## Documentos relacionados

[Relevamiento](informe%20entrevista.md), [requisitos](Requerimientos.md), [análisis de requisitos](analisis_de_requerimientos.md), [backlog](backlog.md), [actas](actas_reuniones.md), [control de cambios](control_cambios.md), [plan académico](../general/plan_entrega_29-10_y_defensa_05-11.md) y [datos por completar](../../docs_auxiliares/revision/formulario_datos_documentacion.md).
