# Clases, atributos y métodos del backend nativo

**05/10/2026 - CC-05.** Correspondencia con archivos implementados. Preparación asistida por IA; revisión de Juan Robaina pendiente. El dominio del proyecto se mantiene y la estructura técnica se ajusta a la solicitud de api-simple.

## Capas y siete módulos

| Módulo | Controlador / servicio / repositorio | Modelos y persistencia |
|---|---|---|
| Auth | AuthController, AuthService, AuthRepository | Usuario; `usuarios`, `auth_tokens`. |
| Noticia | NoticiaController, NoticiaService, NoticiaRepository | Noticia; `noticias`, `noticia_imagenes`, `noticia_enlaces`. |
| Material | MaterialController, MaterialService, MaterialRepository | Material; `materiales_estudio`. |
| Pregunta | PreguntaController, PreguntaService, PreguntaRepository | Pregunta; `preguntas_frecuentes`. |
| Prueba | PruebaController, PruebaService, PruebaRepository | Prueba; `preguntas_prueba`. |
| Reserva | ReservaController, ReservaService, ReservaRepository | Franja y Reserva; `franjas_disponibilidad`, `reservas`. |
| Usuario | UsuarioController, UsuarioService, UsuarioRepository | Usuario; `usuarios` e `historial_acciones`. |

Los controladores validan y exigen acceso, servicios deciden reglas/transacciones, repositorios usan PDO preparado. Modelos contienen datos y `toArray()` para conservar claves JSON; no acceden por su cuenta al navegador. [Método de controlador por endpoint](api.md) y [recorrido individual](flujo_endpoints_backend.md).

## Atributos del dominio

| Modelo | Atributos relevantes y razón |
|---|---|
| Usuario | id, nombre nullable, cédula única, password hash, rol y activo. `verify()` verifica el secreto; `toArray()` omite hash/activo y conserva el perfil del cliente JS. Desactivación conserva referencias históricas. |
| Noticia | título, texto, inicio/fin de vigencia, portada, estado, galería y enlaces. La visibilidad exige publicación y período vigente. Los adjuntos se representan como URL. |
| Material | nombre, tipo PDF/IMAGEN/VIDEO, ubicación y estado. Archivo para PDF/imagen; URL externa para video. |
| Pregunta | pregunta, respuesta y estado de publicación. Sin categoría propia o enlaces útiles estructurados; definición pendiente. |
| Prueba | enunciado, cuatro opciones, respuesta correcta. `toArray(false)` oculta la respuesta antes de corregir; el resultado se calcula con SQL, no con un campo enviado como correcto. |
| Franja | fecha, inicio/fin, tipo y cupos; añade conteo y cupos disponibles calculados. Horario/tipo único. |
| Reserva | usuario y franja, fecha/horas/tipo derivados de la franja, creación. `cedula` solo se añade en la consulta del personal; no se toman usuarios arbitrarios del body. |

Imágenes/enlaces de noticia se conservan como relaciones SQL, serializadas por Noticia; no necesitan un módulo/controller independiente. Historial se consulta en Usuario, preservando usuario/acción/tipo/ID/fecha. Las formas físicas exactas y FK están en [database.sql](../backend/database.sql).

## Núcleo y modelos de entrada

- `Database`: conexión PDO, `query()` preparada y `transaction()` con commit/rollback. SQL UTC, fechas civiles interpretadas en Uruguay.
- `Response`: JSON con estado HTTP, 204 vacío y errores de campo; `ApiException` conserva errores recuperables hasta que la transacción se revierta.
- `Auth`: Bearer, hash/vencimiento, cuenta activa/rol y contador de intentos con flock. El token nunca se deriva de datos de identidad del navegador.
- `Solicitud`: objeto JSON/multipart, texto/entero/enum/fecha/hora/URL/cédula y normalización de archivos. Helpers sencillos compartidos, sin capas Router/DTO/Validator adicionales.
- `Archivo`: validación MIME/contenido, límite, nombre aleatorio, URL y eliminación restringida al almacenamiento.

## Reglas y transacciones

Alta/edición/estado/eliminación administrativa confirma auditoría con sus datos. Archivos nuevos se eliminan si falla la transacción; anteriores se limpian después del commit. Reserva bloquea franja antes de contar cupos y guardar; la combinación usuario/franja también es única en SQL. Gestión de personal conserva al menos un integrante activo e impide quitar el acceso propio.

No hay clases de categoría, consulta ciudadana, Directora, aprobación o gráfico del test implementadas por este cambio. CC-01 a CC-04 siguen pendientes; agenda es académica. Los PNG previos permanecen como antecedente, con [aclaraciones actuales](Diagramas/README.md).
