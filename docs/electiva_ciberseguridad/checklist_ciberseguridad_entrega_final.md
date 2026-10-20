# Checklist para cerrar Electiva Ciberseguridad

**Fecha documental:** 20/10/2026
**Fecha de entrega:** 29/10/2026

Fuente docente: [Requerimientos por asignatura](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/main/Lineamientos/requerimientos_por_asignatura.md#electiva-ciberseguridad).

## Diagnóstico corto

La sección reúne controles implementados y entregables de evaluación todavía pendientes. Cada casilla se cierra con evidencia de ejecución sobre una versión identificada.

| Entrega docente | Estado actual | Qué falta |
|---|---|---|
| 1. Análisis y diseño seguro | **Avanzada** | Actualizar el PDF a la implementación real y justificar la valoración de riesgos. |
| 2. Autenticación y criptografía | **Implementada, evidencia parcial** | Ejecutar y reunir evidencia final sobre la versión entregada. |
| 2. Términos y privacidad | **Borradores** | Completar decisiones institucionales y eliminar campos de plantilla. |
| 2. SAST | **Faltante** | Ejecutar, guardar hallazgos, corregir y volver a ejecutar. |
| 2. Hardening | **Parcial** | Aplicar y documentar controles de contenedores, Apache y secretos. |
| 3. DAST con ZAP y Nmap | **Faltante** | Ejecutar sobre el entorno autorizado y conservar informe. |
| 3. Auditoría Bash de API | **Faltante** | Crear script, ejecutarlo y conservar resultados. |
| 3. Hallazgos y correcciones finales | **Faltante** | Consolidar SAST, DAST, API y hardening con su revalidación. |
| 3. Respuesta a incidentes | **Faltante** | Crear plan y hacer un ejercicio de mesa. |
| 3. Reflexión ética | **Faltante** | Documentar alcance, autorización, límites y aprendizaje. |

## Orden de ejecución recomendado

### 1. Cerrar el análisis y diseño seguro

- [ ] Revisar las amenazas frente a la versión final: SQLi, XSS, robo/fuerza bruta, control de acceso, carga de archivos y fuga de datos.
- [ ] Mantener el mapa que relaciona componentes, amenazas e impacto técnico/sobre usuarios.
- [ ] Definir una escala simple de probabilidad e impacto, por ejemplo 1 a 5.
- [ ] Justificar quién valoró cada riesgo y con qué criterio. No presentarlo como medición si fue una estimación del equipo.
- [ ] Actualizar el PDF frente a este Markdown: conserva referencias a Laravel y cambios pendientes que ya no describen el backend vigente.
- [ ] Generar una versión final coherente con el Markdown y con el código entregado.

**Terminado cuando:** el análisis describe el sistema actual, no tiene afirmaciones históricas falsas y cada riesgo tiene amenaza, activo, impacto, control y riesgo residual.

### 2. Reunir evidencia final de autenticación y criptografía

- [ ] Demostrar contraseña almacenada con `password_hash`/bcrypt y validada con `password_verify`.
- [ ] Demostrar que la contraseña y el hash no aparecen en respuestas ni registros.
- [ ] Demostrar token aleatorio, almacenamiento del hash SHA-256, vencimiento y revocación.
- [ ] Probar logout, token inválido, expirado y revocado.
- [ ] Probar cuenta desactivada y acceso con rol insuficiente.
- [ ] Probar límite de intentos de login/registro.
- [ ] Probar consultas PDO parametrizadas con entradas maliciosas controladas.
- [ ] Guardar fecha, commit/tag, versión del entorno, comandos y resultados.

**Terminado cuando:** otra persona puede repetir las pruebas sobre la versión final y relacionar cada resultado con el requisito docente.

### 3. Finalizar Términos y Política de Privacidad

- [ ] Obtener del referente/docente los datos que no se pueden inventar: responsable legal, domicilio, contacto oficial, alojamiento/proveedores y autorización institucional.
- [ ] Definir si hay transferencias internacionales.
- [ ] Aprobar plazos de conservación de cuentas, reservas, historial, registros técnicos y solicitudes de derechos.
- [ ] Confirmar tratamiento de menores.
- [ ] Definir canal de seguridad, soporte, cancelación y reprogramación.
- [ ] Ajustar las reservas/agendas al alcance real y aclarar qué parte es académica.
- [ ] Si no existe validación institucional o jurídica, rotular claramente los documentos como propuesta académica no publicada.
- [ ] Eliminar todos los campos `[COMPLETAR]` o convertirlos en limitaciones explícitas aceptadas; nunca rellenarlos por deducción.
- [ ] Generar PDFs finales y revisar visualmente todas sus páginas.

**Terminado cuando:** no quedan campos de plantilla ni se presentan como aprobadas decisiones que el cliente no confirmó.

### 4. Ejecutar SAST y corregir

- [ ] Elegir una herramienta compatible con PHP/JavaScript, por ejemplo Semgrep, y anotar versión y reglas utilizadas.
- [ ] Analizar backend, frontend público y panel interno de la versión final.
- [ ] Revisar especialmente `innerHTML`, XSS, SQLi, carga de archivos, rutas, secretos, autenticación, errores y redirecciones.
- [ ] Ejecutar también una revisión de dependencias, por ejemplo `composer audit`, si corresponde.
- [ ] Guardar el informe original y capturas legibles.
- [ ] Clasificar cada hallazgo como válido, falso positivo o riesgo aceptado, con justificación.
- [ ] Corregir todos los hallazgos críticos/altos válidos.
- [ ] Volver a ejecutar la misma herramienta y guardar la comparación antes/después.

**Terminado cuando:** existen informe inicial, correcciones identificables en Git e informe de revalidación sobre el mismo alcance.

### 5. Completar hardening de infraestructura y contenedores

- [ ] Confirmar que `.env` continúa ignorado y que solo se entrega `.env.example` sin secretos reales.
- [ ] Cambiar las claves locales predeterminadas antes de la demostración y no subirlas a Git.
- [ ] Mantener MySQL sin puerto publicado y los frontends montados en solo lectura.
- [ ] Revisar ejecución con usuario no privilegiado o documentar por qué no se aplica.
- [ ] Evaluar y aplicar donde sea compatible `no-new-privileges`, capacidades reducidas y sistemas de archivos de solo lectura.
- [ ] Ocultar información innecesaria del servidor y desactivar mensajes de depuración en la versión de entrega.
- [ ] Configurar y verificar cabeceras HTTP de seguridad adecuadas.
- [ ] Restringir CORS a los orígenes, métodos y cabeceras realmente usados.
- [ ] Verificar límites y tipos MIME de archivos; impedir ejecución de cargas.
- [ ] Comprobar que `.env`, código privado, SQL, caché y listados de directorio no sean accesibles por HTTP.
- [ ] Documentar HTTPS como requisito del despliegue real si la entrega local no incorpora certificado.
- [ ] Conservar evidencia de los healthchecks y del estado de los contenedores.

**Terminado cuando:** cada control aplicado tiene configuración, prueba y resultado; lo no implementado figura como riesgo residual.

### 6. Ejecutar DAST con OWASP ZAP

- [ ] Levantar una base descartable con datos ficticios; no usar datos personales reales.
- [ ] Definir por escrito el alcance autorizado: URLs locales, fecha, responsable y exclusiones.
- [ ] Ejecutar rastreo y escaneo pasivo del portal público.
- [ ] Ejecutar rastreo/escaneo autenticado del panel con cuentas de prueba por rol.
- [ ] Probar el circuito completo de contenido para detectar XSS almacenado y fallas de autorización.
- [ ] Guardar reporte HTML/PDF, capturas y versión de ZAP.
- [ ] Analizar alertas manualmente; no copiar el resultado automático sin interpretación.
- [ ] Corregir hallazgos críticos/altos válidos y repetir el escaneo.

**Terminado cuando:** hay reporte inicial, análisis del equipo, correcciones y reporte posterior sobre el entorno final.

### 7. Revisar puertos con Nmap

- [ ] Ejecutar únicamente contra el equipo o entorno expresamente autorizado.
- [ ] Guardar comando, fecha, host, versión y salida en texto.
- [ ] Explicar cada puerto abierto y cerrar los que no sean necesarios.
- [ ] Confirmar que MySQL no queda accesible desde el exterior.
- [ ] Repetir la revisión después del hardening.

**Terminado cuando:** solo quedan puertos esperados y el informe explica su función y exposición.

### 8. Crear el script Bash de auditoría de la API REST

- [ ] Crear `backend/tests/security_api.sh` para un entorno local descartable.
- [ ] Hacer que termine con código distinto de cero si una comprobación falla.
- [ ] Parametrizar URL, usuarios y contraseñas de prueba; no guardar secretos reales.
- [ ] Probar, como mínimo:
  - [ ] ruta protegida sin token → `401`;
  - [ ] token inválido, expirado y revocado → rechazo;
  - [ ] rol insuficiente → `403`;
  - [ ] JSON mal formado y datos inválidos → error controlado;
  - [ ] intentos repetidos de acceso → `429`;
  - [ ] SQLi y XSS de prueba → no ejecución ni error interno;
  - [ ] métodos/rutas no admitidos → respuesta controlada;
  - [ ] CORS/`OPTIONS` permitido y origen ajeno rechazado según política;
  - [ ] identificadores ajenos y manipulación de ID → sin acceso indebido;
  - [ ] carga de extensión, MIME o tamaño no permitido → rechazo;
  - [ ] respuestas de error → sin SQL, stack trace, rutas internas o secretos;
  - [ ] acceso HTTP a `.env`, SQL y directorios privados → denegado.
- [ ] Generar una salida legible con prueba, resultado esperado, resultado obtenido y resumen final.
- [ ] Ejecutarlo sobre el candidato final y guardar la salida.

**Terminado cuando:** el docente puede ejecutar un único comando y obtener un resumen reproducible de las pruebas de seguridad de la API.

### 9. Crear el registro final de hallazgos y correcciones

- [ ] Consolidar resultados de revisión manual, SAST, ZAP, Nmap, Bash y hardening.
- [ ] Registrar por hallazgo: ID, fecha, herramienta, componente, evidencia, severidad, impacto y probabilidad.
- [ ] Añadir corrección, responsable, commit/PR, resultado de revalidación y estado.
- [ ] Distinguir falsos positivos y riesgos aceptados, explicando el motivo.
- [ ] No declarar “sin vulnerabilidades”; declarar el alcance y las limitaciones de las pruebas.

**Terminado cuando:** todos los hallazgos tienen trazabilidad hasta una corrección o una aceptación expresa del riesgo.

### 10. Crear el plan de respuesta a incidentes

- [ ] Definir responsables y suplentes: coordinación, parte técnica, comunicación y registro.
- [ ] Definir cómo se reporta y clasifica un incidente.
- [ ] Documentar detección, contención, preservación de evidencia, erradicación, recuperación y revisión posterior.
- [ ] Incluir al menos estos escenarios: credencial comprometida, XSS/SQLi, fuga de datos, archivo malicioso y caída/ransomware.
- [ ] Definir contactos institucionales y criterios de comunicación a personas afectadas/autoridades; no inventar nombres o canales.
- [ ] Relacionar recuperación con el backup probado por SSOO.
- [ ] Ejecutar un ejercicio de mesa: elegir un escenario, recorrer el plan, medir tiempos y registrar mejoras.

**Terminado cuando:** el plan tiene personas, canales, decisiones, evidencias y recuperación; no es solo una explicación teórica.

### 11. Escribir la reflexión ética

- [ ] Explicar que las pruebas se realizaron únicamente sobre infraestructura propia/autorizada.
- [ ] Indicar cómo se evitó afectar disponibilidad o datos reales.
- [ ] Explicar límites de automatización, falsos positivos y responsabilidad humana.
- [ ] Describir tratamiento responsable y comunicación de hallazgos.
- [ ] Declarar herramientas e IA utilizadas y cómo se verificaron sus resultados.
- [ ] Incluir aprendizajes, errores y decisiones del equipo en primera persona.

**Terminado cuando:** es específica del trabajo realmente realizado y puede ser defendida oralmente por todo el equipo.

### 12. Armar la carpeta final de Ciberseguridad

- [ ] Crear un índice que mapee cada requisito docente con su documento y evidencia.
- [ ] Incluir versiones finales de primera, segunda y tercera entrega.
- [ ] Incluir comandos y versiones de herramientas.
- [ ] Identificar el commit/tag exacto que se analizó.
- [ ] Confirmar que informes, capturas y scripts no contienen tokens, claves o datos personales reales.
- [ ] Probar todos los enlaces y ejecutar nuevamente el script Bash.
- [ ] Preparar versión imprimible y copia completa para el pendrive.

Estructura sugerida:

```text
docs/ciberseguridad/
├── README.md
├── 01_analisis_diseno_seguro.pdf
├── 02_autenticacion_criptografia.md
├── 03_marco_legal/
├── 04_sast/
├── 05_hardening/
├── 06_dast_zap_nmap/
├── 07_auditoria_api/
├── 08_hallazgos_y_correcciones.md
├── 09_respuesta_incidentes.md
└── 10_reflexion_etica.md
```

## Distribución de actividades por área

| Frente | Responsable sugerido | Revisor |
|---|---|---|
| SAST, backend y script Bash | Tomás | Juan Robaina |
| Registro de evidencias, incidentes y reflexión | Juan Robaina | Todo el equipo |
| Datos, privacidad, conservación y recuperación | Gabriela | Tomás |
| ZAP/XSS sobre portal público | Verónica | Juan Corrales |
| ZAP/permisos sobre panel interno | Juan Corrales | Verónica |
| Decisiones institucionales y cierre | Todo el equipo | Referente/docente |

## Criterio final de aprobación interna

Ciberseguridad queda cerrada solo si:

- [ ] todos los requisitos docentes tienen un archivo o evidencia localizable;
- [ ] las pruebas corresponden al commit/tag final;
- [ ] los hallazgos críticos y altos fueron corregidos y revalidados, o aceptados expresamente;
- [ ] no quedan contradicciones históricas ni campos de plantilla presentados como versión final;
- [ ] el equipo puede demostrar autenticación, permisos, SAST, DAST, Bash, hardening y respuesta a incidentes;
- [ ] ningún documento o reporte expone secretos o datos personales reales.

## Identificación y cierre de evidencia

Cada informe debe incluir el commit o versión evaluada, herramientas y configuración, entorno, datos de prueba, pasos ejecutados, resultado y ubicación del archivo original. La revisión de un informe registra quién lo revisó y sus observaciones. Una casilla sin marcar conserva su condición de pendiente, aunque el control exista en código.

Las funciones añadidas el 20/10 requieren repetir los escenarios afectados, especialmente propiedad y cancelación de reservas. Los resultados de la demo del 13/10 no se reasignan a esa versión. La distribución por área orienta el trabajo de los roles existentes y no acredita que el equipo haya aceptado tareas o fechas individuales.
