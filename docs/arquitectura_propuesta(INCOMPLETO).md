# Arquitectura Propuesta (PLANTILLA — A COMPLETAR)

**Asignatura:** Administración de Sistemas Operativos (Adm. SSOO) — 1ª entrega
**Proyecto:** Plataforma Web Educación Vial IMSJ

> Este documento cubre el requisito de "Arquitectura propuesta" de la primera entrega. El
> "Análisis de requerimientos" que también pide esa entrega ya está cubierto por
> `docs/Requerimientos.md` y `docs/project_charter.md`.

---

## 1. Visión general de la arquitectura

[COMPLETAR — breve descripción: aplicación web de 3 capas, dos frontends independientes
(`frontend-publico`, `frontend-imsj`) consumiendo un backend común (`backend`) vía API REST.]

## 2. Diagrama de arquitectura

[COMPLETAR — insertar diagrama (imagen o diagrama en texto) mostrando: frontend-publico,
frontend-imsj, backend/API, base de datos, y cómo se comunican entre sí.]

```
[frontend-publico] ---\
                        > [Backend / API REST] --- [Base de datos]
[frontend-imsj]    ---/
```

## 3. Componentes

| Componente | Tecnología propuesta | Responsabilidad |
|---|---|---|
| Frontend público | [COMPLETAR] | Consulta de noticias, materiales y preguntas frecuentes |
| Frontend IMSJ (dashboard) | [COMPLETAR] | Administración de contenidos |
| Backend / API | [COMPLETAR] | Lógica de negocio, autenticación, acceso a datos |
| Base de datos | [COMPLETAR] | Persistencia de noticias, materiales, preguntas frecuentes, usuarios y auditoría |

## 4. Infraestructura propuesta

| Aspecto | Definición | Estado |
|---|---|---|
| Entorno de despliegue | [Servidor propio / hosting externo / contenedores] | [COMPLETAR] |
| Sistema operativo del servidor | [COMPLETAR] | [COMPLETAR] |
| Dispositivos del personal IMSJ | [COMPLETAR] | [COMPLETAR] |
| Requisitos de red / acceso | [COMPLETAR] | [COMPLETAR] |

> La justificación tecnológica detallada y la documentación de infraestructura (scripts, docker
> files, etc.) corresponden a la 2ª entrega según `Lineamientos/requerimientos_por_asignatura.md`.

## 5. Consideraciones de seguridad de la arquitectura

[COMPLETAR — separación de red/roles entre frontend público y frontend administrativo, manejo de
credenciales, backups, etc. Debe ser consistente con `docs/analisis_ciberseguridad.md`.]

## 6. Riesgos de arquitectura identificados

| Riesgo | Impacto | Mitigación propuesta |
|---|---|---|
| [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |

---
