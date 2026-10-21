# Registro de verificación

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización:** 21/10/2026.

## 1. Integración del 21/10/2026

| Dato | Valor |
|---|---|
| Resultado | OK |
| Comprobaciones | 192 |
| Peticiones distintas | 60 |
| Declaraciones de endpoint | 46 |
| Último cupo | 201 y 422; una reserva persistida |
| PHP | 8.5.11 |
| MySQL | 8.4.11 |
| Base de prueba | imsj_test_final_20261021 |
| Fecha UTC | 2026-10-21T14:47:36.610545+00:00 |
| Responsable de revisión | Tomás Cabrera (líder) y Juan Robaina (co-líder) |

La suite recorre autenticación, autorización, contenidos, archivos, aprobación, consultas, simulacro, reservas, cancelación, agenda, historial y controles de entrada. El resultado conserva los hashes SHA-256 de los archivos PHP utilizados.

**Evidencia:** [integracion-final.json](../../output/integracion-final.json) y [suite HTTP](../../backend/tests/integracion.py).

## 2. Auditoría de seguridad de la API

| Perfil o ejecución | Aprobadas | Fallidas | Omitidas | Evidencia |
|---|---|---|---|---|
| Completa | 43 | 0 | 0 | [Resultado](../../output/security-api-final.txt). |
| PUBLICO_GENERAL | 32 | 0 | 4 | [Resultado](../../output/security-api-publico.txt). |
| DIRECTORA | 37 | 0 | 3 | [Resultado](../../output/security-api-directora.txt). |
| PERSONAL_IMSJ | 35 | 0 | 3 | [Resultado](../../output/security-api-personal.txt). |
| Hardening | 41 | 0 | 2 | [Resultado](../../output/security-api-hardening.txt). |

La ejecución completa comprueba token inválido, vencido y revocado; permisos; identificadores ajenos; archivos ejecutables; entradas SQLi/XSS controladas; CORS; métodos; cabeceras y límite de intentos. El script parametriza URL y cuentas de prueba.

**Script:** [security_api.sh](../../backend/tests/security_api.sh).

## 3. SAST y DAST

| Evaluación | Alcance | Registro |
|---|---|---|
| Semgrep | Backend y frontends; resultado posterior con seis avisos y un diagnóstico de análisis parcial de Dockerfile. | [Resultado posterior](../../informes-sast-post/semgrep-post.json). |
| ZAP | Baseline del portal público; revalidación: 0 FAIL, 4 WARN, 63 PASS. | [Resultado posterior](../../informes-dast-post/zap-report-post.json). |
| Nmap | 8000/tcp para Apache; MySQL en red interna. | [Resultado](../../informes-dast-post/nmap-post.txt). |

El [registro consolidado](../../docs/electiva_ciberseguridad/registro_hallazgos.md) relaciona los avisos con la fuente actual. La regla exec-use señala la llamada proc_open del verificador CLI; el análisis considera el arreglo de argumentos, su origen y la restricción de ejecución CLI.

El registro documental de clasificación y correcciones se encuentra en los informes de [SAST](../../docs/electiva_ciberseguridad/informe_sast_portal_vial.pdf) y [DAST](../../docs/electiva_ciberseguridad/informe_dast_portal_vial.pdf).

## 4. Hardening

La aplicación utiliza `www-data`, raíz de lectura, `no-new-privileges`, capacidades reducidas y temporales específicos. MySQL utiliza `mysql`, raíz de lectura y capacidades reducidas. Apache aplica CSP, nosniff, protección anti-clickjacking y control de caché. La comprobación de ambos servicios terminó en estado saludable.

**Referencias:** [Compose](../../backend/compose.yaml), [Apache](../../backend/apache.conf) e [informe](../../docs/electiva_ciberseguridad/informe_hardening_contenedores_imsj.pdf).

## 5. Ejecuciones anteriores

| Fecha | Entorno o bloque | Resultado | Evidencia |
|---|---|---|---|
| 05/10/2026 | PHP/MySQL portable; dos servidores independientes. | 155 comprobaciones y 42 rutas; último cupo concurrente; rollback de datos y archivo. | [JSON nativo](evidencia_backend_nativo.json). |
| 05/10/2026 | BAT y configuración Docker. | Escenarios de inicio/detención, detección de rutas y códigos de salida. | [JSON de inicio](evidencia_inicio_docker.json). |
| 13/10/2026 | Proyecto Docker aislado y demo de contenidos. | 41 comprobaciones HTTP; consultas, Directora y gráficos; revisión visual. | Control de cambios y registro de demo. |
| 20/10/2026 | Documentación Markdown. | 39 archivos; 370 enlaces y anclas; 130 tablas; preservación de 120 archivos no Markdown. | DOC-20261020. |

## 6. Primera revisión documental del 21/10

| Dato | Valor |
|---|---|
| Documentos revisados | 38 |
| Enlaces y anclas | 269 |
| Tablas | 198 |
| Identificadores | RF1–RF24, RNF1–RNF10 y US1–US34 |
| Archivos de implementación e informes conservados | 309 |
| Resultado de validación | OK |

## 7. Correspondencia de evidencia y producto

El [plan e informe de pruebas](../../docs/ingenieria_software/plan_informe_pruebas.md) desarrolla los escenarios y su relación con RF, RNF, US y CC. El [manual de usuario](../../docs/general/manual_usuario.md) describe las acciones presentes en las interfaces públicas e internas.

La evidencia de integración identifica 43 archivos PHP mediante hashes. El JSON informa 192 aserciones, 60 combinaciones distintas de método y ruta y 46 declaraciones de endpoint cubiertas. El caso de último cupo utiliza dos solicitudes simultáneas contra una misma franja.

## 8. Referencias de entrega

| Dato | Valor |
|---|---|
| Commit de referencia | 1a43229 |
| Tag final | Identificador propuesto: entrega-final-2026-10-29; se creará sobre el candidato definitivo. |
| Revisor | Tomás Cabrera (líder) y Juan Robaina (co-líder) |
| Fecha de conformidad | Confirmación de revisión principal recibida el 21/10/2026; no constituye firma ni aceptación final. |
| Acta de aceptación | Preparación y condiciones en docs/ingenieria_software/acta_cierre.md; recepción al entregar. |
| Evidencia de restauración | Confirmación conjunta del equipo del 21/10; restauración y prueba en otra computadora satisfactorias, documentadas en consolidacion_2026-10-21.md. |

[Control de cambios](../../docs/ingenieria_software/control_cambios.md), [backlog](../../docs/ingenieria_software/backlog.md) y [entregables de seguridad](../../docs/electiva_ciberseguridad/checklist_ciberseguridad_entrega_final.md).

## 9. Ampliación documental del 21/10

DOC-20261021-B incorpora el manual de usuario, el plan e informe de pruebas, el registro consolidado de hallazgos y el procedimiento técnico de incidentes. Se actualizaron requisitos, trazabilidad, referencias, fichas e índices con las fuentes del repositorio.

La revisión comprende 42 Markdown y comprueba enlaces locales, anclas, tablas, bloques de código e identificadores RF, RNF y US. Los 309 archivos de implementación e informes conservan sus hashes, al igual que los 43 PHP identificados por la integración. Las actas y las respuestas de entrevista conservan su contenido.
