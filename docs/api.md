# Contrato de API IMSJ y transición a PHP sin Laravel

> **Documentación asistida por IA — 02/10/2026:** inventario leído en `backend/routes/api.php` del commit `df581ab`. Describe el código disponible, no una API probada ni un cambio de contrato aprobado. La letra de referencia y las diferencias están al final.

**CC-05, decisión del grupo:** el destino es PHP por capas con PDO, basado en `api-completa`; el código aún es Laravel. Las rutas siguientes constituyen la base de compatibilidad de la migración. La referencia tiene otro contrato; [sus diferencias](referencia_api_completa.md) se adaptarán, sin renombrar rutas o cambiar autenticación/JSON automáticamente.

## Acceso

Base local: `http://localhost:8000/api`. Las respuestas son JSON salvo eliminaciones/cierre de sesión que pueden responder sin contenido. En rutas autenticadas se envía `Authorization: Bearer <token>` y `Accept: application/json`.

Los dos frontends fijan esa dirección en `js/api.js`. Cambiar `APP_PORT` no modifica el JavaScript. El entorno actual es local; `localhost` desde otra computadora refiere a esa computadora.

**Roles actuales:** `PUBLICO_GENERAL` y `PERSONAL_IMSJ`. No existe rol `DIRECTORA` ni autorización de aprobación separada. El middleware del backend decide el acceso, aunque el HTML del dashboard pueda abrirse públicamente.

## Rutas públicas

| Método | Ruta relativa a `/api` | Operación |
|---|---|---|
| GET | `/health` | Estado del servicio; no consulta MySQL. |
| POST | `/login` | Cédula y contraseña; límite `throttle:5,1`. |
| POST | `/register` | Alta ciudadana con cédula, contraseña y confirmación; mismo límite. |
| GET | `/portal/noticias` | Noticias publicadas y vigentes. |
| GET | `/portal/materiales` | Materiales publicados. |
| GET | `/portal/preguntas` | Preguntas frecuentes publicadas. |
| GET | `/portal/prueba` | Selección de preguntas sin respuesta correcta. El servicio usa hasta 10 preguntas por defecto. |
| POST | `/portal/prueba/corregir` | Corrección de una lista `respuestas` con `pregunta_id` y `opcion` A/B/C/D; valida entre 1 y 20 elementos. |
| GET | `/franjas/disponibles` | Disponibilidad de franjas de agenda académica. |

La cantidad 10 y el máximo 20 son **valores observados de implementación**, no configuración aceptada por el cliente/docentes.

## Rutas autenticadas

| Acceso | Método | Ruta | Operación |
|---|---|---|---|
| Cualquier usuario autenticado | GET | `/me` | Perfil. |
| Cualquier usuario autenticado | POST | `/logout` | Revocar token actual. |
| Público general autenticado | POST | `/reservas` | Crear reserva académica mediante `franja_disponibilidad_id`. |
| Público general autenticado | GET | `/reservas/mias` | Reservas de la cuenta autenticada. |

## Rutas del personal IMSJ

| Método(s) | Ruta | Operación |
|---|---|---|
| GET | `/historial` | Consultar historial. |
| GET / POST | `/usuarios-admin` | Listar / dar de alta personal. |
| DELETE | `/usuarios-admin/{usuario}` | Desactivar personal; no borrar su historial. |
| GET / POST | `/preguntas-prueba` | Listar / crear preguntas del simulacro. |
| PUT / DELETE | `/preguntas-prueba/{pregunta}` | Actualizar / eliminar pregunta. |
| GET / POST | `/noticias` | Listar / crear noticia. |
| GET / PUT / DELETE | `/noticias/{noticia}` | Consultar detalle / actualizar / eliminar. |
| PATCH | `/noticias/{noticia}/estado` | Cambiar PUBLICADO/NO_PUBLICADO. |
| GET / POST | `/materiales` | Listar / crear material. |
| PUT / DELETE | `/materiales/{material}` | Actualizar / eliminar. |
| PATCH | `/materiales/{material}/estado` | Cambiar estado. |
| GET / POST | `/preguntas` | Listar / crear FAQ. |
| PUT / DELETE | `/preguntas/{pregunta}` | Actualizar / eliminar FAQ. |
| PATCH | `/preguntas/{pregunta}/estado` | Cambiar estado. |
| GET / POST | `/franjas` | Listar / crear franja académica. |
| PUT / DELETE | `/franjas/{franja}` | Actualizar / eliminar franja. |
| GET | `/agenda` | Vista `dia`, `semana` o `mes`, con parámetro `fecha`; por defecto día actual. |

## Datos y comportamiento relevantes

- El login devuelve token, vencimiento y usuario. `AuthService` emite tokens de ocho horas y revoca los anteriores al emitir uno nuevo. Los frontends guardan token y usuario en `sessionStorage`.
- Noticias: título, texto y fechas de inicio/fin; portada opcional JPG/JPEG/PNG/WEBP hasta 2048 KB, galería hasta cinco imágenes y hasta cinco enlaces HTTP/HTTPS. Son límites del código, sujetos a validación del equipo.
- Materiales: PDF hasta 10240 KB, imagen hasta 5120 KB; VIDEO usa `ubicacion_recurso` como URL HTTP/HTTPS y prohíbe archivo. Se usan formularios multipart para subir archivos.
- FAQ: pregunta, respuesta y estado; sin campo de categoría ni colección propia de enlaces útiles.
- Preguntas del simulacro: enunciado, cuatro opciones y respuesta correcta; sin campo de material gráfico. La corrección incluye totales y resultados por pregunta.
- Reservas: `ReservaService` utiliza transacción y el repositorio bloquea la franja; comprueba fecha, duplicación y cupos. La garantía bajo concurrencia en MySQL aún necesita evidencia de ejecución.
- Los errores de validación siguen el formato de Laravel con `message` y `errors`; autorización/autenticación se verifican en los middleware. No se certifican códigos de respuesta de todos los casos sin ejecutar pruebas.

Las clases de respuesta se encuentran en `backend/app/Http/Resources/`. La lógica se distribuye entre controladores, servicios y repositorios. [Verificación](verificacion.md) identifica los archivos de prueba disponibles.

## Diferencias con la referencia y solicitudes pendientes

| Referencia | Implementación observada | Pendiente de decisión/documentación |
|---|---|---|
| `/auth/login`, `/auth/logout`, `/auth/me` | `/login`, `/logout`, `/me` | Confirmar equivalencia de contrato con docentes; no se renombran rutas. |
| `/noticias/publicadas`, `/materiales/publicados`, `/preguntas-frecuentes/publicadas` | `/portal/noticias`, `/portal/materiales`, `/portal/preguntas` | Registrar equivalencias en la entrega API. |
| PATCH para editar entidades | PUT en rutas de actualización; PATCH para estados | Confirmar aceptación de la diferencia. |
| Endpoints multimedia separados | Carga integrada al formulario de noticias | Confirmar cobertura esperada de operaciones multimedia. |
| `/agendas`, `/agendas/my` | `/reservas`, `/reservas/mias`; consulta IMSJ en `/agenda` | Equivalencia de reserva y vista; no asumir que agenda y reserva son entidades nuevas. |
| Cancelar / confirmar agendas | No hay esas rutas | Validar alcance académico; no inventar estados. |
| Costo urgente y datos de contacto en la letra | Sin costo, teléfono o correo en reservas | Confirmar datos mínimos y forma de registrar costo; no se crean campos. |
| Enlaces útiles de FAQ y categorías relevadas | Sin estructura específica | RF19 y detalle de RF18 pendientes. |
| CC-02 / CC-03 / CC-04 | Sin circuito de consultas, aprobación diferenciada o gráfico del test | Solicitudes registradas, sin implementación localizada. |

Fuente: [letra IMSJ fijada a la revisión consultada](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Proyectos/proyecto_educacion_vial_IMSJ.md). Las diferencias necesitan resolución del equipo; este documento no las elimina del alcance por su cuenta.

## Contrato de compatibilidad para CC-05

**IA — Especificación derivada del código y de sus consumidores:** ejemplos documentales, no respuestas capturadas de una ejecución. Se debe verificar cada escenario en la versión PHP. El inventario comprende 42 declaraciones de rutas; agrupar métodos en tablas no reduce esa cantidad.

### Cuenta y errores

Login: POST `/api/login`, JSON con `cedula` y `password`. Registro: POST `/api/register`, con `cedula`, `password` y `password_confirmation`. El servicio actual entrega las credenciales en la raíz; los números y datos siguientes son ilustrativos:

```json
{
  "token": "<token Bearer emitido>",
  "expira_en": "<fecha ISO 8601 de vencimiento>",
  "usuario": {"id": 1, "nombre": "<nombre o null>", "cedula": "<cedula>", "rol": "PERSONAL_IMSJ"}
}
```

El perfil `/me` devuelve un objeto raíz `usuario` que conserva las claves `id`, `nombre`, `cedula`, `rol`; no expone contraseña/hash ni datos técnicos de tokens. `PUBLICO_GENERAL` es el rol del registro ciudadano. Desactivar personal conserva cuenta/historial y debe impedir operaciones que exijan personal activo. La política completa de tokens PHP y el tratamiento de sesiones existentes quedan pendientes de diseño; no se reemplaza la revocación por borrar una cookie.

Los frontends extraen el mensaje de error de `errors` o `message`:

```json
{
  "message": "<mensaje de validacion>",
  "errors": {"cedula": ["<detalle del campo>"]}
}
```

Preservar los casos de validación, acceso, inexistencia y límite de intentos con sus códigos observados y documentar excepciones comprobadas. No devolver errores SQL/trazas o copiar el 400 de todos los validadores del ejemplo como reemplazo universal del comportamiento Laravel. Un 204 no lleva cuerpo JSON: los clientes actuales lo manejan como `null`.

### Datos de salida por módulo

| Módulo | Campos de recursos actuales a preservar |
|---|---|
| Noticia | `id`, `titulo`, `texto`, `fecha_inicio_vigencia`, `fecha_fin_vigencia`, `imagen_portada` nullable, `estado`, `imagenes` con id/url, `enlaces` con id/url. |
| Material | `id`, `nombre`, `tipo`, `ubicacion_recurso` como URL, `estado`. |
| FAQ | `id`, `pregunta`, `respuesta`, `estado`. |
| Pregunta de prueba administrativa | `id`, `pregunta`, `opciones` A/B/C/D, `respuesta_correcta`. La consulta pública no debe revelar la respuesta correcta antes de corregir. |
| Franja | `id`, `fecha`, `hora_inicio`, `hora_fin`, `tipo`, `cupos_totales`, `reservas_count`, `cupos_disponibles`. |
| Reserva | `id`, alias `reserva_id`, `franja_disponibilidad_id`, fecha/horas, `tipo`, alias `tipo_tramite`, `creada_en`; `cedula` cuando se carga la relación correspondiente. |
| Historial | `id`, `accion`, `tipo_elemento`, `elemento_id`, `fecha_hora`, `usuario` con id/nombre/cedula. |

Mantener la envoltura `data` y metadatos/paginación donde los controladores actuales los producen. Conservar fechas de calendario como `YYYY-MM-DD`, horas como `HH:MM`, timestamps ISO 8601, valores null y arrays vacíos. Los recursos están en `backend/app/Http/Resources/`; el resto de las respuestas requiere lectura del controlador/servicio correspondiente y ejecución para confirmar su representación exacta.

### Rutas, cuerpo y archivos

- Adaptar el router al prefijo `/api`, placeholders de IMSJ y sufijos `/estado`; las rutas estáticas como `/reservas/mias` no deben confundirse con parámetros.
- Conservar PUT para editar y PATCH para estados. Para noticias/materiales, los frontends usan POST multipart con `_method=PUT`; la API PHP debe reconocer ese mecanismo autorizado, además de las rutas de método directo que correspondan.
- Procesar JSON y multipart según Content-Type, preservando las reglas de entrada actuales. Los nombres de campos de archivo se leen en los formularios/controladores: portada/galería de noticias y `archivo` de materiales. No convertir todos los cuerpos a JSON.
- Mantener las URLs de archivos y el uso de `ubicacion_recurso` para VIDEO. No importar los campos precio/stock/categoría de productos.
- Resolver preflight OPTIONS y CORS para el origen de los frontends; permitir Authorization, Accept, Content-Type y métodos usados. La configuración de cookies del ejemplo requiere adaptación si se preserva Bearer.

La suite Laravel disponible identifica escenarios, no valida la API PHP sin adaptarse. Ver [criterios V-CC05](verificacion.md) y [plan de migración](migracion_backend_vanilla.md). El contrato documentado no completa funciones pendientes de la letra ni CC-01–CC-04.
