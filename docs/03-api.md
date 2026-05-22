# 03 - API REST Documentation

## Base URL
```
http://localhost:8000/api
```

## Autenticación

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@imsj.gub.uy",
  "password": "contraseña"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nombre": "Usuario",
    "email": "usuario@imsj.gub.uy",
    "rol": "admin"
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}

Response 200:
{
  "mensaje": "Sesión cerrada exitosamente"
}
```

### Me (Usuario Actual)
```
GET /auth/me
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "nombre": "Usuario",
  "email": "usuario@imsj.gub.uy",
  "rol": "admin"
}
```

## Noticias

### Crear Noticia
```
POST /noticias
Authorization: Bearer {token}
Content-Type: multipart/form-data

titulo: "Título de la noticia"
cuerpo: "Contenido..."
imagen_portada: [file]
fecha_inicio_vigencia: "2026-05-22"
fecha_fin_vigencia: "2026-06-22"

Response 201:
{
  "id": 1,
  "titulo": "...",
  "estado": "no_publicada"
}
```

### Listar Noticias Publicadas
```
GET /noticias/publicadas
Response 200: [{...}, {...}]
```

### Listar Todas las Noticias (Admin)
```
GET /noticias
Authorization: Bearer {token}
Response 200: [{...}, {...}]
```

### Obtener Noticia
```
GET /noticias/{id}
Response 200: {...}
```

### Actualizar Noticia
```
PATCH /noticias/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Nuevo título",
  "cuerpo": "Nuevo contenido"
}

Response 200: {...}
```

### Publicar Noticia
```
PATCH /noticias/{id}/publicar
Authorization: Bearer {token}
Response 200: {"estado": "publicada"}
```

### Despublicar Noticia
```
PATCH /noticias/{id}/despublicar
Authorization: Bearer {token}
Response 200: {"estado": "no_publicada"}
```

### Eliminar Noticia
```
DELETE /noticias/{id}
Authorization: Bearer {token}
Response 204: (sin contenido)
```

## Multimedia

### Subir Imagen a Noticia
```
POST /noticias/{id}/media
Authorization: Bearer {token}
Content-Type: multipart/form-data

media: [file]
tipo: "imagen"

Response 201:
{
  "id": 1,
  "url": "/storage/media/..."
}
```

### Obtener Media
```
GET /media/{id}
Response 200: (archivo)
```

### Eliminar Media
```
DELETE /media/{id}
Authorization: Bearer {token}
Response 204
```

## Franjas de Disponibilidad

### Crear Franja
```
POST /franjas
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_tramite_id": 1,
  "fecha": "2026-05-25",
  "hora_inicio": "09:00",
  "hora_fin": "10:00",
  "cupos": 5,
  "modalidad": "normal"
}

Response 201: {...}
```

### Listar Franjas Disponibles
```
GET /franjas/disponibles
Response 200: [{...}]
```

### Listar Todas las Franjas (Admin)
```
GET /franjas
Authorization: Bearer {token}
Response 200: [{...}]
```

### Actualizar Franja
```
PATCH /franjas/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "cupos": 10
}

Response 200: {...}
```

### Eliminar Franja
```
DELETE /franjas/{id}
Authorization: Bearer {token}
Response 204
```

## Agendas

### Crear Agenda
```
POST /agendas
Content-Type: application/json

{
  "ciudadano_nombre": "Juan Pérez",
  "ciudadano_documento": "12345678",
  "ciudadano_email": "juan@example.com",
  "ciudadano_telefono": "5551234567",
  "tipo_tramite_id": 1,
  "franja_id": 5,
  "modalidad": "normal"
}

Response 201:
{
  "id": 1,
  "estado": "pendiente"
}
```

### Mis Agendas
```
GET /agendas/my
Content-Type: application/json

{
  "ciudadano_documento": "12345678"
}

Response 200: [{...}]
```

### Listar Agendas (Admin)
```
GET /agendas
Authorization: Bearer {token}
Response 200: [{...}]
```

### Confirmar Agenda
```
PATCH /agendas/{id}/confirmar
Authorization: Bearer {token}
Response 200: {"estado": "confirmada"}
```

### Cancelar Agenda
```
PATCH /agendas/{id}/cancelar
Authorization: Bearer {token}
Response 200: {"estado": "cancelada"}
```

## Materiales de Estudio

### Crear Material
```
POST /materiales
Authorization: Bearer {token}
Content-Type: multipart/form-data

titulo: "Reglamento de Tránsito"
descripcion: "Descripción del material"
archivo: [file]
enlace: "https://example.com"

Response 201: {...}
```

### Listar Materiales Publicados
```
GET /materiales/publicados
Response 200: [{...}]
```

### Listar Todos los Materiales (Admin)
```
GET /materiales
Authorization: Bearer {token}
Response 200: [{...}]
```

### Actualizar Material
```
PATCH /materiales/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "publicado"
}

Response 200: {...}
```

### Eliminar Material
```
DELETE /materiales/{id}
Authorization: Bearer {token}
Response 204
```

## Preguntas Frecuentes

### Crear Pregunta
```
POST /preguntas-frecuentes
Authorization: Bearer {token}
Content-Type: application/json

{
  "pregunta": "¿Cuál es el horario de atención?",
  "respuesta": "Atendemos de 8:00 a 17:00...",
  "estado": "visible"
}

Response 201: {...}
```

### Listar Preguntas Publicadas
```
GET /preguntas-frecuentes/publicadas
Response 200: [{...}]
```

### Listar Todas las Preguntas (Admin)
```
GET /preguntas-frecuentes
Authorization: Bearer {token}
Response 200: [{...}]
```

### Actualizar Pregunta
```
PATCH /preguntas-frecuentes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "respuesta": "Nueva respuesta"
}

Response 200: {...}
```

### Eliminar Pregunta
```
DELETE /preguntas-frecuentes/{id}
Authorization: Bearer {token}
Response 204
```

## Códigos de Estado HTTP

- `200`: OK - Solicitud exitosa
- `201`: Created - Recurso creado
- `204`: No Content - Solicitud exitosa sin respuesta
- `400`: Bad Request - Validación fallida
- `401`: Unauthorized - Sin autenticación
- `403`: Forbidden - Sin permisos
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor
