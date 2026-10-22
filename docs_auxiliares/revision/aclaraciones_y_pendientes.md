# Datos y decisiones del proyecto

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Fecha:** 21/10/2026.

## Equipo y cliente

| Integrante | Función |
|---|---|
| Tomás Cabrera | Liderazgo y backend. |
| Juan Robaina | Testing, documentación y revisión interna. |
| Gabriela Romero | Base de datos. |
| Verónica Romero | Frontend. |
| Juan Corrales | Frontend. |

| Dato | Valor |
|---|---|
| Referente | Inspector de Tránsito, conocido como Nacho |
| Identificación del referente en los registros | Inspector de Tránsito, conocido como Nacho; se utiliza su función en las actas. |
| Autoridad | Aceptación de entregas y cambios de alcance |
| Registro de decisiones | Actas de reuniones |
| Administración posterior | Intendencia de San José |

## Ficha de decisiones y referencias

| ID | Dato | Valor | Referencia |
|---|---|---|---|
| P-01 | Entrevista inicial | 09/07/2026; 16:05–16:45; presencial; Tomás Cabrera, Juan Robaina e Inspector. | R-01. |
| P-02 | Reuniones | R-01–R-06. | [Actas](../../docs/ingenieria_software/actas_reuniones.md). |
| P-03 | Capacidad y asignaciones por sprint | Cinco integrantes; estimaciones por complejidad basadas en los sprints anteriores. | [Planning](../../docs/ingenieria_software/sprint_planning.md). |
| P-04 | Referencias de PR y reportes académicos | Trazabilidad por commits; registros 60667ef, 6b49618, df581ab y actualizaciones documentales de octubre. | [Consolidación](consolidacion_2026-10-21.md). |
| P-05 | Simulacro | Hasta diez preguntas, cuatro opciones, total y aciertos; sin temporizador ni umbral. | CC-01. |
| P-06 | Consultas | Nombre, correo y mensaje; lectura del personal y marca de leído. | CC-02. |
| P-07 | Publicación | Personal prepara y publica; Directora aprueba; editar devuelve a borrador. | CC-03. |
| P-08 | Gráficos | Una imagen opcional JPG/PNG/WEBP de hasta 2048 KB. | CC-04. |
| P-09 | Categorías y modalidades | Categorías de preguntas y renovaciones normal y urgente implementadas. | [Backlog](../../docs/ingenieria_software/backlog.md). |
| P-10 | Versión PDF seleccionada | Demo del 13/10/2026. | B-02 del formulario. |
| P-11 | Dominio, alojamiento y contacto | Docker local; requisitos de dominio y HTTPS para producción; interlocución con el Inspector. | [Consolidación](consolidacion_2026-10-21.md). |
| P-12 | Pruebas técnicas | 192 comprobaciones de integración; auditoría API 43/43; SAST/DAST y hardening. | [Verificación](../evidencias/verificacion.md). |
| P-13 | Manual y procedimientos | Manual del portal/panel y procedimiento técnico de recuperación. | [Manual](../../docs/ingenieria_software/manual_usuario.md) y [restauración](../backend/transicion_backend_vanilla.md). |
| P-14 | Identificación legal y domicilio | Intendencia de San José — Sección Tránsito; datos de publicación a validar institucionalmente. | [Consolidación](consolidacion_2026-10-21.md). |
| P-15 | Referencia de titularidad | Crédito del trabajo a los cinco integrantes; LICENSE conserva su texto y debe revisarse para transferencia porque su denominación no coincide con la del cliente. | [Consolidación](consolidacion_2026-10-21.md). |
| P-17 | Decisión tecnológica | PHP nativo; decisión 30/09 y registro CC-05 del 02/10. | Formulario y cambios. |
| P-18 | Sesiones | Bearer opaco revocable; SHA-256; ocho horas. | Auth. |
| P-19 | Estructura | Ocho módulos y 46 rutas. | [Contrato API](../backend/api.md). |
| P-20 | Reconstrucción y recuperación | Instalación nueva, conservación de volúmenes, respaldo SQL/adjuntos y restauración aislada. | [Reconstrucción](../../docs/administracion_ssoo/reconstruccion-infraestructura.md) y [recuperación](../backend/transicion_backend_vanilla.md). |
| P-21 | Estimación y responsable por tarea | Asignación por roles y estimaciones por complejidad; véase planning y backlog. | [Planning](../../docs/ingenieria_software/sprint_planning.md). |
| P-22 | Ejecución de restauración y cierre | Pendiente de comprobar en Ubuntu Server 24.04 LTS antes de la entrega. | [Reconstrucción](../../docs/administracion_ssoo/reconstruccion-infraestructura.md). |
| P-23 | Escenarios de pruebas | Matriz PT-01–PT-18 con requisitos, historias y fuentes. | [Plan e informe](../../docs/ingenieria_software/plan_informe_pruebas.md). |
| P-24 | Seguridad y operación | Hallazgos consolidados y procedimiento técnico de incidentes. | [Hallazgos](../../docs/electiva_ciberseguridad/registro_hallazgos.md) y [procedimiento](../../docs/electiva_ciberseguridad/respuesta_incidentes.md). |

## Parámetros institucionales

| Dato | Valor |
|---|---|
| RUT | La identificación tributaria de los textos públicos debe ser validada por la Intendencia antes de su publicación. |
| Domicilio | Los textos de publicación deberán usar el domicilio oficial validado por la Intendencia. |
| Contacto oficial | Interlocución con la Sección Tránsito a través del Inspector; publicar el canal oficial al habilitar el servicio. |
| Proveedores | Entorno local con Docker, Apache/PHP y MySQL; la entrega no compromete proveedor comercial. |
| Conservación | La versión no ejecuta purga automática; la operación requiere una política institucional por finalidad. |
| Tratamiento de menores | Contenidos educativos consultables sin cuenta; revisar institucionalmente cuentas y formularios antes de habilitar trámites reales. |
| HTTPS | HTTP local; TLS y certificado válido requeridos antes de publicación institucional. |
| Responsable de respaldo | Equipo RC5 durante el proyecto; función de custodia a designar por la Intendencia al transferir. |

## Condiciones de transferencia

Las condiciones actuales y propuestas de operación se reúnen en [operación y transferencia](../../docs/general/condiciones_operacion.md). Las filas institucionales expresan requisitos y responsabilidades por función, no designaciones personales o políticas ya aprobadas.

## Referencias

[Ficha documental](formulario_datos_documentacion.md), [charter](../../docs/ingenieria_software/project_charter.md), [control de cambios](../../docs/ingenieria_software/control_cambios.md) y [especificación](../../docs/ingenieria_software/Requerimientos.md).
