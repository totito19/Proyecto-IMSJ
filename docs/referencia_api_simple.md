# Referencia del backend: API simple

**Actualización autorizada por el grupo - 05/10/2026.** La instrucción de usar el ejemplo simple y el árbol de siete módulos concreta CC-05 y sustituye el diseño de destino basado en la API completa documentado el 02/10. No se atribuye esta decisión a una reunión ni a docentes.

**Fuente fijada:** [api-simple](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple), commit `d6f61c999369b754d70bfa0621a154e9a630589a`. Se descargaron sus 35 archivos y el README raíz para contrastar el recorrido y sus capas. El [análisis de api-completa](referencia_api_completa.md) queda como antecedente, sin imponer Router, middleware, DTO o validadores separados al código actual.

| Pieza del ejemplo simple | Adaptación IMSJ implementada |
|---|---|
| `index.php`, `switch (true)`, carga explícita | `public/index.php`; 42 rutas de IMSJ, conservando `/api`. |
| Controladores exigen login/rol y validan | `Auth::requireUser()` y `Solicitud`; siete controladores. |
| Servicios y repositorios PDO | Un servicio/repositorio por módulo; SQL preparado y transacciones MySQL. |
| Modelos sin ORM | Datos de usuario, noticia, material, FAQ, prueba, franja y reserva; serialización explícita. |
| JWT/Bearer, `firebase/php-jwt` | Bearer opaco revocable de IMSJ; SHA-256 persistido, ocho horas. No hay dependencia JWT. |
| Dominio de productos, ventas y reseñas | Dominio IMSJ; no se copian entidades o credenciales del ejemplo. |
| JSON `datos`/`mensaje` | Claves raíz consumidas por los frontends; errores `message`/`errors`. |
| No hay limitador en api-simple | Se conserva el límite IMSJ de cinco intentos/minuto, con archivo y `flock`. |
| SQL de demostración | `database.sql` sin DROP ni datos de ejemplo; primera cuenta mediante CLI explícita. |

**IA - Observación:** compartir el patrón del ejemplo no significa copiar su contrato o certificar su seguridad. Autenticación revocable, reservas, archivos y auditoría responden al comportamiento IMSJ existente. El recorrido de cada endpoint se documenta en [flujos](flujo_endpoints_backend.md).

La estructura solicitada incluye `public/`, tres clases `core/`, siete controladores, siete servicios, siete repositorios, `models/`, SQL raíz, Composer y Docker. Las franjas/agenda se agrupan en Reserva y el historial en Usuario para mantener esos siete módulos. No se incorporan las funciones pendientes de CC-01 a CC-04.

Los archivos operativos `scripts/`, `tests/`, almacenamiento y plantillas de entorno permiten crear la primera cuenta, comprobar la implementación y ejecutarla. No añaden endpoints. Composer declara PHP/extensiones; esta versión no requiere paquetes externos ni `vendor/autoload.php`.
