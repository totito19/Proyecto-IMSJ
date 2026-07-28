# Proyecto Educación Vial IMSJ — Concepción del proyecto

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

---

# Parte 2: Entrevista con el cliente

## 1. Participantes de la entrevista

| Rol | Participante | Responsabilidad |
|---|---|---|
| Cliente / referente institucional | Inspector de tránsito de la IMSJ | Explica el proceso real y define prioridades |
| Dirección | Dirección de la Sección Tránsito | Aprueba las publicaciones antes de hacerse visibles |
| Equipo de desarrollo | Equipo de estudiantes | Releva necesidades y las transforma en requerimientos |

---

## 2. Desarrollo de la entrevista

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

1. **Confirmó la exclusión de la agenda con el cliente.** No fue una decisión del equipo: el
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
13. Interfaz pública para agendarse a trámites de libreta de conducir.
14. Interfaz administrativa de franjas de disponibilidad.
15. Prevención de doble reserva de agenda.
16. Confirmación visual de agenda para el ciudadano.

---

## 10. Alcance excluido
-Todo alcance referente a las agendas queda excluido respecto a la entrega al cliente por petición del mismo, sin embargo para poder cumplir con la complejidad del curso lo incluiremos en en la entrega a los profesores.


# Parte 4: Requerimientos del sistema


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
| RF11 | El sistema debe permitir clasificar las preguntas frecuentes por categorías. |
| RF12 | El sistema debe permitir almacenar materiales de estudio en formato PDF, imagen y video. |
| RF13 | El sistema debe requerir aprobación de la Dirección antes de que una noticia se haga visible al público. |


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

---

# Parte 5: Épicas del proyecto

## 13. Epicas
### Épicas del proyecto

| Código | Épica |
|---|---|---|
| EP1 | Acceso y control de roles | Inicio de sesión y separación de permisos entre público general y personal de IMSJ. |
| EP2 | Comunicación pública (Noticias) | Publicación y consulta de noticias, con contenido, vigencia, estado y aprobación. |
| EP3 | Materiales de estudio | Acceso del aspirante y administración de materiales en PDF, imagen y video. |
| EP4 | Preguntas frecuentes | Consulta y mantenimiento de preguntas frecuentes clasificadas por categorías. |
| EP5 | Calidad y requisitos transversales | Validaciones, historial de acciones, protección de datos, usabilidad móvil y accesibilidad. |