# Reporte de Entrevista de Relevamiento de Requisitos


**Proyecto:** Educación Vial IMSJ — Portal Vial.

**Actualización documental:** 20/10/2026.

**Referente actual:** Inspector de Tránsito de la Intendencia.

La reunión R-01 registra una entrevista inicial el 09/07/2026 con Tomás Cabrera, Juan Robaina y el Inspector de Tránsito. El presente informe no contiene una identificación original completa; queda por confirmar que sus respuestas correspondan a esa instancia y adjuntar la validación del resumen. Se conserva su contenido como relevamiento disponible, separado de las solicitudes posteriores del 03/09.

## Objetivo de la entrevista

El objetivo de la entrevista fue relevar información sobre los requerimientos funcionales del sistema, identificar los usuarios que interactuarán con la aplicación y conocer las necesidades relacionadas con la gestión de contenidos, noticias, materiales de estudio y otros módulos.

---

# Desarrollo de la entrevista

## 1. Usuarios administrativos

**Pregunta:** Dentro de los usuarios administrativos, ¿qué roles van a existir?

**Respuesta:** El sistema será administrado por el entrevistado y una compañera de equipo, quienes serán los encargados de gestionar el programa.

---

**Pregunta:** ¿La directora utilizará el sistema?

**Respuesta:** Sí. Se entiende que la directora también tendrá participación dentro del sistema.

---

**Pregunta:** ¿Habrá funciones exclusivas para algunos usuarios administrativos?

**Respuesta:** No. Actualmente no se considera necesario definir distintos niveles de permisos, ya que todos los usuarios administrativos tendrán los mismos privilegios.

---

**Pregunta:** ¿Necesitan saber quién realizó cada cambio dentro del sistema?

**Respuesta:** Sí. Es necesario que el sistema registre qué usuario realizó cada modificación para mantener un control de los cambios efectuados.

---

# Agenda de trámites

**Pregunta:** ¿Cómo es actualmente el proceso para solicitar la licencia de conducir?

**Respuesta:** Actualmente la gestión se realiza por teléfono. Existe la intención de migrar este trámite a un formato web, aunque dicho desarrollo no forma parte del alcance de esta etapa del proyecto.

---

# Preguntas Frecuentes

**Pregunta:** ¿Las preguntas frecuentes deberán clasificarse por categorías?

**Respuesta:** Sí. Será necesario organizar las preguntas en distintas categorías para facilitar la búsqueda de información.

---

**Pregunta:** ¿Quién será el responsable de administrar las preguntas frecuentes?

**Respuesta:** Todo el equipo será responsable de crear, actualizar y gestionar las preguntas frecuentes.

---

# Material de estudio

**Pregunta:** ¿Qué tipos de materiales utilizarán?

**Respuesta:** Se trabajará con distintos formatos, incluyendo documentos PDF, imágenes y videos.

La intención es elaborar manuales, normativas y leyes adaptadas a un lenguaje más sencillo y comprensible para adolescentes, evitando un enfoque excesivamente técnico.

---

**Pregunta:** ¿El objetivo principal es acercar la información a más personas?

**Respuesta:** Sí. El objetivo principal es llegar especialmente a los adolescentes mediante materiales de fácil comprensión.

Además, el equipo audiovisual será el encargado de producir videos explicativos para distintas situaciones relacionadas con el tránsito.

Los materiales disponibles en el sistema incluirán:

* Documentos PDF.
* Imágenes.
* Videos.

---

# Noticias

**Pregunta:** ¿Cada noticia tendrá una fecha de inicio y una fecha de finalización de vigencia?

**Respuesta:** Sí. Cada noticia contará con un período de vigencia determinado.

---

**Pregunta:** ¿Cómo influye esa vigencia según el tipo de noticia?

**Respuesta:** Dependerá del contenido de la noticia. Algunas noticias permanecerán publicadas durante un período prolongado (por ejemplo, un año), mientras que la mayoría de las noticias relacionadas con el tránsito serán de carácter esporádico y permanecerán visibles únicamente durante el tiempo necesario.

---

**Pregunta:** ¿Quién decidirá la fecha de finalización de vigencia desde el panel de administración?

**Respuesta:** El entrevistado será el responsable de establecer la vigencia de cada noticia.

---

**Pregunta:** ¿Existen roles definidos para la publicación de noticias?

**Respuesta:** No existen roles diferenciados. Todo el equipo tendrá acceso a la gestión de noticias; sin embargo, las publicaciones deberán contar con la aprobación de la Dirección antes de hacerse visibles.

---

**Pregunta:** ¿Desean agregar algún nuevo requerimiento o funcionalidad respecto a este módulo?

**Respuesta:** Por el momento no se identifican nuevos requerimientos adicionales a los ya planteados.

---

# Conclusiones

De la entrevista se desprenden los siguientes aspectos relevantes para el desarrollo del sistema:

* Todos los usuarios administrativos compartirán los mismos permisos de gestión.
* Será necesario implementar un registro de auditoría que permita identificar qué usuario realizó cada modificación.
* El trámite de licencia de conducir continuará siendo telefónico durante esta etapa del proyecto.
* Las preguntas frecuentes deberán organizarse por categorías y serán administradas por todo el equipo.
* El sistema permitirá almacenar documentos PDF, imágenes y videos como material de estudio.
* Los contenidos estarán orientados principalmente a adolescentes, utilizando un lenguaje claro y accesible.
* Las noticias deberán contar con fechas de inicio y fin de vigencia.
* La administración de noticias será realizada por el equipo, pero requerirá la aprobación de la Dirección antes de su publicación.
* No surgieron nuevos requerimientos adicionales durante la entrevista.

## Aclaraciones para utilizar el relevamiento

La frase final significa que el entrevistado no agregó otros pedidos a los discutidos. Categorías, formatos y aprobación de noticias sí aportan precisiones respecto del catálogo inicial: se identifican ahora como RF19, RF20 y RF21 en [Requerimientos](Requerimientos.md).

Los permisos iguales describen esta instancia inicial. La solicitud posterior CC-03 incorpora validación por Directora; debe consultarse en [control de cambios](control_cambios.md), sin corregir retrospectivamente las respuestas de esta entrevista.

## Relación con los requisitos y estado actual

| Hallazgo de la entrevista | Requisitos relacionados | Tratamiento vigente |
|---|---|---|
| Necesidad de conocer quién modifica contenidos | RNF3 | Hay historial de acciones; cobertura total y retención aún no definidas. |
| Agenda fuera de la entrega actual al cliente | RF3–RF4, RF11–RF16 | Se mantiene exclusivamente en el alcance académico. |
| Clasificación de FAQ | RF19 | Pendiente de categorías concretas e implementación. |
| Materiales en distintos formatos | RF5, RF17, RF20 | PDF e imagen como archivos; videos mediante URL. Falta confirmar esa modalidad operativa. |
| Vigencia de noticias | RF8, RNF7 | Fechas validadas y filtro público por vigencia. |
| Aprobación de Dirección | RF21, CC-03 | Solo Directora aprueba; el personal publica después. Se aplica a noticias, materiales y FAQ. |

La respuesta histórica que describe permisos iguales no refleja la diferenciación posterior introducida por CC-03. La frase «sin nuevos requerimientos» cierra la entrevista, pero no elimina las precisiones sobre categorías, formatos y aprobación que sí aparecen en sus respuestas.

## Datos de procedencia por completar

El equipo debe confirmar la correspondencia con R-01, la fuente de las respuestas y quién validó el resumen. Las decisiones pendientes sobre categorías, video y operación institucional se reúnen en el [formulario auxiliar](../../docs_auxiliares/revision/formulario_datos_documentacion.md), para evitar duplicar campos vacíos en el informe.

## Referencias

[Guía de preguntas](Entrevista.md), [actas](actas_reuniones.md), [requisitos](Requerimientos.md), [análisis](analisis_de_requerimientos.md) y [control de cambios](control_cambios.md).
