# Informe de entrevista

| Dato | Valor |
|---|---|
| Proyecto | Educación Vial IMSJ — Portal Vial |
| Instancia | Entrevista inicial |
| Fecha | 09/07/2026, 16:05–16:45 (R-01). |
| Modalidad y lugar | Presencial — Polo Educativo Tecnológico (R-01). |
| Entrevistadores | Tomás Cabrera y Juan Robaina. |
| Entrevistado | Inspector de Tránsito, referente del cliente. |
| Registro o adjuntos | Guía de entrevista y acta R-01; informe incorporado a Git en a9401ad, 23/07/2026. |

## Objetivo de la entrevista

El objetivo de la entrevista fue relevar información sobre los requerimientos funcionales del sistema, identificar los usuarios que interactuarán con la aplicación y conocer las necesidades relacionadas con la gestión de contenidos, noticias, materiales de estudio y otros módulos.

---

## Desarrollo de la entrevista

### Usuarios administrativos

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

## Agenda de trámites

**Pregunta:** ¿Cómo es actualmente el proceso para solicitar la licencia de conducir?

**Respuesta:** Actualmente la gestión se realiza por teléfono. Existe la intención de migrar este trámite a un formato web, aunque dicho desarrollo no forma parte del alcance de esta etapa del proyecto.

---

## Preguntas frecuentes

**Pregunta:** ¿Las preguntas frecuentes deberán clasificarse por categorías?

**Respuesta:** Sí. Será necesario organizar las preguntas en distintas categorías para facilitar la búsqueda de información.

---

**Pregunta:** ¿Quién será el responsable de administrar las preguntas frecuentes?

**Respuesta:** Todo el equipo será responsable de crear, actualizar y gestionar las preguntas frecuentes.

---

## Materiales de estudio

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

## Noticias

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

## Conclusiones

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

## Requisitos derivados

| Necesidad | Requisitos |
|---|---|
| Identificación de cambios administrativos | RNF3. |
| Agenda como alcance académico | RF3–RF4, RF11–RF16. |
| Categorías de preguntas frecuentes | RF19. |
| PDF, imágenes y videos | RF5, RF17, RF20. |
| Vigencia de noticias | RF8 y RNF7. |
| Aprobación de Dirección | RF21. |

## Evolución de permisos

| Instancia | Regla | Fuente |
|---|---|---|
| Entrevista inicial | Administración compartida y aprobación de Dirección. | Respuestas de usuarios y noticias. |
| 03/09/2026 | Aprobación diferenciada por Directora y publicación posterior. | R-05 y CC-03. |

## Validación

Las necesidades relevadas se contrastaron con el cliente en la demostración del 03/09/2026. Los cambios solicitados quedaron incorporados y el resultado final fue aprobado en la demostración del 13/10/2026 registrada en R-06.

## Referencias

[Guía de preguntas](Entrevista.md), [requisitos](Requerimientos.md), [control de cambios](control_cambios.md) y [Entrevistas del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/entrevistas.md).
