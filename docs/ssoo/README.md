# Administración de Sistemas Operativos — segunda entrega

> **CC-05 — Decisión del grupo, 02/10/2026:** destino PHP sin Laravel, por capas y con PDO, basado en `api-completa`. El código y los archivos de infraestructura aún utilizan Laravel. El contenido previo se conserva como referencia de esa versión; la migración y sus pruebas están pendientes. Ver [transición documentada](transicion_backend_vanilla.md).

**Proyecto:** Plataforma Web Educación Vial IMSJ  
**Asignatura:** Administración de Sistemas Operativos  
**Fecha:** 2 de septiembre de 2026

> **Revisión de IA — 02/10/2026:** fecha original declarada conservada. Se corrigen enlaces a los nombres reales de los archivos. La incorporación de documentación en Git no demuestra su ejecución o recepción académica.

Esta carpeta reúne los tres entregables solicitados:

1. [Justificación tecnológica](justificacion-tecnologica.md)
2. [Documentación de infraestructura](documentacion-infraestructura.md)
3. [Reconstrucción de la infraestructura](reconstruccion-infraestructura.md)

La documentación describe la infraestructura implementada en `backend/`:
tres servicios Docker Compose, dos volúmenes persistentes, el archivo de
construcción del backend, la configuración por ambiente y los scripts de
operación para Windows.

## Correspondencia con la consigna

| Requisito de Adm. SSOO | Documento |
|---|---|
| Justificación tecnológica | `justificacion-tecnologica.md` |
| Documentación de infraestructura | `documentacion-infraestructura.md` |
| Reconstrucción paso a paso | `reconstruccion-infraestructura.md` |

> El respaldo completo de Docker y datos pertenece a la entrega final según la
> consigna. En esta segunda entrega se documentan la persistencia actual y los
> límites del entorno, sin presentar todavía ese respaldo como terminado.

## Actualización para CC-05

La [transición del backend PHP sin Laravel](transicion_backend_vanilla.md) documenta topología de destino, configuración, persistencia, imagen/scripts y separación de instalación nueva/actualización con datos. Complementa los tres entregables originales hasta que el código migre; no acredita una reconstrucción ya realizada.

La [guía general de migración](../migracion_backend_vanilla.md) y el [análisis de la API base](../referencia_api_completa.md) explican las adaptaciones. La diferencia con la consigna Laravel queda pendiente de registrar con docentes.
