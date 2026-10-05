# Transición CC-05: backend PHP nativo

**Decisión del grupo:** retirar Laravel, registrada el 02/10/2026. **Refinamiento autorizado el 05/10/2026:** reescribir desde cero con api-simple, código comentado y el árbol explícito de siete módulos. Se implementó esa estructura en la versión de trabajo. No hay aprobación interna, docente ni del cliente registrada por esta intervención.

## Resultado y correspondencia

La entrada actual es `public/index.php`, con switch de 42 rutas; controladores/servicios/repositorios PHP nativos, modelos sin ORM y PDO preparado. Se retiraron del backend los directorios app/bootstrap/routes/config del framework, migraciones/factories/seeders, Artisan, manifiesto/lock y pruebas dependientes de Laravel. La copia anterior se resguardó fuera del repositorio antes del reemplazo; Git conserva el antecedente `68d34fb`. No se conserva una segunda API heredada dentro del backend.

| Componente anterior | Sustitución actual |
|---|---|
| Rutas/arranque del framework | `public/index.php`, carga explícita y switch. |
| Validación de Request | Controladores y `models/Solicitud.php`. |
| Eloquent/modelos y recursos | Repositorios PDO y modelos con `toArray()`. |
| Sanctum/sesiones | `core/Auth.php`, AuthRepository, tabla `auth_tokens`. |
| Storage público | `models/Archivo.php`, almacenamiento externo a public y GET /storage. |
| Migraciones/seeders | SQL no destructivo y CLI explícita para primera cuenta. |
| PHPUnit del framework | Suite HTTP/MySQL en `tests/integracion.py`; sintaxis con PHP CLI. |
| Pasos Artisan en Docker/scripts | Imagen Apache/PHP nativo y scripts de inicio/verificación. |

Se conservan rutas, claves JSON, roles, tipos y campos consumidos por los dos frontends. POST multipart con `_method=PUT` continúa aceptado. Las capas del diseño de api-completa se sustituyeron por el recorrido directo del ejemplo simple solicitado; [comparación](referencia_api_simple.md).

## Datos, archivos y sesiones

[database.sql](../backend/database.sql) crea diez tablas de dominio y `auth_tokens`; sin DROP, USE fijo ni cuentas/datos automáticos. Una importación no modifica tablas existentes incompatibles: comparar primero el esquema y ensayar sobre una copia. Los nombres/IDs/relaciones y hashes bcrypt de usuarios existentes siguen siendo compatibles. Las rutas relativas de adjuntos mantienen `storage/app/public` y `/storage/`.

Sesiones nativas: Bearer opaco `id|secreto`, 32 bytes aleatorios, solo SHA-256 en SQL, ocho horas. Emisión revoca tokens anteriores; cierre/desactivación revocan. La cuenta activa/rol se comprueban en cada petición. **Las sesiones anteriores dejan de ser válidas y requieren nuevo login.** No se convierte la tabla de sesiones antigua ni se consultan sus registros. Puede permanecer en una base previa sin uso hasta que el equipo decida su tratamiento.

No se operó sobre una base del equipo o de la Intendencia. La única base utilizada para pruebas fue aislada, con datos sintéticos. Los archivos locales anteriores se preservaron al reemplazar el código; no se borraron volúmenes Docker.

## Instalación y actualización

La [guía del backend](../backend/README.md) contiene el arranque nuevo/local y la primera cuenta. Para una base existente: respaldo de base y adjuntos, conservación de .env y nombres de volúmenes, comparación del esquema, ensayo sobre una copia, importación no destructiva y nuevo login. [SSOO](ssoo/transicion_backend_vanilla.md) detalla respaldo/restauración y sus límites. No usar reconstrucción con borrado de volúmenes como actualización.

## Estado de TM-01 a TM-07

| Tarea del plan anterior | Estado técnico de esta intervención | Cierre pendiente |
|---|---|---|
| TM-01 - estructura y arranque | Árbol nativo, entrada y 42 rutas implementados; sintaxis/HTTP comprobados. | Revisión del equipo y arranque Apache/Docker. |
| TM-02 - sesiones y permisos | Bearer revocable, cuenta/rol, vencimiento, límite de intentos comprobados. | Revisión de política institucional y despliegue/proxy. |
| TM-03 - persistencia y datos | PDO, SQL, claves y transacciones comprobados en MySQL 8.4. | Ensayo de actualización/restauración con copia de datos reales. |
| TM-04 - contenidos y archivos | CRUD/estado, archivos, visibilidad y rollback comprobados. | Revisión visual de formularios y recursos institucionales. |
| TM-05 - banco y agenda | Banco/corrección base, franjas/reservas/agenda y último cupo comprobados. | Reglas académicas/CC-01 nuevas continúan pendientes. |
| TM-06 - infraestructura | Docker/Compose/scripts nativos preparados, servicios/volúmenes conservados. | Construcción y reconstrucción Docker no ejecutadas. |
| TM-07 - pruebas y documentación | Suite HTTP, evidencia por hash, PDF/MD de flujos y documentos actualizados. | Juan Robaina: revisión interna; integración visual, docentes y aceptación cuando ocurran. |

Son estados de trabajo y evidencia técnica; no asignan fechas, puntos, costo ni compromisos a los integrantes. No se declara CC-05 completamente aceptado por pasar las pruebas.

## Límites

CC-01 a CC-04 continúan pendientes para la entrega real, sin fecha ni prioridad distinta. Agenda/reservas son académicas. No se incorporan categorías, consultas, Directora, gráficos del test, cancelación/confirmación, costo o campos nuevos. La letra consultada exige Laravel; registrar con docentes la aceptación de PHP nativo sigue pendiente.

El crédito corresponde al equipo, con apoyo externo de IA declarado. Los resultados y límites se registran en [verificación](verificacion.md); aprobación del cliente en actas a cargo del equipo.
