# Plan de preparación — entrega 29/10/2026 y defensa 05/11/2026

**Actualización documental:** 23/10/2026.

## 1. Fechas, alcance y regla de trabajo

- **Entrega final:** jueves 29/10/2026.
- **Defensa:** jueves 05/11/2026.
- El plan prevé desde el 26/10 un **congelamiento funcional**: no se agregan funciones nuevas. Solo se corrigen defectos que impidan entregar, instalar o demostrar el sistema.
- Una tarea se considera terminada únicamente si incluye: implementación, prueba, evidencia, documentación actualizada y cambio guardado en Git.
- Las actividades se registran con fecha, responsable, resultado y referencia.

## 2. Resultado que debe existir el 29/10

### Producto ejecutable

- Frontend público y panel interno utilizables.
- Backend/API y base de datos funcionando.
- Flujo principal demostrado de punta a punta.
- Docker Compose capaz de levantar el sistema desde una instalación limpia.
- Esquema SQL, datos de demostración y usuarios de prueba preparados.
- Repositorio sin secretos, archivos temporales ni cambios sin guardar.
- Versión exacta de entrega identificada con un tag, por ejemplo `entrega-final-2026-10-29`.

### Ingeniería de Software

- Project Charter.
- Registro real de entrevistas y reuniones.
- Análisis, requisitos y arquitectura.
- Backlog actualizado con estado y criterio de aceptación.
- Actas de Sprint Review con demostración, feedback y correcciones.
- Control de cambios: qué cambió, motivo, solicitante, impacto, decisión y estado.
- Plan e informe de pruebas.
- Acta de cierre con entregables, requisitos evaluados, observaciones, lecciones y aceptación.
- Declaración ética de uso de IA completada y firmada por quienes corresponda.
- [Manual de usuario](../ingenieria_software/manual_usuario.md), con recorridos del portal y panel; capturas del candidato de entrega.
- [Plan e informe de pruebas](../ingenieria_software/plan_informe_pruebas.md), con matriz de trazabilidad y resultados.

### Desarrollo Full Stack

- Interfaces pública e interna claramente diferenciadas.
- API REST PHP/MySQL y consumo desde el frontend.
- Validaciones, permisos, manejo de errores y medidas de seguridad básicas.
- Estructura modular y documentación de instalación.
- Docker Compose completo y comprobado.
- Decisión tecnológica documentada: PHP nativo y Fetch, con su justificación, impacto y comprobación en el producto entregado.

### Administración de Sistemas Operativos

- Análisis, arquitectura y justificación tecnológica actualizados.
- Documentación de infraestructura y reconstrucción comprobada.
- Backup completo de base de datos, volúmenes/datos, archivos de configuración y código.
- Restauración real en una instancia o base temporal, con evidencia de consultas correctas.
- Estrategia 3-2-1: tres copias, dos medios y una copia fuera del equipo principal.

### Ciberseguridad

- Evidencia SAST sobre el código actual.
- DAST sobre el sistema local propio mediante OWASP ZAP y revisión de puertos con Nmap.
- Script Bash de auditoría automática de la API REST.
- Informe final de hallazgos, prioridad, corrección aplicada y nueva prueba.
- [Procedimiento técnico de respuesta a incidentes](../electiva_ciberseguridad/respuesta_incidentes.md).
- [Registro de hallazgos y tratamiento ético de evidencias](../electiva_ciberseguridad/registro_hallazgos.md).

### Entrega física

- Una carpeta impresa por área documental, conforme al inventario de entrega.
- Pendrive con código, documentación, SQL, Docker, backup y evidencias.
- Acuse de recibo detallado en dos copias: una queda con la institución y otra vuelve firmada al equipo.
- Copia idéntica de todo el material fuera del pendrive entregado.

## 3. Distribución de trabajo por responsabilidades

| Área | Responsable principal | Revisión cruzada |
|---|---|---|
| Integración, backend, Docker y versión final | Tomás Cabrera | Gabriela y Juan Robaina |
| Pruebas, documentos y control de evidencias | Juan Robaina | Todo el equipo |
| Base de datos, backup y restauración | Gabriela Romero | Tomás |
| Frontend público, responsive y capturas del manual | Verónica Romero | Juan Corrales |
| Panel interno, accesibilidad y preparación de la demo | Juan Corrales | Verónica |
| Declaración de IA, cierre y defensa | Todo el equipo | Revisión entre pares |

Cada responsable debe tener un suplente capaz de ejecutar su parte el día de la defensa.

## 4. Paso a paso hasta la entrega

### Lunes 19/10 — organizar y fijar la línea de base

1. Guardar la comunicación que confirma 29/10 y 05/11.
2. Reunión de 45 minutos para aceptar este cronograma y asignar cada tarea.
3. Convertir este documento en un tablero simple: `Pendiente`, `En curso`, `Para revisar`, `Terminado`.
4. Revisar los cambios locales existentes en el momento de ejecución y agruparlos de acuerdo con su propósito.
5. Elegir la computadora de demostración y comprobar su motor Docker; utilizar el registro de arranque como referencia operativa.
6. Crear una lista única de bloqueos y decisiones pendientes.

**Salida del día:** responsables confirmados, tablero visible, equipo de demo elegido y estado inicial guardado.

### Martes 20/10 — ordenar Git y eliminar contradicciones

1. Separar los cambios actuales en commits coherentes: backend, frontend, base de datos y documentos.
2. Subirlos a ramas y usar Pull Requests reales para la revisión final; no fabricar historial anterior.
3. Revisar que no se publiquen `.env`, contraseñas, datos personales, backups sensibles o archivos temporales.
4. Eliminar o archivar código de prueba que pueda confundirse con el sistema actual, especialmente datos simulados antiguos no cargados por la aplicación.
5. Corregir contradicciones entre documentos y realidad, por ejemplo si Docker ya fue ejecutado o si una sección de seguridad describe código anterior.
6. Ejecutar verificación de sintaxis PHP y JavaScript.

**Salida del día:** trabajo actual ordenado, revisable y subido; documentación sin afirmaciones claramente obsoletas.

### Miércoles 21/10 — cerrar alcance y requisitos

1. Revisar las historias incompletas: galería/enlaces de noticias, costo de renovación urgente, cobertura/retención de auditoría, HTTPS/backup, prueba móvil, accesibilidad y categorías FAQ.
2. Clasificar cada una como:
   - obligatoria y realizable antes del 25/10;
   - entrega posterior acordada;
   - fuera de alcance con justificación.
3. Documentar la decisión tecnológica PHP nativo/Fetch y verificar su correspondencia con los requisitos.
4. Consolidar agenda y reservas dentro del alcance del producto y aclarar que no emiten ni renuevan licencias.
5. Actualizar backlog, requisitos y control de cambios con esas decisiones.

**Salida del día:** alcance cerrado por escrito. Ninguna función queda en un “más o menos terminado”.

### Jueves 22/10 — integración completa

1. Levantar el proyecto desde cero con Docker en la computadora de defensa.
2. Crear la base, ejecutar esquema/migraciones y cargar datos de demostración.
3. Probar el recorrido principal:
   - visitante consulta información pública;
   - visitante envía una consulta;
   - funcionario la visualiza;
   - funcionario crea una noticia y solicita revisión;
   - un funcionario sin permiso intenta aprobar y el sistema lo impide;
   - Dirección aprueba;
   - funcionario publica;
   - la noticia aparece en el sitio y queda historial.
4. Probar además agenda, simulador de trámites, quiz con imagen y permisos por rol.
5. Corregir primero errores de datos, permisos y pérdida de información.

**Salida del día:** flujo principal completo y repetible con datos preparados.

### Viernes 23/10 — jornada de ciberseguridad

1. Ejecutar SAST y guardar versión, fecha, alcance y resultado.
2. Ejecutar ZAP únicamente contra el entorno local/autorizado.
3. Revisar con Nmap únicamente los puertos del equipo o entorno autorizado.
4. Crear y ejecutar el script Bash de auditoría de API: autenticación, autorización, métodos, entradas inválidas, cabeceras y exposición de información.
5. Priorizar hallazgos por impacto y probabilidad.
6. Corregir los hallazgos críticos/altos y volver a probar.
7. Completar informe de hallazgos y plan de respuesta a incidentes.

**Salida del día:** cada conclusión de seguridad tiene una evidencia reproducible; los riesgos no corregidos quedan declarados.

### Sábado 24/10 — backup, restauración e infraestructura

1. Preparar backup de base de datos y datos persistentes.
2. Incluir Compose, Dockerfiles, esquema SQL, scripts y configuración necesaria; guardar secretos de forma segura y separada.
3. Calcular hashes de los archivos de backup.
4. Restaurar la base en una instancia temporal y ejecutar consultas de validación.
5. Reconstruir el sistema desde un clon limpio o desde la copia destinada al pendrive.
6. Guardar capturas, comandos utilizados, tiempos y resultado.
7. Completar la documentación de infraestructura y reconstrucción.

**Salida del día:** backup probado. “Existe el archivo” no alcanza; debe haberse demostrado su restauración.

### Domingo 25/10 — cierre documental

1. Completar manual de usuario con capturas actuales.
2. Completar plan/informe de pruebas y matriz `requisito → prueba → resultado → evidencia`.
3. Actualizar actas de reuniones y Sprint Review solamente con hechos reales.
4. Completar control de cambios y acta de cierre.
5. Completar declaración ética de IA: herramienta, uso real, responsable y firmas.
6. Resolver campos `COMPLETAR`, firmas vacías y contradicciones en PDF/Markdown.
7. Pedir al cliente o referente la revisión/aceptación final si está disponible.

**Salida del día:** carpeta documental completa en contenido, aunque todavía pueda requerir correcciones de forma.

### Lunes 26/10 — pruebas finales y congelamiento

1. Congelar funciones nuevas.
2. Ejecutar regresión completa en escritorio y celular real.
3. Hacer una revisión básica de accesibilidad: teclado, foco visible, etiquetas, contraste, texto alternativo y mensajes de error.
4. Probar permisos con al menos un usuario por rol.
5. Verificar noticias con imágenes, galería y enlaces según el alcance cerrado.
6. Revisar que cada requisito marcado “cumplido” tenga evidencia.
7. Generar el primer candidato de entrega.

**Salida del día:** candidato sin defectos bloqueantes y lista corta de correcciones finales.

### Martes 27/10 — simulacro de instalación y entrega

1. Copiar el candidato a un pendrive de prueba.
2. Instalar/levantar el sistema en una segunda computadora siguiendo únicamente el README.
3. Verificar que una persona distinta del autor pueda seguir el manual.
4. Revisar vínculos, imágenes, PDFs, scripts, SQL y backups.
5. Preparar estructura final del pendrive, por ejemplo:

```text
IMSJ_ENTREGA_FINAL/
├── 00_LEEME_PRIMERO/
├── 01_CODIGO/
├── 02_INGENIERIA_SOFTWARE/
├── 03_FULL_STACK/
├── 04_SSOO_BACKUP_RESTAURACION/
├── 05_CIBERSEGURIDAD/
└── 06_EVIDENCIAS/
```

6. Preparar índice para cada carpeta impresa.

**Salida del día:** un tercero puede reconstruir y usar el sistema sin explicaciones orales adicionales.

### Miércoles 28/10 — cierre material

1. Corregir únicamente bloqueos o errores de presentación documental.
2. Ejecutar una última prueba corta del flujo principal.
3. Integrar el código aprobado a la rama final y comprobar que el repositorio quede limpio.
4. Crear y subir el tag `entrega-final-2026-10-29` sobre el commit exacto entregado.
5. Copiar la entrega a dos pendrives y verificar ambos en otra computadora.
6. Imprimir carpetas e índices.
7. Preparar dos copias del acuse de recibo con inventario preciso.
8. Guardar una copia 3-2-1 y cargar computadoras, adaptadores y periféricos.

**Salida del día:** material cerrado, duplicado y listo. No se imprime ni programa a último momento el jueves.

### Jueves 29/10 — entrega

1. No hacer cambios funcionales por la mañana.
2. Verificar en 10 minutos: tag remoto, contenido del pendrive, PDFs, backup, README y carpetas impresas.
3. Llegar con tiempo y entregar el material inventariado.
4. Obtener firma, fecha y aclaración en el acuse; conservar una copia o fotografía legible.
5. Archivar exactamente lo entregado. No mover el tag ni reemplazar archivos silenciosamente.
6. Preguntar si se permiten correcciones entre la entrega y la defensa. Si no están autorizadas, la defensa debe usar la versión entregada.

**Salida del día:** entrega trazable, recibida y recuperable.

## 5. Paso a paso hasta la defensa

### Viernes 30/10 — construir el relato

1. Confirmar el material entregado y las condiciones autorizadas para la defensa.
2. Definir una frase de valor: qué problema resuelve el sistema, para quién y qué mejora frente al proceso actual.
3. Elegir tres beneficios observables, no una lista de tecnologías.
4. Fijar el guion de la demostración y una base de datos reiniciable.
5. Dividir la defensa en dos partes:
   - **Parte 1 — presentar y vender (20 min):** problema, usuarios, solución, beneficios y demo de 15 minutos.
   - **Parte 2 — técnica (30 min):** arquitectura, datos, API, seguridad, infraestructura, pruebas y decisiones.
   - **Preguntas (10 min).**

**Salida del día:** una historia única; todos explican el mismo sistema y el mismo alcance.

### Sábado 31/10 — preparar el material visual

1. Preparar pocas diapositivas, con capturas y diagramas legibles.
2. Parte 1: contexto, dolor, propuesta, usuarios, beneficios, demo y resultado.
3. Parte 2: arquitectura, flujo de una petición, modelo de datos, roles/permisos, Docker, backup/restauración, seguridad, pruebas, decisiones y limitaciones.
4. Incluir una diapositiva final de aprendizajes y próximos pasos.
5. Preparar evidencia de respaldo sin saturar la presentación principal.

**Salida del día:** presentación completa y compatible con el tiempo asignado.

### Domingo 01/11 — preparación técnica individual

Cada integrante debe poder responder, con ejemplos del proyecto:

- qué problema resuelve y cuál fue su aporte personal;
- cómo viaja una petición desde la pantalla hasta la base y vuelve;
- cómo funcionan autenticación, roles y permisos;
- qué tablas y relaciones sostienen el flujo demostrado;
- cómo se levanta con Docker;
- cómo se hace y restaura el backup;
- qué vulnerabilidades se buscaron y cuáles se corrigieron;
- cómo se probaron los requisitos y cuál fue el alcance verificado;
- por qué se tomaron las decisiones tecnológicas;
- cómo se usó IA y cómo se verificó lo producido.

**Salida del día:** nadie depende de memorizar texto; cada uno puede razonar sobre el sistema.

### Lunes 02/11 — ensayo de la demo y plan B

1. Ejecutar la demo de 15 minutos con cronómetro.
2. Rotar quién maneja la computadora y quién explica.
3. Reiniciar los datos y repetir el recorrido.
4. Preparar contingencias:
   - capturas de cada paso;
   - video local corto del flujo principal;
   - exportación de base de demostración;
   - copia local de recursos externos necesarios;
   - segunda computadora y segundo pendrive.
5. Probar sin Internet para detectar dependencias externas, como iconos cargados desde CDN.

**Salida del día:** la demostración funciona dos veces seguidas y existe un plan B completo.

### Martes 03/11 — simulacro completo de 60 minutos

1. Presentar ante una persona que no participó en el desarrollo, si es posible.
2. Respetar 20 + 30 + 10 minutos.
3. Hacer preguntas individuales al azar, incluyendo temas de otras áreas.
4. Revisar claridad de respuestas, referencias y transiciones.
5. Corregir el guion, no agregar funciones.

**Salida del día:** defensa dentro del tiempo y lista concreta de preguntas a reforzar.

### Miércoles 04/11 — ensayo general

1. Usar computadora, cables, resolución de pantalla y versión exacta previstos para la defensa.
2. Ejecutar el flujo técnico y la restauración o su evidencia.
3. Revisar nombres, turnos y transiciones entre integrantes.
4. Preparar respuestas cortas para limitaciones reales: reconocer, explicar impacto y proponer siguiente paso.
5. Congelar presentación y datos de demo.
6. Empacar cargadores, adaptadores, mouse, dos pendrives, copia offline y acuse de entrega.

**Salida del día:** ensayo limpio; nada esencial queda para el 05/11.

### Jueves 05/11 — defensa

1. Llegar con anticipación y levantar Docker antes de comenzar.
2. Hacer una prueba de humo: inicio de sesión, API, base de datos y pantalla principal.
3. Parte 1: hablar del problema y del valor antes que de las tecnologías.
4. Demo: mostrar un recorrido completo, no pantallas sueltas.
5. Parte 2: conectar cada decisión técnica con un requisito o riesgo.
6. En preguntas, responde primero la persona consultada; el equipo complementa sin interrumpir.
7. Si algo falla, explicar qué capa falló, mostrar evidencia alternativa y continuar.

## 6. Guion recomendado de defensa

### Parte 1 — presentar y “vender” el sistema (20 min)

1. **Apertura (1 min):** quién es el usuario y qué problema existe.
2. **Propuesta de valor (2 min):** cómo IMSJ centraliza información, consultas y gestión de contenidos.
3. **Usuarios y beneficios (2 min):** ciudadano, funcionario y Dirección.
4. **Demostración (15 min):** consulta ciudadana + circuito de noticia con separación de funciones + publicación e historial. Si el tiempo lo permite, cerrar con agenda/simulador o quiz.

La regla narrativa es: **problema → acción del usuario → control del sistema → resultado verificable**.

### Parte 2 — explicación técnica (30 min)

1. Arquitectura y separación frontend/backend (4 min).
2. Recorrido de una petición REST y validaciones (4 min).
3. Modelo de datos e integridad (4 min).
4. Autenticación, roles, permisos y auditoría (4 min).
5. Docker, despliegue y reconstrucción (4 min).
6. Backup y restauración probada (3 min).
7. Pruebas funcionales, SAST, DAST y correcciones (4 min).
8. Decisiones, límites, ética de IA y próximos pasos (3 min).

## 7. Controles de avance

| Control | Fecha límite | Condición para aprobar |
|---|---:|---|
| Alcance cerrado | 21/10 | Cada historia tiene decisión y responsable |
| Sistema y evidencias | 24/10 | Flujo completo, seguridad y restauración ejecutados |
| Candidato final | 26/10 | Sin fallos bloqueantes y sin funciones nuevas |
| Entrega material | 28/10 | Tag, pendrives, impresos, backups y acuse listos |
| Defensa lista | 04/11 | Dos ensayos completos dentro de 60 minutos |

Si un control no se aprueba, se recorta una mejora opcional y se protege primero: instalación, flujo principal, seguridad, datos, evidencia y documentación obligatoria.

## 8. Lista final de verificación rápida

### Antes de entregar

- [ ] Fecha de entrega respaldada por una comunicación registrada.
- [ ] Alcance y condiciones de entrega aceptados por escrito.
- [ ] Repositorio limpio, cambios revisados y tag remoto creado.
- [ ] Docker probado desde cero en otra computadora.
- [ ] Datos y cuentas de demostración funcionan.
- [ ] Sintaxis, integración, permisos, móvil y accesibilidad revisados.
- [ ] SAST, ZAP, Nmap y script Bash documentados.
- [ ] Backup restaurado y validado.
- [ ] Manual, pruebas, reviews, cambios, cierre e IA completos.
- [ ] Carpetas impresas e índices revisados.
- [ ] Dos pendrives y copia externa comprobados.
- [ ] Acuse de recibo en dos copias.

### Antes de defender

- [ ] Presentación 20 + 30 + 10 ensayada.
- [ ] Demo principal menor o igual a 15 minutos.
- [ ] Cada integrante puede explicar cualquier capa a nivel general.
- [ ] Plan B offline con capturas/video y segunda copia.
- [ ] Docker, API y base probados el mismo día.
- [ ] Alcance, versión y condiciones de operación explicados.

## 9. Documentos de referencia

- [Constitución del proyecto](../ingenieria_software/project_charter.md).
- [Análisis de requerimientos](../ingenieria_software/analisis_de_requerimientos.md).
- [Plan e informe de pruebas](../ingenieria_software/plan_informe_pruebas.md).
- [Arquitectura propuesta](../administracion_ssoo/arquitectura_propuesta.md).
- [Reconstrucción de infraestructura](../administracion_ssoo/reconstruccion-infraestructura.md).
- [Paquete de entrega](paquete_entrega.md).

## 10. Versión de referencia

| Dato | Valor |
|---|---|
| Base del repositorio | 1a43229 |
| Contrato | 46 endpoints |
| Integración | 192 comprobaciones; resultado OK |
| Auditoría API | 43 aprobadas, 0 fallidas, 0 omitidas |
| SAST y DAST | Informes y revalidación del 21/10 |
| Hardening | Usuarios de servicio, raíz de lectura y capacidades reducidas |
| Tag de entrega | Propuesto: entrega-final-2026-10-29, a crear sobre el commit entregado. |
| Referencia de fechas | Cronograma documental vigente: entrega 29/10 y presentación 05/11. |
| Paquete para el cliente | Proyecto completo: código, base, instalación, documentación, pruebas y respaldo; participación de los cinco integrantes. Véase paquete_entrega.md. |
