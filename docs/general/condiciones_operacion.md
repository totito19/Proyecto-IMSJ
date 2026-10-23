# Condiciones de operación y transferencia

**Corte:** 23/10/2026. Este documento distingue la instalación actual en red controlada de las condiciones propuestas para habilitar un servicio institucional. Las propuestas no acreditan contratación, designación de personas ni aprobación de políticas de la Intendencia.

## Instalación y responsabilidades actuales

| Aspecto | Condición |
|---|---|
| Producto | Portal Vial, desarrollado por RC5 para la Sección Tránsito de la Intendencia de San José. |
| Entorno | Docker Compose con Apache/PHP y MySQL; acceso local en loopback, puerto 8000 por defecto. |
| Coordinación de entrega | Los cinco integrantes entregan y defienden el proyecto completo. |
| Administración posterior | Intendencia de San José. |
| Interlocución de proyecto | Inspector de Tránsito como referente; Directora para validación de necesidades y aprobación de contenidos. |
| Infraestructura de demostración | Equipos del grupo y volúmenes Docker; la documentación no compromete un proveedor comercial. |
| Presupuesto de esta entrega | Alcance expresado en trabajo y entregables; no constituye una cotización comercial ni compromiso de gasto institucional. |

## Condiciones para habilitación institucional

- Publicar bajo un dominio administrado por la Intendencia, con certificado válido, renovación y HTTPS. El HTTP local se utiliza para demostración.
- Designar funciones de administración técnica, alta y baja de cuentas, respaldo y atención de incidentes. Durante el proyecto, el equipo coordina estos asuntos con el Inspector; la asignación institucional corresponde a la Intendencia.
- Usar cuentas individuales, mínimo privilegio, aprobación exclusiva de Directora y revocación al retirar acceso. La primera cuenta se crea con la herramienta CLI documentada.
- Para público adolescente, ofrecer la consulta de contenidos sin exigir cuenta; limitar los formularios a los datos previstos y revisar institucionalmente el uso de cuentas y el tratamiento de datos antes de habilitar trámites reales.

## Propuesta de respaldo y conservación

Como base de operación a validar por la Intendencia, se propone una copia diaria de SQL y adjuntos, una copia previa a cada actualización y una copia final de entrega. Mantener configuración y código compatibles, acceso restringido y una copia separada del equipo de servicio. La VM base conserva dos días de copias locales; el medio externo protegido conserva siete copias diarias y cuatro semanales como propuesta inicial, verificando que la política institucional autorice ese período. Si se requieren siete copias completas dentro de la VM, el disco debe ampliarse de 30 GB a 40–50 GB.

La conservación de consultas, cuentas e historial requiere una decisión institucional por finalidad. La versión actual no implementa una política automática de vencimiento o purga. El período sugerido para respaldos no establece el período de conservación de los datos personales.

La restauración final debe ejecutarse y comprobarse en Ubuntu Server 26.04 LTS antes de preparar el pendrive de entrega. Hasta contar con esa evidencia no se considera validado el respaldo completo.

## Soporte y capacitación de transferencia

El paquete incluye manual, instalación, recuperación, contrato API y pruebas. Se propone una sesión de transferencia con los cuatro recorridos: gestión de cuentas, preparación/aprobación/publicación, lectura de consultas y respaldo/restauración. Los cinco integrantes participan de la entrega y defensa; esto no constituye un contrato de soporte posterior.

## Referencias

[Paquete de entrega](paquete_entrega.md), [manual](../ingenieria_software/manual_usuario.md) e [infraestructura](../administracion_ssoo/documentacion-infraestructura.md).
