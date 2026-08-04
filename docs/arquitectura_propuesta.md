# Arquitectura Propuesta

**Asignatura:** Administración de Sistemas Operativos (Adm. SSOO) — 1ª entrega
**Proyecto:** Plataforma Web Educación Vial IMSJ


---

## 1. Visión general de la arquitectura

La solución se organiza como una aplicación web de tres capas. La capa de presentación está dividida en
dos interfaces independientes: `frontend-publico`, orientado a la ciudadanía, y `frontend-imsj`, destinado
al personal administrativo. Ambas interfaces se comunican mediante solicitudes HTTP con un backend común,
expuesto como API REST. El backend centraliza la lógica de negocio, la autenticación, la autorización, la
validación de datos y el acceso a la base de datos.

La agenda forma parte del proyecto de egreso por su complejidad técnica,
pero queda excluida de la entrega al cliente por petición de este. Por lo tanto, la arquitectura contempla
reservas y franjas de disponibilidad para la versión académica, sin presentarlas como parte de la entrega
comprometida con la IMSJ.

## 2. Diagrama de arquitectura

> **Diagrama pendiente de elaboración por el equipo.** Debe representar `frontend-publico`,
> `frontend-imsj`, el backend/API REST y la base de datos, incluyendo el sentido de la comunicación entre
> los componentes y dejando claro que únicamente el backend accede a la base de datos.

## 3. Componentes

| Componente | Tecnología propuesta | Responsabilidad |
|---|---|---|
| Frontend público | Aplicación web basada en HTML5, CSS3 y JavaScript. No se documenta el uso de un framework. | Permitir a la ciudadanía consultar noticias, materiales de estudio y preguntas frecuentes. En la versión académica también permitirá solicitar turnos; esta función queda fuera de la entrega al cliente. |
| Frontend IMSJ (dashboard) | HTML5, CSS3 y JavaScript, de acuerdo con los archivos actuales de `frontend-imsj`. | Permitir al personal iniciar sesión y administrar noticias, materiales, preguntas frecuentes y su visibilidad. En la versión académica también incluye la gestión de franjas y la consulta de la agenda. |
| Backend / API | API REST. El lenguaje y el framework de implementación todavía no están definidos en la documentación. | Centralizar la lógica de negocio, autenticar y autorizar usuarios, validar solicitudes, prevenir operaciones inválidas y controlar todo acceso a datos y archivos. |
| Base de datos | Motor de base de datos todavía no definido. | Persistir usuarios, noticias, materiales, preguntas frecuentes, estados de publicación e historial de acciones. Para la versión académica también almacenará franjas y reservas. |
| Archivos de contenido | Mecanismo de almacenamiento todavía no definido; su acceso será gestionado por el backend. | Conservar y servir las imágenes asociadas a noticias y los materiales de estudio en PDF, imagen o video definidos por el proyecto. |

## 4. Infraestructura propuesta

| Aspecto | Definición | Estado |
|---|---|---|
| Entorno de despliegue | La documentación actual no define si se utilizará un servidor propio, hosting externo o contenedores. Este punto debe resolverse antes de implementar el despliegue. | Pendiente de definición y relevamiento con la IMSJ. |
| Sistema operativo del servidor | No definido. Su elección dependerá del entorno de despliegue y de la tecnología que el equipo seleccione para el backend. | Pendiente. |
| Dispositivos del personal IMSJ | El sistema será accesible mediante navegador web. No se relevaron modelos, sistemas operativos ni características concretas de los equipos utilizados por el personal. | Requisito de acceso web definido; hardware pendiente de relevamiento. |
| Requisitos de red / acceso | El frontend público deberá estar disponible para la ciudadanía y el dashboard se reservará al personal autorizado. La comunicación con la API deberá realizarse mediante HTTPS. | Definición general establecida; configuración concreta pendiente del despliegue. |

> La justificación tecnológica detallada y la documentación de infraestructura (scripts, docker
> files, etc.) corresponden a la 2ª entrega según `Lineamientos/requerimientos_por_asignatura.md`.

## 5. Consideraciones de seguridad de la arquitectura

La separación entre el frontend público y el dashboard debe mantenerse también en el backend. No alcanza
con ocultar enlaces o botones: cada endpoint administrativo debe exigir autenticación y verificar que el
usuario pertenece al personal IMSJ, en cumplimiento de RNF1.

Las entradas recibidas por la API deben validarse en el servidor antes de ser procesadas o persistidas
(RNF2). El contenido que luego se muestre en los frontends debe tratarse de forma segura para evitar XSS,
y las operaciones sobre la base de datos deben utilizar consultas parametrizadas. Los archivos cargados
deben limitarse a los formatos previstos por el proyecto y validarse antes de su almacenamiento.

Las contraseñas no deben almacenarse en texto plano. Las credenciales de la base de datos y otros secretos
deben mantenerse fuera del código fuente, y toda comunicación entre los navegadores y la API debe viajar
mediante HTTPS. La protección de datos debe abarcar tanto a los usuarios administrativos como a los datos
de ciudadanos que se utilicen en la agenda académica (RNF4).

El backend debe registrar las acciones administrativas requeridas por RNF3, incluyendo usuario, acción,
fecha y elemento afectado. También se deberán definir copias de respaldo y un procedimiento de
restauración para la base de datos y los archivos. En el módulo académico de agenda, la asignación de un
cupo debe ejecutarse como una operación atómica para impedir dobles reservas (RNF8).

## 6. Riesgos de arquitectura identificados

| Riesgo | Impacto | Mitigación propuesta |
|---|---|---|
| Definición tardía del backend, la base de datos y el despliegue | Puede retrasar la integración de los frontends y obligar a rehacer partes del sistema. | Seleccionar y documentar estas tecnologías antes de la segunda entrega, comprobando que cubran autenticación, archivos, auditoría y transacciones. |
| Acceso directo o no autorizado a funciones administrativas | Una persona ajena podría crear, modificar, publicar o eliminar información. | Centralizar la autorización en el backend y verificar una sesión válida y el rol correspondiente en cada endpoint administrativo. |
| Caída del backend o de la base de datos | Ambos frontends perderían acceso a la información y a las operaciones del sistema. | Definir monitoreo, manejo controlado de errores, copias de respaldo y un procedimiento probado de restauración. |
| Pérdida o corrupción de datos y archivos | Podrían desaparecer noticias, materiales, preguntas frecuentes, reservas o registros de auditoría. | Aplicar validaciones, transacciones cuando correspondan, respaldos periódicos y restricciones de acceso a la persistencia. |
| Doble reserva de una franja | Dos ciudadanos podrían ocupar el mismo cupo y la agenda quedaría inconsistente. | Ejecutar la comprobación y la confirmación como una única operación atómica en la capa de persistencia, de modo que solicitudes simultáneas no puedan superar los cupos disponibles. |
| Carga de archivos inseguros | Un archivo podría afectar al servidor o a los ciudadanos que accedan a los materiales. | Permitir solo los formatos definidos, validar extensión y tipo real, limitar tamaño, usar nombres seguros e impedir la ejecución de los archivos cargados. |
| Diferencia entre la versión académica y la entrega al cliente | Podría generarse confusión sobre qué módulos deben demostrarse o instalarse para la IMSJ. | Mantener documentada la agenda como alcance académico y separarla claramente de la entrega comprometida con el cliente. |

## 7. Documentación consultada

- [Project Charter — Proyecto Educación Vial IMSJ](https://github.com/totito19/Proyecto-IMSJ/blob/main/docs/project_charter.md)
- [Documento de Requisitos](https://github.com/totito19/Proyecto-IMSJ/blob/main/docs/Requerimientos.md)
- [Concepción y documentación general del proyecto](https://github.com/totito19/Proyecto-IMSJ/blob/main/docs/documentacion_proyecto_imsj.md)
- [Descripción y responsabilidades del backend](https://github.com/totito19/Proyecto-IMSJ/blob/main/backend/README.md)
- [Estructura general del repositorio](https://github.com/totito19/Proyecto-IMSJ/blob/main/README.md)

---
