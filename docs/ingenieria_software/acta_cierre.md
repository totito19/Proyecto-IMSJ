# Acta de cierre — preparación de entrega

**Estado al 21/10/2026:** documento de preparación para la entrega del 29/10 y defensa del 05/11 previstas en el cronograma. Define inventario, balance y condiciones de recepción. No acredita una entrega ni aceptación ya celebradas.

## Equipo y revisión

RC5: Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales. El equipo completo entregará y defenderá el proyecto. La revisión principal fue realizada por el líder y co-líder, según confirmación recibida el 21/10.

## Balance del producto al corte

| Área | Resultado |
|---|---|
| Portal y gestión | Noticias, materiales, FAQ, simulacros, consultas y panel administrativo. |
| Control editorial | Directora aprueba; el personal publica posteriormente; la edición devuelve a borrador. |
| Alcance académico | Agenda diaria/semanal/mensual, franjas, cupos, reservas y cancelación propia. |
| Tecnología | PHP nativo, PDO, MySQL y dos frontends, instalables mediante Docker Compose. |
| Integración registrada | 192 comprobaciones sobre 46 endpoints; resultado OK del 21/10. |
| Auditoría API registrada | 43 aprobadas, 0 fallidas y 0 omitidas en la ejecución completa del 21/10. |
| Recuperación y portabilidad | Equipo confirma restauración y prueba en otra computadora satisfactorias; declaración registrada el 21/10. |

## Observaciones que acompañan la entrega

Se mantienen RF4/US12 parcial por la tarifa urgente; RF9/US6 parcial por galería y enlaces en la interfaz; RF19/US29 pendiente por categorías. Las historias de auditoría, privacidad, móvil y accesibilidad conservan su alcance parcial. Los resultados automáticos no equivalen a certificación integral de calidad ni a habilitación de producción.

## Condiciones de recepción

El [paquete completo](../general/paquete_entrega.md) se identificará por el commit exacto y el inventario entregado. La constancia de recepción debe identificar a quien recibe, su función, fecha, versión y observaciones. La aprobación de cambios en R-05 se distingue de la aceptación final del producto.

La operación posterior corresponde a la Intendencia. El [documento de operación](../general/condiciones_operacion.md) establece las condiciones y propuestas para transferencia, cuentas, HTTPS, respaldos y soporte.

## Aprendizajes derivados del historial

- La separación de requisitos de cliente y alcance académico evita presentar la agenda como trámite institucional habilitado.
- El cambio a PHP nativo requiere conservar contrato, migración, datos y pruebas, además del código.
- La aprobación editorial necesita permisos comprobados en servidor y acciones visibles en el panel.
- Mantener documentación y evidencias junto con los cambios reduce la reconstrucción posterior de decisiones.

## Fuentes

[Actas](actas_reuniones.md), [backlog](backlog.md), [cambios](control_cambios.md), [pruebas](plan_informe_pruebas.md) y [confirmaciones del equipo](../../docs_auxiliares/revision/consolidacion_2026-10-21.md).
