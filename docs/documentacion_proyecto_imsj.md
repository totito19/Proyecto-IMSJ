# Proyecto Educación Vial IMSJ — Concepción del proyecto

> **Revisión asistida por IA — 02/10/2026:** la síntesis conserva el relevamiento inicial. La numeración se alinea con [Requerimientos](Requerimientos.md) y [backlog](backlog.md). Las interpretaciones sin evidencia se señalan; no se certifican decisiones ni aceptación del cliente.

---

## Índice

**Parte 1 — Concepción del proyecto**
1. [Situación inicial del cliente](#1-situación-inicial-del-cliente)
2. [Necesidad presentada por el cliente](#2-necesidad-presentada-por-el-cliente)
3. [Primer análisis del equipo: dudas detectadas en la letra](#3-primer-análisis-del-equipo-dudas-detectadas-en-la-letra)

**Parte 2 — Entrevista con el cliente**
4. [Participantes de la entrevista](#4-participantes-de-la-entrevista)
5. [Desarrollo de la entrevista](#5-desarrollo-de-la-entrevista)
6. [Información obtenida](#6-información-obtenida)

**Parte 3 — Alcance del proyecto**
7. [Nombre de la solución](#7-nombre-de-la-solución)
8. [Visión del producto](#8-visión-del-producto)
9. [Alcance incluido](#9-alcance-incluido)
10. [Alcance excluido](#10-alcance-excluido)

**Parte 4 — Requerimientos**
11. [Requerimientos funcionales](#11-requerimientos-funcionales)
12. [Requerimientos no funcionales](#12-requerimientos-no-funcionales)

**Parte 5 — Épicas**
13. [Definición de épicas](#13-definición-de-épicas)

---

# Parte 1: Concepción del proyecto

## 1. Situación inicial del cliente

**Organismo:** Intendencia Municipal de San José (IMSJ)
**Área:** Sección Tránsito
**Referente institucional:** Inspector de Tránsito de la Intendencia, conocido como Nacho. El grupo no confirma un apellido; se usa principalmente el cargo.
**Público alcanzado:** ciudadanía del departamento de San José, con foco especial en adolescentes
**Nivel tecnológico actual:** bajo en cuanto a canales digitales propios
**Registro actual:** información dispersa en canales no integrados; el trámite de licencia se gestiona
telefónicamente

La Sección Tránsito comunica al público tres tipos de contenido: noticias y anuncios, materiales de estudio
para aspirantes a la libreta de conducir, y respuestas a consultas frecuentes. Hoy esa comunicación depende
de canales dispersos, sin control de vigencia ni una herramienta propia de publicación.

---

## 2. Necesidad presentada por el cliente

La letra inicial del proyecto plantea que la IMSJ requiere una aplicación web que centralice:

- la comunicación pública de la Sección Tránsito,
- la agenda de trámites vinculados a la libreta de conducir,
- el acceso a materiales de estudio para aspirantes.

La solución propuesta en la letra se compone de **dos interfaces diferenciadas y un backend centralizado**:

| Componente | Para quién | Qué hace |
|---|---|---|
| **Frontend público** | Ciudadanía en general | Consultar noticias vigentes, materiales de estudio y preguntas frecuentes |
| **Frontend IMSJ (dashboard)** | Personal administrativo de Tránsito | Publicar y administrar los contenidos |
| **Backend (API REST)** | Ambos frontends | Centraliza la lógica de negocio, la autenticación y el acceso a datos |

La separación en dos interfaces está indicada por la letra del proyecto. El público consulta contenidos; en la versión académica también registra reservas. El personal administra contenidos. La autorización efectiva se realiza en la API, no mediante la separación visual.

---

## 3. Primer análisis del equipo: dudas detectadas en la letra

Antes de entrevistar al cliente, el equipo identificó que la letra contenía áreas ambiguas o incompletas
que impedían estimar correctamente el trabajo:

| Área a aclarar | Preguntas iniciales del equipo |
|---|---|
| Usuarios administrativos | ¿Qué roles existirán dentro del panel? ¿Hay funciones exclusivas de algunos usuarios? ¿Se necesita saber quién realizó cada cambio? |
| Agenda de trámites | ¿Cómo es el proceso actualmente? ¿Quién administra las franjas de disponibilidad? ¿Qué duración y cuántos cupos tiene cada franja? ¿Qué datos del ciudadano son obligatorios? ¿Qué ve el usuario tras agendarse? |
| Costo del trámite urgente | ¿Es fijo o variable? ¿De qué depende? ¿Quién está autorizado a modificarlo? |
| Preguntas frecuentes | ¿Necesitan clasificarse por categorías? ¿Quién las administra? |
| Materiales de estudio | ¿Qué formatos de archivo se manejan? ¿Quién puede administrarlos? |
| Noticias | ¿Las noticias vencidas siguen siendo consultables o desaparecen? ¿Quién define la vigencia? |

---

# Parte 2: Entrevista con el cliente

## 4. Participantes de la entrevista

| Rol | Participante | Responsabilidad |
|---|---|---|
| Cliente / referente institucional | Inspector de Tránsito de la Intendencia | Explica el proceso real. El grupo confirmó además su autoridad para aceptar entregas y aprobar cambios, con registro en actas. |
|Equipo de desarrollo | Equipo de estudiantes | Releva necesidades y las transforma en requerimientos |

---

## 5. Desarrollo de la entrevista

### Sobre usuarios administrativos

**¿Qué roles existirán dentro de los usuarios administrativos?**
El sistema será administrado por el entrevistado y una compañera de equipo, encargados de gestionar el
programa.

**¿La Dirección utilizará el sistema?**
Sí, también tendrá participación dentro del sistema.

**¿Habrá funciones exclusivas para algunos usuarios administrativos?**
No. No se considera necesario definir distintos niveles de permisos: todos los usuarios administrativos
tendrán los mismos privilegios.

**¿Necesitan saber quién realizó cada cambio?**
Sí. El sistema debe registrar qué usuario realizó cada modificación.

### Sobre la agenda de trámites

**¿Cómo es actualmente el proceso para solicitar la licencia de conducir?**
Se realiza por teléfono. Existe intención de migrarlo a formato web, **pero ese desarrollo no forma parte
del alcance de esta etapa del proyecto**.

### Sobre preguntas frecuentes

**¿Deberán clasificarse por categorías?**
Sí, para facilitar la búsqueda de información.

**¿Quién las administrará?**
Todo el equipo será responsable de crearlas, actualizarlas y gestionarlas.

### Sobre materiales de estudio

**¿Qué tipos de materiales utilizarán?**
Documentos PDF, imágenes y videos. La intención es adaptar manuales, normativas y leyes a un lenguaje más
sencillo y comprensible para adolescentes, evitando un enfoque excesivamente técnico.

**¿El objetivo es acercar la información a más personas?**
Sí, especialmente a los adolescentes. El equipo audiovisual producirá videos explicativos sobre distintas
situaciones de tránsito.

### Sobre noticias

**¿Cada noticia tendrá fecha de inicio y fin de vigencia?**
Sí.

**¿Cómo influye la vigencia según el tipo de noticia?**
Depende del contenido: algunas permanecen publicadas hasta un año, mientras que la mayoría de las noticias
de tránsito son esporádicas y se mantienen visibles solo el tiempo necesario.

**¿Quién define la fecha de fin de vigencia?**
El entrevistado será el responsable.

**¿Existen roles definidos para publicar noticias?**
No hay roles diferenciados: todo el equipo accede a la gestión de noticias. Sin embargo, **las
publicaciones requieren aprobación de la Dirección antes de hacerse visibles**.

**¿Desean agregar algún requerimiento adicional?**
Por el momento no se identifican nuevos requerimientos.

---

## 6. Información obtenida

| Categoría | Información relevada |
|---|---|
| Problema principal | Información dispersa, sin control de vigencia ni herramienta propia de publicación. |
| Objetivo de negocio | Centralizar la comunicación pública de Tránsito y acercar la educación vial a adolescentes. |
| Alcance confirmado | Noticias, materiales de estudio y preguntas frecuentes. |
| Alcance descartado por el cliente | Agenda de trámites: continúa siendo telefónica en esta etapa. |
| Usuarios | Personal administrativo (sin subniveles de permiso) y Dirección; ciudadanía como consumidora. |
| Seguridad | Registro de auditoría de modificaciones; diferenciación público / personal IMSJ. |
| Flujo de trabajo | Las noticias requieren aprobación de la Dirección antes de publicarse. |
| Formatos de contenido | PDF, imágenes y videos. |
| Organización de contenidos | Preguntas frecuentes clasificadas por categorías; noticias con vigencia variable. |
| Enfoque comunicacional | Lenguaje sencillo orientado a adolescentes. |

### Interpretación del relevamiento

> **IA — Observación:** este resumen interpreta el informe existente. No se localizó validación del entrevistado ni fecha completa. Los permisos iguales corresponden a esta instancia; CC-03 registra una solicitud posterior de diferenciación.

Tres resultados concretos, que conviene poder explicar en la defensa:

1. **Confirmó la exclusión de la agenda con el cliente.** No fue una decisión del equipo: el
   referente indicó que el trámite sigue siendo telefónico en esta etapa. La exclusión consta en el informe y el charter, aunque falta evidencia de validación institucional del registro.

2. **Simplificó un requerimiento sobredimensionado.** El equipo asumía roles administrativos diferenciados;
   el cliente aclaró que todos los administrativos tienen los mismos privilegios. Menos complejidad real de
   implementación.

3. **Descubrió tres requerimientos no previstos:** categorización de preguntas frecuentes, soporte de video
   en materiales, y aprobación de la Dirección antes de publicar.

Las precisiones se incorporan como RF19–RF21. Confirmar lo ya supuesto también permite reducir incertidumbre; no se mide el valor de la entrevista por la cantidad de requisitos nuevos.

### Temas sin respuesta documentada

> **IA — Sugerencia:** las preguntas siguientes son pendientes para el equipo, no pedidos confirmados por el cliente.

Comparando con el estándar del caso de referencia, quedaron sin relevar tres temas que TamboTrace sí
consulta y que conviene preguntar en la próxima instancia con el cliente:

- **Plazo esperado:** ¿para cuándo necesita la IMSJ una primera versión funcionando?
- **Infraestructura:** ¿hay servidor propio o se despliega en hosting externo? ¿Qué dispositivos usa el
  personal?
- **Entregables de cierre:** ¿esperan manual de usuario, capacitación, usuarios creados?

---

# Parte 3: Alcance del proyecto

## 7. Nombre de la solución

**Portal Vial**

---

## 8. Visión del producto

La plataforma será una aplicación web responsive que permitirá a la Sección Tránsito de la IMSJ publicar y
administrar noticias, materiales de estudio y preguntas frecuentes desde un panel propio, y a la ciudadanía
consultar esa información centralizada desde cualquier dispositivo.

La primera versión se orienta a resolver el circuito de comunicación pública, dejando fuera funcionalidades
que aumenten el costo o retrasen la entrega.

---

## 9. Alcance incluido

1. Gestión de usuarios y control de acceso por rol (público general vs. personal IMSJ).
2. Publicación y administración de noticias.
3. Definición de período de vigencia por noticia.
4. Carga de imagen de portada, galería de imágenes, texto y enlaces útiles en noticias.
5. Gestión del estado de publicación de una noticia.
6. Consulta pública de noticias vigentes.
7. Administración de materiales de estudio (PDF, imágenes y videos).
8. Consulta pública de materiales de estudio.
9. Gestión de preguntas frecuentes clasificadas por categorías.
10. Consulta pública de preguntas frecuentes.
11. Historial de acciones administrativas (auditoría de modificaciones).
12. Interfaz responsive con accesibilidad básica.
**Solo para la versión académica, según charter y relevamiento:**

13. Interfaz pública para agendarse a trámites de libreta de conducir.
14. Interfaz administrativa de franjas de disponibilidad.
15. Prevención de doble reserva de agenda.
16. Confirmación visual de agenda para el ciudadano.

Las solicitudes CC-01–CC-04 se consultan en [control de cambios](control_cambios.md). El grupo las confirmó como pendientes para la entrega real, sin fecha fijada ni prioridad distinta entre ellas; no se presentan como alcance inicial ni como funciones terminadas. La agenda es el único módulo señalado como exclusivamente académico hasta ahora.

**Aclaración del grupo — 02/10/2026:** la coordinación y el seguimiento se realizan en reuniones. Juan Robaina revisa y aprueba la documentación internamente; la aceptación del cliente corresponde al Inspector de Tránsito y se registra en las actas a cargo del equipo. La Intendencia administrará y mantendrá el sistema por ahora. Roles y campos pendientes: [aclaraciones y pendientes](aclaraciones_y_pendientes.md).

---

## 10. Alcance excluido
- La agenda queda excluida de la entrega al cliente según el relevamiento; se conserva en la entrega académica para cumplir la letra.
- No está documentado cómo se separarán técnicamente las versiones ni quién aceptó la entrega definitiva.


# Parte 4: Requerimientos del sistema


## 11. Requerimientos funcionales

La referencia de códigos es [Requerimientos.md](Requerimientos.md): RF1–RF18 se conservan, y RF19–RF24 identifican precisiones del relevamiento y solicitudes posteriores. Para evitar dos catálogos distintos, esta síntesis remite a ese documento.

### Equivalencia de los códigos anteriores de esta síntesis

Esta tabla conserva trazabilidad con versiones anteriores; no renumera el catálogo original ni las historias US.

| Código anterior en esta síntesis | Código en Requerimientos.md | Función |
|---|---|---|
| RF1 | RF1 | Inicio de sesión. |
| RF2 | RF2 | Consulta de noticias. |
| RF3 | RF5 | Consulta de materiales. |
| RF4 | RF6 | Consulta de preguntas frecuentes. |
| RF5 | RF7 | Administración de noticias. |
| RF6 | RF8 | Vigencia de noticias. |
| RF7 | RF9 | Imágenes, texto y enlaces de noticias. |
| RF8 | RF10 | Estado de noticias. |
| RF9 | RF17 | Administración de materiales. |
| RF10 | RF18 | Administración de preguntas frecuentes. |
| RF11 | RF19 | Categorías de preguntas frecuentes. |
| RF12 | RF20 | Formatos de materiales. |
| RF13 | RF21 | Aprobación de noticias por Dirección. |

## 12. Requerimientos no funcionales

Consultar RNF1–RNF10 en [Requerimientos.md](Requerimientos.md). En la versión anterior de esta síntesis, RNF1–RNF7 coincidían; **RNF8 significaba separación de publicaciones y corresponde a RNF10**. RNF8 del catálogo de referencia significa prevención de doble reserva y RNF9, confirmación visual.

## 13. Definición de épicas

Se mantienen EP1–EP7 de [backlog](backlog.md). La versión anterior de esta síntesis llamó EP3 a materiales (ahora EP5), EP4 a preguntas frecuentes (ahora EP6) y EP5 a calidad (ahora EP7). EP1 y EP2 coinciden. Agenda y gestión de agenda conservan EP3 y EP4 en el backlog académico.

Las necesidades posteriores se muestran separadas y como borradores trazados a sus fuentes en el backlog. No se transforma una propuesta de IA en compromiso del equipo.

## 14. Actualización tecnológica — CC-05, 02/10/2026

Por decisión explícita del grupo, el destino del backend es PHP sin Laravel, por capas y con PDO/MySQL a partir de `api-completa` de RodrigoCazard. La [migración](migracion_backend_vanilla.md), la [comparación de referencia](referencia_api_completa.md) y el [control de cambios](control_cambios.md) describen esta actualización posterior al relevamiento; no se la atribuye a la entrevista inicial.

La implementación presente todavía utiliza Laravel. Se conserva el dominio, el contrato de los frontends y los destinos acordados: agenda académica y CC-01–CC-04 pendientes para entrega real. La letra académica indica Laravel, por lo que el registro de aceptación de la diferencia con docentes sigue pendiente. Las propuestas de cookie JWT, formatos/rutas del ejemplo o cambios de datos no quedan aprobadas automáticamente.
