# Documentación del proyecto

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Índice actualizado:** 20/10/2026.

Los documentos se organizan por asignatura y se complementan con material de consulta en `docs_auxiliares`. Para comprender el producto se recomienda comenzar por el charter, el relevamiento y el análisis de requisitos, continuar con backlog y cambios y después consultar diseño, infraestructura y seguridad.

## Ingeniería de Software

| Documento | Función |
|---|---|
| [Project Charter](ingenieria_software/project_charter.md) | Propósito, equipo, interesados, alcance, riesgos y evaluación del resultado. |
| [Guía de entrevista](ingenieria_software/Entrevista.md) | Preguntas iniciales, definiciones disponibles y temas por relevar. |
| [Informe de entrevista](ingenieria_software/informe%20entrevista.md) | Respuestas disponibles y su relación con los requisitos. |
| [Concepción del proyecto](ingenieria_software/documentacion_proyecto_imsj.md) | Evolución del problema, relevamiento, alcance y códigos documentales. |
| [Catálogo de requisitos](ingenieria_software/Requerimientos.md) | RF1–RF24, RNF1–RNF10 y comportamiento por grupo. |
| [Análisis de requisitos](ingenieria_software/analisis_de_requerimientos.md) | Actores, casos de uso, reglas, estados y verificación. |
| [Backlog](ingenieria_software/backlog.md) | Épicas e historias US1–US34, criterios y límites. |
| [Planificación](ingenieria_software/sprint_planning.md) | Períodos históricos, puntos propuestos y dependencias. |
| [Actas](ingenieria_software/actas_reuniones.md) | Reuniones R-01–R-05, desarrollo registrado y seguimiento. |
| [Incrementos y Sprint Review](ingenieria_software/actas_sprint_review.md) | Balance por períodos y evidencia, separado de las reuniones acreditadas. |
| [Control de cambios](ingenieria_software/control_cambios.md) | CC-01–CC-05 y modificaciones posteriores documentadas. |
| [Declaración de herramientas](ingenieria_software/declaracion_etica_ia.md) | Registro de asistencia, responsabilidades y conformidad individual pendiente. |

## Programación Full Stack

- [Clases, atributos y métodos](programacion_full_stack/Justificación%20de%20clases,%20atributos%20y%20métodos.md): responsabilidades de las capas y métodos de los ocho módulos.
- [Diagramas](programacion_full_stack/Diagramas/README.md): MER, pasaje a tablas, vista de clases nativas y UML conservado como antecedente.
- [Paso a tablas](programacion_full_stack/Diagramas/PASO_A_TABLAS.md): claves, relaciones, campos derivados y restricciones.
- [Guía para estudiar el código](programacion_full_stack/guia_codigo_y_defensa.md): recorridos y explicación técnica para el equipo.

## Administración de Sistemas Operativos

[Índice de SSOO](administracion_ssoo/README.md), [arquitectura](administracion_ssoo/arquitectura_propuesta.md), [justificación tecnológica](administracion_ssoo/justificacion-tecnologica.md), [inventario](administracion_ssoo/documentacion-infraestructura.md) y [reconstrucción](administracion_ssoo/reconstruccion-infraestructura.md).

## Electiva Ciberseguridad

- [Análisis de seguridad](electiva_ciberseguridad/analisis_ciberseguridad.md): activos, amenazas, controles implementados y evidencia pendiente.
- [Checklist de cierre](electiva_ciberseguridad/checklist_ciberseguridad_entrega_final.md): actividades de evaluación y condiciones para reunir su evidencia.
- [Informe de auditoría Bash de la API](electiva_ciberseguridad/informe_auditoria_bash_api_imsj.pdf): alcance, metodología, resultados por rol, ejecución estricta y capturas de evidencia.
- [Informe de hardening de contenedores](electiva_ciberseguridad/informe_hardening_contenedores_imsj.pdf): usuarios no privilegiados, capacidades mínimas, raíz de solo lectura, revalidación y requisito HTTPS.

## PDF existentes

| Archivo | Estado frente a los Markdown actuales |
|---|---|
| [Análisis de ciberseguridad](electiva_ciberseguridad/analisis_ciberseguridad.pdf) | Versión actualizada para PHP nativo; conserva el mapa de riesgos e incorpora su criterio de escala. |
| [Informe SAST](electiva_ciberseguridad/informe_sast_portal_vial.pdf) | Informe formal del análisis estático y su revalidación. |
| [Informe DAST](electiva_ciberseguridad/informe_dast_portal_vial.pdf) | Informe formal de ZAP/Nmap, alcance, resultados y revalidación. |
| [Informe de auditoría Bash de la API](electiva_ciberseguridad/informe_auditoria_bash_api_imsj.pdf) | Informe formal con 43 pruebas aprobadas, 0 fallidas, 0 omitidas y cuatro capturas de evidencia. |
| [Informe de hardening de contenedores](electiva_ciberseguridad/informe_hardening_contenedores_imsj.pdf) | Informe formal con configuración efectiva, cinco capturas, regresión de 41 pruebas sin fallos y requisito HTTPS de producción. |
| [Declaración de uso de herramientas](ingenieria_software/declaracion_etica_ia.pdf) | Versión anterior; no incorpora el registro Markdown del 20/10. |
| [Política de privacidad](electiva_ciberseguridad/Politica_de_Privacidad_IMSJ_Uruguay.pdf) | Borrador con datos y decisiones institucionales pendientes. |
| [Términos y condiciones](electiva_ciberseguridad/Terminos_y_Condiciones_IMSJ_Uruguay.pdf) | Borrador sujeto a alcance y condiciones institucionales definitivos. |

La actualización de los Markdown no cambia los PDF. Su preparación posterior debe utilizar la información confirmada y la identidad RC5, con colores naranja y azul.

## Preparación, material auxiliar y entregables pendientes

El [plan para la entrega y defensa](general/plan_entrega_29-10_y_defensa_05-11.md) organiza actividades futuras y no acredita reuniones ni tareas ejecutadas. Las [referencias y evidencias](../docs_auxiliares/README.md) y el [formulario](../docs_auxiliares/revision/formulario_datos_documentacion.md) reúnen fuentes y datos pendientes.

El manual de usuario y el acta de cierre todavía no tienen un documento propio. En ciberseguridad quedan pendientes el informe de respuesta a incidentes y la restauración documentada. Las actas y las conformidades se completan con registros efectivos del equipo y del cliente.
