# 02 - Modelado de datos

## 1. Introduccion

Este documento describe el modelo de datos del sistema de Educacion Vial IMSJ.
Define las entidades principales, sus atributos y las relaciones entre ellas.

## 2. Entidades principales

### 2.1 Usuario

Representa al personal administrativo con acceso al panel del IMSJ.

| Atributo        | Tipo          | Descripcion                                |
|-----------------|---------------|--------------------------------------------|
| id              | entero        | Identificador unico                        |
| nombre          | texto         | Nombre completo                            |
| email           | texto         | Direccion de correo, unica                 |
| password_hash   | texto         | Hash de la contrasena                      |
| rol             | enumerado     | `admin` o `superadmin`                     |
| activo          | booleano      | Indica si el usuario puede iniciar sesion  |
| creado_en       | timestamp     | Fecha de alta                              |

### 2.2 Novedad

Publicaciones difundidas en el sitio publico.

| Atributo        | Tipo          | Descripcion                                |
|-----------------|---------------|--------------------------------------------|
| id              | entero        | Identificador unico                        |
| titulo          | texto         | Titulo de la novedad                       |
| cuerpo          | texto largo   | Contenido en formato markdown              |
| imagen          | texto         | Ruta a la imagen asociada                  |
| publicado       | booleano      | Indica si esta visible al publico          |
| autor_id        | entero        | Referencia a `Usuario`                     |
| publicado_en    | timestamp     | Fecha de publicacion                       |

### 2.3 Cronograma

Eventos y turnos disponibles para la ciudadania.

| Atributo        | Tipo          | Descripcion                                |
|-----------------|---------------|--------------------------------------------|
| id              | entero        | Identificador unico                        |
| titulo          | texto         | Nombre del evento o turno                  |
| descripcion     | texto         | Detalle del evento                         |
| fecha_inicio    | timestamp     | Fecha y hora de inicio                     |
| fecha_fin       | timestamp     | Fecha y hora de finalizacion               |
| cupo            | entero        | Cantidad de cupos disponibles              |
| ubicacion       | texto         | Lugar fisico o modalidad                   |

### 2.4 Material

Recursos descargables de estudio.

| Atributo        | Tipo          | Descripcion                                |
|-----------------|---------------|--------------------------------------------|
| id              | entero        | Identificador unico                        |
| titulo          | texto         | Nombre del material                        |
| descripcion     | texto         | Descripcion del contenido                  |
| archivo         | texto         | Ruta al archivo almacenado                 |
| tipo            | enumerado     | `pdf`, `video`, `audio`, `enlace`          |
| categoria       | texto         | Agrupacion tematica                        |
| subido_por      | entero        | Referencia a `Usuario`                     |
| subido_en       | timestamp     | Fecha de carga                             |

### 2.5 PreguntaFrecuente

Listado de preguntas habituales con sus respuestas.

| Atributo        | Tipo          | Descripcion                                |
|-----------------|---------------|--------------------------------------------|
| id              | entero        | Identificador unico                        |
| pregunta        | texto         | Texto de la pregunta                       |
| respuesta       | texto         | Texto de la respuesta                      |
| orden           | entero        | Orden de aparicion                         |
| activa          | booleano      | Indica si se muestra al publico            |

### 2.6 Auditoria

Registro de operaciones realizadas por los administradores.

| Atributo        | Tipo          | Descripcion                                |
|-----------------|---------------|--------------------------------------------|
| id              | entero        | Identificador unico                        |
| usuario_id      | entero        | Referencia a `Usuario`                     |
| accion          | texto         | Operacion realizada                        |
| entidad         | texto         | Entidad afectada                           |
| entidad_id      | entero        | Identificador de la entidad afectada       |
| detalle         | texto         | Informacion adicional                      |
| fecha           | timestamp     | Momento de la operacion                    |

## 3. Relaciones

- Un `Usuario` puede publicar muchas `Novedad`.
- Un `Usuario` puede cargar muchos `Material`.
- Una `Auditoria` referencia un `Usuario` y opcionalmente una entidad
  identificada por `entidad` y `entidad_id`.
- `Cronograma` y `PreguntaFrecuente` no requieren relacion directa con
  `Usuario` mas alla de la auditoria correspondiente.

## 4. Consideraciones

- Todas las tablas incluyen claves primarias autoincrementales.
- Los campos de texto libre se almacenan con codificacion UTF-8.
- Las marcas temporales utilizan zona horaria UTC; el frontend realiza la
  conversion a hora local.
- Las eliminaciones logicas se priorizan sobre las fisicas cuando exista
  riesgo de perdida de informacion historica.
