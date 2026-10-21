# Checklist para cerrar Electiva Ciberseguridad

**Fecha documental:** 21/10/2026
**Fecha de entrega:** 29/10/2026

Fuente docente: [Requerimientos por asignatura](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/main/Lineamientos/requerimientos_por_asignatura.md#electiva-ciberseguridad).

## Diagnóstico corto

La sección reúne controles implementados y entregables de evaluación todavía pendientes. Por decisión del equipo, los ciclos **SAST**, **DAST/Nmap**, la auditoría Bash y la suite integral ejecutados y revalidados el 21/10/2026 se consideran terminados técnicamente. Cada casilla restante se cierra con evidencia sobre una versión identificada.

| Entrega docente | Estado actual | Qué falta |
|---|---|---|
| 1. Análisis y diseño seguro | **Terminado** | PDF actualizado para PHP nativo, con mapa, escala y justificación de riesgos. |
| 2. Autenticación y criptografía | **Terminada técnicamente** | Asociar la evidencia integral aprobada al commit/tag final de entrega. |
| 2. Términos y privacidad | **Borradores** | Completar decisiones institucionales y eliminar campos de plantilla. |
| 2. SAST | **Terminado** | Informe inicial, triage, correcciones y revalidación conservados. |
| 2. Hardening | **Terminado** | Contenedores endurecidos, HTTPS documentado y revalidación conservada. |
| 3. DAST con ZAP y Nmap | **Terminado** | Informe inicial, correcciones, revalidación y alcance/limitaciones conservados. |
| 3. Auditoría Bash de API | **Terminada** | Ejecución completa conservada: 43 aprobadas, 0 fallidas y 0 omitidas. |
| 3. Hallazgos y correcciones finales | **Parcial** | Consolidar SAST y DAST terminados con API, hardening y riesgos aceptados. |
| 3. Respuesta a incidentes | **Faltante** | Crear plan y hacer un ejercicio de mesa. |
| 3. Reflexión ética | **Faltante** | Documentar alcance, autorización, límites y aprendizaje. |

## Pendientes reales, en orden recomendado

- [x] Cerrar o aceptar formalmente los controles pendientes de contenedores y documentar HTTPS.
- [ ] Completar responsable legal, domicilio, contactos, proveedores, conservación y menores en Términos y Privacidad.
- [ ] Consolidar el registro final de hallazgos y correcciones.
- [ ] Crear el plan de respuesta a incidentes y realizar un ejercicio de mesa.
- [ ] Escribir la reflexión ética específica de las pruebas de seguridad.
- [ ] Probar y documentar la restauración de un respaldo.
- [ ] Actualizar el índice final, asociar evidencias al commit/tag de entrega y preparar la copia imprimible.

## Orden de ejecución recomendado

### 1. Análisis y diseño seguro — terminado

- [x] Revisar las amenazas: SQLi, XSS, robo/fuerza bruta, control de acceso, carga de archivos y fuga de datos.
- [x] Mantener el mapa que relaciona componentes, amenazas e impacto técnico/sobre usuarios.
- [x] Definir una escala simple de probabilidad e impacto.
- [x] Justificar quién valoró cada riesgo y con qué criterio, identificándolo como estimación cualitativa.
- [x] Actualizar el contenido histórico de Laravel a la implementación PHP nativa.
- [x] Generar un PDF coherente con el Markdown y revisar su presentación.

**Terminado cuando:** el análisis describe el sistema actual, no tiene afirmaciones históricas falsas y cada riesgo tiene amenaza, activo, impacto, control y riesgo residual.

### 2. Reunir evidencia final de autenticación y criptografía

- [x] Demostrar contraseña almacenada con `password_hash`/bcrypt y validada con `password_verify`.
- [x] Demostrar que la contraseña y el hash no aparecen en respuestas ni registros.
- [x] Demostrar token aleatorio, almacenamiento del hash SHA-256, vencimiento y revocación.
- [x] Probar logout, token inválido, expirado y revocado.
- [x] Probar cuenta desactivada y acceso con rol insuficiente.
- [x] Probar límite de intentos de login/registro.
- [x] Probar consultas PDO parametrizadas con entradas maliciosas controladas.
- [x] Guardar fecha, versión del entorno, comandos y resultados.
- [ ] Asociar los informes al commit/tag exacto de la entrega final.

**Evidencia del 21/10/2026:**

- `output/integracion-final.json`: resultado `OK`, 192 comprobaciones, 60 peticiones distintas y cobertura efectiva de las 46 declaraciones de endpoint.
- `output/integracion-final.log`: salida completa y código de terminación `0`.
- La prueba concurrente del último cupo produjo exactamente una aceptación `201` y un rechazo `422`.
- Entorno registrado: PHP 8.5.11, MySQL 8.4.11 y base aislada `imsj_test_final_20261021`.
- La base, los contenedores, la red y la caché temporales fueron eliminados después de conservar los informes; la instancia normal permaneció saludable.

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

### 4. SAST con Semgrep — terminado

- [x] Elegir Semgrep OSS, registrar versión, reglas y alcance.
- [x] Analizar backend, frontend público y panel interno.
- [x] Revisar `innerHTML`, XSS, SQLi, archivos, rutas, secretos, autenticación, errores y redirecciones.
- [x] Evaluar dependencias: Composer no declara paquetes PHP de terceros que requieran auditoría de vulnerabilidades.
- [x] Guardar el informe original, JSON, salida de terminal y capturas legibles.
- [x] Clasificar cada hallazgo como válido, mitigado, falso positivo o riesgo aceptado, con justificación.
- [x] Corregir los hallazgos válidos priorizados; no se confirmaron hallazgos críticos o altos explotables.
- [x] Repetir Semgrep y conservar la comparación antes/después.

**Terminado cuando:** existen informe inicial, correcciones identificables en Git e informe de revalidación sobre el mismo alcance.

### 5. Completar hardening de infraestructura y contenedores

- [x] Confirmar que `.env` continúa ignorado y que solo se entrega `.env.example` sin secretos reales.
- [x] Cambiar las claves locales predeterminadas y no subirlas a Git.
- [x] Mantener MySQL sin puerto publicado y los frontends montados en solo lectura.
- [x] Revisar ejecución con usuario no privilegiado o documentar por qué no se aplica.
- [x] Evaluar y aplicar donde sea compatible `no-new-privileges`, capacidades reducidas y sistemas de archivos de solo lectura.
- [x] Ocultar información innecesaria del servidor y desactivar mensajes de depuración.
- [x] Configurar y verificar cabeceras HTTP de seguridad adecuadas.
- [x] Restringir CORS a los orígenes, métodos y cabeceras realmente usados.
- [x] Verificar límites y tipos MIME de archivos e impedir ejecución de cargas.
- [x] Comprobar que `.env`, código privado, SQL, caché y listados de directorio no sean accesibles por HTTP.
- [x] Documentar HTTPS como requisito del despliegue real si la entrega local no incorpora certificado.
- [x] Conservar evidencia del entorno Docker utilizado para las pruebas SAST/DAST.
- [x] Conservar una captura o salida final de los healthchecks del candidato de entrega.

**Evidencia de cierre (21/10/2026):** `informe_hardening_contenedores_imsj.pdf` conserva cinco capturas y la configuración efectiva. `app` inicia como `www-data`, con raíz de solo lectura, `no-new-privileges`, `DROP ALL` y solo `CAP_NET_BIND_SERVICE`; `db` inicia como `mysql`, con raíz de solo lectura, `no-new-privileges`, `DROP ALL` y ninguna capacidad agregada. Ambos healthchecks finalizaron `healthy`. La revalidación `output/security-api-hardening.txt` terminó con 41 aprobadas, 0 fallidas, 2 omitidas y salida 0; las dos omisiones ya estaban cubiertas por la ejecución estricta anterior de 43/43.

**Terminado cuando:** cada control aplicado tiene configuración, prueba y resultado; lo no implementado figura como riesgo residual.

### 6. DAST con OWASP ZAP — terminado

- [x] Utilizar un entorno local autorizado con datos de prueba.
- [x] Definir por escrito URL, fecha, herramienta, entorno, exclusiones y límites del alcance.
- [x] Ejecutar rastreo y escaneo pasivo del portal público.
- [x] Registrar como limitación que el baseline entregado no fue un escaneo autenticado del panel.
- [x] Complementar la revisión de permisos y circuitos de contenido con la suite HTTP/MySQL existente.
- [x] Guardar reportes HTML, JSON y PDF, capturas y versión de ZAP.
- [x] Analizar manualmente las alertas y justificar falsos positivos/no aplicables.
- [x] Aplicar correcciones y repetir el escaneo; el resultado posterior quedó en 0 FAIL, 4 WARN y 63 PASS.

**Terminado cuando:** hay reporte inicial, análisis del equipo, correcciones y reporte posterior sobre el entorno final.

### 7. Revisión de puertos con Nmap — terminada

- [x] Ejecutar únicamente contra el equipo o entorno expresamente autorizado.
- [x] Guardar comando, fecha, host, versión y salida en texto.
- [x] Explicar el único puerto abierto esperado: `8000/tcp` para Apache HTTP.
- [x] Confirmar que MySQL no queda publicado al host.
- [x] Repetir la revisión después del hardening y comprobar que Apache no revela la versión exacta.

**Terminado cuando:** solo quedan puertos esperados y el informe explica su función y exposición.

### 8. Crear el script Bash de auditoría de la API REST

- [x] Crear `backend/tests/security_api.sh` para un entorno local descartable.
- [x] Hacer que termine con código distinto de cero si una comprobación falla o si el modo completo deja casos omitidos.
- [x] Parametrizar URL, usuarios, contraseñas y tokens de prueba; no guardar secretos reales.
- [x] Probar, como mínimo:
  - [x] ruta protegida sin token → `401`;
  - [x] token inválido → rechazo;
  - [x] token revocado → rechazo;
  - [x] token expirado → rechazo;
  - [x] rol insuficiente → `403`;
  - [x] JSON mal formado y datos inválidos → error controlado;
  - [x] intentos repetidos de acceso → `429`;
  - [x] SQLi y XSS de prueba → no ejecución ni error interno;
  - [x] métodos/rutas no admitidos → respuesta controlada;
  - [x] CORS/`OPTIONS` permitido y origen ajeno rechazado según política;
  - [x] identificadores ajenos y manipulación de ID → sin acceso indebido;
  - [x] carga de extensión, MIME o tamaño no permitido → rechazo;
  - [x] respuestas de error → sin SQL, stack trace, rutas internas o secretos;
  - [x] acceso HTTP a `.env`, SQL y directorios privados → denegado.
- [x] Generar una salida legible con prueba, resultado esperado, resultado obtenido y resumen final.
- [x] Ejecutarlo sobre el candidato final y guardar la salida.

**Evidencia del 21/10/2026:**

- `output/security-api-publico.txt`: 32 aprobadas, 0 fallidas y 4 omitidas; rol `PUBLICO_GENERAL` y panel restringido con `403`.
- `output/security-api-directora.txt`: 37 aprobadas, 0 fallidas y 3 omitidas; rol `DIRECTORA`, carga PHP disfrazada rechazada y límite `429` confirmado.
- `output/security-api-personal.txt`: 35 aprobadas, 0 fallidas y 3 omitidas; rol `PERSONAL_IMSJ`, carga PHP rechazada, FAQ descartable creada/eliminada y aprobación denegada con `403`.
- `output/security-api-final.txt`: ejecución estricta completa con 43 aprobadas, 0 fallidas y 0 omitidas; confirma token expirado, token revocado, identificador de reserva ajeno, permisos, carga maliciosa y límite `429`.
- `docs/electiva_ciberseguridad/informe_auditoria_bash_api_imsj.pdf`: informe formal con alcance, metodología, trazabilidad, hashes, conclusión y cuatro capturas de evidencia.
- Los usuarios, tokens, franja y reserva descartables de la ejecución final fueron eliminados al terminar.

**Terminado cuando:** el docente puede ejecutar un único comando y obtener un resumen reproducible de las pruebas de seguridad de la API.

### 9. Crear el registro final de hallazgos y correcciones

- [ ] Consolidar los resultados ya terminados de SAST, ZAP y Nmap con Bash y hardening.
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
- [x] Incluir comandos y versiones de Semgrep, ZAP y Nmap en sus informes.
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
- [x] los ciclos SAST y DAST no conservan hallazgos críticos o altos confirmados sin tratamiento;
- [ ] no quedan contradicciones históricas ni campos de plantilla presentados como versión final;
- [ ] el equipo puede demostrar autenticación, permisos, SAST, DAST, Bash, hardening y respuesta a incidentes; SAST y DAST ya están cerrados;
- [ ] ningún documento o reporte expone secretos o datos personales reales.

## Identificación y cierre de evidencia

Cada informe debe incluir el commit o versión evaluada, herramientas y configuración, entorno, datos de prueba, pasos ejecutados, resultado y ubicación del archivo original. La revisión de un informe registra quién lo revisó y sus observaciones. SAST y DAST/Nmap se consideran cerrados con la evidencia del 21/10/2026; una casilla restante sin marcar conserva su condición de pendiente, aunque el control exista en código.

Las funciones añadidas el 20/10 requieren repetir los escenarios afectados, especialmente propiedad y cancelación de reservas. Los resultados de la demo del 13/10 no se reasignan a esa versión. La distribución por área orienta el trabajo de los roles existentes y no acredita que el equipo haya aceptado tareas o fechas individuales.
