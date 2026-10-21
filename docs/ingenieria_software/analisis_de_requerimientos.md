# Análisis de requisitos y casos de uso

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Versión:** 21/10/2026.

## 1. Problema y objetivos

La plataforma reúne información vial y su administración en un canal común. La ciudadanía consulta contenidos y practica con simulacros; el personal prepara información y la Directora revisa antes de publicar. El proyecto académico agrega la gestión de reservas y cupos.

## 2. Interesados

| Interesado | Necesidad | Expectativa |
|---|---|---|
| Intendencia de San José | Administrar la información y los datos de su servicio. | Canal de comunicación y operación de contenidos. |
| Inspector de Tránsito | Representar las necesidades del cliente. | Validar entregas y cambios en reuniones. |
| Directora | Revisar contenidos. | Separación entre aprobación y publicación. |
| Personal | Mantener información y consultar actividad. | Operaciones con permisos y trazabilidad. |
| Ciudadanía | Acceder a información comprensible. | Noticias vigentes, materiales, práctica y consultas. |
| Equipo RC5 | Desarrollar y entregar el proyecto. | Implementación, pruebas y documentación relacionadas. |

## 3. Actores

| Usuario | Interacción |
|---|---|
| Ciudadanía | Consulta contenidos, utiliza el simulacro y envía mensajes. |
| Cuenta pública | Opera sus reservas académicas. |
| Personal IMSJ | Gestiona contenidos, consultas, agenda, cuentas e historial. |
| Directora | Acceso administrativo y aprobación de contenidos. |

## 4. Casos de uso

### CU01 — Acceder y cerrar sesión

| Dato | Valor |
|---|---|
| Actor | Cuenta registrada |
| Precondición | Credenciales válidas |
| Flujo principal | Ingresar cédula y contraseña; recibir identidad y token; operar; cerrar sesión. |
| Alternativas | Credenciales inválidas o límite de intentos. |
| Postcondición | Token emitido o revocado. |
| Trazabilidad | RF1; RNF1. |

### CU02 — Consultar noticias

| Dato | Valor |
|---|---|
| Actor | Ciudadanía |
| Precondición | Contenido publicado y vigente |
| Flujo principal | Abrir noticias; consultar las publicaciones. |
| Alternativas | Listado vacío. |
| Postcondición | Noticias presentadas con su contenido. |
| Trazabilidad | RF2, RF8; RNF7. |

### CU03 — Gestionar una noticia

| Dato | Valor |
|---|---|
| Actor | Personal IMSJ |
| Precondición | Sesión administrativa |
| Flujo principal | Completar campos, fechas y recursos; guardar el contenido. |
| Alternativas | Campos, fechas o archivos inválidos. |
| Postcondición | Noticia y auditoría guardadas. |
| Trazabilidad | RF7–RF10. |

### CU04 — Aprobar y publicar

| Dato | Valor |
|---|---|
| Actor | Personal IMSJ / Directora |
| Precondición | Contenido en borrador |
| Flujo principal | Enviar a revisión; aprobar con Directora; publicar. |
| Alternativas | Rol o transición rechazados. |
| Postcondición | Contenido publicado. |
| Trazabilidad | RF21; CC-03. |

### CU05 — Consultar y gestionar materiales

| Dato | Valor |
|---|---|
| Actor | Ciudadanía / personal |
| Precondición | Recurso del tipo seleccionado |
| Flujo principal | Cargar PDF/imagen o URL de video; aplicar estados; consultar desde el portal. |
| Alternativas | Tipo, tamaño o URL inválidos. |
| Postcondición | Recurso disponible según publicación. |
| Trazabilidad | RF5, RF17, RF20. |

### CU06 — Consultar y gestionar FAQ

| Dato | Valor |
|---|---|
| Actor | Ciudadanía / personal |
| Precondición | Pregunta y respuesta |
| Flujo principal | Preparar, revisar y publicar una FAQ; consultar sus datos. |
| Alternativas | Contenido o transición inválidos. |
| Postcondición | FAQ publicada. |
| Trazabilidad | RF6, RF18. |

### CU07 — Resolver simulacro

| Dato | Valor |
|---|---|
| Actor | Aspirante |
| Precondición | Preguntas en el banco |
| Flujo principal | Consultar hasta diez preguntas; responder opciones; enviar y revisar corrección. |
| Alternativas | ID u opción inválidos o duplicados. |
| Postcondición | Total, aciertos y detalle de corrección. |
| Trazabilidad | RF22, RF24. |

### CU08 — Enviar y leer consulta

| Dato | Valor |
|---|---|
| Actor | Ciudadanía / personal |
| Precondición | Nombre, correo y mensaje |
| Flujo principal | Enviar consulta; abrir bandeja; desplegar y marcar como leída. |
| Alternativas | Campos inválidos o acceso interno rechazado. |
| Postcondición | Consulta guardada y lectura actualizada. |
| Trazabilidad | RF23. |

### CU09 — Crear franja

| Dato | Valor |
|---|---|
| Actor | Personal IMSJ |
| Precondición | Sesión administrativa |
| Flujo principal | Definir fecha, horario, tipo y cupos; guardar. |
| Alternativas | Fecha, intervalo, cupo o duplicado inválidos. |
| Postcondición | Franja disponible. |
| Trazabilidad | RF11–RF13. |

### CU10 — Reservar y cancelar

| Dato | Valor |
|---|---|
| Actor | Cuenta pública |
| Precondición | Franja disponible |
| Flujo principal | Elegir franja; confirmar reserva; consultar las propias; confirmar cancelación. |
| Alternativas | Duplicación, falta de cupo o reserva ajena. |
| Postcondición | Reserva creada o eliminada. |
| Trazabilidad | RF3–RF4; RNF8–RNF9. |

### CU11 — Consultar agenda

| Dato | Valor |
|---|---|
| Actor | Personal IMSJ |
| Precondición | Sesión administrativa |
| Flujo principal | Elegir día, semana o mes; recorrer el período. |
| Alternativas | Vista o fecha inválida. |
| Postcondición | Reservas vigentes y resumen del intervalo. |
| Trazabilidad | RF14–RF16. |

### CU12 — Consultar historial

| Dato | Valor |
|---|---|
| Actor | Personal IMSJ |
| Precondición | Sesión administrativa |
| Flujo principal | Abrir historial y consultar las acciones registradas. |
| Alternativas | Acceso o límite inválidos. |
| Postcondición | Acciones con actor, fecha y elemento. |
| Trazabilidad | RNF3. |

## 5. Reglas y parámetros

| Elemento | Regla |
|---|---|
| Publicación | Borrador → Pendiente → Aprobado → Publicado; Directora aprueba y personal publica. |
| Edición | Un contenido aprobado/publicado vuelve a borrador. |
| Noticias | La visibilidad pública utiliza estado y vigencia. |
| Simulacro | Hasta diez preguntas, cuatro opciones, corrección posterior y gráfico opcional. |
| Gráficos de prueba | Una imagen JPG/PNG/WEBP de hasta 2048 KB. |
| Videos | URL HTTP/HTTPS. |
| Reservas | Propiedad, fecha, duplicación y cupo validados. |
| Agenda | Vistas diaria, semanal y mensual de fechas vigentes. |
| Categorías FAQ | [] |
| Costo urgente | [] |
| Retención | [] |

## 6. Cambios y requisitos

| Cambio | Necesidad | Requisitos | Estado |
|---|---|---|---|
| CC-01 | Simulacros | RF22 | Listo |
| CC-02 | Consultas ciudadanas | RF23 | Listo |
| CC-03 | Aprobación de contenidos | RF21 | Listo |
| CC-04 | Gráficos de preguntas | RF24 | Listo |
| CC-05 | Backend PHP nativo | Transversal | Listo |

## 7. Verificación

La suite del 21/10 registra 192 comprobaciones, 60 peticiones distintas y 46 declaraciones de endpoint. La prueba concurrente del último cupo produjo 201 y 422. La auditoría Bash completa registra 43 aprobadas, 0 fallidas y 0 omitidas.

| Dato | Valor |
|---|---|
| Validación de requisitos | [] |
| Fecha | [] |
| Referencia de aceptación | [] |

## 8. Referencias

[Especificación](Requerimientos.md), [backlog](backlog.md), [verificación](../../docs_auxiliares/evidencias/verificacion.md) y [Especificación y modelado del curso](https://github.com/portalutu/ing_software-3ro-bt/blob/main/Teoricos/ADA.md).
