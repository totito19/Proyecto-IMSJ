# Transición CC-05: backend PHP nativo

**Decisión del grupo:** retirar Laravel, registrada el 02/10/2026. **Refinamiento del 05/10/2026:** reescribir desde cero con api-simple y código comentado. **Estado consolidado al 15/10/2026: Listo**, con ocho módulos después de incorporar Consulta mediante CC-02.

## Resultado y correspondencia

La entrada actual es `public/index.php`, con switch de 46 rutas; ocho controladores, servicios y repositorios PHP nativos, modelos sin ORM y PDO preparado. Se retiraron del backend los directorios app/bootstrap/routes/config del framework, migraciones/factories/seeders, Artisan, manifiesto/lock y pruebas dependientes de Laravel. Git conserva el antecedente `68d34fb`; no existe una segunda API heredada dentro del backend.

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

[database.sql](../../backend/database.sql) crea once tablas de dominio y `auth_tokens`; sin DROP, USE fijo ni cuentas/datos automáticos. Una importación no modifica tablas existentes incompatibles: comparar primero el esquema y ensayar sobre una copia. Los nombres/IDs/relaciones y hashes bcrypt de usuarios existentes siguen siendo compatibles. Las rutas relativas de adjuntos mantienen `storage/app/public` y `/storage/`.

Sesiones nativas: Bearer opaco `id|secreto`, 32 bytes aleatorios, solo SHA-256 en SQL, ocho horas. Emisión revoca tokens anteriores; cierre/desactivación revocan. La cuenta activa/rol se comprueban en cada petición. **Las sesiones anteriores dejan de ser válidas y requieren nuevo login.** No se convierte la tabla de sesiones antigua ni se consultan sus registros. Puede permanecer en una base previa sin uso hasta que el equipo decida su tratamiento.

No se operó sobre una base del equipo o de la Intendencia. La única base utilizada para pruebas fue aislada, con datos sintéticos. Los archivos locales anteriores se preservaron al reemplazar el código; no se borraron volúmenes Docker.

## Instalación y actualización

La [guía del backend](../../backend/README.md) contiene el arranque nuevo/local y la primera cuenta. Para una base existente: respaldo de base y adjuntos, conservación de .env y nombres de volúmenes, comparación del esquema, ensayo sobre una copia, importación no destructiva y nuevo login. [SSOO](transicion_backend_vanilla.md) detalla respaldo/restauración y sus límites. No usar reconstrucción con borrado de volúmenes como actualización.

## Estado de TM-01 a TM-07

| Tarea del plan anterior | Estado técnico | Observación |
|---|---|---|
| TM-01 - estructura y arranque | **Listo.** Árbol nativo, entrada y 46 rutas implementados; sintaxis/HTTP comprobados. | La línea base fue de 42 rutas y CC-02 añadió tres. |
| TM-02 - sesiones y permisos | **Listo.** Bearer revocable, cuenta/rol, vencimiento y límite de intentos comprobados. | La configuración de un futuro proxy pertenece al despliegue. |
| TM-03 - persistencia y datos | **Listo.** PDO, SQL, claves y transacciones comprobados en MySQL 8.4. | Una instalación real debe respaldarse antes de actualizar. |
| TM-04 - contenidos y archivos | **Listo.** CRUD/estado, archivos, visibilidad y rollback comprobados. | Recorrido visual registrado el 13/10. |
| TM-05 - banco y agenda | Banco/corrección, franjas/reservas/agenda y último cupo comprobados. | Listo. |
| TM-06 - infraestructura | **Listo.** Docker/Compose/scripts nativos, servicios y volúmenes conservados. | Arranque aislado registrado el 13/10. |
| TM-07 - pruebas y documentación | **Listo.** Suite HTTP, evidencia por hash y documentos actualizados. | Evidencia vinculada en el registro de verificación. |

Son estados técnicos; no asignan puntos, costo ni tareas individuales retrospectivas.

## Límites

**Estado consolidado al 15/10/2026:** CC-01–CC-05 están Listos. La versión incorpora simulador, consultas, Directora, aprobación diferenciada y gráficos del test. Agenda/reservas siguen siendo académicas. Categorías, respuestas a consultas, costo urgente y campos institucionales permanecen pendientes o fuera de esos cambios. La cancelación ciudadana se añadió a la agenda académica el 20/10.

El crédito y la responsabilidad corresponden al equipo. Los resultados y límites se registran en [verificación](../evidencias/verificacion.md).

## Evolución posterior de la base nativa

La base del 05/10 expuso 42 rutas. Consultas añadió tres en la demo del 13/10 y la cancelación añadió una el 20/10. Estos incrementos conservan la estructura nativa y no reincorporan archivos del framework. El manifiesto actual declara requisitos de PHP/extensiones, sin paquetes externos.

Al revisar una instalación se debe comparar el esquema actual, la migración incremental, los adjuntos y la configuración. La compatibilidad de nombres y hashes no acredita que cualquier base previa pueda actualizarse sin ensayo. La restauración debe verificarse con una copia y una versión de código compatible.
