# Educacion Vial IMSJ

Plataforma web del Instituto Municipal de Seguridad y Justicia (IMSJ) para
la gestion y difusion de contenidos de educacion vial.

## Descripcion

El proyecto comprende tres componentes principales:

- **backend**: API REST que centraliza la logica de negocio y el acceso a la
  base de datos.
- **frontend-publico**: sitio publico orientado a la ciudadania, con
  informacion sobre tramites, materiales de estudio y novedades.
- **frontend-imsj**: panel administrativo destinado al personal del IMSJ
  para la carga y mantenimiento de contenidos.

## Estructura del repositorio

```
educacion-vial-imsj/
├── backend/
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── README.md
├── frontend-publico/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── manifest.json
├── frontend-imsj/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── manifest.json
├── docs/
│   ├── 01-requerimientos.md
│   ├── 02-modelado.md
│   ├── 03-api.md
│   ├── 04-seguridad.md
│   ├── 05-planificacion.md
│   └── 06-testing.md
├── .gitignore
├── LICENSE
└── README.md
```

## Documentacion

La documentacion del proyecto se encuentra en el directorio `docs/`:

- [Requerimientos](docs/01-requerimientos.md)
- [Modelado de datos](docs/02-modelado.md)
- [API](docs/03-api.md)
- [Seguridad](docs/04-seguridad.md)
- [Planificacion](docs/05-planificacion.md)
- [Testing](docs/06-testing.md)

## Licencia

Este proyecto se distribuye bajo los terminos de la licencia MIT. Para mas
detalles ver el archivo [LICENSE](LICENSE).
