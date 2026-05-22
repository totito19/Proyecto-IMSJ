# Backend

API REST del sistema de Educacion Vial IMSJ. Centraliza la logica de negocio,
la autenticacion y el acceso a la base de datos para ambos frontends.

## Estructura

```
backend/
├── app/         # Logica de aplicacion, modelos y servicios
├── routes/      # Definicion de endpoints HTTP
├── database/    # Esquemas, migraciones y conexion a la base
└── README.md
```

## Responsabilidades

- Exponer la API consumida por `frontend-publico` y `frontend-imsj`.
- Validar y autorizar las solicitudes entrantes.
- Persistir la informacion en la base de datos.
- Servir contenidos y archivos asociados (materiales de estudio, novedades).

## Documentacion relacionada

- Contrato de la API: [docs/03-api.md](../docs/03-api.md)
- Modelo de datos: [docs/02-modelado.md](../docs/02-modelado.md)
- Politicas de seguridad: [docs/04-seguridad.md](../docs/04-seguridad.md)
- Estrategia de testing: [docs/06-testing.md](../docs/06-testing.md)
