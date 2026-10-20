# Administración de Sistemas Operativos

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización:** 20/10/2026.

Esta sección explica la infraestructura que ejecuta el sistema, las razones de su configuración y los pasos necesarios para reconstruir una instalación. La configuración vigente utiliza Apache/PHP y MySQL mediante Docker Compose. La API y las dos interfaces se publican desde el servicio `app`; la base permanece en la red interna de los contenedores.

## Orden de lectura

| Documento | Contenido y utilidad |
|---|---|
| [Arquitectura](arquitectura_propuesta.md) | Componentes, recorrido HTTP, límites de acceso y persistencia. |
| [Justificación tecnológica](justificacion-tecnologica.md) | Relación de PHP, PDO, MySQL, Apache, Docker y frontend con las necesidades del proyecto. |
| [Inventario de infraestructura](documentacion-infraestructura.md) | Servicios, volúmenes, archivos, configuración, controles de salud y diagnóstico. |
| [Reconstrucción](reconstruccion-infraestructura.md) | Instalación nueva, creación explícita de la primera cuenta, comprobaciones y conservación de datos. |

El [README del backend](../../backend/README.md) contiene los comandos de operación y la resolución de problemas del inicio. La [guía de transición y respaldo](../../docs_auxiliares/backend/transicion_backend_vanilla.md) desarrolla la actualización de instalaciones con datos y la recuperación sobre una copia aislada.

## Estado y límites

El arranque Docker aislado y el recorrido visual del 13/10 constan en [verificación](../../docs_auxiliares/evidencias/verificacion.md). Esa ejecución no acredita una instalación en la Intendencia ni un ensayo de restauración de sus datos. Alojamiento definitivo, dominio, HTTPS, contactos operativos, frecuencia de respaldo y conservación requieren definición institucional.

La agenda y las reservas pertenecen a la entrega académica. Los nombres de servicio y volumen deben conservarse al actualizar para reutilizar los datos existentes. El arranque normal detiene o recrea contenedores sin borrar volúmenes.
