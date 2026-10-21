# Administración de Sistemas Operativos

**Proyecto:** Educación Vial IMSJ — Portal Vial. **Actualización:** 21/10/2026.

Esta sección explica la infraestructura que ejecuta el sistema, las razones de su configuración y los pasos necesarios para reconstruir una instalación. La configuración vigente utiliza Apache/PHP y MySQL mediante Docker Compose. La API y las dos interfaces se publican desde el servicio `app`; la base permanece en la red interna de los contenedores.

## Orden de lectura

| Documento | Contenido y utilidad |
|---|---|
| [Arquitectura](arquitectura_propuesta.md) | Componentes, recorrido HTTP, límites de acceso y persistencia. |
| [Justificación tecnológica](justificacion-tecnologica.md) | Relación de PHP, PDO, MySQL, Apache, Docker y frontend con las necesidades del proyecto. |
| [Inventario de infraestructura](documentacion-infraestructura.md) | Servicios, volúmenes, archivos, configuración, controles de salud y diagnóstico. |
| [Reconstrucción](reconstruccion-infraestructura.md) | Instalación nueva, creación explícita de la primera cuenta, comprobaciones y conservación de datos. |

El [README del backend](../../backend/README.md) contiene los comandos de operación y la resolución de problemas del inicio. La [guía de transición y respaldo](../../docs_auxiliares/backend/transicion_backend_vanilla.md) desarrolla la actualización de instalaciones con datos y la recuperación sobre una copia aislada.

## Operación y verificación

La integración del 21/10 registró 192 comprobaciones sobre 46 endpoints. La auditoría API completa registró 43 aprobadas. La configuración de contenedores utiliza usuarios de servicio, raíz de solo lectura y restricciones de capacidades.

| Dato | Valor |
|---|---|
| Organismo administrador | Intendencia de San José |
| Responsable operativo | Equipo RC5 durante la entrega; administración posterior por la Intendencia de San José. |
| Alojamiento | Equipos del grupo con Docker para demostración; infraestructura institucional como condición de despliegue. |
| Dominio | localhost en demostración; dominio institucional como condición de publicación. |
| Certificado HTTPS | Requisito de producción: certificado válido y renovación bajo administración institucional. |
| Contacto | Interlocución del proyecto a través del Inspector de Tránsito; canales institucionales al habilitar el servicio. |
| Frecuencia de respaldo | Propuesta para operación: copia diaria y previa a actualizaciones; validar en la transferencia. |
| Conservación de copias | Propuesta inicial: siete copias diarias y cuatro semanales, con acceso restringido y copia separada. |

## Referencias

[Verificación](../../docs_auxiliares/evidencias/verificacion.md) y [recuperación](../../docs_auxiliares/backend/transicion_backend_vanilla.md).
