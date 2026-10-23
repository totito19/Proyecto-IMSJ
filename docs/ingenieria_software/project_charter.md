# Constitución del proyecto

## 1. Identificación

| Dato | Valor |
|---|---|
| Producto | Portal Vial |
| Proyecto | Educación Vial IMSJ |
| Equipo | RC5 |
| Cliente | Intendencia de San José — Sección Tránsito |
| Referente del cliente | Inspector de Tránsito |
| Líder del proyecto | Tomás Cabrera |
| Entrega prevista | 29/10/2026 |

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

### Alcance incluido

- Portal público con noticias, materiales de estudio, preguntas frecuentes, simulador y formulario de consultas.
- Panel administrativo para gestionar contenidos y leer las consultas recibidas.
- Aprobación de contenidos por la Directora antes de su publicación.
- Control de acceso por roles e historial de acciones administrativas.
- Gráficos asociados a las preguntas del simulador.
- Agenda de pruebas de manejo y renovaciones, franjas, cupos, reservas propias, cancelación y consultas por día, semana y mes.
- Dos frontends, API PHP nativa, esquema MySQL y entorno Docker Compose.
- Documentación de relevamiento, requisitos, planificación, diseño, infraestructura, seguridad y pruebas.

### Alcance excluido

- Emisión, renovación o validación legal de la libreta de conducir desde el sistema.
- Pagos en línea e integración con expedientes institucionales externos.

## 5. Equipo e interesados

| Participante | Responsabilidad |
|---|---|
| Tomás Cabrera | Liderazgo y backend. |
| Juan Robaina | Testing y documentación. |
| Gabriela Romero | Base de datos. |
| Verónica Romero | Frontend. |
| Juan Corrales | Frontend. |
| Inspector de Tránsito | Referente del cliente; aceptación de entregas y cambios de alcance en reuniones. |
| Directora de Tránsito | Validación de necesidades y aprobación de contenidos en el sistema. |
| Personal de la Intendencia | Administración de contenidos y consultas. |
| Ciudadanía | Consulta de información, materiales, simulacros y envío de mensajes. |

La administración y el mantenimiento posteriores corresponden a la Intendencia.

## 6. Hitos

| Fecha | Hito |
|---|---|
| 09/07/2026 | Entrevista inicial y relevamiento. |
| 03/09/2026 | Demostración al cliente y solicitud de ampliaciones. |
| 30/09/2026 | Decisión del equipo de retirar Laravel. |
| 05/10/2026 | Reescritura del backend en PHP nativo. |
| 13/10/2026 | Demostración de los cambios y aprobación del resultado por parte del cliente. |


## 7. Riesgos y tratamiento

| Riesgo | Impacto | Tratamiento |
|---|---|---|
| Cambios de alcance | Diferencias entre la solución y las necesidades del cliente. | Registrar las solicitudes y actualizar la documentación afectada. |
| Interpretación incorrecta de las reservas | Confundir una reserva de franja con la emisión o renovación efectiva de la libreta. | Explicar el límite funcional en requisitos, manual y transferencia. |
| Pérdida de datos | Interrupción de la operación y pérdida de adjuntos. | Respaldar la base de datos, los archivos y la configuración. |
| Exposición de datos | Acceso o publicación indebidos. | Aplicar permisos, revisión de contenidos, controles de archivos y pruebas de seguridad. |

## 8. Criterios de éxito

- El portal presenta contenido publicado y noticias dentro de su vigencia.
- Solo la Directora aprueba; la publicación es una acción posterior.
- Las consultas del portal llegan a la bandeja del personal.
- El simulacro corrige con las respuestas almacenadas en el servidor.
- La agenda respeta propiedad, duplicación y capacidad.
- El entorno inicia con Docker y conserva datos y archivos entre reinicios.
- Los requisitos se relacionan con historias, implementación y evidencia.
