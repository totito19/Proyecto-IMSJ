# Pasaje del MER al modelo relacional

Este documento mantiene separado el **modelo conceptual** del **modelo relacional**. El MER se encuentra en [MER.png](MER.png) y el resultado del pasaje en [Pasaje_a_tablas.png](Pasaje_a_tablas.png).

## Reglas aplicadas

- Cada entidad se transforma en una tabla.
- El atributo identificador de cada entidad se transforma en su clave primaria (`PK`).
- En las relaciones `1:N`, la clave de la entidad del lado `1` se incorpora como clave foránea (`FK`) en la tabla del lado `N`.
- La entidad asociativa **RESERVA** se transforma en la tabla `reservas`.
- Las relaciones `USUARIO 1:N RESERVA` y `FRANJA DE DISPONIBILIDAD 1:N RESERVA` incorporan `usuario_id` y `franja_disponibilidad_id` como claves foráneas.
- Los atributos multivaluados de una noticia se separan en `noticia_imagenes` y `noticia_enlaces`.
- `auth_tokens` es una tabla técnica de autenticación. No representa una entidad del dominio y por eso no aparece en el MER conceptual.
- `RESERVA.fecha_reserva` se implementa mediante `reservas.created_at`; los demás `created_at` y `updated_at` son atributos técnicos del modelo relacional.

## Tablas resultantes

```text
USUARIOS(
    id PK,
    nombre,
    cedula UK,
    password,
    rol,
    activo,
    created_at,
    updated_at
)

FRANJAS_DISPONIBILIDAD(
    id PK,
    fecha,
    hora_inicio,
    hora_fin,
    tipo,
    cupos_totales,
    created_at,
    updated_at,
    UK(fecha, hora_inicio, hora_fin, tipo)
)

RESERVAS(
    id PK,
    usuario_id FK -> USUARIOS.id,
    franja_disponibilidad_id FK -> FRANJAS_DISPONIBILIDAD.id,
    created_at,
    updated_at,
    UK(usuario_id, franja_disponibilidad_id)
)

HISTORIAL_ACCIONES(
    id PK,
    usuario_id FK -> USUARIOS.id,
    accion,
    tipo_elemento,
    elemento_id,
    fecha_hora
)

NOTICIAS(
    id PK,
    titulo,
    texto,
    fecha_inicio_vigencia,
    fecha_fin_vigencia,
    imagen_portada,
    estado,
    created_at,
    updated_at
)

NOTICIA_IMAGENES(
    id PK,
    noticia_id FK -> NOTICIAS.id,
    ubicacion,
    created_at,
    updated_at
)

NOTICIA_ENLACES(
    id PK,
    noticia_id FK -> NOTICIAS.id,
    url,
    created_at,
    updated_at
)

MATERIALES_ESTUDIO(
    id PK,
    nombre,
    tipo,
    ubicacion_recurso,
    estado,
    created_at,
    updated_at
)

PREGUNTAS_FRECUENTES(
    id PK,
    pregunta,
    respuesta,
    estado,
    created_at,
    updated_at
)

PREGUNTAS_PRUEBA(
    id PK,
    pregunta,
    imagen,
    opcion_a,
    opcion_b,
    opcion_c,
    opcion_d,
    respuesta_correcta,
    created_at,
    updated_at
)

CONSULTAS(
    id PK,
    nombre,
    email,
    mensaje,
    leida,
    created_at,
    updated_at
)

AUTH_TOKENS(
    id PK,
    usuario_id FK -> USUARIOS.id,
    token_hash UK,
    expires_at,
    created_at
)
```

Los nombres, tipos de datos y restricciones ejecutables se encuentran en [`backend/database.sql`](../../../backend/database.sql), que es la fuente de verdad del esquema físico.

## Integridad de las relaciones

| Relación o restricción | Implementación y efecto |
|---|---|
| Usuario → reservas | `reservas.usuario_id` exige una cuenta existente. Borrar una cuenta referenciada no es parte del procedimiento normal. |
| Franja → reservas | `franja_disponibilidad_id` exige una franja existente; la aplicación rechaza borrar una franja con reservas. |
| Usuario + franja | La clave única impide que una cuenta repita la reserva de la misma franja. El bloqueo transaccional comprueba además el cupo global. |
| Noticia → imágenes/enlaces | Las claves foráneas identifican su noticia y eliminan las filas dependientes en cascada cuando se elimina la noticia. |
| Usuario → historial | Conserva la identidad de quien realizó la acción. `tipo_elemento` y `elemento_id` identifican el recurso afectado, sin una FK a cada tipo de contenido. |
| Usuario → tokens | La sesión pertenece a una cuenta; el borrado de la cuenta elimina sus tokens en cascada. Vencimiento y revocación se comprueban en la aplicación. |

## Campos derivados y decisiones de almacenamiento

El cupo disponible no se almacena como una segunda cifra que deba sincronizarse: se calcula desde `cupos_totales` y el número de reservas. Fecha, horario y tipo que presenta una reserva se obtienen de su franja. La cédula que usa el personal se obtiene de la cuenta relacionada.

Los adjuntos se guardan fuera de la base. Sus columnas contienen rutas o URL, y los modelos construyen la representación pública correspondiente. La imagen opcional del simulador puede ser nula; las respuestas correctas permanecen en la base y se excluyen de la consulta pública inicial.

Las fechas civiles se interpretan en la zona de Uruguay y las marcas de tiempo se gestionan en UTC. Los campos `created_at` y `updated_at` conservan las marcas temporales de los registros.

La cancelación elimina la fila de `reservas` y la disponibilidad se recalcula con la ocupación actual.

| Dato | Valor |
|---|---|
| Catálogo de categorías | [] |
| Costo de trámite urgente | [] |
| Plazo de conservación | [] |
