# 02 - Modelado de Datos

## Diagrama Entidad-Relación (DER)

```
usuarios ──┬─→ roles
           │
           ├─→ noticias
           │
           ├─→ preguntas_frecuentes
           │
           ├─→ materiales_estudio
           │
           └─→ historial_actividad

noticias ──→ noticias_multimedia
         ──→ enlaces_utiles

franjas_disponibilidad ──→ tipos_tramite
                      ──→ agendas

agendas ──→ tipos_tramite
         ──→ franjas_disponibilidad
```

## Tablas y Campos

### usuarios
```
id (INT, PK)
nombre (VARCHAR 100)
email (VARCHAR 100, UNIQUE)
password (VARCHAR 255, HASHED)
rol_id (INT, FK)
estado (ENUM: 'activo', 'inactivo')
fecha_creacion (TIMESTAMP)
fecha_actualizacion (TIMESTAMP)
```

### roles
```
id (INT, PK)
nombre (VARCHAR 50)
descripcion (TEXT)
permisos (JSON)
```

### noticias
```
id (INT, PK)
titulo (VARCHAR 255)
cuerpo (LONGTEXT)
imagen_portada (VARCHAR 255)
fecha_inicio_vigencia (DATE)
fecha_fin_vigencia (DATE)
estado (ENUM: 'publicada', 'no_publicada', 'archivada')
usuario_id (INT, FK)
fecha_creacion (TIMESTAMP)
fecha_actualizacion (TIMESTAMP)
```

### noticias_multimedia
```
id (INT, PK)
noticia_id (INT, FK)
url_media (VARCHAR 255)
tipo_media (ENUM: 'imagen', 'video')
orden (INT)
fecha_subida (TIMESTAMP)
```

### enlaces_utiles
```
id (INT, PK)
noticias_id (INT, FK)
url (VARCHAR 255)
descripcion (VARCHAR 255)
tipo (ENUM: 'video', 'documento', 'otro')
```

### franjas_disponibilidad
```
id (INT, PK)
tipo_tramite_id (INT, FK)
fecha (DATE)
hora_inicio (TIME)
hora_fin (TIME)
cupos (INT)
cupos_disponibles (INT)
modalidad (ENUM: 'normal', 'urgente', 'manejo')
usuario_id (INT, FK)
fecha_creacion (TIMESTAMP)
```

### tipos_tramite
```
id (INT, PK)
nombre (VARCHAR 100)
descripcion (TEXT)
costo_normal (DECIMAL 10,2)
costo_urgente (DECIMAL 10,2)
```

### agendas
```
id (INT, PK)
ciudadano_nombre (VARCHAR 100)
ciudadano_documento (VARCHAR 20)
ciudadano_email (VARCHAR 100)
ciudadano_telefono (VARCHAR 20)
tipo_tramite_id (INT, FK)
franja_id (INT, FK)
modalidad (ENUM: 'normal', 'urgente')
estado (ENUM: 'pendiente', 'confirmada', 'cancelada', 'completada')
costo_especial (DECIMAL 10,2, NULLABLE)
fecha_creacion (TIMESTAMP)
fecha_confirmacion (TIMESTAMP, NULLABLE)
fecha_cancelacion (TIMESTAMP, NULLABLE)
```

### materiales_estudio
```
id (INT, PK)
titulo (VARCHAR 255)
descripcion (TEXT)
archivo (VARCHAR 255, NULLABLE)
enlace (VARCHAR 255, NULLABLE)
estado (ENUM: 'publicado', 'no_publicado')
usuario_id (INT, FK)
fecha_creacion (TIMESTAMP)
fecha_actualizacion (TIMESTAMP)
```

### preguntas_frecuentes
```
id (INT, PK)
pregunta (VARCHAR 255)
respuesta (LONGTEXT)
estado (ENUM: 'visible', 'no_visible')
usuario_id (INT, FK)
fecha_creacion (TIMESTAMP)
fecha_actualizacion (TIMESTAMP)
```

### enlaces_preguntas
```
id (INT, PK)
pregunta_id (INT, FK)
url (VARCHAR 255)
descripcion (VARCHAR 255)
tipo (ENUM: 'video', 'documento', 'otro')
```

### historial_actividad
```
id (INT, PK)
usuario_id (INT, FK)
accion (VARCHAR 255)
tabla_afectada (VARCHAR 100)
id_registro (INT)
cambios (JSON)
fecha (TIMESTAMP)
```

## Índices

```sql
-- Búsqueda rápida
CREATE INDEX idx_noticias_estado ON noticias(estado);
CREATE INDEX idx_noticias_vigencia ON noticias(fecha_inicio_vigencia, fecha_fin_vigencia);
CREATE INDEX idx_agendas_estado ON agendas(estado);
CREATE INDEX idx_agendas_franja ON agendas(franja_id);
CREATE INDEX idx_franjas_fecha ON franjas_disponibilidad(fecha);
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

## Relaciones y Constraints

- Cada noticia puede tener múltiples imágenes
- Cada franja puede tener múltiples agendas
- Cada agenda está vinculada a una franja
- No se permite eliminar franjas con agendas activas
- Solo usuarios con rol admin pueden publicar/despublicar
- Historial de cambios es inmutable
