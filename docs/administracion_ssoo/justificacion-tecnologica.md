# Justificación tecnológica

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización:** 21/10/2026.

## Decisión de implementación

El equipo sustituyó Laravel por PHP nativo para facilitar la documentación y la defensa del recorrido del backend. La aclaración del grupo sitúa la decisión el 30/09; el control la registra como CC-05 el 02/10 y la reescritura sigue el ejemplo `api-simple` desde el 05/10. La decisión conserva las necesidades de negocio, los datos y el contrato consumido por los frontends.

El resultado es una entrada explícita, ocho controladores, ocho servicios y ocho repositorios, con modelos y utilidades comunes. Se utiliza la organización de la referencia y se adapta al dominio vial. El contrato y los datos corresponden al dominio de IMSJ.

## Relación entre tecnologías y necesidades

| Tecnología | Aplicación y motivo | Condición o límite |
|---|---|---|
| PHP 8.5 | Procesa las peticiones, validaciones, archivos, reglas y respuestas. La carga explícita facilita seguir una operación desde la entrada. | Requiere PDO MySQL, mbstring y fileinfo. La versión debe respetarse al instalar. |
| PDO | Mantiene separados el texto SQL y sus parámetros y ofrece transacciones sobre una conexión común. | Los filtros, permisos y reglas deben programarse expresamente; PDO no los define. |
| MySQL 8.4 / InnoDB | Mantiene relaciones, restricciones únicas y bloqueo de filas para los cupos de reservas. | El esquema debe acompañar al código; crear tablas no actualiza cualquier estructura previa incompatible. |
| Apache | Sirve la API y las dos interfaces con una raíz pública y alias específicos. Resuelve la entrada única con `mod_rewrite`. | La configuración actual publica en loopback y no incluye HTTPS institucional. |
| Docker Compose | Reúne servicios, configuración y volúmenes y permite iniciar el entorno sin instalar PHP/MySQL en cada equipo. | El motor Linux debe funcionar; las imágenes necesitan descarga inicial y los volúmenes requieren respaldo. |
| HTML, CSS y JavaScript con Fetch | Conservan las interfaces existentes y consumen la API del mismo origen. | Las comprobaciones de interfaz deben complementarse con pruebas móviles y de accesibilidad. |
| Composer | Declara requisitos de PHP/extensiones y el comando de comprobación. | No hay paquetes externos obligatorios ni se necesita `vendor` para atender peticiones. |

Nginx se retiró por solicitud del grupo. Apache reúne ahora la publicación del portal, panel y API y Compose mantiene únicamente `app` y `db`.

## Autenticación, archivos y persistencia

Las sesiones opacas revocables conservan la autenticación de IMSJ: el servidor almacena el hash del secreto, comprueba vencimiento y consulta la cuenta y su rol. Esta solución evita incorporar una dependencia JWT para mantener el contrato actual. El navegador conserva el token en `sessionStorage` y lo envía como Bearer.

Los adjuntos utilizan almacenamiento fuera de la raíz pública y se sirven tras comprobar ruta y tipo permitido. Base, archivos y caché se mantienen en volúmenes independientes para que el reemplazo de contenedores no implique borrar el estado. Los servicios coordinan archivos y transacciones para evitar referencias incompletas cuando falla una operación.

## Compatibilidad y condiciones de entrega

Se conservan los identificadores del catálogo de requisitos, las claves de respuesta, los roles, la compatibilidad multipart y los datos relacionados. La agenda se mantiene en el alcance académico. Categorías, costo urgente, notificaciones y decisiones institucionales no se agregan como consecuencia del cambio de tecnología.

La organización por capas conserva el recorrido de entrada, control, servicio, repositorio y respuesta. El despliegue utiliza las restricciones de usuarios y capacidades del Compose actual.

| Dato | Valor |
|---|---|
| Referencia de equivalencia docente | La decisión de retirar Laravel corresponde al equipo (30/09; CC-05), con justificación técnica y evidencia; no se presenta como aprobación docente. |
| Dominio institucional | Demostración en localhost; para producción se requiere dominio administrado por la Intendencia. |
| Alojamiento | Equipos del grupo con Docker para demostración; infraestructura institucional como condición de despliegue. |
| HTTPS | HTTP local; TLS y certificado válido requeridos antes de publicación institucional. |
| Respaldo institucional | Transferir SQL, adjuntos, configuración protegida y versión compatible; propuesta diaria y previa a cambios. |

## Referencias

[Arquitectura](arquitectura_propuesta.md), [inventario](documentacion-infraestructura.md), [referencia simple](../../docs_auxiliares/backend/referencia_api_simple.md) y [control de cambios](../ingenieria_software/control_cambios.md).
