# Proyecto Educación Vial IMSJ
## Intendencia Municipal de San José - Sección Tránsito

Proyecto Egreso 2026

## Integrantes
- Nombre 1 – Rol
- Nombre 2 – Rol
- Nombre 3 – Rol
- Nombre 4 – Rol
- Nombre 5 – Rol

## Tecnologías
- Backend: Laravel + PHP
- Base de datos: MySQL
- Frontend: Vanilla JS / Vue.js
- Estilos: Tailwind CSS / Bootstrap
- Servidor: Apache/Nginx

## Descripción del Proyecto

Aplicación web centralizada para la Sección Tránsito de la IMSJ que permite:
- Publicar noticias y anuncios
- Gestionar agendas de trámites (prueba de manejo, renovación)
- Acceso a materiales de estudio
- Preguntas frecuentes
- Control administrativo de usuarios y permisos

## Cómo ejecutar el proyecto

### Backend
1. Clonar repositorio
2. Configurar archivo `.env` con credenciales de base de datos
3. Ejecutar: `composer install`
4. Ejecutar: `php artisan migrate`
5. Ejecutar: `php artisan serve`
6. Backend disponible en: `http://localhost:8000`

### Frontend Público
1. Abrir `frontend-publico/index.html` en navegador
2. O ejecutar con servidor local: `python -m http.server 8001` en la carpeta frontend-publico

### Frontend IMSJ
1. Abrir `frontend-imsj/index.html` en navegador
2. O ejecutar con servidor local: `python -m http.server 8002` en la carpeta frontend-imsj

## Estructura del proyecto
```
educacion-vial-imsj/
├── backend/              # API REST con Laravel
├── frontend-publico/     # Interfaz pública
├── frontend-imsj/        # Dashboard administrativo
├── docs/                 # Documentación
└── README.md
```

Para más detalles, ver la documentación completa en la carpeta `/docs`

## Links útiles
- [Requerimientos](docs/01-requerimientos.md)
- [Modelado de datos](docs/02-modelado.md)
- [API REST](docs/03-api.md)
- [Seguridad](docs/04-seguridad.md)
- [Planificación](docs/05-planificacion.md)
- [Testing](docs/06-testing.md)

## Licencia
MIT
