# Educación Vial IMSJ

Plataforma web para la Sección Tránsito de la Intendencia de San José.

## Estructura

```text
Proyecto-IMSJ/
├── backend/            API REST en PHP/Laravel y base de datos MySQL
├── frontend-publico/   sitio para la ciudadanía y pantalla de ingreso
├── frontend-imsj/      panel para el personal de la IMSJ
├── docs/               documentación académica hasta la segunda entrega
├── .gitignore
├── LICENSE
└── README.md
```

Las cuatro carpetas tienen responsabilidades distintas y corresponden a la
arquitectura indicada para el proyecto. No se necesitan carpetas paralelas de
versiones, login o archivos compartidos.

## Archivos generados

`backend/vendor` contiene las librerías que descarga Composer para ejecutar
Laravel. No es código del grupo y Git no lo sube. Si no existe, se reconstruye
automáticamente al preparar el backend.

Las instrucciones para iniciar la API están en `backend/README.md`.
