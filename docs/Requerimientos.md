# Documento de Requisitos
## Sistema de Gestión de Educación Vial - IMSJ

> **Revisión asistida por IA — 02/10/2026:** se conservan RF1–RF18 y RNF1–RNF10 porque son los códigos usados por el backlog y el modelo original. Los añadidos RF19–RF24 identifican necesidades ya presentes en entrevista/control de cambios; su numeración es documental, no una aprobación de alcance. Ver [revisión](revision_documental.md).
---

**Descripción General:**
Sistema web para centralizar información de la sección Tránsito de la Intendencia Municipal de San José, permitiendo la publicación de noticias, acceso a materiales de estudio y consulta de preguntas frecuentes, ademas la posibilidad de agendarse para tramites referentes a la libreta de conducir.

---
## Requerimientos Funcionales

| Código | Requerimiento Funcional |
|--------|------------------------|
| RF1 | El sistema debe permitir iniciar sesión con cedula y contraseña. |
| RF2 | El sistema debe permitir que los ciudadanos consulten anuncios y noticias de la sección Tránsito. |
| RF3 | El sistema debe permitir que los ciudadanos se agenden para la prueba de manejo. |
| RF4 | El sistema debe permitir que los ciudadanos agenden renovación de libreta de conducir. |
| RF5 | El sistema debe permitir que los ciudadanos accedan a materiales de estudio para aspirantes. |
| RF6 | El sistema debe permitir que los ciudadanos consulten preguntas frecuentes. |
| RF7 | El sistema debe permitir publicar y administrar noticias visibles para el público por parte del personal de IMSJ. |
| RF8 | El sistema debe permitir definir período de vigencia de cada noticia. |
| RF9 | El sistema debe permitir cargar imagen de portada, galería de imágenes, texto y enlaces útiles en las noticias. |
| RF10 | El sistema debe permitir gestionar el estado de una noticia ej: como publicada o no-publicada. |
| RF11 | El sistema debe permitir cargar franjas disponibles para trámites normales. |
| RF12 | El sistema debe permitir cargar franjas disponibles para trámites urgentes. |
| RF13 | El sistema debe permitir cargar franjas disponibles para prueba de manejo. |
| RF14 | El sistema debe permitir visualizar la agenda por día. |
| RF15 | El sistema debe permitir visualizar la agenda por semana. |
| RF16 | El sistema debe permitir visualizar la agenda por mes. |
| RF17 | El sistema debe permitir administrar materiales de estudio. |
| RF18 | El sistema debe permitir mantener la sección de preguntas frecuentes. |

---
## Requerimientos No Funcionales

| Código | Requerimiento No Funcional |
|--------|---------------------------|
| RNF1 | Control de roles (diferenciación entre público general y personal IMSJ) |
| RNF2 | Validación de entradas |
| RNF3 | Historial completo de acciones administrativas |
| RNF4 | Protección de datos personales |
| RNF5 | Usabilidad móvil (mobile first) |
| RNF6 | Accesibilidad básica para público general |
| RNF7 | Manejo de vigencia automática de noticias |
| RNF8 | Prevención de doble reserva de agenda |
| RNF9 | Confirmación visual de agenda para el ciudadano |
| RNF10 | Separación clara entre contenidos publicados y contenidos no-publicados |

---

## Origen y destino de los requisitos

**Aclaración del grupo — 02/10/2026:** las agendas son el único módulo exclusivamente académico señalado hasta ahora. CC-01–CC-04 corresponden a entrega real y están pendientes, sin fecha fijada ni prioridad distinta entre ellas. La autoridad del Inspector de Tránsito y los datos por completar están en [aclaraciones y pendientes](aclaraciones_y_pendientes.md).

| Grupo | Fuente y destino |
|---|---|
| RF1, RF2, RF5–RF10, RF17–RF18 y RNF1–RNF7, RNF10 | Letra IMSJ y documentos iniciales. Contenidos y administración para el cliente; aceptación final no registrada. |
| RF3–RF4, RF11–RF16, RNF8–RNF9 | Letra académica. Agenda excluida de la entrega al cliente según entrevista y charter; se conserva para egreso. |
| RF19–RF21 | Informe de entrevista. Necesidades que faltaban en este catálogo; datos de la entrevista incompletos. RF21 se amplía mediante CC-03. |
| RF22–RF24 | Control de cambios CC-01, CC-02 y CC-04. Solicitudes pendientes para la entrega real, confirmadas por el grupo; reglas y aceptación futura por completar. |

## Necesidades relevadas posteriormente

| Código | Necesidad documentada | Fuente | Situación observada al 02/10/2026 |
|---|---|---|---|
| RF19 | Clasificar las preguntas frecuentes por categorías. | Informe de entrevista. | Sin categoría en esquema/modelo/API. Clasificación concreta pendiente. |
| RF20 | Administrar materiales PDF, imágenes y videos. | Informe de entrevista; desarrolla RF5/RF17. | PDF e imagen se cargan como archivo; VIDEO usa URL HTTP/HTTPS. El acuerdo sobre subir videos o enlazarlos no está registrado. |
| RF21 | Obtener aprobación de Dirección antes de publicar noticias; distinguir aprobación de publicación. | Informe de entrevista y CC-03. | CC-03 registra Borrador → Pendiente → Aprobado → Publicado y rol Directora. Código actual: dos roles y estados PUBLICADO/NO_PUBLICADO. Falta confirmar qué otros contenidos cubre el cambio. |
| RF22 | Ofrecer simulacros de pruebas teóricas y gestionar sus preguntas. | CC-01, pedido de profesores. | Existen banco y corrección en API. CC-01 sigue pendiente para entrega real. Cantidad, duración y resultado deben validarse; los valores del código no acreditan acuerdo ni cierre. |
| RF23 | Enviar consultas desde el pie del portal y leerlas desplegables en el panel IMSJ. | CC-02. | No se localizaron tabla, ruta o módulo de consultas que cumplan el circuito solicitado. `consulta.html` consulta reservas, no mensajes. Datos mínimos y tratamiento pendientes. |
| RF24 | Adjuntar material gráfico a preguntas de simulacros. | CC-04. | No se localizaron campos ni carga de adjuntos en preguntas de prueba. Formatos, cantidad, tamaño y obligatoriedad pendientes. |

## Reglas que no se deben completar por suposición

- **Agenda académica:** la letra requiere costo especial urgente; la implementación distingue el trámite, pero no registra costo. No se define precio ni cálculo sin decisión. Los endpoints de cancelación/confirmación de la letra tampoco están implementados.
- **Preguntas frecuentes:** la letra prevé enlaces útiles; el esquema actual tiene pregunta, respuesta y estado. Falta confirmar el tratamiento de enlaces.
- **Usuarios:** hay registro ciudadano y alta/desactivación de personal en código. Su fuente de autorización y criterios de aceptación no están documentados; no se convierten automáticamente en requisitos nuevos aprobados.
- **RNF5–RNF6:** «mobile first» y «accesibilidad básica» carecen de dispositivos, medidas y criterios acordados. Los criterios propuestos en el backlog son sugerencias, no estándares adoptados.
- **RNF3/RNF4:** falta acordar retención, cobertura de auditoría, responsables y evidencias de restauración. Los PDF legales no cierran esas decisiones.

La [matriz del backlog](backlog.md) vincula requisitos con criterios sugeridos y código/pruebas disponibles. Ninguna fila de este catálogo afirma que una funcionalidad esté aceptada o probada.

## Decisión tecnológica transversal — CC-05

**Grupo, 02/10/2026:** sustituir Laravel por PHP sin framework de aplicación, por capas y con PDO/MySQL, basado en `api-completa`. Cambia la implementación de la API, no las necesidades de RF1–RF24/RNF1–RNF10 ni el destino real/académico ya registrado. No se renumeran requisitos ni se añade una función del dominio de productos del ejemplo.

La [guía de migración](migracion_backend_vanilla.md) conserva el contrato de los frontends y los controles de RNF1–RNF4/RNF7–RNF10 como condiciones de transición. El código todavía usa Laravel; CC-05 y CC-01–CC-04 no se declaran implementados. La letra académica indica PHP/Laravel; la aceptación de la sustitución por docentes se completará en el registro del equipo. Ver [control de cambios](control_cambios.md) y [verificación](verificacion.md).
