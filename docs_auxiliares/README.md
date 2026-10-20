# Documentación auxiliar

**Actualización:** 20/10/2026. Material de referencia, evidencia y preparación, separado de la [documentación por asignatura](../docs/README.md).

## Información y revisiones

| Archivo | Uso |
|---|---|
| [Formulario](revision/formulario_datos_documentacion.md) | Completar datos institucionales, registros, evidencias y preferencias de PDF. Conserva las respuestas del equipo. |
| [Aclaraciones y pendientes](revision/aclaraciones_y_pendientes.md) | Consultar decisiones confirmadas y datos todavía necesarios. |
| [Revisión del 13/10](revision/revision_2026-10-13.md) | Consultar hallazgos históricos y su evolución posterior. |
| [Revisión documental inicial](revision/revision_documental.md) | Conservar origen de dificultades y criterios de organización. |
| [Índice anterior](revision/indice_anterior_2026-10-13.md) | Localizar documentación citada antes de los cambios de carpetas. |

## Backend y referencias

- [Contrato API](backend/api.md): 46 rutas actuales, permisos, entradas y respuestas.
- [API simple](backend/referencia_api_simple.md): patrón utilizado por la reescritura del 05/10.
- [API completa](backend/referencia_api_completa.md): estudio anterior, conservado para explicar la evolución de la referencia.
- [Migración](backend/migracion_backend_vanilla.md): sustitución de componentes Laravel y compatibilidad.
- [Respaldo y transición](backend/transicion_backend_vanilla.md): conservación de configuración, datos, adjuntos y recuperación sobre una copia.

## Evidencia y lectura de resultados

[Verificación](evidencias/verificacion.md) reúne resultados del 05/10, demo del 13/10 y comprobaciones documentales posteriores. Los JSON de [backend nativo](evidencias/evidencia_backend_nativo.json) e [inicio Docker](evidencias/evidencia_inicio_docker.json) conservan evidencia de sus propios cortes y no se regeneran al cambiar documentos.

Un caso de prueba escrito, un procedimiento de restauración y una casilla de checklist no equivalen a una ejecución. Cada resultado debe conservar fecha, versión, entorno y evidencia; las pruebas anteriores no se atribuyen automáticamente a modificaciones nuevas.

## Estado vigente y antecedentes

CC-01–CC-05 están Listos. Las referencias de 42 rutas corresponden a la base del 05/10 y las de 45 a la demo del 13/10; el contrato tiene 46 desde la cancelación del 20/10. Los informes fechados mantienen sus resultados históricos y enlazan a los documentos actuales.

Los antiguos flujos MD/PDF de endpoints fueron retirados antes de esta consolidación, según el commit `cd6d770`. El contrato vigente es el archivo `backend/api.md` de esta carpeta. Los PDF existentes y las firmas conservan sus versiones; los datos por completar permanecen en el formulario.
