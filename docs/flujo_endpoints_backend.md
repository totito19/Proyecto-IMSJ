# Flujo de los 42 endpoints del backend IMSJ

**05/10/2026 - CC-05, versión PHP nativa.** Documento preparado con apoyo externo de IA; revisión interna de Juan Robaina pendiente. Crédito y responsabilidad del proyecto: Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales.

Recorrido del ejemplo simple: HTTP → public/index.php → controlador → servicio → repositorio → PDO/MySQL → modelo → Response. Auth verifica acceso en el controlador; Solicitud valida entradas; Database revierte transacciones antes de responder errores.

Agenda/reservas son académicas. CC-01 a CC-04 siguen pendientes para entrega real. Ejemplos/llaves abreviadas son didácticos, no datos de reuniones ni aceptación. Las reglas indicadas provienen del código actual; no sustituyen decisiones pendientes del equipo.

[PDF con identidad RC5](flujo_endpoints_backend.pdf). [Arranque](../backend/README.md), [contrato](api.md), [referencia](referencia_api_simple.md), [evidencia](verificacion.md).

## Guía de lectura

Cada ficha identifica método/ruta, acceso, entrada, recorrido por métodos, tablas, salida HTTP y condiciones de error. GET consulta; POST crea o ejecuta una acción; PUT edita; PATCH cambia estado; DELETE elimina/desactiva. GET /storage y OPTIONS son soporte HTTP, no se cuentan entre las 42 rutas API.

El panel conserva POST multipart con _method=PUT para noticias/materiales. PHP 8.5 admite también PUT multipart con request_parse_body(). Los adjuntos se validan por contenido, reciben nombres aleatorios y se guardan fuera de public. El límite global multipart es 24 MB.

Sesión Bearer opaca id|secreto: SHA-256 en auth_tokens, ocho horas, cuenta/rol revalidados. Un nuevo login revoca los tokens anteriores; logout/desactivación los elimina. Las sesiones del backend anterior requieren login nuevamente.

## 01. GET /api/health

Comprobar que la entrada PHP responde.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php identifica GET health y llama directamente a Response::json. No hay controlador, servicio, repositorio ni consulta SQL. |
| Tablas | Sin consulta de base de datos. |
| Salida | 200, {"status":"ok"}. |
| Reglas y efectos | No acredita que MySQL esté conectado o que el sistema esté listo para operar. |
| Errores | 404 si método/ruta no coinciden. El health no detecta fallos de MySQL. |

## 02. POST /api/login

Iniciar sesión conservando cédula, Bearer y perfil usados por ambos frontends.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | JSON: cedula (7 u 8 dígitos, admite separadores) y password. Se conserva el secreto sin recortar espacios; hasta 72 bytes por bcrypt. |
| Flujo | public/index.php → AuthController::login → Auth::limitAttempts(login) → validación → AuthService::login → UsuarioRepository::buscarCedula/bloquear → password_verify → AuthRepository::revocarTodos/crear → Response. |
| Tablas | usuarios y auth_tokens |
| Salida | 200, {token, expira_en, usuario:{id,nombre,cedula,rol}}. |
| Reglas y efectos | Transacción: emitir un secreto aleatorio de 32 bytes, guardar solo SHA-256 y revocar sesiones anteriores. Vigencia de ocho horas, vencimiento ISO 8601. |
| Errores | 400 JSON mal formado; 422 credenciales inválidas/cuenta inactiva; 429 más de cinco intentos en 60 segundos; 500 SQL. |

## 03. POST /api/register

Crear una cuenta ciudadana y emitir su primera sesión.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | JSON: cedula, password (mínimo 6 caracteres y máximo 72 bytes), password_confirmation idéntico. Un rol enviado por el cliente no modifica el rol ciudadano. |
| Flujo | public/index.php → AuthController::register → límite de intentos/validación → AuthService::register → UsuarioRepository::buscarCedula/crear → password_hash bcrypt → AuthRepository::revocarTodos/crear → Response. |
| Tablas | usuarios y auth_tokens |
| Salida | 201, {token, expira_en, usuario}; nombre puede ser null y rol PUBLICO_GENERAL. |
| Reglas y efectos | Alta y sesión en la misma transacción. La cédula es única. Cinco intentos/minuto por IP para registro, separado del contador de login. |
| Errores | 400 JSON inválido; 422 cédula repetida o datos/confirmación inválidos; 429 límite; 500 SQL. |

## 04. GET /api/portal/noticias

Listar contenidos visibles para la ciudadanía.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → NoticiaController::publicIndex → acceso/validación → NoticiaService::listar → NoticiaRepository::listar → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces |
| Salida | 200, {noticias:[…]}. |
| Reglas y efectos | Solo PUBLICADO; noticias además dentro de vigencia inclusiva. |
| Errores | 500 ante un fallo interno o de MySQL, salvo health. |

## 05. GET /api/portal/materiales

Listar contenidos visibles para la ciudadanía.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → MaterialController::publicIndex → acceso/validación → MaterialService::listar → MaterialRepository::listar → Material::toArray/Response. |
| Tablas | materiales_estudio |
| Salida | 200, {materiales:[…]}. |
| Reglas y efectos | Solo PUBLICADO; noticias además dentro de vigencia inclusiva. |
| Errores | 500 ante un fallo interno o de MySQL, salvo health. |

## 06. GET /api/portal/preguntas

Listar contenidos visibles para la ciudadanía.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → PreguntaController::publicIndex → acceso/validación → PreguntaService::listar → PreguntaRepository::listar → Pregunta::toArray/Response. |
| Tablas | preguntas_frecuentes |
| Salida | 200, {preguntas:[…]}. |
| Reglas y efectos | Solo PUBLICADO; noticias además dentro de vigencia inclusiva. |
| Errores | 500 ante un fallo interno o de MySQL, salvo health. |

## 07. GET /api/portal/prueba

Obtener el cuestionario público sin revelar respuestas correctas.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → PruebaController::publicIndex → PruebaService::publica → PruebaRepository::aleatorias → SELECT ORDER BY RAND() LIMIT 10 → Prueba::toArray(false) → Response. |
| Tablas | preguntas_prueba |
| Salida | 200, {preguntas:[{id,pregunta,opciones:{A,B,C,D}},…]}. |
| Reglas y efectos | Hasta diez preguntas según el banco existente; no acredita criterios acordados para cerrar CC-01. |
| Errores | 500 ante un fallo interno o de MySQL, salvo health. |

## 08. POST /api/portal/prueba/corregir

Corregir las respuestas contra el banco almacenado.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | JSON: respuestas, lista de 1–20 objetos {pregunta_id, opcion}. Identificadores distintos, existentes y opciones A/B/C/D. |
| Flujo | public/index.php → PruebaController::corregir → validación de lista → PruebaService::corregir → PruebaRepository::buscar por pregunta → comparación con respuesta_correcta SQL → Response. |
| Tablas | preguntas_prueba |
| Salida | 200, {total,correctas,resultados:[{pregunta_id,correcta,respuesta_correcta},…]}. |
| Reglas y efectos | No guarda un resultado personal ni acepta un campo enviado como respuesta correcta. No agrega duración, nota de aprobación o adjuntos. |
| Errores | 400 JSON inválido; 422 lista/identificador/opción inválidos o pregunta repetida; 500 SQL. |

## 09. GET /api/franjas/disponibles

Consultar disponibilidad pública futura con cupos.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Público: sin token. |
| Entrada | Query tipo opcional con uno de los tres tipos de trámite. |
| Flujo | public/index.php → ReservaController::disponibles → acceso/validación → ReservaService::franjas → ReservaRepository::franjas → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas |
| Salida | 200, {franjas:[{id,fecha,hora_inicio,hora_fin,tipo,cupos_totales,cupos_disponibles},…]}. |
| Reglas y efectos | El repositorio cuenta reservas por franja; la consulta pública filtra fecha desde hoy y cupos disponibles positivos. |
| Errores | 500 ante un fallo interno o de MySQL, salvo health. 422 si el filtro de tipo es inválido. |

## 10. GET /api/me

Consultar el perfil de la cuenta que presenta el token.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido de cualquier rol, cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → AuthController::me → Auth::requireUser → AuthRepository::buscarToken → UsuarioRepository::buscar → Usuario::toArray → Response. No interviene AuthService. |
| Tablas | usuarios y auth_tokens |
| Salida | 200, {usuario:{id,nombre,cedula,rol}}; sin hash o datos internos del token. |
| Reglas y efectos | Se revalidan hash, vencimiento y cuenta activa; el perfil no se toma del sessionStorage del navegador. |
| Errores | 401 si la sesión es inválida. |

## 11. POST /api/logout

Revocar la sesión utilizada en la petición.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido de cualquier rol, cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → AuthController::logout → Auth::requireUser → AuthService::logout → AuthRepository::revocar(tokenId) → DELETE auth_tokens → Response::empty. |
| Tablas | usuarios y auth_tokens |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | Después del cierre, el mismo Bearer devuelve 401. Borrar la sesión del navegador por sí solo no revoca el token del servidor. |
| Errores | 401 si la sesión es inválida. |

## 12. POST /api/reservas

Reservar un cupo académico para la cuenta ciudadana autenticada.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PUBLICO_GENERAL y cuenta activa. |
| Entrada | JSON: franja_disponibilidad_id, entero positivo. El usuario_id se obtiene del token y no del cuerpo. |
| Flujo | public/index.php → ReservaController::store → acceso/validación → ReservaService::reservar → ReservaRepository::franja con bloqueo/duplicada/crearReserva → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas |
| Salida | 201, {reserva:{id,reserva_id,franja_disponibilidad_id,fecha,hora_inicio,hora_fin,tipo,tipo_tramite,creada_en}}. |
| Reglas y efectos | Transacción: SELECT FOR UPDATE en franja, comprobar existencia/fecha/duplicación/cupo, insertar y commit. Si dos procesos disputan el último cupo, solo uno reserva. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 id inexistente, fecha vencida, duplicación o falta de cupos. |

## 13. GET /api/reservas/mias

Listar únicamente las reservas de la cuenta ciudadana autenticada.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PUBLICO_GENERAL y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → ReservaController::mine → acceso/validación → ReservaService::propias → ReservaRepository::propias → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas |
| Salida | 200, {reservas:[…]}, con fechas/horas/tipo y creada_en. |
| Reglas y efectos | El filtro usuario_id proviene del token; no se acepta seleccionar otra persona en query/body. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 14. GET /api/historial

Consultar las acciones administrativas más recientes.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Query limite opcional, entero 1–50 (por defecto 20). |
| Flujo | public/index.php → UsuarioController::historial → Auth/validación → UsuarioService::historial → UsuarioRepository::historial → SELECT con usuario y LIMIT entero → Response. |
| Tablas | usuarios e historial_acciones |
| Salida | 200, {acciones:[…]} con usuario, acción, tipo de elemento, id afectado y fecha. |
| Reglas y efectos | Solo lectura; una eliminación conserva su referencia en historial aunque el contenido ya no exista. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 límite no válido. |

## 15. GET /api/usuarios-admin

Listar integrantes del personal que conservan acceso activo.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → UsuarioController::index → Auth::requireUser(personal) → UsuarioService::listar → UsuarioRepository::personal → Usuario/Response. |
| Tablas | usuarios e historial_acciones |
| Salida | 200, {usuarios:[{id,nombre,cedula,created_at},…]}. |
| Reglas y efectos | Filtra PERSONAL_IMSJ y activo=1; no expone contraseñas o tokens. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 16. POST /api/usuarios-admin

Crear o reactivar una cuenta de personal desde el panel.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | JSON: nombre no vacío (≤120) y cedula normalizada de 7 u 8 dígitos. |
| Flujo | public/index.php → UsuarioController::store → Auth::requireUser(personal) → UsuarioService::crear → UsuarioRepository::bloquearPersonal/buscarCedula/crear o reactivar/registrar → Usuario/Response. |
| Tablas | usuarios e historial_acciones |
| Salida | 201, {usuario:{id,nombre,cedula}, clave_inicial:"imsj1234"}. |
| Reglas y efectos | Conserva la clave inicial del comportamiento anterior. Transacción con auditoría; no convierte una cuenta ciudadana en personal. Reactivar revoca sesiones anteriores. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 si cédula pertenece a ciudadanía o personal ya activo. |

## 17. DELETE /api/usuarios-admin/{id}

Desactivar personal sin eliminar su historia o reservas.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → UsuarioController::destroy → Auth::requireUser(personal) → UsuarioService::desactivar → UsuarioRepository::bloquearPersonal/buscar/desactivar/registrar → Usuario/Response. |
| Tablas | usuarios e historial_acciones |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | Transacción: exige cuenta de personal activa, impide quitar acceso propio/último integrante, revoca sus tokens y conserva referencias históricas. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 integrante activo inexistente; 422 acceso propio/último personal. |

## 18. GET /api/preguntas-prueba

Listar todos los elementos del módulo para el personal.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → PruebaController::index → acceso/validación → PruebaService::listar → PruebaRepository::listar → Prueba::toArray/Response. |
| Tablas | preguntas_prueba |
| Salida | 200, {preguntas:[…]}. |
| Reglas y efectos | Banco completo con la respuesta correcta para el personal; no modifica preguntas. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 19. POST /api/preguntas-prueba

Crear un elemento del módulo.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | pregunta (≤500), opcion_a a opcion_d (≤255 cada una) y respuesta_correcta A/B/C/D. |
| Flujo | public/index.php → PruebaController::store → acceso/validación → PruebaService::guardar → PruebaRepository::crear → Prueba::toArray/Response. |
| Tablas | preguntas_prueba; historial_acciones (UsuarioRepository::registrar) |
| Salida | 201, {pregunta:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Banco de preguntas base; no incorpora gráficos de CC-04. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 20. PUT /api/preguntas-prueba/{id}

Editar los datos del elemento existente.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | pregunta (≤500), opcion_a a opcion_d (≤255 cada una) y respuesta_correcta A/B/C/D. |
| Flujo | public/index.php → PruebaController::update → acceso/validación → PruebaService::guardar → PruebaRepository::buscar/actualizar → Prueba::toArray/Response. |
| Tablas | preguntas_prueba; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {pregunta:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Banco de preguntas base; no incorpora gráficos de CC-04. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 21. DELETE /api/preguntas-prueba/{id}

Eliminar un elemento y mantener constancia en historial.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → PruebaController::destroy → acceso/validación → PruebaService::eliminar → PruebaRepository::buscar/eliminar → Prueba::toArray/Response. |
| Tablas | preguntas_prueba; historial_acciones (UsuarioRepository::registrar) |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | El servicio registra ELIMINAR y borra en la misma transacción. No elimina el registro de auditoría. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 id inexistente. |

## 22. GET /api/noticias

Listar todos los elementos del módulo para el personal.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → NoticiaController::index → acceso/validación → NoticiaService::listar → NoticiaRepository::listar → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces |
| Salida | 200, {noticias:[…]}. |
| Reglas y efectos | Incluye elementos no publicados; no altera su estado. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 23. POST /api/noticias

Crear un elemento del módulo.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | titulo (≤255), texto, fecha_inicio_vigencia y fecha_fin_vigencia (AAAA-MM-DD). Opcionales: imagen_portada, galeria[] (≤5), enlaces[] (≤5 HTTP/HTTPS). Imágenes JPG/PNG/WEBP ≤2048 KB cada una. |
| Flujo | public/index.php → NoticiaController::store → acceso/validación → NoticiaService::guardar → NoticiaRepository::crear → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces; historial_acciones (UsuarioRepository::registrar) |
| Salida | 201, {noticia:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Comienza NO_PUBLICADO. Archivos nuevos antes de SQL, limpieza si falla; anteriores después del commit. En edición, enlaces ausentes se conservan y [] los elimina; galería se reemplaza al enviar imágenes. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 24. GET /api/noticias/{id}

Consultar el detalle administrativo de una noticia.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → NoticiaController::show → acceso/validación → NoticiaService::detalle → NoticiaRepository::buscar → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces |
| Salida | 200, {noticia:{…}}, con imágenes/enlaces y fechas de vigencia. |
| Reglas y efectos | No modifica datos ni registra una acción administrativa. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 noticia inexistente. |

## 25. PUT /api/noticias/{id}

Editar los datos del elemento existente.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | titulo (≤255), texto, fecha_inicio_vigencia y fecha_fin_vigencia (AAAA-MM-DD). Opcionales: imagen_portada, galeria[] (≤5), enlaces[] (≤5 HTTP/HTTPS). Imágenes JPG/PNG/WEBP ≤2048 KB cada una. |
| Flujo | public/index.php → NoticiaController::update → acceso/validación → NoticiaService::guardar → NoticiaRepository::buscar/actualizar → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {noticia:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Conserva el estado de publicación existente. Archivos nuevos antes de SQL, limpieza si falla; anteriores después del commit. En edición, enlaces ausentes se conservan y [] los elimina; galería se reemplaza al enviar imágenes. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 26. PATCH /api/noticias/{id}/estado

Publicar o retirar el contenido mediante una operación separada.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | JSON: estado=PUBLICADO o NO_PUBLICADO. |
| Flujo | public/index.php → NoticiaController::updateEstado → acceso/validación → NoticiaService::estado → NoticiaRepository::buscar/actualizar → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {noticia:{…}}. |
| Reglas y efectos | Si cambia el estado, persiste y audita PUBLICAR/DESPUBLICAR en una transacción. Si ya tiene ese estado devuelve el elemento sin duplicar acción. No implementa aprobación de Directora. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 estado inválido; 404 id inexistente. |

## 27. DELETE /api/noticias/{id}

Eliminar un elemento y mantener constancia en historial.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → NoticiaController::destroy → acceso/validación → NoticiaService::eliminar → NoticiaRepository::buscar/eliminar → Noticia::toArray/Response. |
| Tablas | noticias, noticia_imagenes y noticia_enlaces; historial_acciones (UsuarioRepository::registrar) |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | El servicio registra ELIMINAR y borra en la misma transacción. Noticia elimina galería/enlaces en cascada; limpia sus archivos después del commit. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 id inexistente. |

## 28. GET /api/materiales

Listar todos los elementos del módulo para el personal.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → MaterialController::index → acceso/validación → MaterialService::listar → MaterialRepository::listar → Material::toArray/Response. |
| Tablas | materiales_estudio |
| Salida | 200, {materiales:[…]}. |
| Reglas y efectos | Incluye elementos no publicados; no altera su estado. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 29. POST /api/materiales

Crear un elemento del módulo.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | nombre (≤255), tipo PDF/IMAGEN/VIDEO. archivo para PDF (≤10240 KB) o imagen (≤5120 KB); ubicacion_recurso HTTP/HTTPS (≤2048) para video. El tipo nuevo exige recurso. |
| Flujo | public/index.php → MaterialController::store → acceso/validación → MaterialService::guardar → MaterialRepository::crear → Material::toArray/Response. |
| Tablas | materiales_estudio; historial_acciones (UsuarioRepository::registrar) |
| Salida | 201, {material:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Comienza NO_PUBLICADO. Nuevo tipo requiere recurso; mismo tipo permite conservarlo. Se limpia archivo nuevo ante fallo y anterior tras confirmar reemplazo. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 30. PUT /api/materiales/{id}

Editar los datos del elemento existente.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | nombre (≤255), tipo PDF/IMAGEN/VIDEO. archivo para PDF (≤10240 KB) o imagen (≤5120 KB); ubicacion_recurso HTTP/HTTPS (≤2048) para video. El tipo nuevo exige recurso. |
| Flujo | public/index.php → MaterialController::update → acceso/validación → MaterialService::guardar → MaterialRepository::buscar/actualizar → Material::toArray/Response. |
| Tablas | materiales_estudio; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {material:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Conserva el estado de publicación existente. Nuevo tipo requiere recurso; mismo tipo permite conservarlo. Se limpia archivo nuevo ante fallo y anterior tras confirmar reemplazo. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 31. PATCH /api/materiales/{id}/estado

Publicar o retirar el contenido mediante una operación separada.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | JSON: estado=PUBLICADO o NO_PUBLICADO. |
| Flujo | public/index.php → MaterialController::updateEstado → acceso/validación → MaterialService::estado → MaterialRepository::buscar/actualizar → Material::toArray/Response. |
| Tablas | materiales_estudio; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {material:{…}}. |
| Reglas y efectos | Si cambia el estado, persiste y audita PUBLICAR/DESPUBLICAR en una transacción. Si ya tiene ese estado devuelve el elemento sin duplicar acción. No implementa aprobación de Directora. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 estado inválido; 404 id inexistente. |

## 32. DELETE /api/materiales/{id}

Eliminar un elemento y mantener constancia en historial.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → MaterialController::destroy → acceso/validación → MaterialService::eliminar → MaterialRepository::buscar/eliminar → Material::toArray/Response. |
| Tablas | materiales_estudio; historial_acciones (UsuarioRepository::registrar) |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | El servicio registra ELIMINAR y borra en la misma transacción. Material limpia su archivo local después del commit; no elimina una URL externa. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 id inexistente. |

## 33. GET /api/preguntas

Listar todos los elementos del módulo para el personal.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → PreguntaController::index → acceso/validación → PreguntaService::listar → PreguntaRepository::listar → Pregunta::toArray/Response. |
| Tablas | preguntas_frecuentes |
| Salida | 200, {preguntas:[…]}. |
| Reglas y efectos | Incluye elementos no publicados; no altera su estado. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 34. POST /api/preguntas

Crear un elemento del módulo.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | pregunta (≤255) y respuesta, ambas no vacías. |
| Flujo | public/index.php → PreguntaController::store → acceso/validación → PreguntaService::guardar → PreguntaRepository::crear → Pregunta::toArray/Response. |
| Tablas | preguntas_frecuentes; historial_acciones (UsuarioRepository::registrar) |
| Salida | 201, {pregunta:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Comienza NO_PUBLICADO. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 35. PUT /api/preguntas/{id}

Editar los datos del elemento existente.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | pregunta (≤255) y respuesta, ambas no vacías. |
| Flujo | public/index.php → PreguntaController::update → acceso/validación → PreguntaService::guardar → PreguntaRepository::buscar/actualizar → Pregunta::toArray/Response. |
| Tablas | preguntas_frecuentes; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {pregunta:{…}}. |
| Reglas y efectos | Transacción de datos más auditoría. Conserva el estado de publicación existente. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 400 JSON inválido; 422 datos/archivos inválidos; 404 id inexistente en edición. |

## 36. PATCH /api/preguntas/{id}/estado

Publicar o retirar el contenido mediante una operación separada.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | JSON: estado=PUBLICADO o NO_PUBLICADO. |
| Flujo | public/index.php → PreguntaController::updateEstado → acceso/validación → PreguntaService::estado → PreguntaRepository::buscar/actualizar → Pregunta::toArray/Response. |
| Tablas | preguntas_frecuentes; historial_acciones (UsuarioRepository::registrar) |
| Salida | 200, {pregunta:{…}}. |
| Reglas y efectos | Si cambia el estado, persiste y audita PUBLICAR/DESPUBLICAR en una transacción. Si ya tiene ese estado devuelve el elemento sin duplicar acción. No implementa aprobación de Directora. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 estado inválido; 404 id inexistente. |

## 37. DELETE /api/preguntas/{id}

Eliminar un elemento y mantener constancia en historial.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → PreguntaController::destroy → acceso/validación → PreguntaService::eliminar → PreguntaRepository::buscar/eliminar → Pregunta::toArray/Response. |
| Tablas | preguntas_frecuentes; historial_acciones (UsuarioRepository::registrar) |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | El servicio registra ELIMINAR y borra en la misma transacción. No elimina el registro de auditoría. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 id inexistente. |

## 38. GET /api/franjas

Listar franjas para administrarlas, también llenas o vencidas.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → ReservaController::franjas → acceso/validación → ReservaService::franjas → ReservaRepository::franjas → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas |
| Salida | 200, {franjas:[{id,fecha,hora_inicio,hora_fin,tipo,cupos_totales,cupos_disponibles},…]}. |
| Reglas y efectos | El repositorio cuenta reservas por franja; la consulta pública filtra fecha desde hoy y cupos disponibles positivos. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. |

## 39. POST /api/franjas

Crear una franja de agenda académica.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | fecha desde hoy; hora_inicio/hora_fin HH:MM con fin posterior; tipo PRUEBA_MANEJO, RENOVACION_NORMAL o RENOVACION_URGENTE; cupos_totales entero de 1 a 20. |
| Flujo | public/index.php → ReservaController::crearFranja → acceso/validación → ReservaService::guardarFranja → ReservaRepository::franja con bloqueo/horarioExiste/crearFranja o actualizarFranja → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas; historial_acciones |
| Salida | 201, {franja:{…}}. |
| Reglas y efectos | Transacción y auditoría. Horario/fecha/tipo únicos. En edición se bloquea la franja y no se reducen cupos por debajo de reservas existentes. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 fecha/horario/tipo/cupos/duplicación; 404 id no existente en edición. |

## 40. PUT /api/franjas/{id}

Editar horario, tipo o capacidad de una franja académica.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | fecha desde hoy; hora_inicio/hora_fin HH:MM con fin posterior; tipo PRUEBA_MANEJO, RENOVACION_NORMAL o RENOVACION_URGENTE; cupos_totales entero de 1 a 20. |
| Flujo | public/index.php → ReservaController::actualizarFranja → acceso/validación → ReservaService::guardarFranja → ReservaRepository::franja con bloqueo/horarioExiste/crearFranja o actualizarFranja → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas; historial_acciones |
| Salida | 200, {franja:{…}}. |
| Reglas y efectos | Transacción y auditoría. Horario/fecha/tipo únicos. En edición se bloquea la franja y no se reducen cupos por debajo de reservas existentes. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 fecha/horario/tipo/cupos/duplicación; 404 id no existente en edición. |

## 41. DELETE /api/franjas/{id}

Eliminar una franja que todavía no tiene reservas.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Sin cuerpo. El id de ruta, cuando existe, es un entero positivo. |
| Flujo | public/index.php → ReservaController::eliminarFranja → acceso/validación → ReservaService::eliminarFranja → ReservaRepository::franja con bloqueo/eliminarFranja → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas; historial_acciones |
| Salida | 204 sin cuerpo. |
| Reglas y efectos | Transacción, bloqueo de franja y auditoría. Si ya tiene reservas, se rechaza en lugar de romper las referencias. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 404 id no existente; 422 franja con reservas. |

## 42. GET /api/agenda

Consultar la agenda y su resumen para el personal.

| Aspecto | Comportamiento |
|---|---|
| Acceso | Bearer válido, PERSONAL_IMSJ y cuenta activa. |
| Entrada | Query vista=dia / semana / mes y fecha=AAAA-MM-DD. Defaults: día actual en Uruguay. |
| Flujo | public/index.php → ReservaController::agenda → acceso/validación → ReservaService::agenda → ReservaRepository::agenda → Franja/Reserva → Response. |
| Tablas | franjas_disponibilidad y reservas |
| Salida | 200, {reservas:[…con cedula…], resumen:{total,urgentes}}. |
| Reglas y efectos | Día exacto; semana lunes–domingo; mes completo. SELECT por rango de fechas con usuario/franja. Urgentes cuenta RENOVACION_URGENTE. |
| Errores | 401 sin sesión válida; 403 con rol insuficiente. 422 vista/fecha inválida. |

## Soporte, operación y límites

GET /storage/<ruta> valida ruta real dentro del almacenamiento y MIME permitido antes de servir bytes. Responde 404 para rutas ajenas/archivos inexistentes/tipos no admitidos. No permite ejecutar adjuntos. Las URL se construyen con APP_URL.

OPTIONS valida origen configurado: 204 con métodos/cabeceras para origen permitido y 403 para origen ajeno. No evita solicitudes desde clientes ajenos al navegador; Auth impone los permisos. Las rutas/métodos sin coincidencia responden 404.

Todas las fichas pueden producir 500 por un fallo interno inesperado; se registra un diagnóstico sin incluir SQL/secretos en el JSON. 413 corresponde a formularios por encima del límite global. Textos TEXT tienen límite físico de 65535 bytes.

La suite HTTP/MySQL cubre los 42 endpoints, rechazo por sesión/rol, archivos, revocación/expiración, último cupo desde dos procesos y rollback de auditoría/archivo. Docker/Apache, restauración de datos institucionales, pruebas visuales integrales de los frontends y aceptación siguen pendientes; consultar [evidencia](verificacion.md).

## Fuentes y revisión

[api-simple, revisión fija](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple), código actual en backend/public/index.php, controladores/servicios/repositorios/modelos y backend/database.sql. Los límites conservados describen implementación, no aceptación de CC-01 ni de la entrega real. [Datos pendientes](aclaraciones_y_pendientes.md).
