# Concepción y análisis del proyecto

**Producto:** Portal Vial. **Proyecto:** Educación Vial IMSJ. **Fecha:** 21/10/2026.

## 1. Contexto

La Sección Tránsito de la Intendencia de San José comunica noticias, materiales de preparación y respuestas sobre sus trámites. El relevamiento identifica la necesidad de reunir esa información y mantenerla mediante una herramienta propia, con un lenguaje comprensible para la ciudadanía y especial atención a adolescentes y aspirantes a conducir.

## 2. Necesidad del cliente

La solución centraliza contenidos públicos y su administración. El panel permite preparar noticias, materiales y preguntas frecuentes, controlar vigencia, revisar contenidos y publicarlos. El simulador aporta práctica y el canal de consultas recibe mensajes para su lectura por el personal.

El trámite institucional de licencia mantiene su canal telefónico dentro del alcance relevado. La agenda web se desarrolla para la entrega académica.

## 3. Relevamiento

El equipo preparó preguntas sobre usuarios, permisos, identificación de modificaciones, franjas, cupos, costo urgente, materiales, categorías y noticias. Las respuestas de la entrevista desarrollan formatos educativos, vigencia y aprobación de Dirección.

| Tema | Información del relevamiento |
|---|---|
| Usuarios | Personal administrativo y participación de Dirección. |
| Auditoría | Identificar qué usuario modifica información. |
| Agenda | Excluida de la entrega actual al cliente. |
| FAQ | Clasificación por categorías. |
| Materiales | PDF, imágenes y videos; lenguaje orientado a adolescentes. |
| Noticias | Vigencia variable y aprobación de Dirección. |

## 4. Visión de la solución

Dos interfaces diferenciadas utilizan la misma API. El portal ofrece consulta pública y funciones ciudadanas; el panel reúne la operación del personal y la Directora. La API aplica validaciones, roles, reglas y persistencia sobre MySQL.

## 5. Alcance

| Versión | Funciones |
|---|---|
| Cliente | Noticias, materiales, FAQ, simulador, gráficos de preguntas, consultas y administración de contenidos. |
| Académica | Funciones del cliente más franjas, cupos, reservas, cancelación y agenda. |
| Operación | Docker Compose, Apache/PHP, MySQL y volúmenes de persistencia. |

## 6. Organización funcional

| Grupo | Requisitos | Historias |
|---|---|---|
| Acceso y permisos | RF1, RNF1 | US1–US2. |
| Noticias | RF2, RF7–RF10 | US3–US9. |
| Reservas y agenda | RF3–RF4, RF11–RF16, RNF8–RNF9 | US10–US20. |
| Materiales | RF5, RF17, RF20 | US21–US22. |
| FAQ | RF6, RF18–RF19 | US23–US24, US29. |
| Calidad | RNF2–RNF6 | US25–US28, US34. |
| Ampliaciones | RF21–RF24 | US30–US33. |

## 7. Evolución

El desarrollo avanzó desde las pantallas y la definición del producto hacia persistencia, integración y funciones de gestión. La demostración del 03/09 originó consultas ciudadanas, aprobación de la Directora y gráficos del simulador.

El equipo decidió retirar Laravel el 30/09. CC-05 se registró el 02/10 y la reescritura del 05/10 adoptó PHP nativo con el recorrido de api-simple. La demo del 13/10 comprobó las ampliaciones de contenidos y consultas. El 20/10 se incorporó cancelación propia y el 21/10 se completaron la integración de 46 rutas y los ciclos técnicos de seguridad.

## 8. Configuración del producto

| Aspecto | Valor |
|---|---|
| Backend | PHP 8.5, PDO, controladores, servicios y repositorios. |
| Datos | MySQL 8.4; once tablas del dominio y auth_tokens. |
| Publicación | Borrador, Pendiente, Aprobado y Publicado. |
| Sesiones | Bearer opaco revocable; ocho horas. |
| Simulacro | Hasta diez preguntas; corrección con total y aciertos. |
| Materiales | PDF e imágenes como archivos; video mediante URL. |
| Categorías FAQ | RF19/US29 permanece pendiente de implementación; la versión permite FAQ sin clasificación. |
| Costo urgente | Modalidad académica diferenciada; la versión no calcula ni cobra tarifa especial (RF4/US12 parcial). |
| Dominio y alojamiento | Entorno local de demostración; despliegue institucional sujeto a las condiciones de operación. |
| Contacto institucional | Sección Tránsito de la Intendencia de San José, por medio del Inspector referente. |

## 9. Referencias

[Charter](project_charter.md), [entrevista](informe%20entrevista.md), [especificación](Requerimientos.md), [casos de uso](analisis_de_requerimientos.md), [backlog](backlog.md), [cambios](control_cambios.md) y [Especificación y modelado del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/ADA.md).
