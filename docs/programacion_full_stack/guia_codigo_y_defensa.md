# Guía para estudiar y defender el código

Esta guía resume cómo está organizado el sistema y qué recorrido sigue una petición. No reemplaza la documentación técnica: sirve como mapa rápido para estudiar el proyecto y explicarlo en una defensa.

## Idea principal

El proyecto separa la interfaz, las reglas de negocio y el acceso a datos. Una petición normal sigue este recorrido:

```text
Navegador
  -> public/index.php (reconoce la ruta)
  -> Controller (valida entrada y permisos)
  -> Service (aplica reglas de negocio)
  -> Repository (ejecuta SQL con PDO)
  -> MySQL
  -> Model -> Response JSON -> Navegador
```

Esta separación permite cambiar una pantalla sin escribir SQL en JavaScript y cambiar una consulta SQL sin mezclarla con la respuesta HTTP.

## Qué responsabilidad tiene cada carpeta

| Carpeta o archivo | Responsabilidad | Frase útil para la defensa |
| --- | --- | --- |
| `frontend-publico/` | Portal para la ciudadanía. | “Consume la API y no accede directamente a la base de datos”. |
| `frontend-imsj/` | Panel para personal y Directora. | “Comparte utilidades de interfaz y restringe las acciones administrativas”. |
| `backend/public/index.php` | Punto de entrada y enrutador. | “Relaciona método y URL con un controlador”. |
| `backend/controllers/` | Entrada HTTP, permisos y validación. | “El controlador traduce una solicitud web a un caso de uso”. |
| `backend/services/` | Reglas de negocio y transacciones. | “El servicio decide qué está permitido y coordina operaciones”. |
| `backend/repositories/` | Consultas SQL mediante PDO. | “El repositorio es la única capa que conoce la persistencia”. |
| `backend/models/` | Representación y conversión de datos. | “El modelo entrega una estructura controlada a la respuesta”. |
| `backend/core/` | Base de datos, autenticación y respuestas. | “Centraliza comportamientos transversales para no repetirlos”. |

## Ejemplo para explicar: crear una reserva

1. `frontend-publico/js/turnos.js` consulta las franjas y envía la elegida.
2. `backend/public/index.php` dirige `POST /api/reservas` a `ReservaController::store()`.
3. El controlador exige un usuario ciudadano y valida el identificador recibido.
4. `ReservaService::reservar()` aplica las reglas: la franja debe existir, no estar vencida, no estar repetida y conservar cupos.
5. `ReservaRepository` bloquea la franja durante la transacción y guarda la reserva.
6. `Response::json()` devuelve el resultado con código HTTP 201.

El bloqueo de la franja es importante: evita que dos solicitudes simultáneas ocupen el último cupo.

## Ejemplo para explicar: publicar contenido

Noticias, materiales y preguntas frecuentes usan el flujo:

```text
BORRADOR -> PENDIENTE -> APROBADO -> PUBLICADO
```

- El personal crea, edita y envía a revisión.
- La Directora realiza la aprobación.
- Solo el contenido publicado aparece en el portal ciudadano.
- Si se edita el contenido, vuelve a borrador para requerir una aprobación nueva.
- Las operaciones administrativas quedan registradas en el historial.

## Seguridad que conviene mencionar

- Las contraseñas se guardan con hash bcrypt, no como texto legible.
- Los tokens se validan junto con su vencimiento y el estado de la cuenta.
- Los endpoints administrativos verifican el rol en el backend; ocultar botones en el frontend no se considera una medida de seguridad.
- Las consultas usan PDO con parámetros, evitando concatenar datos del usuario en SQL.
- Los archivos se validan por tamaño y tipo antes de guardarse.
- Los intentos sensibles tienen limitación por frecuencia.
- Las operaciones que deben completarse juntas usan transacciones con `commit` o `rollback`.

## Cómo leer cada módulo

Para estudiar un módulo, conviene seguir siempre el mismo orden:

1. Abrir su archivo JavaScript para ver qué acción inicia el usuario.
2. Buscar la ruta correspondiente en `backend/public/index.php`.
3. Leer el método del controlador para identificar permisos y validaciones.
4. Leer el servicio para entender las reglas de negocio.
5. Terminar en el repositorio para ver las consultas SQL.
6. Revisar el modelo para conocer la forma de la respuesta.

## Cómo interpretar los comentarios de una consulta

Los repositorios ahora explican cada consulta justo antes de ejecutarla. Por ejemplo:

```php
// Comprueba si el mismo ciudadano ya tiene una reserva en esa franja.
return Database::query(
    'SELECT id FROM reservas WHERE usuario_id=? AND franja_disponibilidad_id=?',
    [$usuario, $franja],
)->fetch() !== false;
```

La lectura línea por línea es:

1. `SELECT id FROM reservas` busca una fila en la tabla de reservas; no necesita cargar todas sus columnas.
2. `WHERE usuario_id=?` limita la búsqueda al ciudadano autenticado.
3. `AND franja_disponibilidad_id=?` exige además que sea la misma franja.
4. `[$usuario, $franja]` entrega los valores por separado mediante PDO, evitando concatenarlos en el SQL.
5. `fetch() !== false` transforma “se encontró una fila” en un valor booleano.

El mismo criterio se aplica al resto del backend: el comentario anterior explica la intención y el código inferior muestra cómo se realiza.

## Convenciones de lectura

- PHP usa cuatro espacios; JavaScript, HTML y CSS usan dos.
- Cada clase PHP representa una responsabilidad concreta.
- Los métodos públicos expresan casos de uso; los privados reúnen pasos internos reutilizables.
- Los comentarios explican decisiones o reglas, no repiten literalmente cada línea.
- Los nombres de negocio se mantienen en español; los nombres técnicos estándar conservan su forma habitual.
- Las respuestas de error se centralizan para que toda la API mantenga el mismo formato.

## Preguntas frecuentes de una defensa

### ¿Por qué no se consulta MySQL desde el controlador?

Porque mezclar HTTP, reglas y SQL vuelve el código difícil de probar y mantener. El controlador valida la petición, el servicio aplica la regla y el repositorio persiste los datos.

### ¿Por qué se vuelven a comprobar los permisos en el backend?

El navegador puede ser manipulado. La autorización real debe ejecutarse donde se protegen los datos: en la API.

### ¿Qué ocurre si falla una operación a mitad de camino?

Las operaciones compuestas se ejecutan en una transacción. Si una parte falla, se hace `rollback` y la base no queda en un estado parcial.

### ¿Qué parte cambiaría si se reemplaza MySQL?

Principalmente los repositorios y la configuración de conexión. Los controladores, servicios y pantallas conservan sus responsabilidades.

### ¿Cómo se evita publicar cambios sin revisión?

La edición devuelve el elemento a borrador y el servicio controla las transiciones y el rol autorizado para aprobar.

## Recorrido adicional: cancelación de una reserva

La página de reservas consulta `/reservas/mias` y presenta las de la cuenta actual. Al confirmar una cancelación envía DELETE con el identificador. El controlador exige el rol público, el servicio coordina la operación y el repositorio elimina con dos condiciones: ID de reserva e ID del usuario autenticado. Una reserva ajena no se elimina y devuelve 404; personal no utiliza esta ruta ciudadana.

Al desaparecer la fila, deja de contarse para el cupo de la franja. No se registra un estado de cancelación ni se reprograma otra reserva. Los listados actuales excluyen fechas pasadas incluso para el personal; volver a un mes anterior puede mostrar una agenda vacía. Estas son características del código que debe demostrarse, no funciones adicionales.

## Relacionar la explicación con una prueba

Para explicar una regla se puede localizar el requisito, su servicio/repositorio y el caso correspondiente en `backend/tests/integracion.py`. Es importante distinguir un caso escrito de su ejecución: los resultados del 05/10 y 13/10 pertenecen a sus versiones, mientras que la cancelación se incorporó después.

La defensa de infraestructura debe mostrar el papel de `app`, `db` y los tres volúmenes, la creación explícita de la primera cuenta y la diferencia entre `/api/health` y el control interno que comprueba base y portal. El respaldo debe incluir SQL y adjuntos junto a una versión compatible, no solo el repositorio.
