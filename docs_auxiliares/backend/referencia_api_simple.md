# Referencia del backend: API simple

**Estado consolidado al 15/10/2026: CC-05 Listo.** La instrucción de usar el ejemplo simple concretó CC-05 y sustituyó el diseño de destino basado en la API completa documentado el 02/10. CC-02 añadió posteriormente el módulo Consulta.

**Fuente fijada:** [api-simple](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple), commit `d6f61c999369b754d70bfa0621a154e9a630589a`. Se descargaron sus 35 archivos y el README raíz para contrastar el recorrido y sus capas. El [análisis de api-completa](referencia_api_completa.md) queda como antecedente, sin imponer Router, middleware, DTO o validadores separados al código actual.

| Pieza del ejemplo simple | Adaptación IMSJ implementada |
|---|---|
| `index.php`, `switch (true)`, carga explícita | `public/index.php`; 46 rutas de IMSJ, conservando `/api`. |
| Controladores exigen login/rol y validan | `Auth::requireUser()` y `Solicitud`; ocho controladores. |
| Servicios y repositorios PDO | Un servicio/repositorio por módulo; SQL preparado y transacciones MySQL. |
| Modelos sin ORM | Datos de usuario, consulta, noticia, material, FAQ, prueba, franja y reserva; serialización explícita. |
| JWT/Bearer, `firebase/php-jwt` | Bearer opaco revocable de IMSJ; SHA-256 persistido, ocho horas. No hay dependencia JWT. |
| Dominio de productos, ventas y reseñas | Dominio IMSJ; no se copian entidades o credenciales del ejemplo. |
| JSON `datos`/`mensaje` | Claves raíz consumidas por los frontends; errores `message`/`errors`. |
| No hay limitador en api-simple | Se conserva el límite IMSJ de cinco intentos/minuto, con archivo y `flock`. |
| SQL de demostración | `database.sql` sin DROP ni datos de ejemplo; primera cuenta mediante CLI explícita. |

La estructura actual incluye `public/`, tres clases `core/`, ocho controladores, ocho servicios, ocho repositorios, `models/`, SQL raíz, Composer y Docker. Las franjas/agenda se agrupan en Reserva, el historial en Usuario y las consultas ciudadanas forman el octavo módulo. CC-01–CC-05 están Listos.

Los archivos operativos `scripts/`, `tests/`, almacenamiento y plantillas de entorno permiten crear la primera cuenta, comprobar la implementación y ejecutarla.  Composer declara PHP/extensiones; esta versión no requiere paquetes externos ni `vendor/autoload.php`.

## Correspondencia con los recorridos actuales

La referencia aporta la forma de seguir una petición y separar HTTP, negocio y SQL. IMSJ agrega reglas propias: aprobación de Dirección, vigencia, tipos de adjunto, consultas, cupos, propiedad y auditoría. Por ello los modelos, métodos y límites se justifican desde los requisitos de IMSJ y no desde las entidades del ejemplo.

El contrato pasó de 42 rutas en la reescritura a 45 con consultas y 46 con cancelación. Los inventarios y pruebas se relacionan con esas versiones; el ejemplo no determina la cantidad ni las autorizaciones del sistema vial.

## Verificación de la adaptación

La suite integral del 21/10 recorre las 46 rutas y registra 192 comprobaciones. La organización de entrada, controladores, servicios y repositorios conserva el contrato del dominio IMSJ.

[Contrato](api.md) y [verificación](../evidencias/verificacion.md).
