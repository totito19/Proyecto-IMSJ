# Control de cambios

**Proyecto:** Sistema de Gestión para Educación y Tránsito — IMSJ  
**Fecha de registro documental:** 07/09/2026

Este documento registra los cambios comunicados por el equipo, sus fechas y las aclaraciones posteriores. El estado **Registrado** indica que la solicitud está documentada; no acredita su implementación, sus pruebas ni su aceptación final.

## 1. Registro de solicitudes

| Código | Fecha de solicitud | Cambio | Solicitante o instancia informada | Estado |
|---|---|---|---|---|
| CC-01 | 14/08/2026 | Incorporar simulacros de pruebas teóricas. | Profesores, para mantener el nivel del curso. | Registrado |
| CC-02 | 03/09/2026 | Incorporar un formulario de consultas en el pie de página y su lectura en el panel IMSJ. | Auditoría / demo con el cliente. | Registrado |
| CC-03 | 03/09/2026 | Incorporar la validación de contenidos por la Directora y separar la aprobación de la publicación. | Auditoría / demo con el cliente. | Registrado |
| CC-04 | 03/09/2026 | Permitir adjuntar material gráfico a las preguntas de los test. | Solicitante e instancia no especificados. | Registrado |

## 2. Detalle de los cambios

### CC-01 — Simulacros de pruebas teóricas

**Solicitud:** agregar simulacros de pruebas teóricas al sistema.

**Motivo informado:** solicitud de los profesores para mantener el nivel del curso.

**Definiciones pendientes:** configuración del simulacro y criterios de resultado. No se establecen cantidades de preguntas, duración ni puntajes en este registro.

### CC-02 — Formulario de consultas y apartado en el panel IMSJ

**Solicitud:** agregar un formulario de consultas en el pie de página del sitio. Las consultas enviadas deben llegar a un apartado **Consultas** del panel IMSJ, donde cada consulta pueda desplegarse para leer su contenido.


### CC-03 — Validación de contenidos por la Directora

**Solicitud:** ampliar el manejo de estados de los contenidos e incorporar el rol **Directora**, responsable de su validación.

El flujo confirmado es:

**Borrador → Pendiente → Aprobado → Publicado**

| Estado | Significado |
|---|---|
| Borrador | Contenido en preparación. |
| Pendiente | Contenido enviado para revisión de la Directora. |
| Aprobado | Contenido validado por la Directora y habilitado para su publicación posterior. |
| Publicado | Contenido publicado mediante una acción independiente de la aprobación. |


### CC-04 — Material gráfico en las preguntas de los test

**Solicitud:** permitir adjuntar material gráfico a las preguntas de los test o simulacros teóricos.

**Relación:** amplía el módulo de simulacros incorporado mediante CC-01.

**Aspectos a revisar:** carga de adjuntos, asociación con la pregunta, almacenamiento y presentación al resolver el test.

**Definiciones pendientes:** solicitante e instancia de origen, formatos admitidos, cantidad y tamaño de adjuntos, y si su incorporación será opcional u obligatoria.
