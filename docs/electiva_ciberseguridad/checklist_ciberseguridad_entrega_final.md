# Control de entregables de Ciberseguridad

| Dato | Valor |
|---|---|
| Proyecto | Educación Vial IMSJ — Portal Vial |
| Fecha | 21/10/2026 |
| Entrega académica | 29/10/2026 |
| Revisor | [] |
| Versión de entrega | [] |

## 1. Entregables

| Bloque | Documento | Evidencia | Revisión |
|---|---|---|---|
| Análisis y diseño | [Análisis de ciberseguridad](analisis_ciberseguridad.pdf). | Mapa, escala, justificación y controles. | [] |
| SAST | [Informe SAST](informe_sast_portal_vial.pdf). | [Resultado inicial](../../sast-report.json) y [revalidación](../../informes-sast-post/semgrep-post.json). | [] |
| DAST y Nmap | [Informe DAST](informe_dast_portal_vial.pdf). | [ZAP posterior](../../informes-dast-post/zap-report-post.json) y [Nmap](../../informes-dast-post/nmap-post.txt). | [] |
| Auditoría API | [Informe Bash](informe_auditoria_bash_api_imsj.pdf). | [Ejecución completa](../../output/security-api-final.txt). | [] |
| Hardening | [Informe de contenedores](informe_hardening_contenedores_imsj.pdf). | [Revalidación](../../output/security-api-hardening.txt) y Compose. | [] |
| Términos | [Términos y condiciones](Terminos_y_Condiciones_IMSJ_Uruguay.pdf). | [] | [] |
| Privacidad | [Política de privacidad](Politica_de_Privacidad_IMSJ_Uruguay.pdf). | [] | [] |
| Hallazgos consolidados | [Registro](registro_hallazgos.md). | JSON de herramientas, revisión del código y auditoría API. | [] |
| Respuesta a incidentes | [Procedimiento técnico](respuesta_incidentes.md). | Detección, contención, análisis, recuperación y ficha de intervención. | [] |
| Reflexión ética de las pruebas | [Tratamiento de evidencias y alcance](registro_hallazgos.md#6-tratamiento-de-evidencias-y-alcance-ético). | Alcance local, datos sintéticos, resguardo y clasificación de resultados. | [] |
| Restauración de respaldo | [Procedimiento](../../docs_auxiliares/backend/transicion_backend_vanilla.md). | [] | [] |

## 2. Resultados de ejecución

| Evaluación | Fecha | Alcance | Resultado |
|---|---|---|---|
| Integración | 21/10/2026 | API y MySQL; 46 endpoints. | 192 comprobaciones; 60 peticiones distintas; resultado OK. |
| Concurrencia | 21/10/2026 | Último cupo de franja. | Una aceptación 201 y un rechazo 422. |
| Auditoría Bash completa | 21/10/2026 | Sesión, permisos, entradas, archivos, CORS y datos privados. | 43 aprobadas, 0 fallidas, 0 omitidas. |
| Auditoría por perfil público | 21/10/2026 | PUBLICO_GENERAL. | 32 aprobadas, 0 fallidas, 4 omitidas. |
| Auditoría por perfil Directora | 21/10/2026 | DIRECTORA. | 37 aprobadas, 0 fallidas, 3 omitidas. |
| Auditoría por perfil personal | 21/10/2026 | PERSONAL_IMSJ. | 35 aprobadas, 0 fallidas, 3 omitidas. |
| Auditoría tras hardening | 21/10/2026 | Configuración endurecida. | 41 aprobadas, 0 fallidas, 2 omitidas. |
| ZAP posterior | 21/10/2026 | Baseline del portal público. | 0 FAIL, 4 WARN y 63 PASS. |
| Nmap | 21/10/2026 | Publicación local. | 8000/tcp para Apache HTTP; MySQL interno. |

El JSON de Semgrep conserva seis resultados y un diagnóstico de análisis parcial. El registro consolidado relaciona cada aviso con la fuente actual; la regla exec-use señala la llamada proc_open del verificador CLI y se analiza junto con el origen de sus argumentos y las condiciones de ejecución.

## 3. Controles comprobados

- Hash bcrypt y comprobación de credenciales.
- Token opaco, hash SHA-256, vencimiento y revocación.
- Acceso según rol y propiedad de reservas.
- Validación de JSON, formularios, consultas SQL y archivos.
- Rechazo de cargas ejecutables y acceso a configuración privada.
- Límite de intentos de acceso y CORS por origen.
- CSP, nosniff, protección anti-clickjacking y control de caché.
- Usuarios de servicio, raíz de solo lectura y capacidades reducidas en contenedores.

## 4. Datos institucionales

| Dato | Valor |
|---|---|
| Responsable legal | [] |
| Identificación institucional | [] |
| Domicilio | [] |
| Contacto oficial | [] |
| Proveedores y alojamiento | [] |
| Conservación de datos | [] |
| Tratamiento de menores | [] |
| Dominio y HTTPS | [] |
| Canal de incidentes | [] |

## 5. Registro de acciones

| Acción | Responsable | Fecha objetivo | Resultado | Referencia |
|---|---|---|---|---|
| [] | [] | [] | [] | [] |

## 6. Referencias

[Registro de verificación](../../docs_auxiliares/evidencias/verificacion.md), [Compose](../../backend/compose.yaml), [script API](../../backend/tests/security_api.sh) y [requisitos por asignatura](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/main/Lineamientos/requerimientos_por_asignatura.md#electiva-ciberseguridad).
