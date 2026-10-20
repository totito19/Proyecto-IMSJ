> **Estado consolidado - 15/10/2026:** CC-01–CC-05 están **Listos**. El backend actual es PHP nativo/PDO; CC-02–CC-04 se trazan a la reunión/demo del 03/09 con la Directora y el Inspector de Tránsito.

---

# Project Charter - Proyecto Educación Vial IMSJ

> **Documento inicial conservado. Adenda asistida por IA — 02/10/2026:** las aclaraciones del final distinguen cliente y evaluación académica; no reemplazan los acuerdos originales ni acreditan nuevas decisiones del equipo.
**Nombre del proyecto:** Plataforma Web Educación Vial IMSJ
**Patrocinador:** Intendencia Municipal de San José - Sección Tránsito

---

## Objetivo del proyecto
Desarrollar una aplicación web que centralice la comunicación pública de la sección tránsito de la IMSJ, permitiendo que ciudadanos consulten noticias, accedan a materiales de estudio, preguntas frecuentes y agenden trámites de obtención y renovación de libreta de conducir, mientras que el personal administrativo gestiona toda la información desde un dashboard con funciones equivalentes.

---

## Justificación del proyecto
Actualmente la información sobre noticias, agendas de trámites y materiales de estudio está dispersa o depende de canales no integrados. Esto genera:
- Dificultad para que ciudadanos accedan a información
- Procesos administrativos manuales e ineficientes
- Riesgo de dobles agendamientos
- Falta de historial centralizado

Una plataforma integrada mejorará la experiencia del ciudadano y la eficiencia operativa de la IMSJ.

---

## Alcance inicial
- Interfaz pública (noticias, agenda, materiales de estudio, preguntas frecuentes)
- Dashboard administrativo (crear/editar noticias, cargar franjas, gestionar materiales, mantener preguntas frecuentes)
- Control de acceso con roles (público general vs personal IMSJ)
- Historial de acciones administrativas
- Responsividad móvil y accesibilidad básica

---

## alcance excluido
- Aclaración: (Se excluyen las agendas en la entrega al cliente por petición del mismo, sin embargo se incluira en la entrega de proyecto de egreso para respetar el nivel de complejidad tecnica que exige el curso.) 
---

## Stakeholders principales
- Intendencia Municipal de San José (patrocinador)
- Personal administrativo de tránsito (usuarios admin)
- Ciudadanía general (usuarios finales - consulta)
- Equipo de estudiantes (desarrollan el software)

---

## Riesgos iniciales
- Cambio de requerimientos durante el desarrollo

---

## Criterios de éxito
- El sistema registra y almacena correctamente todos los datos 
- Ciudadano puede agendar una prueba de manejo completamente por la web
- Personal IMSJ puede consultar la agenda semanal sin errores
- Interfaz es responsive
- Todo el código está ordenado correctamente en Github
- Documentación completa 
- Demo funciona sin fallos durante la defensa

---

## Adenda de lectura y datos pendientes — 02/10/2026

El objetivo y los criterios anteriores conservan el alcance inicial de la letra. La exclusión de agenda para el cliente ya consta en este charter y el informe de entrevista. Por tanto, los criterios de reservar y consultar agenda se aplican a la **versión académica**, no a un compromiso actual de instalación en la IMSJ.

| Destino | Alcance documentado | Estado / referencia |
|---|---|---|
| Cliente IMSJ | Noticias, materiales, preguntas frecuentes, simulador, consultas y administración; CC-01–CC-04 Listos. Agenda excluida. | Versión implementada y trazada en control de cambios. |
| Egreso académico | Lo anterior más agenda, franjas y reservas de prueba/renovación. | Cumplimiento de letra, costo urgente, diferencias de API, datos y evidencia de pruebas. |
| Solicitudes posteriores | CC-01–CC-04 corresponden a la entrega real y están Listas. | Ver [control de cambios](control_cambios.md) y [verificación](../docs_auxiliares/evidencias/verificacion.md). |

| Dato del charter | Información disponible |
|---|---|
| Director / líder del proyecto | Tomás Cabrera, también desarrollador backend, confirmado por el grupo. |
| Equipo | Tomás Cabrera: liderazgo/backend; Juan Robaina: testing, documentación y revisión interna; Gabriela Romero: base de datos; Verónica Romero y Juan Corrales: frontend. |
| Fecha de inicio | Julio de 2026, según aclaración del grupo. |
| Duración y esfuerzo | No registrados. Los cuatro períodos y 82 puntos del planning no se presentan como medición real de capacidad. |
| Referente del cliente | Inspector de Tránsito de la Intendencia, conocido como Nacho. Tiene autoridad para aceptar entregas y aprobar cambios de alcance; registro en actas. No se usa un apellido no confirmado. |
| Fecha de entrega real | No fijada por el grupo. |
| Administración y mantenimiento posteriores | A cargo de la Intendencia, por ahora; contacto institucional se completará después. |
| Presupuesto | No registrado; no se traslada el importe del ejemplo TamboTrace. |
| Aprobación del charter | No se localizó firma o evidencia de aprobación. |

**Aclaraciones del grupo — actualizadas al 15/10/2026:** la coordinación y el seguimiento se realizan en reuniones; las actas quedan a cargo del equipo. El origen y estado de cada cambio se consultan en el [control de cambios](control_cambios.md): **CC-01–CC-05, Listos**. Los datos institucionales por completar están en [aclaraciones y pendientes](../docs_auxiliares/revision/aclaraciones_y_pendientes.md).

**IA — Sugerencia:** reemplazar criterios generales como «documentación completa» o «sin errores» por verificaciones acordadas y evidencia. Los criterios de CC-01–CC-05 quedaron incorporados al [backlog](backlog.md) y su estado consolidado es **Listo**.

Fuentes de estructura: [charter del curso](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/docs_docentes/01_project_charter.md) y [letra IMSJ](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/841e992a88e4be1d38feaa93e10b02d69c31f8cc/Proyectos/proyecto_educacion_vial_IMSJ.md). Los cambios posteriores se registran en el control de cambios.

## Adenda tecnológica del grupo — CC-05, 02/10/2026

Se reemplazó Laravel por un backend PHP sin framework, siguiendo api-simple, organizado por capas y conectado a MySQL con PDO. El [control de cambios](control_cambios.md) y la [guía de migración](../docs_auxiliares/backend/migracion_backend_vanilla.md) registran alcance, compatibilidad, datos y cierre. CC-01–CC-05 están Listos; agenda continúa como alcance académico.

El backend PHP nativo, sus pruebas y la documentación están implementados. **Estado: CC-01–CC-05, Listos.** No se fija una fecha o un presupuesto que no estén registrados; las actas conservan el origen histórico de las decisiones.
