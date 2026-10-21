# Contrato API IMSJ - PHP nativo

**Versión documental - 20/10/2026; CC-01–CC-05 Listos.** Contrato implementado en `backend/public/index.php`. El inventario incluye los 46 endpoints actuales, incluidas las tres rutas de consultas y la cancelación ciudadana.

Base local: `http://localhost:8000/api`. JSON de entrada/salida; archivos mediante multipart. En rutas protegidas: `Authorization: Bearer <token>` y `Accept: application/json`. El token se entrega en la raíz junto a `usuario` y `expira_en`; el frontend lo guarda en `sessionStorage`. Los valores concretos de ejemplos son ilustrativos.

## Acceso y respuestas

Roles: `PUBLICO_GENERAL`, `PERSONAL_IMSJ` y `DIRECTORA`. Directora hereda el acceso administrativo y es el único rol que puede aprobar noticias, materiales y preguntas frecuentes pendientes. `Auth` valida hash del token, vigencia de ocho horas, cuenta activa y rol almacenados en MySQL; iniciar sesión revoca sesiones anteriores. Logout y desactivación revocan tokens.

200: consulta/edición/corrección; 201: alta/registro/reserva; 204: eliminación/desactivación/logout, sin cuerpo; 400: JSON mal formado; 401: falta de sesión, token inválido/expirado o cuenta inactiva; 403: rol insuficiente; 404: ruta/recurso inexistente; 413: cuerpo multipart por encima del límite PHP; 422: validación o conflicto de unicidad; 429: más de cinco intentos/minuto para login o registro; 500: fallo interno, sin SQL ni secretos en la respuesta. Apache rechaza métodos no habilitados con 405; una ruta sin coincidencia en el switch devuelve 404.

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
| POST | `/portal/consultas` | publico | `ConsultaController::store` |
| GET | `/franjas/disponibles` | publico | `ReservaController::disponibles` |
| GET | `/me` | autenticado | `AuthController::me` |
| POST | `/logout` | autenticado | `AuthController::logout` |
| POST | `/reservas` | ciudadano | `ReservaController::store` |
| GET | `/reservas/mias` | ciudadano | `ReservaController::mine` |
| DELETE | `/reservas/{id}` | ciudadano propietario | `ReservaController::cancelar` |
| GET | `/historial` | personal | `UsuarioController::historial` |
| GET | `/consultas` | personal/directora | `ConsultaController::index` |
| PATCH | `/consultas/{id}/leida` | personal/directora | `ConsultaController::marcarLeida` |
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

`{id}` es un entero positivo. La suma es diez rutas públicas, dos para cualquier cuenta autenticada, tres ciudadanas y 31 del personal: 46 endpoints en total.

## Entradas y validación

- Cuenta: cédula de siete u ocho dígitos, normalizada; registro con `password` y `password_confirmation`, mínimo seis caracteres. El secreto conserva espacios y admite hasta 72 bytes por bcrypt. Alta de personal: `nombre` hasta 120 y cédula; devuelve `usuario` y `clave_inicial` con el mecanismo previo `imsj1234`.
- Noticias: `titulo` hasta 255, `texto`, `fecha_inicio_vigencia`, `fecha_fin_vigencia` (fin igual/posterior); `imagen_portada` opcional y `galeria[]` hasta cinco JPG/PNG/WEBP de 2048 KB cada una; `enlaces[]` hasta cinco URL HTTP/HTTPS. El portal filtra `PUBLICADO` y vigencia inclusiva.
- Materiales: `nombre` hasta 255 y `tipo` PDF/IMAGEN/VIDEO. PDF hasta 10240 KB, imagen hasta 5120 KB, video con URL HTTP/HTTPS hasta 2048 caracteres y sin archivo. Alta/cambio de tipo requieren el recurso correspondiente. Edición del mismo tipo permite conservarlo; el estado se cambia mediante una operación separada.
- FAQ: `pregunta` hasta 255 y `respuesta`; el estado se cambia mediante una operación separada. Prueba: `pregunta` hasta 500, `opcion_a` a `opcion_d` hasta 255, `respuesta_correcta` A/B/C/D. La consulta pública selecciona hasta diez preguntas sin la respuesta; corrección recibe `respuestas` de uno a 20 elementos distintos con `pregunta_id` y `opcion`.
- Franjas: `fecha` desde hoy, horas HH:MM con fin posterior, `tipo` PRUEBA_MANEJO/RENOVACION_NORMAL/RENOVACION_URGENTE y `cupos_totales` entre uno y 20; horario/tipo único. Reserva: solo `franja_disponibilidad_id`; el usuario se toma del token. No se puede borrar una franja con reservas.
- Agenda: `vista` dia/semana/mes y `fecha` AAAA-MM-DD; por defecto hoy/día. Semana lunes a domingo; mes completo. Historial: `limite` de uno a 50, por defecto 20.

Textos destinados a columnas TEXT se rechazan si superan 65535 bytes; no se truncan. Fechas civiles: Uruguay; timestamps SQL: UTC. Las cantidades del test son comportamiento conservado, conforme al comportamiento implementado.

## Formularios, archivos y CORS

Además de PUT JSON y multipart nativo, se conserva **POST multipart con `_method=PUT`**, usado por ambos formularios del panel para editar noticias/materiales. Son variantes de transporte de los endpoints PUT, no nuevas rutas.

`/storage/<ruta>` sirve PDF/imágenes validados fuera de `public/`; los nombres son aleatorios. Las URL de archivos se construyen con `APP_URL`. Solo esos tipos se sirven; se comprueba que la ruta resuelta siga dentro del almacenamiento. El formulario global admite 24 MB. OPTIONS responde 204 para los orígenes configurados; un preflight de origen ajeno devuelve 403. CORS no reemplaza autenticación.

## Reglas vigentes

Noticias, materiales y preguntas frecuentes siguen `BORRADOR → PENDIENTE → APROBADO → PUBLICADO`. El personal puede preparar, enviar a revisión y publicar contenido aprobado; solo Directora puede aprobar. Editar el contenido lo devuelve a borrador. El portal acepta consultas con nombre, correo y mensaje; el panel permite leerlas y marcarlas como leídas. Las preguntas del simulador admiten una imagen opcional que se muestra sin revelar la respuesta correcta.

No se crean rutas del ejemplo de productos ni se adoptan JWT/cookies o `datos`/`mensaje`.  La cancelación ciudadana se incorporó posteriormente. Agenda y reservas son académicas.

La relación con la [letra académica](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Proyectos/proyecto_educacion_vial_IMSJ.md) y los resultados técnicos se documentan en [verificación](../evidencias/verificacion.md).

## Cancelación y consulta de agenda

La cancelación no recibe un ID de usuario en el cuerpo. `Auth` exige `PUBLICO_GENERAL` y el repositorio ejecuta DELETE con el ID de reserva y la cuenta autenticada. El éxito devuelve 204 sin JSON; reserva inexistente o ajena devuelve 404. El registro se elimina físicamente, por lo que el cupo se libera al recalcular el número de reservas.

`GET /reservas/mias`, los listados de franjas y `GET /agenda` excluyen fechas anteriores a hoy. El filtro también se aplica a personal, además del intervalo día/semana/mes solicitado. No existe una ruta alternativa de historial de reservas ni una operación de reprogramación automática.

## Recorridos y efectos persistentes

| Operación | Validación y autorización | Efecto |
|---|---|---|
| Login / logout | Credenciales o token válido; límite de intentos en ingreso. | Emitir y revocar sesiones en `auth_tokens`. |
| Crear o editar contenido | Cuenta administrativa, campos y adjuntos permitidos. | Datos y auditoría; editar contenido validado devuelve a borrador. |
| Cambiar estado | Transición permitida y Directora para aprobación. | Estado e historial; publicar habilita la consulta pública correspondiente. |
| Corregir prueba | IDs y opciones válidos, sin duplicar preguntas. | Calcular resultado con la respuesta almacenada; no persiste una calificación académica. |
| Enviar consulta / marcar leída | Campos públicos válidos; personal para gestionar lectura. | Crear la consulta o actualizar su marca de lectura. |
| Reservar / cancelar | Cuenta ciudadana, cupo/duplicación o propiedad según acción. | Crear o eliminar la relación usuario/franja. |

El [análisis de requisitos](../../docs/ingenieria_software/analisis_de_requerimientos.md) explica el alcance y la [justificación de clases](../../docs/programacion_full_stack/Justificación%20de%20clases,%20atributos%20y%20métodos.md) identifica los métodos de cada capa.

## Parámetros de operación

| Dato | Valor |
|---|---|
| Política institucional de cuentas | [] |
| Conservación de consultas | [] |
| Dominio y HTTPS | [] |
