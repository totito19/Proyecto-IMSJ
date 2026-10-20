# Justificación tecnológica

**Estado consolidado al 15/10/2026: CC-05, Listo.** Actualización por solicitud expresa del grupo: backend PHP nativo y estructura de api-simple. No se presume una mejora medida de rendimiento, costo o seguridad por retirar el framework.

| Tecnología | Uso y razón en esta versión | Límites |
|---|---|---|
| PHP 8.5 | Conserva el lenguaje/versionado previo; clases y carga explícita; request_parse_body para PUT multipart. | Requiere pdo_mysql, mbstring y fileinfo. |
| PDO / MySQL 8.4 | Preserva dominio, relaciones, consultas parametrizadas y transacciones/bloqueos. | El esquema no actualiza automáticamente tablas divergentes. |
| Apache | Imagen php:8.5-apache, raíz public y mod_rewrite para entrada única. | Ejecución real del contenedor pendiente. |
| Nginx | Mantiene publicación de ambos frontends estáticos. | No actúa como proxy API en esta configuración. |
| Docker Compose | Mantiene frontend/app/db y persistencia nombrada; entorno local reproducible documentado. | Construcción, persistencia y restauración requieren ejecución del equipo. |
| Composer | Manifiesto de PHP/extensiones y comando de sintaxis. | No hay paquetes externos; no se requiere vendor para responder. |
| HTML/CSS/JavaScript | Frontends actuales, contrato conservado. | Recorrido visual completo no probado en esta intervención. |

La referencia simple facilita seguir HTTP → entrada → controlador → servicio → repositorio → SQL → respuesta. No se incorporan Router/DTO/middleware separados ni dominio de productos. Sesiones opacas revocables conservan el comportamiento IMSJ sin dependencia JWT. [Comparación](../../docs_auxiliares/backend/referencia_api_simple.md), [arquitectura](../arquitectura_propuesta.md).

Agenda y reservas son académicas; CC-01–CC-05 están Listos. La Intendencia administrará y mantendrá por ahora; contacto y configuración institucional se completarán luego. No se selecciona proveedor, hardware o política de respaldo por deducción. Preparado con apoyo externo de IA.
