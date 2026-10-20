# Documentación auxiliar

Material de apoyo separado de la [carpeta de entrega](../docs/README.md) por solicitud del grupo el **13/10/2026**. Se conserva para consulta, trazabilidad y trabajo interno.

**Estado vigente al 15/10/2026:** CC-01–CC-05 están **Listos**. Los estados anteriores que aparezcan en informes fechados son antecedentes, no pendientes actuales.

## Revisión y pendientes

- [Formulario para completar datos y preparar los PDF](revision/formulario_datos_documentacion.md).
- [Revisión actual: qué falta y qué señales explícitas de IA permanecen](revision/revision_2026-10-13.md).
- [Aclaraciones y datos por completar](revision/aclaraciones_y_pendientes.md), con el estado de los CC ya consolidado y campos institucionales separados.
- [Revisión documental anterior](revision/revision_documental.md).
- [Índice anterior](revision/indice_anterior_2026-10-13.md), conservado como antecedente.

## Backend y referencias

- [Contrato de API](backend/api.md), actualizado a 45 rutas para la demo del 13/10.
- [Referencia api-simple](backend/referencia_api_simple.md), base del 05/10.
- [Referencia api-completa](backend/referencia_api_completa.md), antecedente del 02/10.
- [Migración a PHP nativo](backend/migracion_backend_vanilla.md), actualizada con los ocho módulos y 45 rutas vigentes.
- [Transición, respaldo y recuperación](backend/transicion_backend_vanilla.md), guía del 05/10.

## Evidencias

- [Registro de verificación](evidencias/verificacion.md), con la actualización de demo del 13/10 y antecedentes fechados.
- [Evidencia HTTP/MySQL de la base nativa](evidencias/evidencia_backend_nativo.json).
- [Evidencia del ensayo de inicio Docker](evidencias/evidencia_inicio_docker.json).

Los archivos de flujo de endpoints MD/PDF que citaba el índice anterior ya no estaban en el árbol al comenzar esta revisión. Su retirada consta en Git, commit `cd6d770`; no se regeneraron. Las referencias Markdown a esos archivos se retiraron como enlaces activos. Las rutas impresas en los PDF históricos se conservan; para localizar los informes trasladados, usar este índice.

Los informes contienen observaciones y propuestas asistidas por IA. El origen y el estado operativo de cada cambio se consultan en el control de cambios; no se crea un apartado separado de aprobaciones. La declaración obligatoria de IA, las actas y los documentos legales y de seguridad permanecen en `docs/`.
