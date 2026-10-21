# Manual de usuario — Portal Vial

**Proyecto:** Educación Vial IMSJ. **Equipo:** RC5. **Versión de referencia:** código del 21/10/2026, base `1a43229`.

## 1. Acceso y navegación

Portal Vial reúne noticias de Tránsito, materiales de estudio, preguntas frecuentes y práctica de pruebas teóricas. Desde el pie de las páginas se pueden enviar consultas al personal de la Intendencia de San José.

En una instalación local con el puerto predeterminado, abrir `http://localhost:8000/frontend-publico/`. La persona que prepara la instalación puede utilizar `backend/iniciar.bat`; cuando el sistema está disponible, el navegador abre el portal. Si el inicio selecciona otro puerto, utilizar la dirección que muestra su ventana.

El menú permite cambiar de sección. En pantallas pequeñas se despliega mediante el botón de menú. Los mensajes de carga, confirmación y error aparecen junto a la operación correspondiente.

| Perfil | Funciones |
|---|---|
| Visitante | Noticias, materiales, FAQ, simulacro y envío de consultas. |
| Ciudadano con cuenta | Funciones públicas y reservas propias de la versión académica. |
| Personal IMSJ | Gestión de contenidos, banco de preguntas, consultas, cuentas, historial y agenda académica. |
| Directora | Funciones del personal y aprobación de noticias, materiales y FAQ. |

## 2. Noticias, materiales y preguntas frecuentes

### Noticias

1. Seleccionar **Noticias** en la navegación del portal.
2. Consultar los títulos, imágenes y textos disponibles.
3. Volver a la sección para consultar otra publicación.

El portal presenta noticias publicadas dentro de su período de vigencia. Una noticia que se encuentra en preparación, revisión o aprobación permanece en el panel interno.

### Materiales de estudio

1. Seleccionar **Materiales de estudio**.
2. Identificar el recurso por su nombre y tipo.
3. Seleccionar **Abrir material**.

Los PDF e imágenes se abren desde el almacenamiento del sistema. Los videos se consultan mediante el enlace cargado por el personal y necesitan acceso al sitio donde están alojados. La apertura en otra pestaña depende de la configuración del navegador.

### Preguntas frecuentes

Seleccionar **Preguntas frecuentes** y leer la pregunta junto a su respuesta. Esta sección presenta las FAQ publicadas por el personal mediante el circuito de aprobación.

## 3. Realizar un simulacro

1. Abrir la sección del simulacro de prueba teórica.
2. Esperar la carga de las preguntas. Cada sesión presenta hasta diez, según el banco disponible.
3. Leer el enunciado y observar su imagen cuando la tenga.
4. Marcar una de las cuatro opciones de cada pregunta.
5. Utilizar el botón de corrección del formulario.
6. Revisar el total de aciertos y las opciones señaladas como correctas o incorrectas.
7. Utilizar el botón de nueva simulación para comenzar otra práctica.

El formulario exige responder todas las preguntas presentadas. La corrección se obtiene del servidor después del envío. La práctica muestra aciertos sobre el total y permite revisar las respuestas; funciona sin temporizador ni calificación mínima de aprobación.

Si aparece **Todavía no hay preguntas disponibles**, el banco de preguntas está vacío. El personal puede incorporar preguntas desde su panel.

## 4. Enviar una consulta

1. Ir al pie de una página del portal y localizar **¿Tenés una consulta?**.
2. Completar nombre, correo electrónico y mensaje.
3. Seleccionar **Enviar consulta**.
4. Esperar el mensaje **Consulta enviada correctamente**.

El nombre admite hasta 120 caracteres y el mensaje hasta 2000. El correo debe tener un formato válido. La confirmación indica que el mensaje fue guardado para su lectura por el personal. Si aparece un error, conservar el texto y corregir el campo indicado antes de reenviar.

## 5. Iniciar y cerrar sesión

En la pantalla de acceso, elegir **Ciudadano** o **Personal IMSJ** según la cuenta. Ingresar cédula y contraseña y seleccionar **Ingresar**. Cada pestaña comprueba que la cuenta pertenezca al perfil correspondiente.

Para crear una cuenta ciudadana, elegir **Ciudadano → Registrarme**, completar cédula, contraseña y confirmación, y seleccionar **Crear cuenta**. La contraseña debe tener al menos seis caracteres; las dos entradas deben coincidir.

La sesión dura hasta ocho horas. Un nuevo ingreso con la misma cuenta reemplaza la sesión anterior. Utilizar **Cerrar sesión** al finalizar, especialmente en equipos compartidos. Cuando la sesión vence o se revoca, ingresar nuevamente para continuar con operaciones protegidas.

Ante el mensaje de demasiados intentos, esperar el intervalo indicado antes de volver a intentar. Las contraseñas distinguen los espacios ingresados.

## 6. Reservas de la versión académica

Las pantallas de agenda forman parte de la demostración académica. El alcance de entrega al cliente se describe en la [especificación](../ingenieria_software/Requerimientos.md).

### Reservar un horario

1. Abrir **Agenda** para una prueba de manejo o **Renovar licencia** para una renovación.
2. En renovación, elegir modalidad normal o urgente.
3. Consultar fecha, horario y cupos disponibles.
4. Seleccionar **Reservar** en la franja elegida.
5. Si la pantalla solicita ingreso, utilizar una cuenta ciudadana y volver a la agenda.
6. Esperar la confirmación con fecha y hora.

El sistema vuelve a comprobar la disponibilidad al confirmar. Si otra persona ocupa el último cupo o la cuenta ya tiene esa franja reservada, muestra el error correspondiente. La modalidad urgente identifica el tipo de reserva en esta versión.

### Consultar y cancelar

1. Seleccionar **Ver mis reservas** o **Consultar reserva**.
2. Revisar las reservas actuales y futuras asociadas a la cuenta.
3. Para retirar una, seleccionar **Cancelar reserva**.
4. Confirmar la pregunta de la pantalla.
5. Comprobar que desaparezca de la lista.

La cancelación libera el cupo. Para elegir otro horario se realiza una nueva reserva. Cada cuenta puede cancelar sus propias reservas.

## 7. Acceder al panel IMSJ

Ingresar desde **Personal IMSJ** o abrir `http://localhost:8000/frontend-imsj/` con una sesión de personal. La barra lateral permite cambiar entre noticias, materiales, FAQ, preguntas del simulador, consultas, usuarios y agenda académica.

La primera cuenta se prepara mediante la [instalación del backend](../../backend/README.md#instalación-nueva-con-docker). Las cuentas siguientes se crean desde la sección de usuarios. El panel comunica la clave inicial al completar el alta.

### Preparar una noticia

1. Abrir **Noticias** y seleccionar **Nueva noticia**.
2. Completar título, cuerpo y fin de vigencia.
3. Seleccionar una portada si corresponde: JPG, PNG o WEBP de hasta 2 MB.
4. Seleccionar **Guardar borrador**.
5. Revisar la noticia en la lista y enviarla a revisión.

El formulario fija el inicio de vigencia al crear la noticia y conserva ese dato al editarla. El botón **Editar** permite modificar los campos de la pantalla. La búsqueda filtra por título, texto o estado.

### Aprobar y publicar contenidos

| Estado | Operación disponible | Resultado |
|---|---|---|
| Borrador | **Enviar a revisión** | Pendiente. |
| Pendiente, con cuenta Directora | **Aprobar** | Aprobado. |
| Aprobado | **Publicar** | Publicado. |
| Publicado | **Retirar** | Borrador. |

Este circuito se aplica a noticias, materiales y FAQ. Una cuenta de personal observa **Pendiente de Directora** durante la revisión. La aprobación deja el contenido preparado para publicar; luego se utiliza **Publicar**. Al editar un contenido aprobado o publicado, vuelve a borrador y recorre nuevamente el circuito.

### Gestionar materiales

1. Abrir **Materiales** y utilizar el alta de material.
2. Completar el nombre y elegir PDF, imagen o video.
3. Para PDF, seleccionar un archivo de hasta 10 MB. Para imagen, seleccionar JPG, PNG o WEBP de hasta 5 MB.
4. Para video, completar una URL HTTP o HTTPS.
5. Guardar y seguir el circuito de revisión, aprobación y publicación.

En una edición, la pantalla permite conservar el archivo actual si se mantiene su tipo. **Abrir recurso** permite comprobar el material cargado. Antes de eliminar, la pantalla solicita confirmación.

### Gestionar preguntas frecuentes

Abrir la sección de preguntas frecuentes, crear o editar el enunciado y la respuesta, guardar y seguir el circuito de publicación. La búsqueda ayuda a localizar preguntas existentes. La eliminación requiere confirmar la acción.

### Gestionar preguntas del simulador

1. Abrir el banco de preguntas del simulador y crear una pregunta.
2. Completar el enunciado y las cuatro opciones A, B, C y D.
3. Seleccionar la respuesta correcta.
4. Adjuntar, si corresponde, una imagen JPG, PNG o WEBP de hasta 2 MB.
5. Guardar y comprobar la fila del banco.

Al editar una pregunta con imagen se puede conservarla, sustituirla o marcar su eliminación. El banco del simulador tiene acciones propias de alta, edición y eliminación; sus preguntas se utilizan en la práctica pública.

### Leer consultas ciudadanas

Abrir **Consultas**, buscar por nombre, correo o texto y desplegar el mensaje. Al abrir una consulta nueva se registra su lectura y se actualiza el contador de no leídas. **Escribir a** abre el programa de correo configurado en el equipo; el envío se realiza desde ese programa.

### Administrar cuentas e historial

En **Usuarios**, completar nombre, cédula y rol para crear acceso. El panel muestra la clave inicial al terminar. **Quitar acceso** desactiva la cuenta seleccionada y sus sesiones, conservando sus relaciones históricas. La pantalla identifica la cuenta propia como **Tu cuenta**.

La campana abre **Historial de acciones** y consulta las veinte acciones más recientes. Allí se identifica a la persona, operación, elemento y fecha registrados por el sistema.

### Administrar agenda académica

En **Franjas de disponibilidad**, cargar fecha, hora de inicio, hora de fin, trámite y cupos. Revisar que el horario final sea posterior al inicial. Una franja con reservas conserva sus relaciones y el sistema impide eliminarla mientras las tenga.

En **Agenda**, seleccionar fecha y vista diaria, semanal o mensual. Las consultas reúnen las reservas vigentes y futuras del intervalo elegido.

## 8. Resolver situaciones habituales

| Situación | Acción |
|---|---|
| No aparecen contenidos públicos | Comprobar que estén publicados; para noticias, revisar también la vigencia. |
| Falta la acción Aprobar | Ingresar con la cuenta Directora y comprobar que el contenido esté pendiente. |
| Una edición retira una publicación | Revisar el borrador y volver a enviarlo a aprobación. |
| El archivo es rechazado | Revisar tipo real, extensión y tamaño permitido. |
| La agenda no ofrece horarios | Revisar trámite, fecha y cupos de las franjas cargadas. |
| La operación solicita iniciar sesión | Volver a ingresar con el perfil que corresponde. |
| El video no abre | Comprobar conexión y disponibilidad del sitio del video. |
| El portal no responde | Comprobar el inicio de Docker y la dirección mostrada por la instalación. |

## 9. Documentos relacionados

[Requisitos](../ingenieria_software/Requerimientos.md), [instalación](../administracion_ssoo/reconstruccion-infraestructura.md) y [plan e informe de pruebas](../ingenieria_software/plan_informe_pruebas.md).
