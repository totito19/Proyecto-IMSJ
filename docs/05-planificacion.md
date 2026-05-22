# 05 - Planificación y Gestión de Proyecto

## Timeline General

- **Semana 1-2**: Setup inicial, configuración de herramientas
- **Semana 3-4**: Diseño y modelado de datos
- **Semana 5-8**: Desarrollo del backend
- **Semana 9-12**: Desarrollo del frontend
- **Semana 13-14**: Testing e integración
- **Semana 15**: Presentación y defensa

## Hitos Principales

### Hito 1: Setup (Fin Semana 2)
- [ ] Repositorio Git configurado
- [ ] Estructura de carpetas creada
- [ ] Entorno de desarrollo funcional
- [ ] README.md actualizado

### Hito 2: Diseño (Fin Semana 4)
- [ ] Modelo de datos finalizado
- [ ] Diseño de interfaces (wireframes/mockups)
- [ ] Documentación de requerimientos completada
- [ ] Plan de desarrollo aprobado

### Hito 3: Backend MVP (Fin Semana 8)
- [ ] Autenticación funcional
- [ ] CRUD de noticias
- [ ] CRUD de agendas
- [ ] Sistema de franjas
- [ ] Tests unitarios

### Hito 4: Frontend MVP (Fin Semana 12)
- [ ] Frontend público funcional
- [ ] Dashboard administrativo funcional
- [ ] Integración con API
- [ ] Responsividad testeada

### Hito 5: Finalización (Fin Semana 14)
- [ ] Bug fixes y optimizaciones
- [ ] Documentación completa
- [ ] Tests de integración
- [ ] Preparación de demo

## Distribución de Tareas por Rol

### Líder de Proyecto
- Coordinación del equipo
- Seguimiento de timeline
- Resolución de bloqueos
- Comunicación con stakeholders
- Gestión del repositorio Git
- **Tiempo estimado**: 50% del proyecto

### Desarrollador Backend
- Implementación de API REST
- Gestión de base de datos
- Lógica de negocio
- Autenticación y autorización
- **Tiempo estimado**: 40% del proyecto
- **Habilidades**: PHP/Laravel, MySQL, REST API

### Desarrollador Frontend (Principal)
- Frontend público
- Integración con API
- Testing en navegador
- **Tiempo estimado**: 35% del proyecto
- **Habilidades**: HTML, CSS, JavaScript, Responsive Design

### Desarrollador Frontend (Secundario)
- Frontend administrativo
- Componentes reutilizables
- Estilos y temas
- **Tiempo estimado**: 35% del proyecto
- **Habilidades**: HTML, CSS, JavaScript, UI/UX

### Especialista BD/Seguridad
- Diseño de base de datos
- Migraciones y seeders
- Implementación de seguridad
- Validación de datos
- **Tiempo estimado**: 30% del proyecto
- **Habilidades**: MySQL, SQL, Seguridad web, GDPR

## Flujo de Trabajo Git

### Ramas
```
main                  (producción)
├── develop           (integración)
├── feature/auth      (feature branch)
├── feature/noticias
├── feature/agendas
├── bugfix/validacion
└── release/v1.0
```

### Workflow
1. Crear feature branch desde `develop`
2. Hacer commits frecuentes
3. Crear Pull Request cuando completes
4. Code review obligatorio (mínimo 1)
5. Merge a `develop`
6. Hacer release a `main` al final

### Convención de Commits
```
feat: agregar sistema de agendas
fix: corregir validación de email
docs: actualizar README
refactor: limpiar código del controller
test: agregar tests de autenticación
```

## Reuniones y Reportes

### Reuniones Semanales
- **Lunes 9:00**: Sprint planning (30 min)
- **Miércoles 14:00**: Sincronización (15 min)
- **Viernes 16:00**: Sprint review (30 min)

### Reportes Quincenales
- Progreso completado
- Blockers identificados
- Trazabilidad Git
- Métricas de calidad

## Estimación de Esfuerzo

| Componente | Horas | Responsable |
|-----------|-------|-------------|
| Setup | 8 | Líder |
| Modelado | 12 | BD/Seg |
| Backend Auth | 16 | Backend |
| Backend CRUD | 24 | Backend |
| Backend Tests | 12 | Backend |
| Frontend Público | 28 | Frontend 1 |
| Frontend Admin | 28 | Frontend 2 |
| Integración | 12 | Líder + Devs |
| Testing | 16 | BD/Seg |
| Documentación | 12 | Todos |
| **Total** | **188 horas** | |

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| Retrasos en diseño | Media | Alto | Iniciar con análisis temprano |
| Falta de experiencia en Laravel | Media | Medio | Capacitación inicial, pair programming |
| Cambios de scope | Baja | Alto | Documentar requerimientos, validar con IMSJ |
| Problemas de BD | Baja | Alto | Revisar diseño temprano, tests |
| Falta de testing | Alta | Medio | Dedicar tiempo específico, TDD |

## Criterios de Éxito

- ✓ Todos los requerimientos implementados
- ✓ 80% de cobertura de tests
- ✓ Documentación completa
- ✓ Demo funcional sin errores críticos
- ✓ Código limpio (linting OK)
- ✓ Trazabilidad Git completa
- ✓ Escalabilidad mínima (100 usuarios concurrentes)
