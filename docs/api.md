# Contrato API IMSJ - PHP nativo

**Versión de trabajo - 05/10/2026; CC-05.** Contrato leído en los consumidores existentes, reimplementado en `backend/public/index.php` y comprobado mediante HTTP/MySQL. La documentación fue preparada con apoyo externo de IA; revisión de Juan Robaina pendiente. [Flujo individual de los 42 endpoints](flujo_endpoints_backend.md).

Base local: `http://localhost:8000/api`. JSON de entrada/salida; archivos mediante multipart. En rutas protegidas: `Authorization: Bearer <token>` y `Accept: application/json`. El token se entrega en la raíz junto a `usuario` y `expira_en`; el frontend lo guarda en `sessionStorage`. Los valores concretos de ejemplos son ilustrativos.

## Acceso y respuestas

Roles conservados: `PUBLICO_GENERAL` y `PERSONAL_IMSJ`. `Auth` valida hash del token, vigencia de ocho horas, cuenta activa y rol almacenado en MySQL; iniciar sesión revoca sesiones anteriores. Logout y desactivación revocan tokens. Las sesiones anteriores a la reescritura requieren nuevo login.

200: consulta/edición/corrección; 201: alta/registro/reserva; 204: eliminación/desactivación/logout, sin cuerpo; 400: JSON mal formado; 401: falta de sesión, token inválido/expirado o cuenta inactiva; 403: rol insuficiente; 404: ruta/recurso inexistente; 413: cuerpo multipart por encima del límite PHP; 422: validación o conflicto de unicidad; 429: más de cinco intentos/minuto para login o registro; 500: fallo interno, sin SQL ni secretos en la respuesta. Ruta y método sin coincidencia en el switch devuelven 404.

Errores de campo: `{"message":"Los datos no son válidos.","errors":{"campo":["detalle"]}}`. Un conflicto SQL concurrente puede devolver 422 con `message` sin `errors`. Los clientes aceptan ambas formas. No hay envoltorio `data` o `datos`.

## Inventario

| Método | Ruta relativa a `/api` | Acceso | Controlador/método |
|---|---|---|---|
| GET | `/health` | publico | Response directa |
| POST | `/login` | publico | `AuthController::login` |
| POST | `/register` | publico | `AuthController::register` |
| GET | `/portal/noticias` | publico | `NoticiaController::publicIndex` |
| GET | `/portal/materiales` | publico | `MaterialController::publicIndex` |
| GET | `/portal/preguntas` | publico | `PreguntaController::publicIndex` |
| GET | `/portal/prueba` | publico | `PruebaController::publicIndex` |
| POST | `/portal/prueba/corregir` | publico | `PruebaController::corregir` |
| GET | `/franjas/disponibles` | publico | `ReservaController::disponibles` |
| GET | `/me` | autenticado | `AuthController::me` |
| POST | `/logout` | autenticado | `AuthController::logout` |
| POST | `/reservas` | ciudadano | `ReservaController::store` |
| GET | `/reservas/mias` | ciudadano | `ReservaController::mine` |
| GET | `/historial` | personal | `UsuarioController::historial` |
| GET | `/usuarios-admin` | personal | `UsuarioController::index` |
| POST | `/usuarios-admin` | personal | `UsuarioController::store` |
| DELETE | `/usuarios-admin/{id}` | personal | `UsuarioController::destroy` |
| GET | `/preguntas-prueba` | personal | `PruebaController::index` |
| POST | `/preguntas-prueba` | personal | `PruebaController::store` |
| PUT | `/preguntas-prueba/{id}` | personal | `PruebaController::update` |
| DELETE | `/preguntas-prueba/{id}` | personal | `PruebaController::destroy` |
| GET | `/noticias` | personal | `NoticiaController::index` |
| POST | `/noticias` | personal | `NoticiaController::store` |
| GET | `/noticias/{id}` | personal | `NoticiaController::show` |
| PUT | `/noticias/{id}` | personal | `NoticiaController::update` |
| PATCH | `/noticias/{id}/estado` | personal | `NoticiaController::updateEstado` |
| DELETE | `/noticias/{id}` | personal | `NoticiaController::destroy` |
| GET | `/materiales` | personal | `MaterialController::index` |
| POST | `/materiales` | personal | `MaterialController::store` |
| PUT | `/materiales/{id}` | personal | `MaterialController::update` |
| PATCH | `/materiales/{id}/estado` | personal | `MaterialController::updateEstado` |
| DELETE | `/materiales/{id}` | personal | `MaterialController::destroy` |
| GET | `/preguntas` | personal | `PreguntaController::index` |
| POST | `/preguntas` | personal | `PreguntaController::store` |
| PUT | `/preguntas/{id}` | personal | `PreguntaController::update` |
| PATCH | `/preguntas/{id}/estado` | personal | `PreguntaController::updateEstado` |
| DELETE | `/preguntas/{id}` | personal | `PreguntaController::destroy` |
| GET | `/franjas` | personal | `ReservaController::franjas` |
| POST | `/franjas` | personal | `ReservaController::crearFranja` |
| PUT | `/franjas/{id}` | personal | `ReservaController::actualizarFranja` |
| DELETE | `/franjas/{id}` | personal | `ReservaController::eliminarFranja` |
| GET | `/agenda` | personal | `ReservaController::agenda` |

`{id}` es un entero positivo. La suma es nueve rutas públicas, dos para cualquier cuenta autenticada, dos ciudadanas y 29 del personal. Consultar [flujos](flujo_endpoints_backend.md) para entradas, tablas, validaciones y salida por ruta.

## Entradas y límites conservados

- Cuenta: cédula de siete u ocho dígitos, normalizada; registro con `password` y `password_confirmation`, mínimo seis caracteres. El secreto conserva espacios y admite hasta 72 bytes por bcrypt. Alta de personal: `nombre` hasta 120 y cédula; devuelve `usuario` y `clave_inicial` con el mecanismo previo `imsj1234`. Su política definitiva sigue pendiente.
- Noticias: `titulo` hasta 255, `texto`, `fecha_inicio_vigencia`, `fecha_fin_vigencia` (fin igual/posterior); `imagen_portada` opcional y `galeria[]` hasta cinco JPG/PNG/WEBP de 2048 KB cada una; `enlaces[]` hasta cinco URL HTTP/HTTPS. El portal filtra `PUBLICADO` y vigencia inclusiva.
- Materiales: `nombre` hasta 255 y `tipo` PDF/IMAGEN/VIDEO. PDF hasta 10240 KB, imagen hasta 5120 KB, video con URL HTTP/HTTPS hasta 2048 caracteres y sin archivo. Alta/cambio de tipo requieren el recurso correspondiente. Edición del mismo tipo permite conservarlo.
- FAQ: `pregunta` hasta 255 y `respuesta`; estado mediante operación separada. Prueba: `pregunta` hasta 500, `opcion_a` a `opcion_d` hasta 255, `respuesta_correcta` A/B/C/D. La consulta pública selecciona hasta diez preguntas sin la respuesta; corrección recibe `respuestas` de uno a 20 elementos distintos con `pregunta_id` y `opcion`.
- Franjas: `fecha` desde hoy, horas HH:MM con fin posterior, `tipo` PRUEBA_MANEJO/RENOVACION_NORMAL/RENOVACION_URGENTE y `cupos_totales` entre uno y 20; horario/tipo único. Reserva: solo `franja_disponibilidad_id`; el usuario se toma del token. No se puede borrar una franja con reservas.
- Agenda: `vista` dia/semana/mes y `fecha` AAAA-MM-DD; por defecto hoy/día. Semana lunes a domingo; mes completo. Historial: `limite` de uno a 50, por defecto 20.

Textos destinados a columnas TEXT se rechazan si superan 65535 bytes; no se truncan. Fechas civiles: Uruguay; timestamps SQL: UTC. Las cantidades del test son comportamiento conservado, sin afirmar aprobación de criterios de CC-01.

## Formularios, archivos y CORS

Además de PUT JSON y multipart nativo, se conserva **POST multipart con `_method=PUT`**, usado por ambos formularios del panel para editar noticias/materiales. Son variantes de transporte de los endpoints PUT, no nuevas rutas.

`/storage/<ruta>` sirve PDF/imágenes validados fuera de `public/`; los nombres son aleatorios. Las URL de archivos se construyen con `APP_URL`. Solo esos tipos se sirven; se comprueba que la ruta resuelta siga dentro del almacenamiento. El formulario global admite 24 MB. OPTIONS responde 204 para los orígenes configurados; un preflight de origen ajeno devuelve 403. CORS no reemplaza autenticación.

## Diferencias y pendientes

No se crean rutas del ejemplo de productos ni se adoptan JWT/cookies o `datos`/`mensaje`. Conservados los estados PUBLICADO/NO_PUBLICADO y los dos roles existentes. Consultas, Directora, aprobación diferenciada, categorías y gráficos del test siguen pendientes. Cancelación, confirmación de agenda, costo urgente y nuevos campos de contacto no se incorporan por esta reescritura. Agenda y reservas son académicas.

Las equivalencias frente a la [letra académica](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Proyectos/proyecto_educacion_vial_IMSJ.md) y la aceptación de PHP nativo corresponden al equipo/docentes. Las pruebas no acreditan aceptación institucional; [resultados y límites](verificacion.md).
