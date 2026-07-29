# Análisis de Ciberseguridad (PLANTILLA — A COMPLETAR)

**Asignatura:** Electiva Ciberseguridad — 1ª entrega (Análisis y Diseño Seguro)
**Proyecto:** Plataforma Web Educación Vial IMSJ

---

## 1. Amenazas digitales identificadas

> Mínimo 3 amenazas relevantes para este tipo de sistema, con explicación del riesgo concreto para
> el proyecto (no una definición genérica de manual).

| # | Amenaza | Explicación del riesgo para este proyecto |
|---|---|---|
| 1 | [ej.: Inyección SQL] | [COMPLETAR — ej.: el formulario de login o los formularios de carga de contenido en el dashboard IMSJ acceden a la base de datos] |
| 2 | [ej.: XSS] | [COMPLETAR — ej.: el contenido de noticias/preguntas frecuentes es ingresado por personal administrativo y mostrado al público] |
| 3 | [ej.: Phishing / robo de credenciales] | [COMPLETAR — ej.: acceso al panel administrativo con cédula y contraseña] |
| 4 | [opcional] | [COMPLETAR] |

## 2. Mapa de riesgos

> Relacionar cada componente del sistema con las amenazas que lo afectan, y el impacto técnico y
> sobre los usuarios.

| Componente del sistema | Amenaza(s) asociada(s) | Impacto técnico | Impacto sobre usuarios |
|---|---|---|---|
| Login administrativo (RF1) | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Carga de contenidos (noticias, materiales, FAQ) | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Consulta pública (frontend-publico) | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Base de datos | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |

[COMPLETAR — opcionalmente, agregar un esquema/gráfico visual del mapa de riesgos.]

## 3. Buenas prácticas de seguridad aplicables

> Investigación y resumen aplicable al proyecto, relacionado con las tecnologías que efectivamente
> se van a usar (no copiar sin análisis).

| Práctica | Aplicación concreta en este proyecto |
|---|---|
| Validación de entradas | [COMPLETAR — relacionar con RNF2 en `docs/Requerimientos.md`] |
| Hashing de contraseñas | [COMPLETAR — algoritmo propuesto, ej. bcrypt] |
| Control de roles / permisos | [COMPLETAR — relacionar con RNF1] |
| Protección de datos personales | [COMPLETAR — relacionar con RNF4] |
| [otra práctica relevante] | [COMPLETAR] |

## 4. Referencias consultadas

[COMPLETAR — fuentes usadas para la investigación de amenazas y buenas prácticas]

---
