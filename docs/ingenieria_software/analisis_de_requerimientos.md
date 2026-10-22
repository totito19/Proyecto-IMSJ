# Análisis del proyecto

## 1. Problema

La Sección Tránsito necesita centralizar noticias, materiales de estudio y preguntas frecuentes en un canal accesible para la ciudadanía. También necesita administrar los contenidos, controlar su vigencia, registrar las modificaciones y aprobar la información antes de publicarla.

## 2. Solución

Portal Vial ofrece un portal público y un panel administrativo conectados a una misma API. La ciudadanía consulta contenidos, utiliza el simulador y envía consultas. El personal gestiona la información y la Directora aprueba los contenidos antes de su publicación.

La versión académica incorpora además la agenda de trámites, franjas, cupos, reservas y cancelaciones.

## 3. Alcance

### Incluido

- Noticias, materiales de estudio y preguntas frecuentes.
- Simulacros de pruebas teóricas con material gráfico.
- Consultas ciudadanas y bandeja de lectura.
- Panel administrativo, roles, aprobación de contenidos e historial.
- Agenda, franjas, cupos y reservas en la versión académica.

### Excluido

- La agenda web no forma parte de la entrega institucional al cliente.

## 4. Requerimientos

El sistema cuenta con 24 requerimientos funcionales y 10 requerimientos no funcionales, todos implementados.

| Grupo | Contenido |
|---|---|
| Funcionales | Acceso, noticias, materiales, preguntas frecuentes, simulacros, consultas, aprobación de contenidos y agenda académica. |
| No funcionales | Roles, validación, auditoría, protección de datos, adaptación móvil, accesibilidad, vigencia y control de reservas. |

El detalle completo se mantiene en [Requerimientos.md](Requerimientos.md).

## 5. Actores

| Actor | Funciones principales |
|---|---|
| Ciudadanía | Consultar contenidos, utilizar simulacros y enviar consultas. |
| Ciudadano registrado | Reservar y cancelar trámites de la versión académica. |
| Personal IMSJ | Gestionar contenidos, consultas, usuarios, historial y agenda. |
| Directora | Revisar y aprobar contenidos antes de su publicación. |

## 6. Casos de uso principales

| Caso de uso | Actor |
|---|---|
| Iniciar y cerrar sesión. | Usuarios registrados |
| Consultar noticias, materiales y preguntas frecuentes. | Ciudadanía |
| Administrar contenidos. | Personal IMSJ |
| Aprobar y publicar contenidos. | Directora y personal IMSJ |
| Resolver simulacros. | Ciudadanía |
| Enviar y leer consultas. | Ciudadanía y personal IMSJ |
| Crear y administrar franjas. | Personal IMSJ |
| Reservar y cancelar trámites académicos. | Ciudadano registrado |
| Consultar la agenda diaria, semanal y mensual. | Personal IMSJ |
| Consultar el historial de acciones. | Personal IMSJ |

## 7. Arquitectura

El sistema se ejecuta con Docker Compose sobre contenedores Linux. Apache sirve los dos frontends y la API PHP; MySQL almacena los datos. Los frontends se comunican únicamente con la API y no acceden directamente a la base de datos.

| Componente | Tecnología | Responsabilidad |
|---|---|---|
| Portal público | HTML, CSS y JavaScript | Interfaz para la ciudadanía. |
| Panel IMSJ | HTML, CSS y JavaScript | Gestión administrativa. |
| API | Apache y PHP 8.5 nativo | Validaciones, permisos y reglas del sistema. |
| Persistencia | MySQL 8.4 | Datos, sesiones, historial y relaciones. |
| Almacenamiento | Volúmenes Docker | Base de datos, archivos y caché. |

La API se organiza en controladores, servicios y repositorios. Las sesiones utilizan tokens y las operaciones protegidas comprueban la cuenta y su rol.

**Flujo principal:** navegador → Apache → API PHP → MySQL.

La arquitectura detallada se encuentra en [arquitectura_propuesta.md](../administracion_ssoo/arquitectura_propuesta.md) y los modelos en [Diagramas](../programacion_full_stack/Diagramas/README.md).
