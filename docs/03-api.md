# 03 - API

## 1. Introduccion

Este documento describe el contrato de la API REST expuesta por el backend.
Todos los endpoints intercambian datos en formato JSON y utilizan los codigos
de estado HTTP estandar.

## 2. Convenciones generales

- URL base: `/api/v1`.
- Autenticacion: cabecera `Authorization: Bearer <token>` para los endpoints
  privados.
- Formato de fechas: ISO 8601 en UTC (`2026-05-22T14:30:00Z`).
- Errores: respuesta con el siguiente formato:

```json
{
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Descripcion legible del error",
    "detalles": []
  }
}
```

## 3. Autenticacion

### POST /auth/login

Inicia sesion y devuelve un token de acceso.

Cuerpo:

```json
{
  "email": "usuario@imsj.gob",
  "password": "secreto"
}
```

Respuesta:

```json
{
  "token": "<jwt>",
  "expira_en": "2026-05-22T18:30:00Z",
  "usuario": {
    "id": 1,
    "nombre": "Juan Perez",
    "rol": "admin"
  }
}
```

### POST /auth/logout

Invalida el token actual. Requiere autenticacion.

## 4. Novedades

### GET /novedades

Lista las novedades publicadas. Acepta los parametros `pagina` y
`por_pagina`.

### GET /novedades/{id}

Obtiene una novedad por su identificador.

### POST /novedades

Crea una novedad. Requiere rol `admin`.

### PUT /novedades/{id}

Actualiza una novedad existente. Requiere rol `admin`.

### DELETE /novedades/{id}

Elimina una novedad. Requiere rol `admin`.

## 5. Cronograma

### GET /cronograma

Lista los eventos vigentes y futuros.

### POST /cronograma

Crea un evento. Requiere rol `admin`.

### PUT /cronograma/{id}

Modifica un evento. Requiere rol `admin`.

### DELETE /cronograma/{id}

Elimina un evento. Requiere rol `admin`.

## 6. Materiales

### GET /materiales

Lista los materiales disponibles. Acepta los parametros `categoria` y
`tipo`.

### POST /materiales

Carga un nuevo material. Requiere rol `admin` y envio multipart cuando
incluye archivo.

### DELETE /materiales/{id}

Elimina un material. Requiere rol `admin`.

## 7. Preguntas frecuentes

### GET /faqs

Lista las preguntas activas, ordenadas por el campo `orden`.

### POST /faqs

Crea una nueva pregunta. Requiere rol `admin`.

### PUT /faqs/{id}

Modifica una pregunta. Requiere rol `admin`.

### DELETE /faqs/{id}

Elimina una pregunta. Requiere rol `admin`.

## 8. Usuarios administrativos

### GET /usuarios

Lista los usuarios administrativos. Requiere rol `superadmin`.

### POST /usuarios

Crea un nuevo usuario. Requiere rol `superadmin`.

### PUT /usuarios/{id}

Actualiza datos de un usuario. Requiere rol `superadmin`.

### DELETE /usuarios/{id}

Desactiva un usuario. Requiere rol `superadmin`.

## 9. Codigos de estado

| Codigo | Significado                                              |
|--------|----------------------------------------------------------|
| 200    | Operacion exitosa                                        |
| 201    | Recurso creado correctamente                             |
| 204    | Operacion exitosa sin contenido                          |
| 400    | Error de validacion en la solicitud                      |
| 401    | Falta autenticacion o token invalido                     |
| 403    | Autenticado pero sin permisos suficientes                |
| 404    | Recurso inexistente                                      |
| 409    | Conflicto con el estado actual del recurso               |
| 500    | Error inesperado del servidor                            |
