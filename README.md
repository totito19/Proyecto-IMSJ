# Educación Vial IMSJ

Plataforma web para la Sección Tránsito de la Intendencia de San José.

## Estado actual - 13/10/2026

Backend en **PHP 8.5 nativo, PDO y MySQL 8.4**, con la estructura por controladores, servicios y repositorios solicitada por el grupo y el recorrido de [api-simple de RodrigoCazard](https://github.com/RodrigoCazard/api-ejemplo-utu/tree/d6f61c999369b754d70bfa0621a154e9a630589a/api-simple). La entrada sigue en `backend/public/index.php` y actualmente expone 45 endpoints. La demo incorpora CC-02, CC-03 y CC-04: consultas del portal, aprobación por Directora de noticias, materiales y preguntas frecuentes, e imágenes opcionales en las preguntas del simulador.

```text
Proyecto-IMSJ/
├── backend/            API PHP nativa, comentarios, SQL, Docker y pruebas
├── frontend-publico/   portal ciudadano e ingreso
├── frontend-imsj/      panel administrativo
├── docs/               documentación de entrega
└── docs_auxiliares/    informes, referencias y evidencias complementarias
```

Para iniciar en Windows con Docker/Compose, abrir **[backend/iniciar.bat](backend/iniciar.bat)**. Prepara claves de una instalación local nueva, inicia Apache/PHP y MySQL, espera al sistema y abre el portal en el navegador. Apache sirve API, portal y panel en un único puerto configurable; se retiró Nginx. Se conservan los volúmenes de datos/archivos. Instrucciones y recuperación de configuración previa en el [README del backend](backend/README.md); evidencia y límites en [verificación](docs_auxiliares/evidencias/verificacion.md).

## Documentación

- [Índice de documentos de entrega](docs/README.md).
- [Guía para estudiar y defender el código](docs/guia_codigo_y_defensa.md).
- [Control de cambios](docs/control_cambios.md), [arquitectura](docs/arquitectura_propuesta.md) y [SSOO](docs/ssoo/README.md).
- [Documentación auxiliar](docs_auxiliares/README.md): contrato de API, referencias, migración y evidencias.
- [Revisión del 13/10/2026 y pendientes actuales](docs_auxiliares/revision/revision_2026-10-13.md).

**Estado consolidado al 15/10/2026:** CC-01, CC-02, CC-03, CC-04 y CC-05 están **Listos**. La demo del 03/09 originó CC-02–CC-04 con la Directora y el Inspector de Tránsito; su implementación fue verificada el 13/10/2026. CC-01 conserva el comportamiento implementado del simulador y CC-05 corresponde al backend PHP nativo. Agenda y reservas continúan dentro del alcance académico.

El crédito del proyecto y su documentación corresponde a **Tomás Cabrera, Juan Robaina, Gabriela Romero, Verónica Romero y Juan Corrales**. La implementación y la documentación fueron preparadas con apoyo externo de IA. CC-02–CC-04 conservan como origen la reunión/demo con la Directora y el Inspector de Tránsito; su estado actual se expresa directamente como **Listo**, sin crear un apartado separado de aprobaciones. La administración y el mantenimiento posteriores corresponden a la Intendencia, por ahora.
