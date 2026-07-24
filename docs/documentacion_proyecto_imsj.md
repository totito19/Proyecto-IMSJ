# Proyecto Educación Vial IMSJ — Concepción del proyecto

**Alcance de este documento:** cubre el trabajo realizado hasta el apartado de Épicas inclusive,
siguiendo la estructura del caso de referencia **TamboTrace** (`Practicos/proyecto_scrum_trazabilidad_lechera.md`).
No incluye historias de usuario, backlog por sprint, arquitectura ni testing, que corresponden a entregas
posteriores.

**Primera entrega:** 6 de agosto de 2026.

**A quién está dirigido:** a una persona ajena al proyecto (docente auditor, tribunal, integrante nuevo del
equipo). No se asume conocimiento previo del proyecto ni de Scrum.

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

**Parte 6 — Estimación**
14. [Criterio de estimación](#14-criterio-de-estimación)
15. [Estimación por épica](#15-estimación-por-épica)
16. [Ajuste de alcance](#16-ajuste-de-alcance)

**Anexos**
- [Marco metodológico: Scrum](#anexo-a--marco-metodológico-scrum)
- [Preguntas de defensa](#anexo-b--preguntas-de-defensa)
- [Glosario](#anexo-c--glosario)

---

# Parte 1: Concepción del proyecto

## 1. Situación inicial del cliente

**Organismo:** Intendencia Municipal de San José (IMSJ)
**Área:** Sección Tránsito
**Referente entrevistado:** Inspector de tránsito Ignacio Franco
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

La separación en dos interfaces no es una decisión técnica arbitraria: responde a que son **dos públicos
con permisos radicalmente distintos**. El ciudadano solo lee; el personal escribe y publica. Unificarlas
sería un riesgo de seguridad y una complicación de usabilidad.

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

> **Nota metodológica.** Este apartado corresponde al ítem 3 de la rúbrica del docente auditor
> ("análisis de la letra e identificación de faltantes o dudas"), y es lo que justifica la existencia de la
> entrevista. Detectar qué falta *antes* de reunirse con el cliente es lo que diferencia una entrevista
> productiva de una charla informal.

---

# Parte 2: Entrevista con el cliente

**Documentos:** `docs/Entrevista.md` (guía de preguntas) y
`entrevista con el cliente/informe entrevista.md` (informe de la entrevista realizada)

## 4. Participantes de la entrevista

| Rol | Participante | Responsabilidad |
|---|---|---|
| Cliente / referente institucional | Inspector de tránsito de la IMSJ | Explica el proceso real y define prioridades |
| Dirección | Dirección de la Sección Tránsito | Aprueba las publicaciones antes de hacerse visibles |
| Equipo de desarrollo | Equipo de estudiantes | Releva necesidades y las transforma en requerimientos |

> **Punto pendiente:** el informe de entrevista tiene los campos de **fecha, entrevistador y entrevistado
> sin completar**. Según el cronograma del repositorio de lineamientos, la entrevista presencial por el
> proyecto de educación vial estaba agendada para el **jueves 09/07/2026 a las 17:00 en el Polo San José**.
> Completar estos datos antes de la entrega: una entrevista sin fecha ni participantes identificados pierde
> valor como evidencia documental.

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

### Qué aportó la entrevista

Tres resultados concretos, que conviene poder explicar en la defensa:

1. **Confirmó la exclusión de la agenda con el cliente.** No fue una decisión unilateral del equipo: el
   referente indicó que el trámite sigue siendo telefónico en esta etapa. Eso convierte el alcance excluido
   en un acuerdo documentado.

2. **Simplificó un requerimiento sobredimensionado.** El equipo asumía roles administrativos diferenciados;
   el cliente aclaró que todos los administrativos tienen los mismos privilegios. Menos complejidad real de
   implementación.

3. **Descubrió tres requerimientos no previstos:** categorización de preguntas frecuentes, soporte de video
   en materiales, y aprobación de la Dirección antes de publicar.

El tercer punto es el que justifica haber hecho la entrevista. Si el cliente solo confirma lo que el equipo
ya suponía, la entrevista no aportó información. Acá aportó.

### Temas que la entrevista no cubrió

Comparando con el estándar del caso de referencia, quedaron sin relevar tres temas que TamboTrace sí
consulta y que conviene preguntar en la próxima instancia con el cliente:

- **Plazo esperado:** ¿para cuándo necesita la IMSJ una primera versión funcionando?
- **Infraestructura:** ¿hay servidor propio o se despliega en hosting externo? ¿Qué dispositivos usa el
  personal?
- **Entregables de cierre:** ¿esperan manual de usuario, capacitación, usuarios creados?

---

# Parte 3: Alcance del proyecto

**Documento:** `docs/project_charter.md`

## 7. Nombre de la solución

**Plataforma Web Educación Vial IMSJ**

> **Observación.** El caso de referencia adopta un nombre de producto propio y corto (*TamboTrace*), y la
> rúbrica del docente auditor evalúa explícitamente la **"pertinencia y justificación del nombre elegido"**
> (ítem 5). El nombre actual es descriptivo pero no funciona como marca. Conviene definir un nombre propio
> —por ejemplo, algo que combine tránsito/vial con la idea de guía o información— y poder justificar en la
> defensa por qué se eligió.

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

---

## 10. Alcance excluido

Queda fuera de esta primera versión:

1. Interfaz pública para agendarse a trámites de libreta de conducir.
2. Interfaz administrativa de franjas de disponibilidad.
3. Prevención de doble reserva de agenda.
4. Confirmación visual de agenda para el ciudadano.
5. Gestión del costo del trámite urgente.
6. Aplicación móvil nativa.
7. Integración con sistemas externos de la IMSJ.

Estas funcionalidades podrán evaluarse en una etapa posterior.

### Fundamento de la exclusión de la agenda

Es la decisión de alcance más importante del proyecto y la que más se va a preguntar en la defensa. Los
fundamentos, en orden de peso:

1. **El cliente lo confirmó en la entrevista.** El referente indicó que la gestión de licencias se realiza
   por teléfono y que migrarla a web no forma parte del alcance de esta etapa. Está registrado en el
   informe de entrevista.

2. **Complejidad desproporcionada.** La agenda concentra la lógica más difícil del sistema: control de
   cupos, prevención de doble reserva, concurrencia (dos ciudadanos reservando la misma franja
   simultáneamente), estados de reserva y costos variables.

3. **Datos personales.** Obliga a almacenar cédula, correo y teléfono de ciudadanos, lo que eleva
   sustancialmente las exigencias legales y de seguridad.

4. **Coherencia técnica de lo que sí se incluye.** Las tres funcionalidades incluidas comparten un mismo
   patrón —contenido que se crea, se publica, se despublica y se consulta— lo que permite construir una
   base reutilizable. La agenda es un patrón distinto que se apoyaría sobre esa base.

Lo relevante metodológicamente es que **la exclusión está documentada, no omitida**. Un alcance excluido
escrito es una decisión de gestión; un alcance simplemente no mencionado es un olvido.

---

# Parte 4: Requerimientos del sistema

**Documento:** `docs/Requerimientos.md`

### Qué es un requerimiento y por qué se separan en dos tipos

Un requerimiento es una afirmación verificable sobre lo que el sistema debe cumplir.

- **Funcionales (RF):** describen **qué hace** el sistema. Se verifican ejecutando la acción y comprobando
  el resultado.
- **No funcionales (RNF):** describen **con qué calidad** lo hace. No son funciones sino condiciones
  transversales: seguridad, rendimiento, usabilidad, accesibilidad.

La distinción importa porque se construyen y prueban de manera distinta. Un RF se implementa en un módulo
concreto; un RNF como "protección de datos personales" atraviesa todo el sistema.

Cada requerimiento lleva un **código** (RF1, RNF3…). No es decorativo: es lo que permite señalar qué épica
cubre qué requerimiento y qué prueba lo valida. Sin códigos no hay trazabilidad.

## 11. Requerimientos funcionales

| Código | Requerimiento funcional |
|---|---|
| RF1 | El sistema debe permitir iniciar sesión con cédula y contraseña. |
| RF2 | El sistema debe permitir que los ciudadanos consulten anuncios y noticias de la Sección Tránsito. |
| RF3 | El sistema debe permitir que los ciudadanos accedan a materiales de estudio para aspirantes. |
| RF4 | El sistema debe permitir que los ciudadanos consulten preguntas frecuentes. |
| RF5 | El sistema debe permitir publicar y administrar noticias visibles para el público por parte del personal de IMSJ. |
| RF6 | El sistema debe permitir definir período de vigencia de cada noticia. |
| RF7 | El sistema debe permitir cargar imagen de portada, galería de imágenes, texto y enlaces útiles en las noticias. |
| RF8 | El sistema debe permitir gestionar el estado de una noticia (publicada / no publicada). |
| RF9 | El sistema debe permitir administrar materiales de estudio. |
| RF10 | El sistema debe permitir gestionar la sección de preguntas frecuentes. |

Los requerimientos fueron **renumerados de forma continua** (RF1 a RF10) al reorganizar el documento,
eliminando los saltos de la versión anterior. Es el criterio correcto: una numeración con huecos sin
explicación se lee como descuido.

### Requerimientos surgidos de la entrevista, aún no incorporados

La entrevista arrojó tres necesidades que **todavía no figuran en el documento** y deben agregarse:

| Propuesto | Requerimiento | Origen |
|---|---|---|
| RF11 | El sistema debe permitir clasificar las preguntas frecuentes por categorías. | El cliente indicó que es necesario organizarlas para facilitar la búsqueda. |
| RF12 | El sistema debe permitir almacenar materiales de estudio en formato PDF, imagen y video. | El cliente especificó los tres formatos a soportar. |
| RF13 | El sistema debe requerir aprobación de la Dirección antes de que una noticia se haga visible al público. | El cliente indicó que toda publicación pasa por la Dirección. |

**RF13 es el más relevante** porque introduce un flujo de aprobación que cambia el modelo de estados de una
noticia: ya no alcanza con "publicada / no publicada", aparece un estado intermedio de *pendiente de
aprobación*. Detectar esto en la etapa de análisis, y no durante el desarrollo, es exactamente el propósito
de hacer la entrevista antes de programar.

## 12. Requerimientos no funcionales

| Código | Requerimiento no funcional |
|---|---|
| RNF1 | Control de roles (diferenciación entre público general y personal IMSJ) |
| RNF2 | Validación de entradas |
| RNF3 | Historial completo de acciones administrativas |
| RNF4 | Protección de datos personales |
| RNF5 | Usabilidad móvil (mobile first) |
| RNF6 | Accesibilidad básica para público general |
| RNF7 | Manejo de vigencia automática de noticias |
| RNF8 | Separación clara entre contenidos publicados y no publicados |

La entrevista aclaró que **todos los usuarios administrativos tienen los mismos privilegios**, lo que acota
RNF1: la diferenciación es entre público y personal IMSJ, sin subniveles internos.

### Observación sobre la redacción de los RNF

Los RF están correctamente redactados en formato "El sistema debe permitir…", que los hace verificables.
Los RNF, en cambio, están escritos como **etiquetas** ("Validación de entradas") y no como condiciones
medibles. El caso de referencia los redacta con umbrales concretos: *"El sistema debe responder las
consultas principales en menos de 3 segundos bajo carga normal"*.

Ejemplos de reescritura recomendada:

| Actual | Propuesto |
|---|---|
| Usabilidad móvil (mobile first) | El sistema debe ser plenamente operable desde pantallas de 360 px de ancho sin scroll horizontal. |
| Validación de entradas | El sistema debe validar todos los campos de formulario antes de persistir datos, mostrando mensajes de error específicos por campo. |
| Historial completo de acciones administrativas | El sistema debe registrar fecha, hora y usuario en toda creación, modificación o eliminación de contenido. |

Un RNF que no se puede medir tampoco se puede probar ni dar por cumplido.

---

# Parte 5: Épicas del proyecto

**Documento:** `docs/backlog.md`

## 13. Definición de épicas

Una **épica** es una funcionalidad grande o área de trabajo que debe dividirse en historias de usuario más
pequeñas. Organiza el alcance antes de pasar al Product Backlog.

La jerarquía completa:

```
Requerimientos  →  Épicas  →  Historias de usuario  →  Tareas
   (qué)           (bloques)   (unidades de sprint)     (pasos)
```

Existen por una razón práctica: una lista plana de treinta historias es inmanejable para priorizar y para
conversar con el cliente. Agrupadas en cinco o seis épicas, el equipo puede decirle al cliente "en el
Sprint 1 atacamos acceso y noticias", que es una conversación que se entiende sin ser técnico.

### Épicas del proyecto

| Código | Épica | Descripción |
|---|---|---|
| EP1 | Acceso y control de roles | Inicio de sesión y separación de permisos entre público general y personal de IMSJ. |
| EP2 | Comunicación pública (Noticias) | Publicación y consulta de noticias, con contenido, vigencia, estado y aprobación. |
| EP3 | Materiales de estudio | Acceso del aspirante y administración de materiales en PDF, imagen y video. |
| EP4 | Preguntas frecuentes | Consulta y mantenimiento de preguntas frecuentes clasificadas por categorías. |
| EP5 | Calidad y requisitos transversales | Validaciones, historial de acciones, protección de datos, usabilidad móvil y accesibilidad. |

### Trazabilidad épica → requerimientos

| Épica | Requerimientos cubiertos |
|---|---|
| EP1 | RF1, RNF1 |
| EP2 | RF2, RF5, RF6, RF7, RF8, RF13, RNF7, RNF8 |
| EP3 | RF3, RF9, RF12 |
| EP4 | RF4, RF10, RF11 |
| EP5 | RNF2, RNF3, RNF4, RNF5, RNF6 |

### ⚠️ Corrección pendiente en el repositorio

**Este es el punto más urgente antes del 6 de agosto.**

El archivo `docs/backlog.md` **todavía usa la numeración anterior** de requerimientos y épicas. Las
referencias actuales apuntan a códigos inexistentes:

- EP2 declara cubrir `RF2, RF8, RF9, RF10, RF11, RNF7, RNF10` — **RF11 y RNF10 ya no existen**, y RF8, RF9
  y RF10 hoy significan cosas distintas.
- EP5 declara cubrir `RF6, RF18` — **RF18 no existe**; RF6 hoy es "vigencia de noticias", no materiales.
- EP6 declara cubrir `RF7, RF19` — **RF19 no existe**.
- Las épicas están numeradas EP1, EP2, EP5, EP6, EP7 (con huecos), mientras los requerimientos sí fueron
  renumerados de forma continua: los dos documentos siguen criterios distintos.
- Las historias de usuario saltan de US9 a US21 y arrastran el mismo desfasaje.

La trazabilidad es justamente lo que se evalúa en esta entrega (ítem 8 de la rúbrica del auditor:
*"coherencia entre las épicas presentadas y los requerimientos identificados"*). Un backlog que apunta a
requerimientos inexistentes rompe la cadena y es detectable cruzando ambos archivos.

**Acción:** aplicar sobre `backlog.md` la tabla de trazabilidad de arriba y renumerar épicas (EP1–EP5) e
historias de usuario de forma continua.

### Cómo se decidió agrupar las épicas

El criterio fue **por dominio funcional**: cada épica reúne todo lo relativo a un mismo concepto del
negocio, tanto del lado del ciudadano como del administrador.

EP2 es el caso más claro: incluye la consulta pública de noticias, la publicación administrativa, la
vigencia, el contenido multimedia, el estado de publicación y el flujo de aprobación. La alternativa habría
sido separar "épica del frontend público" y "épica del dashboard", pero eso parte en dos algo que se
construye junto: la noticia es una sola entidad, con una sola tabla y un solo conjunto de endpoints.

**EP5 es distinta a las demás.** Agrupa los requerimientos no funcionales transversales. No son
funcionalidades que el usuario vea como pantalla; atraviesan todo el sistema. Se le dio épica propia para
que **queden visibles y no se pierdan**: un RNF que no está en el backlog es un RNF que nadie va a
implementar, porque no aparece en ninguna planificación de sprint.

---

# Parte 6: Estimación de esfuerzo y plazo

## 14. Criterio de estimación

> **Estado: pendiente.** Esta sección todavía no está desarrollada en el repositorio y es un faltante
> respecto del caso de referencia, que estima cada épica en puntos y ajusta el alcance en consecuencia.
> Lo que sigue es el método a aplicar y una propuesta de trabajo, no una estimación cerrada por el equipo.

Se utilizarán **puntos de historia** (story points), una medida **relativa de esfuerzo**, no de horas. La
escala habitual:

| Puntos | Significado |
|---|---|
| 1 | Tarea muy pequeña |
| 3 | Tarea simple pero con cierta lógica |
| 5 | Tarea media |
| 8 | Tarea compleja |
| 13 | Tarea grande o riesgosa |

**Por qué puntos y no horas:** estimar en horas obliga a comprometerse con una precisión que no se tiene al
inicio, y las horas varían según quién ejecute la tarea. Los puntos comparan tamaño relativo entre tareas,
que es más estable y más fácil de acordar en equipo.

Con la velocidad del equipo (puntos completados por sprint, que se calibra tras el primer sprint) se
determina cuántos sprints requiere el backlog.

### Marco temporal del proyecto

Fechas fijadas en el repositorio de lineamientos:

| Hito | Fecha |
|---|---|
| Primera entrega (Ing. Software: documentación de análisis) | 6 de agosto de 2026 |
| Segunda entrega | 10 de septiembre de 2026 |
| Tercera entrega | 15 de octubre de 2026 |
| Defensa del proyecto | A establecer |

Entre la primera y la tercera entrega hay aproximadamente **10 semanas**, lo que sugiere una planificación
de **4 a 5 sprints de 2 semanas**, con los cortes de sprint alineados a las fechas de entrega parcial.

---

## 15. Estimación por épica

> **A completar por el equipo.** La tabla siguiente muestra el formato requerido; los valores deben ser
> acordados por el equipo, idealmente estimando primero las historias de usuario y sumando por épica.

| Código | Épica | Estimación en puntos |
|---|---|---|
| EP1 | Acceso y control de roles | _a definir_ |
| EP2 | Comunicación pública (Noticias) | _a definir_ |
| EP3 | Materiales de estudio | _a definir_ |
| EP4 | Preguntas frecuentes | _a definir_ |
| EP5 | Calidad y requisitos transversales | _a definir_ |
| **Total** | | **_a definir_** |

**Orientación:** EP2 debería ser la épica más pesada —concentra ocho requerimientos, incluye carga de
archivos, galería, vigencia automática y flujo de aprobación—. EP4 debería ser la más liviana. EP5 suele
subestimarse: la auditoría y la accesibilidad requieren trabajo real, no salen solas.

---

## 16. Ajuste de alcance

En el caso de referencia, la estimación total supera la capacidad del equipo, y **ese desajuste es
deliberado**: muestra que en Scrum el Product Backlog se prioriza por valor y riesgo, y que el equipo
negocia con el cliente qué se ajusta o posterga.

Una vez completada la estimación, el equipo debe verificar si el total entra en la capacidad disponible
(sprints × velocidad). Si no entra, corresponde documentar el ajuste en una tabla de este tipo:

| Elemento | Decisión |
|---|---|
| _(funcionalidad)_ | _(se simplifica / se posterga / se resuelve por configuración)_ |

Y registrar cada ajuste en el documento de **control de cambios**, para que quede trazabilidad de qué se
decidió, cuándo y por qué.

---

# Anexo A — Marco metodológico: Scrum

## Qué es Scrum y por qué se usa acá

Scrum es un **marco de trabajo ágil** para desarrollar productos en entornos donde los requerimientos
pueden cambiar. Su idea central es no planificar todo el proyecto al detalle desde el día uno —esa
planificación siempre falla— sino **avanzar en ciclos cortos** llamados *sprints*, mostrando resultados al
cliente al final de cada uno y ajustando el rumbo con lo aprendido.

Se contrapone al modelo en cascada, donde se define todo al inicio, se construye durante meses y recién al
final se muestra al cliente. En cascada, si el equipo entendió mal algo en el mes 1, se entera en el mes 8,
cuando corregirlo es carísimo.

## Roles

| Rol | Qué hace | En este proyecto |
|---|---|---|
| **Product Owner** | Representa al cliente, decide prioridades y valor | La Sección Tránsito de la IMSJ, a través de su referente |
| **Scrum Master / Líder** | Facilita el proceso, coordina, remueve obstáculos | Líder del equipo de estudiantes |
| **Equipo de desarrollo** | Construye el producto; auto-organizado | Los integrantes del grupo |

## Artefactos

- **Product Backlog:** lista priorizada de todo lo que el producto debería hacer. Documento *vivo*.
- **Sprint Backlog:** subconjunto que el equipo se compromete a completar en el sprint en curso.
- **Incremento:** el producto funcionando al final de cada sprint.

## Ceremonias

- **Sprint Planning:** al inicio del sprint, se elige qué historias entran y se estiman.
- **Daily:** sincronización breve: qué hice, qué haré, qué me bloquea.
- **Sprint Review:** al cierre, se muestra lo construido al cliente y se recoge feedback.
- **Retrospectiva:** el equipo analiza cómo trabajó y qué mejorar.

## Dónde está Scrum en esta etapa

**En la primera entrega todavía no hay sprints de desarrollo ejecutados.** Lo que hay es el trabajo previo
que Scrum exige antes de construir:

| Concepto Scrum | Documento |
|---|---|
| Análisis previo de la letra | Sección 3 de este documento |
| Relevamiento con el Product Owner | `docs/Entrevista.md` + `entrevista con el cliente/informe entrevista.md` |
| Visión y alcance del producto | `docs/project_charter.md` |
| Especificación del sistema | `docs/Requerimientos.md` |
| Agrupación en bloques de trabajo | Épicas, en `docs/backlog.md` |
| Product Backlog inicial | `docs/backlog.md` |
| Trazabilidad y evidencia | Historial de commits de Git |

## Trazabilidad: cómo se conecta todo

```
Análisis de la letra → dudas detectadas
        ↓
Entrevista con el cliente
        ↓
Alcance (Project Charter)
        ↓
Requerimientos RF / RNF
        ↓
Épicas
        ↓
Historias de usuario / Product Backlog
```

La trazabilidad es la capacidad de recorrer esa cadena en ambos sentidos, y está implementada mediante
códigos. Sirve para dos cosas:

- **Hacia adelante:** verificar que ningún requerimiento quedó sin implementar.
- **Hacia atrás:** justificar cada línea de código. Si una funcionalidad no rastrea hasta un requerimiento
  y de ahí hasta algo que el cliente pidió, es *scope creep*.

## Organización del repositorio

```
Proyecto-IMSJ/
├── backend/                      # API REST
├── frontend-publico/             # Interfaz ciudadana
├── frontend-imsj/                # Dashboard administrativo
├── docs/
│   ├── project_charter.md
│   ├── Entrevista.md             # Guía de preguntas
│   ├── Requerimientos.md
│   ├── backlog.md
│   └── sprint_planning.md
├── entrevista con el cliente/
│   └── informe entrevista.md     # Informe de la entrevista
├── .gitignore, LICENSE, README.md
```

La separación en tres carpetas refleja la arquitectura decidida: dos clientes independientes consumiendo
una misma API. Git deja **evidencia verificable de quién hizo qué y cuándo**, lo que en un proyecto grupal
con evaluación individual es determinante. A la fecha el repositorio registra 18 commits distribuidos entre
los integrantes del equipo.

---

# Anexo B — Preguntas de defensa

Anticipa preguntas del docente auditor sobre lo documentado hasta acá. Las respuestas son una guía de qué
dominar, no un guion para memorizar.

## Sobre metodología

**¿Por qué eligieron Scrum y no cascada?**
Porque al inicio había incertidumbre real: varias definiciones dependían de respuestas del cliente que no
teníamos. Cascada exige congelar todos los requerimientos antes de empezar y penaliza cualquier cambio
posterior. Scrum permite avanzar sobre lo que ya está claro y refinar el resto con lo que se aprende.

**¿Están aplicando Scrum o solo usando su vocabulario?**
Aplicamos los elementos que corresponden a esta fase: análisis previo de la letra, relevamiento con el
Product Owner, definición de visión y alcance, y construcción de un backlog agrupado en épicas con
trazabilidad a requerimientos. Los sprints con sus ceremonias comienzan en la etapa siguiente.

**¿Quién es el Product Owner?**
El referente de la Sección Tránsito. Es quien conoce el proceso real y decide prioridades. Los estudiantes
no podemos ocupar ese rol: no somos dueños del problema, somos el equipo de desarrollo.

## Sobre el análisis de la letra

**¿Qué información faltaba en la letra inicial?**
Detectamos seis áreas ambiguas antes de la entrevista: roles administrativos, funcionamiento de la agenda,
costo del trámite urgente, categorización de preguntas frecuentes, formatos de materiales y manejo de
vigencia de noticias. Esas dudas fueron las que estructuraron la guía de entrevista.

## Sobre el alcance

**¿Por qué dejaron fuera la agenda, siendo central en el pedido original?**
Ante todo porque **el cliente lo confirmó en la entrevista**: indicó que hoy se gestiona por teléfono y que
migrarlo a web no forma parte de esta etapa. Está registrado en el informe, así que es un acuerdo, no una
decisión unilateral. A eso se suma que es el módulo de mayor complejidad —concurrencia, cupos, doble
reserva— y el único que exige almacenar datos personales de ciudadanos.

**¿Entonces el proyecto quedó recortado?**
Quedó *acotado*, que es distinto. El alcance excluido está escrito en el charter como etapa futura, no
eliminado. Las tres funcionalidades incluidas comparten el mismo patrón, lo que nos permite construir una
base de autenticación, roles, validación y auditoría que la agenda reutilizaría íntegramente.

**Si el cliente pide reincorporar la agenda mañana, ¿qué hacen?**
Se registra como solicitud en el documento de control de cambios, se estima su impacto en plazo y esfuerzo,
y se negocia qué se posterga a cambio. Lo que no se hace es agregarla silenciosamente al backlog: eso es
scope creep.

## Sobre los requerimientos

**¿Cuál es la diferencia entre RF y RNF?**
El funcional describe qué hace el sistema: una acción concreta que se ejecuta y se comprueba. El no
funcional describe con qué calidad lo hace. La diferencia práctica es que un RF se implementa en un módulo
identificable, mientras que un RNF como protección de datos atraviesa todo el sistema.

**Algunos RNF son muy generales. ¿Cómo verifican que se cumplieron?**
Es una observación válida: varios están redactados como etiquetas y no como condiciones medibles. El
criterio de mejora es reescribirlos con umbrales concretos, para que puedan asociarse a una prueba en la
etapa de testing.

**¿Por qué renumeraron los requerimientos?**
La versión inicial tenía saltos heredados del recorte de la agenda. Optamos por numeración continua que
refleje el alcance acordado, porque los huecos sin explicación se interpretan como descuido. Si la agenda
se reincorpora, sus requerimientos se agregan al final y el cambio se registra en control de cambios.

## Sobre las épicas

**¿Diferencia entre épica e historia de usuario?**
El tamaño. Una épica es un bloque grande que no cabe en un sprint. Una historia es una unidad pequeña,
estimable y completable dentro de un sprint, redactada desde la perspectiva de quien la necesita.

**¿Por qué agruparon por dominio y no por interfaz?**
Porque la noticia es una sola entidad del negocio, con una sola tabla y un solo conjunto de endpoints,
aunque se consuma desde dos interfaces. Separar en "épica del público" y "épica del dashboard" habría
partido en dos algo que se construye junto.

**¿Qué es EP5 y por qué es distinta?**
Agrupa los requerimientos no funcionales transversales. Le dimos épica propia porque no son visibles como
pantalla, y lo que no está en el backlog no se planifica ni se implementa.

**Sus épicas no tienen estimación. ¿Cómo van a planificar los sprints?**
Es el paso pendiente inmediato. La estimación en puntos, cruzada con la velocidad del equipo, determina
cuántos sprints requiere el backlog y si hace falta ajustar alcance.

## Sobre el trabajo en equipo

**¿Cómo garantizan que todos trabajaron?**
El historial de Git registra autor y fecha de cada commit, y los aportes están distribuidos entre los
integrantes. A eso se suman las bitácoras individuales y las actas de reuniones.

**¿Cómo se toman las decisiones cuando hay desacuerdo?**
Se discuten en reunión y se registran en el acta, incluyendo los desacuerdos y no solo la decisión final.
Dejar asentada la postura que no prevaleció importa: si más adelante la decisión resulta equivocada, queda
registro de las alternativas evaluadas.

---

# Anexo C — Glosario

| Término | Significado |
|---|---|
| **Scrum** | Marco de trabajo ágil basado en ciclos cortos e iterativos llamados sprints |
| **Sprint** | Ciclo de trabajo de duración fija que termina en un incremento del producto |
| **Product Owner** | Representante del cliente; define prioridades y valida el producto |
| **Scrum Master** | Facilitador del proceso; coordina y remueve obstáculos |
| **Product Backlog** | Lista priorizada de todo lo que el producto debería hacer |
| **Épica** | Bloque grande de funcionalidad que agrupa varios requerimientos |
| **Historia de usuario** | Unidad pequeña de funcionalidad descrita desde la perspectiva del usuario |
| **Story point** | Medida relativa de esfuerzo, no de horas |
| **Velocidad** | Puntos que el equipo completa por sprint |
| **RF / RNF** | Requerimiento funcional (qué hace) / no funcional (con qué calidad) |
| **Trazabilidad** | Capacidad de vincular cada elemento con su origen y destino en la cadena documental |
| **Stakeholder** | Persona u organización afectada o interesada en el proyecto |
| **Project Charter** | Acta de constitución que autoriza el proyecto y define su marco |
| **Scope creep** | Crecimiento no controlado del alcance sin ajustar plazos ni esfuerzo |
| **API REST** | Interfaz que permite a los frontends comunicarse con el backend vía HTTP |
