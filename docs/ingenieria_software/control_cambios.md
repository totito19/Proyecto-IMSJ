# Control de cambios

| Dato | Valor |
|---|---|
| Proyecto | Educación Vial IMSJ — Portal Vial |
| Actualización | 21/10/2026 |
| Revisión documental | Juan Robaina |
| Referencia del cliente | Inspector de Tránsito |

## 1. Registro de solicitudes

| Código | Fecha | Solicitud | Origen | Destino | Estado |
|---|---|---|---|---|---|
| CC-01 | 14/08/2026 | Simulacros de pruebas teóricas. | Profesores. | Cliente y académico. | Listo |
| CC-02 | 03/09/2026 | Formulario público de consultas y bandeja de lectura. | Demo con Directora e Inspector. | Cliente y académico. | Listo |
| CC-03 | 03/09/2026 | Aprobación de contenidos por la Directora. | Demo con Directora e Inspector. | Cliente y académico. | Listo |
| CC-04 | 03/09/2026 | Gráficos en las preguntas del simulador. | Demo con Directora e Inspector. | Cliente y académico. | Listo |
| CC-05 | Decisión: 30/09/2026; registro: 02/10/2026. | Sustituir Laravel por PHP nativo. | Equipo del proyecto. | Transversal. | Listo |

**Prioridad relativa de CC-01–CC-04:** misma prioridad.

## 2. Detalle e impacto

### CC-01 — Simulacros

La solicitud incorpora práctica de pruebas teóricas. La implementación mantiene un banco de preguntas, selecciona hasta diez al azar, ofrece cuatro opciones y calcula una corrección con total y aciertos. El resultado se obtiene a partir de las respuestas almacenadas en el servidor.

| Dato | Valor |
|---|---|
| Motivo | Mantener el nivel del proyecto de egreso. |
| Requisitos | RF22; US31. |
| Tiempo límite | Sin temporizador |
| Umbral de aprobación | Sin umbral |
| Evidencia | Suite HTTP/MySQL y recorrido del simulador. |

### CC-02 — Consultas ciudadanas

El formulario del pie del portal solicita nombre, correo y mensaje. La consulta se guarda en MySQL y queda disponible en la bandeja del panel. El personal puede desplegarla y marcarla como leída.

| Dato | Valor |
|---|---|
| Requisitos | RF23; US32. |
| Datos | Nombre, correo, mensaje, lectura y marcas de tiempo. |
| Permisos | Envío público; lectura y gestión por personal y Directora. |
| Evidencia | Demo del 13/10 y suite integral del 21/10. |

### CC-03 — Aprobación y publicación

Noticias, materiales y FAQ siguen el flujo **Borrador → Pendiente → Aprobado → Publicado**. El personal prepara y envía el contenido; la Directora lo aprueba y la publicación se realiza después. Editar un contenido aprobado o publicado devuelve su estado a borrador.

| Dato | Valor |
|---|---|
| Requisitos | RF21; US30. |
| Datos y permisos | Rol DIRECTORA y estados de aprobación en los tres módulos. |
| Interfaces | Acciones de revisión, aprobación y publicación en el panel. |
| Evidencia | Demo del 13/10; integración y auditoría de permisos del 21/10. |

### CC-04 — Material gráfico del simulador

Cada pregunta puede tener una imagen JPG, PNG o WEBP de hasta 2048 KB. La gestión permite cargar, sustituir o quitar el archivo y la consulta pública lo presenta junto al enunciado.

| Dato | Valor |
|---|---|
| Requisitos | RF24; US33. |
| Relación | Ampliación de CC-01. |
| Persistencia | preguntas_prueba.imagen y almacenamiento de archivos. |
| Evidencia | Carga, descarga y consulta pública comprobadas en las suites registradas. |

### CC-05 — Backend PHP nativo

El equipo decidió retirar Laravel para facilitar la documentación y la defensa. La decisión se sitúa el 30/09 y su registro documental se abrió el 02/10. La referencia inicial fue api-completa; el refinamiento del 05/10 adoptó el recorrido explícito de api-simple y código comentado.

Se sustituyeron el arranque del framework, rutas, ORM y sesiones por carga explícita, controladores, servicios, repositorios PDO, modelos y sesiones opacas revocables. Se conservaron dominio, identificadores, campos y contrato utilizado por los frontends. La instalación utiliza Apache/PHP, MySQL, volúmenes y herramientas operativas.

| Área | Resultado |
|---|---|
| Rutas y entrada | public/index.php; contrato vigente de 46 endpoints. |
| Autenticación | Bearer revocable, hash SHA-256, ocho horas y comprobación de cuenta/rol. |
| Persistencia | PDO preparado, esquema, restricciones y transacciones MySQL. |
| Archivos | Validación, almacenamiento y descarga de PDF/imágenes. |
| Agenda | Propiedad, duplicación, cupos y bloqueo transaccional. |
| Despliegue | Compose app/db, alias de Apache y persistencia. |
| Verificación | 155 comprobaciones en la base del 05/10 y 192 sobre la versión integral del 21/10. |

## 3. Modificaciones de implementación

| Fecha | Modificación | Impacto | Referencia |
|---|---|---|---|
| 05/10 | Reescritura PHP; arranque portable y Apache único. | API, instalación y operación. | CC-05. |
| 13/10 | Consultas, Directora y gráficos. | 45 rutas; demo de 41 comprobaciones. | Registro de verificación. |
| 20/10 | Cancelación de reservas propias. | DELETE /api/reservas/{id}; 46 rutas. | bfd7f52. |
| 20/10 | Agenda vigente y ajustes visuales. | Vistas de fechas actuales/futuras, mes inicial y navegación. | b7eb9a2; f5c6545. |
| 21/10 | SAST, DAST, auditoría Bash y hardening. | Cabeceras, recursos locales, usuarios de contenedor y restricciones de ejecución. | 1a43229. |

## 4. Cambios documentales

| Registro | Fecha | Resultado |
|---|---|---|
| DOC-20261002 | 02/10/2026 | Revisión del catálogo, referencias, estructura documental y PDF. |
| DOC-20261013 | 13/10/2026 | Separación de material auxiliar e índices de consulta. |
| DOC-20261020 | 20/10/2026 | Desarrollo de Markdown y correspondencia con el backend nativo. |
| DOC-20261021 | 21/10/2026 | Homogeneización de estructuras con los teóricos del curso y actualización de datos y evidencias. |
| DOC-20261021-B | 21/10/2026 | Manual de usuario, plan e informe de pruebas, registro consolidado de hallazgos y procedimiento técnico de incidentes; trazabilidad de ampliaciones y actualización de índices. |

## 5. Decisiones y revisión

| Cambio | Acta o fuente | Revisión principal informada | Fecha de decisión registrada | Referencia de decisión |
|---|---|---|---|---|
| CC-01 | Solicitud docente | Tomás Cabrera y Juan Robaina; confirmación del 21/10. | 14/08/2026 | Solicitud registrada en este control; implementación del simulacro. |
| CC-02 | R-05 | Tomás Cabrera y Juan Robaina; confirmación del 21/10. | 03/09/2026 | R-05; implementación ac018b7 y evidencia del 13/10. |
| CC-03 | R-05 | Tomás Cabrera y Juan Robaina; confirmación del 21/10. | 03/09/2026 | R-05; implementación 05c1012 y pruebas de permisos. |
| CC-04 | R-05 | Tomás Cabrera y Juan Robaina; confirmación del 21/10. | 03/09/2026 | R-05; evidencia de gráficos del 13/10 y 21/10. |
| CC-05 | Decisión del equipo | Tomás Cabrera y Juan Robaina; confirmación del 21/10. | 30/09/2026; registro 02/10 | Respuesta B-04 del equipo; commits 68d34fb y d9c254c. |

## 6. Correspondencia del corte documental

| Documento | Fuente de contenido | Cobertura |
|---|---|---|
| [Manual de usuario](../general/manual_usuario.md) | Pantallas y clientes JavaScript vigentes. | Portal, cuentas, panel, aprobación y agenda académica. |
| [Plan e informe de pruebas](plan_informe_pruebas.md) | Suite HTTP/MySQL y resultados guardados. | Escenarios, entorno, matriz y resultados. |
| [Hallazgos de seguridad](../electiva_ciberseguridad/registro_hallazgos.md) | JSON y terminal de herramientas, auditoría API y fuente actual. | Avisos, controles y alcance de evaluación. |
| [Respuesta a incidentes](../electiva_ciberseguridad/respuesta_incidentes.md) | Infraestructura, permisos y herramientas operativas del proyecto. | Procedimiento técnico y registro de intervención. |

La ampliación documental describe el producto y los procedimientos. Los acuerdos de reuniones, las firmas y la aceptación conservan su registro en las actas del equipo.

## 7. Consolidación posterior del mismo corte

DOC-20261021-C completa registros desde commits y actas, incorpora las confirmaciones del equipo sobre restauración, segundo equipo y revisión principal, y prepara inventario y cierre de la entrega futura. Las estimaciones añadidas son retrospectivas; se mantienen los estados parciales del producto. Fuente: [consolidación](../../docs_auxiliares/revision/consolidacion_2026-10-21.md).

## 8. Referencias

[Actas](actas_reuniones.md), [requisitos](Requerimientos.md), [backlog](backlog.md), [verificación](../../docs_auxiliares/evidencias/verificacion.md), [API](../../docs_auxiliares/backend/api.md) y [Ciclo de vida y gestión de requisitos](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/ADA.md).
