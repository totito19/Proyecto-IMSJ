# Análisis de requerimientos — Portal Vial

## 1. Introducción

### 1.1 Propósito

Este documento describe el problema identificado junto con la Intendencia de San José — Sección Tránsito, la solución propuesta, los usuarios involucrados, el alcance y las principales restricciones de Portal Vial. La especificación detallada de los requisitos funcionales y no funcionales se mantiene en [Requerimientos.md](Requerimientos.md).

### 1.2 Cliente y partes interesadas

| Parte interesada | Relación con el sistema | Necesidades principales |
|---|---|---|
| Intendencia de San José — Sección Tránsito | Cliente y responsable de la operación posterior | Disponer de un canal institucional centralizado, administrable y trazable. |
| Inspector de Tránsito | Referente del cliente | Validar necesidades, entregas y cambios de alcance. |
| Directora de Tránsito | Responsable de aprobación | Revisar y aprobar contenidos antes de su publicación. |
| Personal de la Sección Tránsito | Usuario interno | Mantener contenidos, consultas, cuentas, agenda e historial. |
| Ciudadanía y aspirantes | Usuarios externos | Consultar información, practicar, comunicarse y gestionar reservas. |
| Equipo RC5 | Desarrollo y transferencia | Implementar, verificar, documentar y entregar el sistema. |

## 2. Problema identificado

La Sección Tránsito necesita comunicar noticias, materiales de estudio y respuestas a preguntas frecuentes mediante un canal único y accesible. Sin una plataforma centralizada, la información puede quedar distribuida entre distintos medios, perder vigencia o depender de intervenciones técnicas para ser actualizada. Esta situación dificulta que la ciudadanía encuentre material confiable y que el personal mantenga una versión clara de lo publicado.

El cliente también necesita controlar el proceso previo a la publicación. El personal debe poder preparar información, pero los contenidos no deben hacerse públicos hasta que la Directora los revise y apruebe. Además, las modificaciones deben quedar asociadas a la persona que las realizó para facilitar la trazabilidad y la revisión interna.

Los aspirantes a obtener o renovar la libreta de conducir necesitan recursos de preparación, preguntas de práctica y un mecanismo claro para consultar disponibilidad. El personal, por su parte, necesita administrar franjas, cupos y reservas sin duplicaciones ni sobreasignación. Finalmente, la ciudadanía requiere un canal para enviar consultas que puedan ser recibidas y gestionadas por la Sección Tránsito.

Los grupos afectados son la ciudadanía que busca información, los aspirantes que practican o reservan, el personal que mantiene los datos y la Dirección que asume la responsabilidad de aprobación. Por eso el problema no se limita a publicar páginas: también comprende control de acceso, vigencia, integridad de cupos, trazabilidad, protección de datos y continuidad operativa.

## 3. Solución propuesta

Portal Vial reúne en una misma plataforma un portal público, un panel de gestión y una API conectada a una base de datos. La solución responde al problema de dispersión mediante un punto de consulta único para noticias, materiales de estudio y preguntas frecuentes.

El portal permite a la ciudadanía:

- consultar contenidos vigentes y materiales de preparación;
- resolver simulacros de pruebas teóricas con corrección del servidor;
- enviar consultas a la Sección Tránsito;
- crear una cuenta, consultar franjas disponibles y gestionar sus propias reservas.

El panel permite al personal:

- crear y mantener noticias, materiales y preguntas frecuentes;
- recibir consultas y registrar su lectura;
- administrar preguntas del simulador, usuarios, franjas, cupos y agenda;
- consultar un historial de acciones.

El circuito `Borrador → Pendiente → Aprobado → Publicado` separa la preparación de la aprobación. La Directora es el único rol autorizado para aprobar; el personal publica posteriormente el contenido aprobado. Las reglas se aplican en la API para que no dependan únicamente de los botones visibles en el navegador.

La solución se entrega en contenedores para que la Intendencia pueda reconstruirla, conservar datos y adjuntos, realizar respaldos y comprobar restauraciones sin depender del equipo donde fue desarrollada.

## 4. Alcance

### 4.1 Incluido

- Portal público con noticias, materiales de estudio y preguntas frecuentes.
- Simulacros de pruebas teóricas con material gráfico opcional.
- Consultas ciudadanas y bandeja interna con estado de lectura.
- Panel de gestión, roles, aprobación de contenidos e historial.
- Registro de ciudadanos e inicio y cierre de sesión.
- Agenda de trámites, franjas, cupos, reservas y cancelación propia.
- Consultas de agenda diaria, semanal y mensual.
- API PHP, persistencia MySQL y ejecución mediante Docker Compose.
- Procedimientos de instalación, operación, backup y restauración.

### 4.2 Excluido

- Emisión, renovación o validación legal de la libreta de conducir dentro del sistema.
- Pagos en línea y conexión con sistemas externos de expedientes.
- Envío automático de correos o mensajes de texto.
- Publicación en Internet sin dominio institucional, HTTPS y políticas operativas aprobadas.

## 5. Usuarios y funciones principales

| Actor | Funciones principales |
|---|---|
| Visitante | Consultar noticias, materiales y FAQ; realizar simulacros; enviar consultas. |
| Ciudadano registrado | Iniciar sesión, reservar franjas, consultar y cancelar sus reservas. |
| Personal IMSJ | Gestionar contenidos, consultas, usuarios, preguntas, franjas, agenda e historial. |
| Directora | Realizar las funciones del personal y aprobar contenidos antes de su publicación. |

## 6. Casos de uso principales

| Caso de uso | Actor principal | Resultado esperado |
|---|---|---|
| Consultar contenidos publicados | Visitante | Obtiene información vigente sin autenticarse. |
| Resolver un simulacro | Visitante | Recibe la corrección calculada por el servidor. |
| Enviar una consulta | Visitante | El mensaje queda disponible en la bandeja interna. |
| Gestionar una reserva | Ciudadano registrado | Reserva o cancela una franja propia sin exceder cupos. |
| Preparar contenido | Personal IMSJ | Guarda un borrador y lo envía a revisión. |
| Aprobar contenido | Directora | Autoriza un contenido pendiente para su publicación posterior. |
| Publicar contenido | Personal IMSJ | Hace visible un contenido previamente aprobado. |
| Administrar agenda | Personal IMSJ | Mantiene franjas y consulta reservas por intervalo. |
| Consultar historial | Personal IMSJ | Revisa las acciones administrativas registradas. |

## 7. Requerimientos y trazabilidad

El sistema cuenta con 24 requerimientos funcionales y 10 requerimientos no funcionales. Cada requisito se relaciona con historias del [Product Backlog](backlog.md) y escenarios del [plan e informe de pruebas](plan_informe_pruebas.md).

| Grupo | Contenido |
|---|---|
| Funcionales | Acceso, noticias, materiales, preguntas frecuentes, simulacros, consultas, aprobación de contenidos, usuarios, agenda y reservas. |
| No funcionales | Roles, validación, auditoría, protección de datos, adaptación móvil, accesibilidad, vigencia e integridad de reservas. |

## 8. Restricciones y supuestos

- La operación institucional requiere un servidor administrado, dominio y HTTPS antes de publicar el servicio en Internet.
- MySQL no se expone directamente a la red; el acceso a los datos se realiza mediante la API.
- Los videos se almacenan como enlaces y dependen de la disponibilidad del proveedor externo.
- La infraestructura parte de 2 vCPU, 4 GB de RAM y 30 GB SSD/NVMe para un objetivo de hasta 90 sesiones simultáneas. Debe validarse con una prueba de carga y ampliarse si CPU, RAM o disco superan de forma sostenida el 70 %.
- La política de conservación de datos y la responsabilidad permanente de los respaldos deben ser definidas por la Intendencia.

## 9. Arquitectura de referencia

El sistema se ejecuta con Docker Compose sobre Ubuntu Server. Apache sirve los frontends y dirige las solicitudes de `/api` al backend PHP; la API valida acceso y datos, aplica las reglas mediante servicios y utiliza repositorios PDO para comunicarse con MySQL.

**Flujo principal:** usuario → navegador/frontend → Apache → router de la API → controlador → servicio → repositorio → MySQL → respuesta HTTP → frontend.

La infraestructura y el recorrido completo se desarrollan en [arquitectura propuesta](../administracion_ssoo/arquitectura_propuesta.md); el modelo de datos y clases se encuentra en [Diagramas](../programacion_full_stack/Diagramas/README.md).
