# Clases, atributos y métodos del backend nativo

**Estado consolidado al 21/10/2026: Listo.** Correspondencia con los archivos implementados. El dominio del proyecto se mantiene y la estructura técnica sigue el recorrido de api-simple.

## Capas y ocho módulos

| Módulo | Controlador / servicio / repositorio | Modelos y persistencia |
|---|---|---|
| Auth | AuthController, AuthService, AuthRepository | Usuario; `usuarios`, `auth_tokens`. |
| Consulta | ConsultaController, ConsultaService, ConsultaRepository | Consulta; `consultas`. |
| Noticia | NoticiaController, NoticiaService, NoticiaRepository | Noticia; `noticias`, `noticia_imagenes`, `noticia_enlaces`. |
| Material | MaterialController, MaterialService, MaterialRepository | Material; `materiales_estudio`. |
| Pregunta | PreguntaController, PreguntaService, PreguntaRepository | Pregunta; `preguntas_frecuentes`. |
| Prueba | PruebaController, PruebaService, PruebaRepository | Prueba; `preguntas_prueba`. |
| Reserva | ReservaController, ReservaService, ReservaRepository | Franja y Reserva; `franjas_disponibilidad`, `reservas`. |
| Usuario | UsuarioController, UsuarioService, UsuarioRepository | Usuario; `usuarios` e `historial_acciones`. |

Los controladores validan y exigen acceso, servicios deciden reglas/transacciones, repositorios usan PDO preparado. Modelos contienen datos y `toArray()` para conservar claves JSON; no acceden por su cuenta al navegador. [Método de controlador por endpoint](../../docs_auxiliares/backend/api.md).

## Atributos del dominio

| Modelo | Atributos relevantes y razón |
|---|---|
| Usuario | id, nombre nullable, cédula única, password hash, rol y activo. `verify()` verifica el secreto; `toArray()` omite hash/activo y conserva el perfil del cliente JS. Desactivación conserva referencias históricas. |
| Consulta | nombre, email, mensaje, estado de lectura y marcas de tiempo. Permite recibir consultas públicas y gestionar su lectura sin exponer operaciones internas al portal. |
| Noticia | título, texto, inicio/fin de vigencia, portada, estado, galería y enlaces. La visibilidad exige publicación y período vigente. Los adjuntos se representan como URL. |
| Material | nombre, tipo PDF/IMAGEN/VIDEO, ubicación y estado. Archivo para PDF/imagen; URL externa para video. |
| Pregunta | pregunta, respuesta y estado de publicación. La representación JSON utiliza pregunta, respuesta y estado. |
| Prueba | enunciado, imagen opcional, cuatro opciones y respuesta correcta. `toArray(false)` oculta la respuesta antes de corregir; el resultado se calcula con SQL, no con un campo enviado como correcto. |
| Franja | fecha, inicio/fin, tipo y cupos; añade conteo y cupos disponibles calculados. Horario/tipo único. |
| Reserva | usuario y franja, fecha/horas/tipo derivados de la franja, creación. `cedula` solo se añade en la consulta del personal; no se toman usuarios arbitrarios del body. |

Imágenes/enlaces de noticia se conservan como relaciones SQL, serializadas por Noticia; no necesitan un módulo/controller independiente. Historial se consulta en Usuario, preservando usuario/acción/tipo/ID/fecha. Las formas físicas exactas y FK están en [database.sql](../../backend/database.sql).

## Núcleo y modelos de entrada

- `Database`: conexión PDO, `query()` preparada y `transaction()` con commit/rollback. SQL UTC, fechas civiles interpretadas en Uruguay.
- `Response`: JSON con estado HTTP, 204 vacío y errores de campo; `ApiException` conserva errores recuperables hasta que la transacción se revierta.
- `Auth`: Bearer, hash/vencimiento, cuenta activa/rol y contador de intentos con flock. El token nunca se deriva de datos de identidad del navegador.
- `Solicitud`: objeto JSON/multipart, texto/entero/enum/fecha/hora/URL/cédula y normalización de archivos. Helpers sencillos compartidos, sin capas Router/DTO/Validator adicionales.
- `Archivo`: validación MIME/contenido, límite, nombre aleatorio, URL y eliminación restringida al almacenamiento.

## Reglas y transacciones

Alta/edición/estado/eliminación administrativa confirma auditoría con sus datos. Archivos nuevos se eliminan si falla la transacción; anteriores se limpian después del commit. Reserva bloquea franja antes de contar cupos y guardar; la combinación usuario/franja también es única en SQL. Gestión de personal conserva al menos un integrante activo e impide quitar el acceso propio.

Consulta ciudadana, rol Directora, aprobación diferenciada, gráfico del test, agenda y reservas están implementados. CC-01–CC-05 están Listos. El MER y el pasaje a tablas describen el modelo actual; el UML PNG se conserva como antecedente y se acompaña de una vista de clases nativas en [diagramas](Diagramas/README.md).

## Métodos públicos y responsabilidad por capa

La tabla identifica los métodos declarados en los archivos actuales. El controlador expone operaciones HTTP, el servicio coordina su caso de uso y el repositorio encapsula acceso a datos. No se espera que los tres archivos tengan nombres o cantidades idénticos.

| Módulo | Controlador | Servicio | Repositorio |
|---|---|---|---|
| Auth | `login()`, `register()`, `me()`, `logout()` | `login()`, `register()`, `logout()` | `buscarToken()`, `revocarTodos()`, `revocar()`, `crear()` |
| Consulta | `store()`, `index()`, `marcarLeida()` | `listar()`, `crear()`, `marcarLeida()` | `buscar()`, `listar()`, `crear()`, `marcarLeida()` |
| Noticia | `publicIndex()`, `index()`, `show()`, `store()`, `update()`, `updateEstado()`, `destroy()` | `listar()`, `detalle()`, `guardar()`, `estado()`, `eliminar()` | `buscar()`, `listar()`, `crear()`, `actualizar()`, `imagenes()`, `enlaces()`, `eliminar()` |
| Material | `publicIndex()`, `index()`, `store()`, `update()`, `updateEstado()`, `destroy()` | `listar()`, `detalle()`, `guardar()`, `estado()`, `eliminar()` | `buscar()`, `listar()`, `crear()`, `actualizar()`, `eliminar()` |
| Pregunta | `index()`, `store()`, `update()`, `destroy()`, `publicIndex()`, `updateEstado()` | `listar()`, `detalle()`, `guardar()`, `eliminar()`, `estado()` | `buscar()`, `listar()`, `crear()`, `actualizar()`, `eliminar()` |
| Prueba | `index()`, `store()`, `update()`, `destroy()`, `publicIndex()`, `corregir()` | `listar()`, `detalle()`, `guardar()`, `eliminar()`, `publica()`, `corregir()` | `buscar()`, `listar()`, `crear()`, `actualizar()`, `eliminar()`, `aleatorias()` |
| Reserva | `disponibles()`, `franjas()`, `crearFranja()`, `actualizarFranja()`, `eliminarFranja()`, `store()`, `mine()`, `cancelar()`, `agenda()` | `franjas()`, `guardarFranja()`, `eliminarFranja()`, `reservar()`, `propias()`, `cancelar()`, `agenda()` | `franja()`, `cantidad()`, `franjas()`, `horarioExiste()`, `crearFranja()`, `actualizarFranja()`, `eliminarFranja()`, `duplicada()`, `crearReserva()`, `propias()`, `cancelar()`, `agenda()` |
| Usuario | `index()`, `store()`, `destroy()`, `historial()` | `listar()`, `historial()`, `crear()`, `desactivar()` | `buscar()`, `buscarCedula()`, `bloquear()`, `crear()`, `personal()`, `bloquearPersonal()`, `reactivar()`, `desactivar()`, `registrar()`, `historial()` |

## Decisiones de diseño explicadas

La separación evita que una pantalla construya SQL o decida permisos. Por ejemplo, ReservaController obtiene la cuenta mediante Auth; ReservaService comprueba el caso de uso; ReservaRepository utiliza los identificadores autorizados y ejecuta consultas. El modelo Reserva transforma el resultado para entregar las claves que consume el frontend.

La cancelación sigue ese recorrido y utiliza simultáneamente el ID de reserva y el ID de propietario en DELETE. No acepta un usuario arbitrario enviado por el navegador. Las vistas diaria, semanal y mensual calculan intervalos en el servicio y el repositorio limita los resultados a fechas vigentes.

En contenidos, la validación de forma ocurre antes de guardar y el servicio controla estados y auditoría. Las relaciones de galería y enlaces se recuperan dentro de NoticiaRepository. Las imágenes y los enlaces pertenecen a la gestión de una noticia y se operan desde NoticiaRepository.

## Tratamiento de errores y consistencia

`ApiException` transporta el estado HTTP y los errores recuperables. `Database::transaction()` revierte datos si una operación falla; `Response` termina la petición con JSON o un cuerpo vacío. La autorización ocurre antes de solicitar los datos y los modelos preparan la representación de salida.

El almacenamiento de archivos necesita coordinación adicional porque SQL no revierte una copia del sistema de archivos. Los servicios eliminan una carga nueva si falla la transacción y retiran el archivo anterior después de confirmar el reemplazo. Este comportamiento se explica junto a las pruebas de rollback en el registro técnico.
