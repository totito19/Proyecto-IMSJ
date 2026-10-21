# Constitución del proyecto

## 1. Identificación

| Dato | Valor |
|---|---|
| Producto | Portal Vial |
| Proyecto académico | Educación Vial IMSJ |
| Equipo | RC5 |
| Cliente | Intendencia de San José — Sección Tránsito |
| Referente del cliente | Inspector de Tránsito |
| Líder del proyecto | Tomás Cabrera |
| Inicio | Julio de 2026 |
| Entrega académica | 29/10/2026 |
| Defensa | 05/11/2026 |
| Entrega al cliente | [] |
| Presupuesto | [] |
| Actualización | 21/10/2026 |

## 2. Necesidad y justificación

La Sección Tránsito necesita un canal propio para reunir noticias, materiales de estudio y preguntas frecuentes. El relevamiento identifica información distribuida entre distintos medios y una necesidad de comunicar contenidos comprensibles para la ciudadanía, especialmente adolescentes y aspirantes a la licencia de conducir.

Portal Vial centraliza esos contenidos y permite mantenerlos desde un panel administrativo. La aprobación de la Directora y el control de vigencia permiten organizar la publicación; el historial relaciona las modificaciones administrativas con sus responsables. Los simulacros ofrecen práctica y corrección, y el formulario de consultas recibe mensajes de la ciudadanía.

## 3. Objetivos

1. Reunir la comunicación pública de Tránsito en una plataforma accesible desde el navegador.
2. Administrar noticias, materiales y preguntas frecuentes mediante un panel de gestión.
3. Aplicar revisión de la Directora antes de publicar contenidos.
4. Ofrecer simulacros de práctica y un canal de consultas ciudadanas.
5. Proteger los datos y autorizar operaciones según la cuenta y su rol.
6. Entregar código, instalación reproducible y documentación de análisis, diseño, operación y pruebas.

## 4. Alcance

| Entrega | Contenido |
|---|---|
| Cliente | Portal público, noticias y vigencia, materiales, FAQ, simulador, gráficos de preguntas, consultas y panel con aprobación y auditoría. |
| Académica | Funciones de la entrega al cliente y agenda de pruebas de manejo y renovaciones, franjas, cupos, reservas propias, cancelación y consulta por día, semana y mes. |
| Técnica | Dos frontends, API PHP nativa, esquema MySQL, Docker Compose, herramientas de inicio, suite de integración y auditoría de seguridad. |
| Documental | Relevamiento, requisitos, backlog, planificación, actas, cambios, diseño, infraestructura, seguridad y declaración de herramientas. |

La agenda forma parte de la entrega académica. La operación institucional del trámite de licencia mantiene su canal telefónico en el alcance relevado para el cliente.

## 5. Equipo e interesados

| Participante | Responsabilidad |
|---|---|
| Tomás Cabrera | Liderazgo y backend. |
| Juan Robaina | Testing, documentación y revisión documental interna. |
| Gabriela Romero | Base de datos. |
| Verónica Romero | Frontend. |
| Juan Corrales | Frontend. |
| Inspector de Tránsito | Referente del cliente; aceptación de entregas y cambios de alcance en reuniones. |
| Directora de Tránsito | Validación de necesidades y aprobación de contenidos en el sistema. |
| Personal de la Intendencia | Administración de contenidos y consultas. |
| Ciudadanía | Consulta de información, materiales, simulacros y envío de mensajes. |

La administración y el mantenimiento posteriores corresponden a la Intendencia. Las decisiones de reuniones se conservan en las actas y se relacionan con el control de cambios.

## 6. Hitos

| Fecha | Hito | Referencia |
|---|---|---|
| 09/07/2026 | Entrevista inicial y relevamiento. | R-01. |
| 03/09/2026 | Demostración al cliente y solicitudes de consultas, aprobación y gráficos. | R-05; CC-02–CC-04. |
| 30/09/2026 | Decisión del equipo de retirar Laravel. | Formulario del equipo; registro CC-05 del 02/10. |
| 05/10/2026 | Reescritura PHP nativa con referencia api-simple. | CC-05. |
| 13/10/2026 | Demo con consultas, Directora y gráficos; 41 comprobaciones HTTP. | Registro de verificación. |
| 20/10/2026 | Cancelación propia y ajustes de interfaz. | Control de cambios. |
| 21/10/2026 | Integración de 46 endpoints y cierre técnico de seguridad. | 192 comprobaciones de integración y auditoría API 43/43. |

## 7. Riesgos y tratamiento

| Riesgo | Impacto | Tratamiento | Responsable |
|---|---|---|---|
| Cambios de alcance | Diferencias entre la solución y las necesidades del cliente. | Relacionar solicitudes, requisitos, historias y resultados. | [] |
| Confusión de versiones | Presentar la agenda académica como servicio institucional. | Identificar el destino de cada función y paquete de entrega. | [] |
| Pérdida de datos | Interrupción de la operación y pérdida de adjuntos. | Respaldo de SQL, archivos, configuración y versión; recuperación ensayada. | [] |
| Exposición de datos | Acceso o publicación indebidos. | Permisos, revisión de contenidos, controles de archivos y pruebas de seguridad. | [] |

## 8. Criterios de éxito

- El portal presenta contenido publicado y noticias dentro de su vigencia.
- Solo la Directora aprueba; la publicación es una acción posterior.
- Las consultas del portal llegan a la bandeja del personal.
- El simulacro corrige con las respuestas almacenadas en el servidor.
- La agenda académica respeta propiedad, duplicación y capacidad.
- El entorno inicia con Docker y conserva datos y archivos entre reinicios.
- Los requisitos se relacionan con historias, implementación y evidencia.

## 9. Conformidad

| Instancia | Responsable | Fecha | Referencia |
|---|---|---|---|
| Revisión interna | Juan Robaina | [] | [] |
| Conformidad del equipo | [] | [] | [] |
| Aceptación del cliente | Inspector de Tránsito | [] | [] |

## 10. Referencias

[Relevamiento](informe%20entrevista.md), [requisitos](Requerimientos.md), [backlog](backlog.md), [actas](actas_reuniones.md), [cambios](control_cambios.md) y [Gestión de proyectos del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/Introducci%C3%B3n%20a%20la%20Gesti%C3%B3n%20de%20Proyectos.md).
