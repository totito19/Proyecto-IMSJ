> **Estado consolidado - 15/10/2026:** CC-01–CC-05 están **Listos**. El backend está implementado en PHP nativo a partir de api-simple y expone 45 endpoints. CC-02–CC-04 surgieron de la reunión/demo del 03/09 con la Directora y el Inspector de Tránsito. [Implementación/transición](../docs_auxiliares/backend/migracion_backend_vanilla.md) y [pruebas ejecutadas](../docs_auxiliares/evidencias/verificacion.md).

---

# Documento de Requisitos
## Sistema de Gestión de Educación Vial - IMSJ

> **Revisión asistida por IA — 02/10/2026:** se conservan RF1–RF18 y RNF1–RNF10 porque son los códigos usados por el backlog y el modelo original. Los añadidos RF19–RF24 identifican necesidades ya presentes en entrevista/control de cambios; su numeración es documental, no una aprobación de alcance. Ver [revisión](../docs_auxiliares/revision/revision_documental.md).
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

**Estado vigente — 15/10/2026:** las agendas son el único módulo exclusivamente académico señalado. CC-01–CC-05 están Listos. La trazabilidad de las solicitudes está en [control de cambios](control_cambios.md).

| Grupo | Fuente y destino |
|---|---|
| RF1, RF2, RF5–RF10, RF17–RF18 y RNF1–RNF7, RNF10 | Letra IMSJ y documentos iniciales. Contenidos y administración para el cliente; estado detallado por historia en el backlog. |
| RF3–RF4, RF11–RF16, RNF8–RNF9 | Letra académica. Agenda excluida de la entrega al cliente según entrevista y charter; se conserva para egreso. |
| RF19–RF21 | Informe de entrevista. Necesidades que faltaban en este catálogo; datos de la entrevista incompletos. RF21 se amplía mediante CC-03. |
| RF22–RF24 | Control de cambios CC-01, CC-02 y CC-04. Implementados con el comportamiento registrado y estado Listo. |

## Necesidades relevadas posteriormente

| Código | Necesidad documentada | Fuente | Situación observada al 02/10/2026 |
|---|---|---|---|
| RF19 | Clasificar las preguntas frecuentes por categorías. | Informe de entrevista. | Sin categoría en esquema/modelo/API. Clasificación concreta pendiente. |
| RF20 | Administrar materiales PDF, imágenes y videos. | Informe de entrevista; desarrolla RF5/RF17. | PDF e imagen se cargan como archivo; VIDEO usa URL HTTP/HTTPS. El acuerdo sobre subir videos o enlazarlos no está registrado. |
| RF21 | Obtener aprobación de Dirección antes de publicar noticias; distinguir aprobación de publicación. | Informe de entrevista y CC-03. | **Listo.** Rol Directora y flujo Borrador → Pendiente → Aprobado → Publicado aplicado a noticias, materiales y preguntas frecuentes. |
| RF22 | Ofrecer simulacros de pruebas teóricas y gestionar sus preguntas. | CC-01, pedido de profesores. | **Listo.** Banco, selección de hasta diez preguntas y corrección sin revelar previamente la respuesta. |
| RF23 | Enviar consultas desde el pie del portal y leerlas desplegables en el panel IMSJ. | CC-02, reunión/demo del 03/09. | **Listo.** Formulario público, tabla `consultas`, API, bandeja del panel y marcado como leído. |
| RF24 | Adjuntar material gráfico a preguntas de simulacros. | CC-04, reunión/demo del 03/09. | **Listo.** Una imagen opcional JPG/PNG/WEBP de hasta 2048 KB, administrable y visible al resolver. |

## Reglas que no se deben completar por suposición

- **Agenda académica:** la letra requiere costo especial urgente; la implementación distingue el trámite, pero no registra costo. No se define precio ni cálculo sin decisión. La cancelación ciudadana está implementada; la confirmación sigue pendiente.
- **Preguntas frecuentes:** la letra prevé enlaces útiles; el esquema actual tiene pregunta, respuesta y estado. Falta confirmar el tratamiento de enlaces.
- **Usuarios:** hay registro ciudadano y alta/desactivación de personal en código. Su procedencia no está documentada como un cambio controlado; no se atribuye a CC-01–CC-05.
- **RNF5–RNF6:** «mobile first» y «accesibilidad básica» carecen de dispositivos, medidas y criterios acordados. Los criterios propuestos en el backlog son sugerencias, no estándares adoptados.
- **RNF3/RNF4:** falta acordar retención, cobertura de auditoría, responsables y evidencias de restauración. Los PDF legales no cierran esas decisiones.

La [matriz del backlog](backlog.md) vincula requisitos con su estado, comportamiento verificable y código/pruebas disponibles. Los cambios CC-01–CC-05 figuran como **Listos**; las historias parciales mantienen visible su limitación concreta.

## Decisión tecnológica transversal — CC-05

**Grupo, 02/10/2026:** sustituir Laravel por PHP sin framework de aplicación, por capas y con PDO/MySQL, siguiendo el recorrido de `api-simple`. Cambia la implementación de la API, no las necesidades de RF1–RF24/RNF1–RNF10 ni el destino real/académico ya registrado. No se renumeran requisitos ni se añade una función del dominio de productos del ejemplo.

La [guía de migración](../docs_auxiliares/backend/migracion_backend_vanilla.md) conserva el contrato de los frontends y los controles de RNF1–RNF4/RNF7–RNF10. El código actual usa PHP nativo, PDO y MySQL; CC-01–CC-05 están Listos. Ver [control de cambios](control_cambios.md) y [verificación](../docs_auxiliares/evidencias/verificacion.md).
