# Portal Vial — Educación Vial IMSJ

Plataforma de la Sección Tránsito de la Intendencia de San José, desarrollada por el equipo RC5.

## Producto

El portal reúne noticias vigentes, materiales de estudio, preguntas frecuentes, simulacros y consultas ciudadanas. El panel permite gestionar contenidos, revisar su aprobación, leer consultas y consultar el historial de acciones. La Directora aprueba y el personal publica mediante acciones diferenciadas.

La versión académica incorpora franjas, cupos, reservas de prueba de manejo y renovación, cancelación propia y agenda diaria, semanal y mensual.

## Tecnología

PHP 8.5 nativo, PDO y MySQL 8.4; ocho módulos y 46 rutas HTTP. Los frontends HTML/CSS/JavaScript consumen la API del mismo origen. Apache y MySQL se ejecutan con Docker Compose y conservan datos, adjuntos y caché en volúmenes.

```text
Proyecto-IMSJ/
├── backend/            API, esquema, Docker, herramientas y pruebas
├── frontend-publico/   Portal e ingreso
├── frontend-imsj/      Panel administrativo
├── docs/               Documentación por asignatura
└── docs_auxiliares/    Referencias, fichas y evidencias
```

## Inicio

Con Docker/Compose y motor Linux operativo, abrir [backend/iniciar.bat](backend/iniciar.bat). El inicio prepara la configuración, levanta los servicios, espera la salud y abre el portal. La primera cuenta de personal se crea con la herramienta indicada en el [README del backend](backend/README.md).

[detener.bat](backend/detener.bat) detiene los servicios conservando volúmenes. El [procedimiento de reconstrucción](docs/administracion_ssoo/reconstruccion-infraestructura.md) desarrolla instalación y operación.

## Verificación del 21/10/2026

- Integración: 192 comprobaciones y 46 endpoints; resultado OK.
- Auditoría API completa: 43 aprobadas, 0 fallidas y 0 omitidas.
- SAST, DAST/Nmap y hardening con informes y revalidación.

Los resultados y archivos se consultan en el [registro de verificación](docs_auxiliares/evidencias/verificacion.md).

## Documentación

- [Índice por asignatura](docs/README.md).
- [Charter](docs/ingenieria_software/project_charter.md), [especificación](docs/ingenieria_software/Requerimientos.md) y [casos de uso](docs/ingenieria_software/analisis_de_requerimientos.md).
- [Backlog](docs/ingenieria_software/backlog.md), [planning](docs/ingenieria_software/sprint_planning.md), [Review](docs/ingenieria_software/actas_sprint_review.md) y [actas](docs/ingenieria_software/actas_reuniones.md).
- [Arquitectura](docs/administracion_ssoo/arquitectura_propuesta.md), [modelo](docs/programacion_full_stack/Diagramas/README.md) y [contrato API](docs_auxiliares/backend/api.md).
- [Material auxiliar](docs_auxiliares/README.md) y [ficha documental](docs_auxiliares/revision/formulario_datos_documentacion.md).

## Equipo

Tomás Cabrera: liderazgo/backend. Juan Robaina: testing/documentación. Gabriela Romero: base de datos. Verónica Romero y Juan Corrales: frontend. El crédito del proyecto y de la documentación corresponde a sus cinco integrantes.

El referente del cliente es el Inspector de Tránsito. Las decisiones se registran en reuniones y la administración posterior corresponde a la Intendencia. El uso de herramientas se registra en la [declaración del equipo](docs/ingenieria_software/declaracion_etica_ia.md).
