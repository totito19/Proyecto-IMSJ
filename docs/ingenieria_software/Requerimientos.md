# Especificación de requisitos

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Versión:** 21/10/2026.

## 1. Introducción

### 1.1. Propósito

Definir las funciones, reglas e interfaces de Portal Vial y relacionarlas con las necesidades de la Sección Tránsito y la entrega académica.

### 1.2. Alcance

La entrega al cliente comprende información pública, materiales, preguntas frecuentes, simulacros, consultas y panel de gestión. La versión académica incorpora agenda de trámites, franjas, cupos, reservas y cancelación propia.

### 1.3. Definiciones

| Término | Significado |
|---|---|
| IMSJ | Intendencia de San José. |
| RF / RNF | Requisito funcional / no funcional. |
| US | Historia de usuario. |
| CC | Cambio controlado. |
| FAQ | Preguntas frecuentes. |
| API | Interfaz HTTP utilizada por los frontends. |

## 2. Descripción general

### 2.1. Contexto del producto

Dos interfaces HTML/CSS/JavaScript consumen una API PHP 8.5 con MySQL 8.4. Apache publica las páginas y la API desde un mismo origen; Docker Compose organiza aplicación, base y volúmenes.

### 2.2. Usuarios

| Usuario | Interacción |
|---|---|
| Ciudadanía | Consulta contenidos, utiliza el simulacro y envía mensajes. |
| Cuenta pública | Opera sus reservas académicas. |
| Personal IMSJ | Gestiona contenidos, consultas, agenda, cuentas e historial. |
| Directora | Acceso administrativo y aprobación de contenidos. |

### 2.3. Condiciones de operación

| Dato | Valor |
|---|---|
| Motor local | Docker con Compose y contenedores Linux |
| Servicios | app: Apache/PHP; db: MySQL |
| Puerto local | 8000 por defecto, configurable |
| Dominio institucional | [] |
| Alojamiento institucional | [] |
| Certificado HTTPS | [] |

## 3. Requisitos específicos

### 3.1. Requisitos funcionales

| Código | Requisito | Entrega | Estado |
|---|---|---|---|
| RF1 | El sistema debe permitir iniciar sesión con cédula y contraseña. | Cliente y académico | Implementado |
| RF2 | El sistema debe permitir consultar anuncios y noticias de la sección Tránsito. | Cliente y académico | Implementado |
| RF3 | El sistema debe permitir que los ciudadanos reserven una prueba de manejo. | Académico | Implementado |
| RF4 | El sistema debe permitir reservar la renovación de libreta normal o urgente. | Académico | Parcial |
| RF5 | El sistema debe permitir acceder a materiales de estudio. | Cliente y académico | Implementado |
| RF6 | El sistema debe permitir consultar preguntas frecuentes. | Cliente y académico | Implementado |
| RF7 | El personal debe poder crear, modificar y administrar noticias. | Cliente y académico | Implementado |
| RF8 | El personal debe poder definir el período de vigencia de una noticia. | Cliente y académico | Implementado |
| RF9 | Las noticias deben admitir portada, galería, texto y enlaces útiles. | Cliente y académico | Parcial |
| RF10 | El sistema debe permitir gestionar el estado de publicación de una noticia. | Cliente y académico | Implementado |
| RF11 | El personal debe poder cargar franjas para trámites normales. | Académico | Implementado |
| RF12 | El personal debe poder cargar franjas para trámites urgentes. | Académico | Implementado |
| RF13 | El personal debe poder cargar franjas para pruebas de manejo. | Académico | Implementado |
| RF14 | El personal debe poder consultar la agenda diaria. | Académico | Implementado |
| RF15 | El personal debe poder consultar la agenda semanal. | Académico | Implementado |
| RF16 | El personal debe poder consultar la agenda mensual. | Académico | Implementado |
| RF17 | El personal debe poder administrar materiales de estudio. | Cliente y académico | Implementado |
| RF18 | El personal debe poder mantener la sección de preguntas frecuentes. | Cliente y académico | Implementado |
| RF19 | Las preguntas frecuentes deben poder clasificarse por categorías. | Cliente y académico | Pendiente |
| RF20 | Los materiales de estudio deben admitir PDF, imágenes y videos. | Cliente y académico | Implementado con videos mediante URL |
| RF21 | Los contenidos deben ser aprobados por la Directora antes de publicarse. | Cliente y académico | Implementado |
| RF22 | El sistema debe ofrecer simulacros de pruebas teóricas. | Cliente y académico | Implementado |
| RF23 | La ciudadanía debe poder enviar consultas y el personal debe poder leerlas en el panel. | Cliente y académico | Implementado |
| RF24 | El personal debe poder adjuntar material gráfico a las preguntas de los simulacros. | Cliente y académico | Implementado |

### 3.2. Requisitos no funcionales

| Código | Requisito |
|---|---|
| RNF1 | Controlar el acceso según el tipo de usuario y su rol. |
| RNF2 | Validar los datos recibidos antes de almacenarlos. |
| RNF3 | Mantener un historial de acciones administrativas. |
| RNF4 | Proteger los datos personales. |
| RNF5 | Ofrecer una interfaz adaptable a dispositivos móviles. |
| RNF6 | Proporcionar accesibilidad básica. |
| RNF7 | Gestionar automáticamente la vigencia de las noticias. |
| RNF8 | Evitar reservas duplicadas y superar los cupos disponibles. |
| RNF9 | Mostrar una confirmación visual después de reservar. |
| RNF10 | Separar claramente los contenidos publicados de los no publicados. |

| Aspecto | Parámetro de aceptación |
|---|---|
| Dispositivos y navegadores | [] |
| Accesibilidad | [] |
| Tiempo de respuesta | [] |
| Concurrencia objetivo | [] |
| Cobertura de auditoría | [] |
| Conservación de datos | [] |
| Respaldo y recuperación | [] |

### 3.3. Reglas del dominio

- Noticias, materiales y FAQ siguen Borrador → Pendiente → Aprobado → Publicado.
- La Directora aprueba y el personal publica mediante una acción posterior.
- Editar un contenido aprobado o publicado lo devuelve a borrador.
- La consulta pública de noticias aplica estado y fechas de vigencia.
- PDF e imágenes se cargan como archivos; VIDEO utiliza una URL HTTP/HTTPS.
- El simulacro selecciona hasta diez preguntas y corrige con las respuestas del servidor.
- Las consultas reciben nombre, correo y mensaje y pueden marcarse como leídas.
- Una reserva académica relaciona una cuenta y una franja con cupo; la API rechaza duplicación y exceso de capacidad.
- La cancelación exige propiedad de la reserva y libera capacidad al eliminar la fila.

### 3.4. Interfaces

| Interfaz | Descripción |
|---|---|
| Portal público | Noticias, materiales, preguntas frecuentes, simulador, consultas y agenda académica. |
| Panel IMSJ | Gestión de contenidos, estados, consultas, personal, historial y agenda. |
| API | 46 rutas bajo /api; JSON y multipart; Bearer en operaciones protegidas. |
| Persistencia | Once tablas de dominio y auth_tokens en MySQL. |
| Archivos | PDF e imágenes almacenados fuera de la raíz pública y servidos por /storage/. |

### 3.5. Restricciones

El backend utiliza PHP nativo, PDO y carga explícita de clases, siguiendo el recorrido de api-simple. Se conserva el contrato de los frontends y la identificación RF1–RF24, RNF1–RNF10 y US1–US34. La configuración local publica en loopback y utiliza volúmenes para datos, adjuntos y caché.

## 4. Validación y trazabilidad

Cada requisito se relaciona con las historias del backlog, sus criterios y la evidencia. El resultado integral del 21/10 registra 192 comprobaciones y 46 endpoints; la auditoría API registra 43 aprobadas. La aceptación del producto se registra en reuniones del cliente.

| Dato | Valor |
|---|---|
| Revisor de requisitos | [] |
| Fecha de revisión | [] |
| Referencia de conformidad | [] |

## 5. Referencias

[Relevamiento](informe%20entrevista.md), [análisis](analisis_de_requerimientos.md), [backlog](backlog.md), [cambios](control_cambios.md) y [Especificación y modelado del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/ADA.md).
