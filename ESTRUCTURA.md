# Estructura del Proyecto

```
educacion-vial-imsj/
│
├── README.md                 # Descripción general del proyecto
├── ESTRUCTURA.md            # Este archivo
├── LICENSE                  # Licencia MIT
├── .gitignore              # Configuración de Git
│
├── backend/                # API REST con Laravel + PHP
│   ├── app/                # Modelos, Controllers, Middleware
│   ├── routes/             # Definición de rutas API
│   ├── database/           # Migraciones y seeders
│   └── README.md           # Documentación del backend
│
├── frontend-publico/       # Interfaz pública responsive
│   ├── index.html          # Página principal
│   ├── manifest.json       # Web app manifest (PWA)
│   ├── css/
│   │   └── style.css       # Estilos principales
│   └── js/
│       └── main.js         # Lógica de la aplicación
│
├── frontend-imsj/          # Dashboard administrativo
│   ├── index.html          # Panel de control
│   ├── manifest.json       # Web app manifest (PWA)
│   ├── css/
│   │   └── style.css       # Estilos del dashboard
│   └── js/
│       └── main.js         # Lógica administrativa
│
└── docs/                   # Documentación técnica
    ├── 01-requerimientos.md    # Análisis de requerimientos
    ├── 02-modelado.md          # Diseño de base de datos
    ├── 03-api.md               # Especificación de API REST
    ├── 04-seguridad.md         # Políticas de seguridad
    ├── 05-planificacion.md     # Plan de proyecto y timeline
    └── 06-testing.md           # Estrategia de testing
```

## Descripción de Carpetas

### `/backend`
Contiene el API REST desarrollado con Laravel. La lógica de negocio, autenticación, gestión de datos y validaciones están aquí.

**Subcarpetas esperadas:**
- `app/`: Modelos (User, Noticia, Agenda, etc.), Controllers, Middleware
- `routes/`: Definición de endpoints API
- `database/`: Migraciones para crear tablas, seeders para datos iniciales
- `config/`: Configuración de base de datos, autenticación, etc.
- `tests/`: Tests unitarios y funcionales
- `storage/`: Almacenamiento de archivos subidos

### `/frontend-publico`
Interfaz web pública para ciudadanos. Permite ver noticias, agendar trámites, acceder a materiales y preguntas frecuentes.

**Archivos principales:**
- `index.html`: Estructura HTML de la aplicación
- `css/style.css`: Estilos responsive (mobile-first)
- `js/main.js`: Lógica de cliente, consumo de API
- `manifest.json`: Configuración para PWA (Progressive Web App)

### `/frontend-imsj`
Dashboard administrativo para personal de IMSJ. Panel de control para gestionar noticias, agendas, franjas de disponibilidad.

**Archivos principales:**
- `index.html`: Estructura del dashboard
- `css/style.css`: Estilos del dashboard
- `js/main.js`: Lógica administrativa, consumo de API
- `manifest.json`: Configuración para PWA

### `/docs`
Documentación técnica completa del proyecto.

| Archivo | Contenido |
|---------|----------|
| `01-requerimientos.md` | Análisis de necesidades, funcionalidades |
| `02-modelado.md` | Diagrama de BD, tablas, campos, relaciones |
| `03-api.md` | Endpoints, métodos HTTP, parámetros, ejemplos |
| `04-seguridad.md` | Autenticación, autorización, protección de datos |
| `05-planificacion.md` | Timeline, distribución de tareas, riesgos |
| `06-testing.md` | Estrategia de tests, checklist de QA |

## Cómo Empezar

### 1. Configuración Inicial
```bash
# Clonar el repositorio
git clone <repo-url>
cd educacion-vial-imsj

# Crear rama de desarrollo
git checkout -b develop
```

### 2. Backend
```bash
cd backend

# Instalar dependencias
composer install

# Configurar archivo .env
cp .env.example .env
php artisan key:generate

# Crear base de datos y ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve
```

El backend estará disponible en: `http://localhost:8000`

### 3. Frontend Público
```bash
cd frontend-publico

# Abrir en navegador
# Opción 1: Abrir index.html directamente
# Opción 2: Usar servidor local Python
python -m http.server 8001
```

Disponible en: `http://localhost:8001`

### 4. Frontend IMSJ
```bash
cd frontend-imsj

# Servidor local
python -m http.server 8002
```

Disponible en: `http://localhost:8002`

## Flujo de Desarrollo

1. **Crear feature branch**: `git checkout -b feature/nombre`
2. **Hacer cambios y commits**: `git commit -m "feat: descripción"`
3. **Push a repositorio**: `git push origin feature/nombre`
4. **Crear Pull Request**: Descripción de cambios y testing
5. **Code review**: Mínimo 1 aprobación
6. **Merge a develop**: Cuando esté aprobado
7. **Release a main**: Al final del sprint

## Próximos Pasos

- [ ] Configurar repositorio Git remoto
- [ ] Instalar y configurar backend (Laravel)
- [ ] Crear estructura de base de datos
- [ ] Implementar autenticación
- [ ] Desarrollar endpoints API
- [ ] Integrar frontend con API
- [ ] Escribir tests
- [ ] Documentar cambios

## Contacto y Preguntas

Para preguntas sobre la arquitectura o estructura del proyecto, revisar primero la documentación en `/docs`.
