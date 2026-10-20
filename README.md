# Portal Vial — Educación Vial IMSJ

Plataforma web para la Sección Tránsito de la Intendencia de San José, desarrollada por el equipo RC5. **Portal Vial** es la denominación pública; **Educación Vial IMSJ** identifica el proyecto académico y sus documentos.

**Actualización:** 20/10/2026. Backend PHP 8.5 nativo, PDO y MySQL 8.4; dos interfaces HTML/CSS/JavaScript y despliegue local con Apache y Docker Compose.

## Funciones y alcance

El portal reúne noticias vigentes, materiales de estudio, preguntas frecuentes, simulacros y un formulario de consultas. El panel permite mantener contenidos y leer consultas. Los contenidos se preparan en borrador, se envían a revisión, los aprueba la Directora y se publican mediante una acción posterior.

La versión académica incorpora franjas, cupos, reservas de prueba de manejo y renovación normal/urgente, cancelación propia y agenda diaria, semanal y mensual. Este módulo está excluido de la entrega actual al cliente. El costo urgente y las categorías de FAQ siguen pendientes; galería y enlaces de noticias todavía no están completos en las interfaces.

## Inicio local

En Windows, con Docker/Compose y motor Linux operativo, abrir [backend/iniciar.bat](backend/iniciar.bat). Prepara la configuración de una instalación nueva, inicia los servicios, espera la salud y abre el portal. La primera cuenta de personal se crea expresamente con la herramienta indicada en el [README del backend](backend/README.md).

Apache sirve portal, panel y API en un único puerto configurable, 8000 por defecto. Se utilizan únicamente los servicios `app` y `db`. [detener.bat](backend/detener.bat) detiene sin borrar volúmenes. Para otros sistemas, configuración previa y diagnóstico, consultar las instrucciones del backend y [reconstrucción](docs/administracion_ssoo/reconstruccion-infraestructura.md).

## Estructura del repositorio

```text
Proyecto-IMSJ/
├── backend/            API, SQL, Docker, herramientas y pruebas
├── frontend-publico/   Portal ciudadano e ingreso
├── frontend-imsj/      Panel administrativo
├── docs/               Documentos organizados por asignatura
└── docs_auxiliares/    Referencias, evidencias y datos por completar
```

La API expone **46 rutas** en `backend/public/index.php`, organizadas en ocho módulos. El recorrido es entrada → controlador → servicio → repositorio → PDO/MySQL → modelo/respuesta. La reescritura sigue la [referencia api-simple](docs_auxiliares/backend/referencia_api_simple.md), adaptada al dominio del proyecto.

## Documentación y evidencia

- [Índice de documentos](docs/README.md) y [constitución del proyecto](docs/ingenieria_software/project_charter.md).
- [Requisitos y estados](docs/ingenieria_software/analisis_de_requerimientos.md), [backlog](docs/ingenieria_software/backlog.md) y [control de cambios](docs/ingenieria_software/control_cambios.md).
- [Arquitectura](docs/administracion_ssoo/arquitectura_propuesta.md), [modelo de datos](docs/programacion_full_stack/Diagramas/README.md) y [SSOO](docs/administracion_ssoo/README.md).
- [Guía del código](docs/programacion_full_stack/guia_codigo_y_defensa.md) y [contrato API](docs_auxiliares/backend/api.md).
- [Evidencia de pruebas](docs_auxiliares/evidencias/verificacion.md) y [formulario de información pendiente](docs_auxiliares/revision/formulario_datos_documentacion.md).

CC-01–CC-05 constan como **Listos**. Los resultados del 05/10 y 13/10 corresponden a sus versiones y entornos; los cambios del 20/10 requieren su revalidación funcional. Los PDF existentes conservan versiones anteriores a los Markdown actuales. El índice distingue los documentos disponibles de manual, cierre e informes todavía pendientes.

## Equipo y operación posterior

Tomás Cabrera: liderazgo/backend; Juan Robaina: testing/documentación y revisión interna; Gabriela Romero: base de datos; Verónica Romero y Juan Corrales: frontend. El crédito del proyecto y su documentación pertenece a estos cinco integrantes. El registro de herramientas utilizadas se concentra en la [declaración correspondiente](docs/ingenieria_software/declaracion_etica_ia.md).

El referente del cliente es el Inspector de Tránsito de la Intendencia. Las decisiones de aceptación y cambios se registran en actas del equipo. La administración y el mantenimiento posteriores corresponden a la Intendencia, por ahora; las condiciones de alojamiento, HTTPS, contacto y respaldo siguen por definir.
