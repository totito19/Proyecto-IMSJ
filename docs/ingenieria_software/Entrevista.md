# Guía de entrevista con el cliente

**Proyecto:** Educación Vial IMSJ — Portal Vial.

**Actualización documental:** 20/10/2026.

## Objetivo y uso

Esta guía organiza las preguntas preparadas para comprender el trabajo de la Sección Tránsito, los destinatarios de la información y las reglas que debe respetar el sistema. Las respuestas se documentan en el [informe de entrevista](informe%20entrevista.md), y las decisiones de reuniones posteriores se conservan en las [actas](actas_reuniones.md).

La guía distingue las preguntas iniciales de las definiciones que ya se encuentran resueltas. De esta forma, una próxima entrevista puede concentrarse en los datos todavía necesarios sin volver a tratar solicitudes implementadas.

## Usuarios administrativos y responsabilidades

- ¿Qué diferentes roles utilizarán el panel administrativo dentro de la IMSJ?
- ¿Hay funciones exclusivas de algunos usuarios?
- ¿Necesitan saber quién realizó cada cambio?

Estas preguntas permiten determinar quién prepara contenido, quién lo aprueba, quién lo publica y qué identificación debe conservar el historial. La definición vigente diferencia al personal de la Directora para aprobar contenidos; el control efectivo se realiza en la API.

## Agenda de trámites

- ¿Cómo es el proceso actualmente?
- ¿Quién administra las franjas de disponibilidad?
- ¿Las franjas se crean manualmente?
- ¿Qué duración tiene cada franja?
- ¿Cuántos cupos debe admitir cada una?
- ¿Qué datos del ciudadano son obligatorios para realizar una reserva?
- ¿Qué debería ver el usuario luego de agendarse?

La agenda se excluyó de la entrega actual al cliente y permanece en la versión académica. Las respuestas sobre duración, cupos y operación deben interpretarse con ese alcance, sin anunciar una sustitución del trámite telefónico institucional.

### Costo del trámite urgente

- ¿Es un costo fijo o depende de algún factor?
- En caso de depender de algún factor, ¿de cuáles?
- ¿Ese costo puede modificarse desde el panel administrativo?
- Si puede modificarse, ¿qué usuarios están autorizados a hacerlo?

La implementación distingue la renovación urgente, pero no calcula un costo. No hay un importe o regla acordados para completar esta parte del requisito.

## Preguntas frecuentes

- ¿Necesitan clasificar las preguntas frecuentes por categorías?

El informe responde afirmativamente. Falta definir las categorías concretas, su mantenimiento y el tratamiento de enlaces útiles. El sistema actual conserva pregunta, respuesta y estado de publicación.

## Materiales de estudio

- ¿Qué formatos de archivos manejan?
- ¿Quién puede administrarlos dentro de los usuarios administrativos?

El relevamiento menciona PDF, imágenes y videos, con contenido comprensible para adolescentes. Actualmente PDF e imágenes se cargan como archivos y VIDEO se registra como URL. Sigue pendiente confirmar si esa modalidad de video coincide con la operación prevista por la institución.

## Noticias

- ¿Las noticias vencidas deben seguir siendo consultables o desaparecer completamente?

Las noticias del portal se filtran por publicación y vigencia. Su existencia en la base y en el panel no depende de que permanezcan visibles públicamente. El backend admite portada, galería y enlaces; las interfaces todavía no cubren toda la galería y los enlaces.

## Definiciones posteriores disponibles

| Tema | Información vigente | Fuente |
|---|---|---|
| Referente y autoridad | Inspector de Tránsito, conocido como Nacho; acepta entregas y cambios con registro en actas. | Aclaraciones del equipo y charter. |
| Equipo | Tomás: liderazgo/backend; Juan Robaina: testing/documentación; Gabriela: base de datos; Verónica y Juan Corrales: frontend. | Roles confirmados. |
| Aprobación | Solo Directora aprueba; personal publica después; editar devuelve a borrador. Aplica a noticias, materiales y FAQ. | CC-03. |
| Consultas | Nombre, correo y mensaje; bandeja de lectura del personal y marcado como leído. | CC-02. |
| Simulacro | Hasta diez preguntas aleatorias, cuatro opciones y corrección posterior; sin tiempo límite ni umbral. | CC-01. |
| Gráficos | Una imagen opcional JPG/PNG/WEBP de hasta 2048 KB por pregunta. | CC-04. |

## Información aún necesaria

Quedan por confirmar la correspondencia del informe con la entrevista registrada en R-01, la selección de categorías, el tratamiento de videos y la separación de la entrega real y académica. Para la operación institucional faltan alojamiento, dominio, HTTPS, contactos, respaldo, conservación de datos y condiciones de soporte.

Las respuestas nuevas deben incluir fecha y una referencia al acta o documento donde se acordaron. El [formulario auxiliar](../../docs_auxiliares/revision/formulario_datos_documentacion.md) reúne estos campos para que el equipo los complete en un único lugar.
