# Justificación de clases, atributos y métodos

> **Revisión asistida por IA — 02/10/2026:** las secciones 1–3 conservan la derivación conceptual inicial, no un inventario de clases PHP. La sección 4 aclara exclusiones del modelo inicial y la sección 5 relaciona ese modelo con la implementación actual y necesidades posteriores. El acta R-04 declara asistencia de IA en su organización; no se identifica la herramienta o revisor original.

## 1. Criterio de derivación

El modelo conceptual inicial se deriva de los siguientes documentos académicos:

* `docs/Requerimientos.md`: RF1–RF18 y RNF1–RNF10.
* `docs/backlog.md`: US1–US28 y EP1–EP7.
* `docs/project_charter.md`: alcance general y criterios de éxito.
* `docs/arquitectura_propuesta.md`: responsabilidades del backend y persistencia.
* `docs/analisis_ciberseguridad.md`: autenticación, protección de datos, validación y auditoría.

Se aplica el mismo criterio de `Practicos/ada-tambotrace.md`:

1. Los sustantivos de los requerimientos originan clases.
2. Los datos necesarios para representar esos sustantivos originan atributos.
3. Los verbos de los requerimientos e historias de usuario originan métodos.
4. Ningún elemento se incorpora sin una justificación trazable.

---

## 2. Tabla general de trazabilidad

| Clase o tipo                           | Requerimientos                              | Historias de usuario | Épica         |
| -------------------------------------- | ------------------------------------------- | -------------------- | ------------- |
| `Usuario` / `RolUsuario`               | RF1, RNF1, RNF4                             | US1, US2, US26       | EP1, EP7      |
| `Noticia` / `EstadoPublicacion`        | RF2, RF7, RF8, RF9, RF10, RNF2, RNF7, RNF10 | US3–US9              | EP2           |
| `MaterialEstudio` / `TipoMaterial`     | RF5, RF17, RNF2, RNF10                      | US21, US22           | EP5           |
| `PreguntaFrecuente`                    | RF6, RF18, RNF2, RNF10                      | US23, US24           | EP6           |
| `FranjaDisponibilidad` / `TipoTramite` | RF11, RF12, RF13, RNF2, RNF8                | US15, US16, US17     | EP4           |
| `Reserva`                              | RF3, RF4, RNF4, RNF8, RNF9                  | US10–US14            | EP3           |
| `ConsultaAgenda`                       | RF14, RF15, RF16                            | US18, US19, US20     | EP4           |
| `HistorialAccion`                      | RNF3, RNF4                                  | US25, US26           | EP7           |
| `PortalPublico`                        | RF2, RF5, RF6, RNF5, RNF6, RNF7, RNF10      | US3, US21, US23      | EP2, EP5, EP6 |

---

# 3. Justificación de clases, atributos y métodos

## 3.1 `Usuario` / `RolUsuario`

| Elemento                          | Justificación                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clase `Usuario`                   | RF1 exige que el sistema permita iniciar sesión con cédula y contraseña. RNF1 diferencia al público general del personal de la IMSJ, por lo que ambos tipos de usuario deben poder representarse dentro del control de acceso. |
| `id`                              | Permite identificar de manera estable a cada usuario en la base de datos y asociarlo con reservas o acciones administrativas.                                                                                                  |
| `cedula`                          | RF1 y US1 indican expresamente que el inicio de sesión se realiza utilizando cédula. También constituye un dato personal protegido por RNF4.                                                                                   |
| `passwordHash`                    | Representa la contraseña exigida por RF1. Se almacena como hash y no en texto plano, siguiendo las decisiones de seguridad documentadas en `analisis_ciberseguridad.md`.                                                       |
| `rol: RolUsuario`                 | RNF1 exige diferenciar entre público general y personal de la IMSJ. Por eso se definen los valores `PUBLICO_GENERAL` y `PERSONAL_IMSJ`.                                                                                        |
| `iniciarSesion(cedula, password)` | Deriva directamente del verbo “iniciar sesión” de RF1 y US1. Compara la contraseña ingresada con el hash almacenado.                                                                                                           |
| `tieneAccesoA(recurso)`           | Implementa el control de roles de RNF1 y US2. El público puede consultar contenidos y realizar reservas, mientras que el personal puede acceder a las operaciones administrativas.                                             |

El modelo inicial diferencia público y personal IMSJ. La entrevista y CC-03 registran aprobación por Dirección y posterior diferenciación de permisos; no se descarta esa necesidad por estar ausente del catálogo inicial.

---

## 3.2 `EstadoPublicacion`

| Elemento                        | Justificación                                                                                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enumeración `EstadoPublicacion` | RF10 exige gestionar el estado de las noticias y proporciona como ejemplo los valores publicada y no publicada. RNF10 exige separar claramente los contenidos publicados de los no publicados. |
| `PUBLICADO`                     | Representa el contenido que puede mostrarse en el frontend público.                                                                                                                            |
| `NO_PUBLICADO`                  | Representa el contenido que se conserva en el sistema, pero todavía no debe mostrarse públicamente.                                                                                            |

Esta enumeración puede ser utilizada por `Noticia`, `MaterialEstudio` y `PreguntaFrecuente`, ya que RNF10 se refiere de manera general a contenidos publicados y no publicados.

---

## 3.3 `Noticia`

| Elemento                    | Justificación                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clase `Noticia`             | RF2 permite a los ciudadanos consultar noticias y RF7 permite al personal de la IMSJ publicarlas y administrarlas. Corresponde a US3 y US4.            |
| `id`                        | Permite identificar una noticia concreta para modificarla, eliminarla, publicarla o registrarla en el historial de acciones.                           |
| `titulo`                    | Permite identificar y diferenciar cada noticia dentro del portal público y el panel administrativo.                                                    |
| `texto`                     | RF9 exige que las noticias admitan contenido de texto.                                                                                                 |
| `fechaInicioVigencia`       | RF8 exige definir un período de vigencia. La fecha de inicio determina desde cuándo puede mostrarse una noticia.                                       |
| `fechaFinVigencia`          | Completa el período exigido por RF8 e indica hasta cuándo la noticia debe considerarse vigente.                                                        |
| `imagenPortada`             | RF9 exige cargar una imagen de portada para la noticia.                                                                                                |
| `galeriaImagenes`           | RF9 exige una galería de imágenes. Se representa como una colección porque una noticia puede contener varias imágenes.                                 |
| `enlacesUtiles`             | RF9 menciona expresamente enlaces útiles. Se utiliza una colección para permitir más de un enlace por noticia.                                         |
| `estado: EstadoPublicacion` | RF10 exige gestionar el estado de la noticia como publicada o no publicada. RNF10 exige separar ambos conjuntos.                                       |
| `crear()`                   | Deriva de “publicar y administrar noticias” de RF7 y US4. Permite registrar una nueva noticia inicialmente no publicada.                               |
| `actualizar()`              | Forma parte de la administración exigida por RF7. Permite modificar el título, texto, vigencia, imágenes o enlaces.                                    |
| `eliminar()`                | También deriva de la administración de noticias de RF7. La operación debe registrarse en `HistorialAccion`.                                            |
| `publicar()`                | Implementa el cambio de estado solicitado por RF10 y US7. Cambia el estado a `PUBLICADO`.                                                              |
| `despublicar()`             | Permite cambiar el estado a `NO_PUBLICADO` sin eliminar la noticia.                                                                                    |
| `estaVigente(fecha)`        | Implementa el manejo automático de vigencia de RNF7 y US8. Comprueba si la fecha actual se encuentra entre `fechaInicioVigencia` y `fechaFinVigencia`. |
| `esVisible(fecha)`          | Una noticia es visible solamente cuando su estado es `PUBLICADO` y `estaVigente(fecha)` devuelve verdadero. Integra RF2, RF8, RF10, RNF7 y RNF10.      |

---

## 3.4 `TipoMaterial`

| Elemento                   | Justificación                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enumeración `TipoMaterial` | La arquitectura académica establece que el sistema administra materiales en PDF, imagen y video. Una enumeración permite validar que solamente se carguen formatos admitidos. |
| `PDF`                      | Representa documentos y manuales de estudio.                                                                                                                                  |
| `IMAGEN`                   | Representa material gráfico de educación vial.                                                                                                                                |
| `VIDEO`                    | Representa contenido audiovisual de estudio.                                                                                                                                  |

---

## 3.5 `MaterialEstudio`

| Elemento                    | Justificación                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clase `MaterialEstudio`     | RF5 permite a los ciudadanos acceder a materiales de estudio y RF17 permite al personal de la IMSJ administrarlos. Corresponde a US21 y US22.                         |
| `id`                        | Permite identificar el material que se desea consultar, modificar, retirar o auditar.                                                                                 |
| `nombre`                    | Permite identificar el material dentro de la biblioteca pública y del panel administrativo.                                                                           |
| `tipo: TipoMaterial`        | Permite diferenciar documentos PDF, imágenes y videos y aplicar las validaciones correspondientes.                                                                    |
| `ubicacionRecurso`          | Representa la referencia al archivo almacenado o al recurso servido por el backend. La arquitectura establece que el backend debe gestionar el acceso a los archivos. |
| `estado: EstadoPublicacion` | RNF10 exige diferenciar los contenidos publicados de los no publicados. Un material no publicado permanece en administración, pero no aparece en el portal público.   |
| `crear()`                   | Deriva de “administrar materiales de estudio” de RF17 y US22.                                                                                                         |
| `actualizar()`              | Permite modificar el nombre, tipo, recurso o estado del material.                                                                                                     |
| `eliminar()`                | Permite retirar definitivamente un material. Debe generar un registro de auditoría por RNF3.                                                                          |
| `publicar()`                | Cambia el material a estado `PUBLICADO`, permitiendo su consulta pública.                                                                                             |
| `despublicar()`             | Retira el material del portal sin eliminarlo de la administración.                                                                                                    |
| `esFormatoPermitido()`      | Implementa RNF2. Comprueba que el tipo declarado, la extensión y el tipo real del archivo coincidan con los formatos permitidos.                                      |

---

## 3.6 `PreguntaFrecuente`

| Elemento                    | Justificación                                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Clase `PreguntaFrecuente`   | RF6 permite a los ciudadanos consultar preguntas frecuentes y RF18 permite al personal mantener esa sección. Corresponde a US23 y US24. |
| `id`                        | Permite identificar la pregunta que se desea modificar, eliminar, publicar o auditar.                                                   |
| `pregunta`                  | Representa el enunciado que consulta el ciudadano.                                                                                      |
| `respuesta`                 | Contiene la información proporcionada por el sistema para resolver la consulta frecuente.                                               |
| `estado: EstadoPublicacion` | RNF10 exige separar el contenido publicado del no publicado. Las preguntas no publicadas no deben aparecer en el portal público.        |
| `crear()`                   | Deriva del mantenimiento de preguntas frecuentes exigido por RF18 y US24.                                                               |
| `actualizar()`              | Permite modificar el texto de la pregunta o su respuesta.                                                                               |
| `eliminar()`                | Permite eliminar una pregunta frecuente. La acción debe quedar auditada por RNF3.                                                       |
| `publicar()`                | Cambia el estado a `PUBLICADO` para hacer visible la pregunta.                                                                          |
| `despublicar()`             | Cambia el estado a `NO_PUBLICADO` sin eliminar la pregunta.                                                                             |

El modelo inicial no agregó categorías. El informe de entrevista sí las solicita (RF19); la ausencia en el modelo y en el código es una brecha pendiente, no una exclusión aprobada del cliente.

---

## 3.7 `TipoTramite`

| Elemento                  | Justificación                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Enumeración `TipoTramite` | RF3, RF4, RF11, RF12 y RF13 distinguen tres trámites diferentes. Una enumeración evita valores no contemplados por los requerimientos. |
| `PRUEBA_MANEJO`           | Proviene de RF3 y RF13.                                                                                                                |
| `RENOVACION_NORMAL`       | Proviene de RF4 y RF11.                                                                                                                |
| `RENOVACION_URGENTE`      | Proviene de RF4 y RF12.                                                                                                                |

---

## 3.8 `FranjaDisponibilidad`

| Elemento                     | Justificación                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clase `FranjaDisponibilidad` | RF11, RF12 y RF13 exigen cargar franjas disponibles para renovaciones normales, renovaciones urgentes y pruebas de manejo.                               |
| `id`                         | Permite identificar la franja que se reserva, modifica o elimina.                                                                                        |
| `fecha`                      | Permite ubicar la franja dentro de las consultas por día, semana y mes de RF14, RF15 y RF16.                                                             |
| `horaInicio`                 | Determina el comienzo de la franja horaria.                                                                                                              |
| `horaFin`                    | Determina el final de la franja. Se utiliza en lugar de una duración fija porque los requerimientos no especifican que todas las franjas duren lo mismo. |
| `tipo: TipoTramite`          | Indica si la franja corresponde a prueba de manejo, renovación normal o renovación urgente.                                                              |
| `cuposTotales`               | La arquitectura académica exige controlar los cupos y prevenir que solicitudes simultáneas superen la disponibilidad.                                    |
| `crear()`                    | Deriva del verbo “cargar” utilizado por RF11, RF12 y RF13 y de US15, US16 y US17.                                                                        |
| `actualizar()`               | Permite modificar la fecha, el horario, el tipo de trámite o los cupos.                                                                                  |
| `eliminar()`                 | Permite retirar una franja. Antes de eliminarla debe comprobarse si existen reservas asociadas.                                                          |
| `hayCupo()`                  | Implementa la comprobación de disponibilidad requerida para cumplir RNF8.                                                                                |
| `reservarCupo()`             | Asigna un cupo a una reserva. La comprobación y la asignación deben realizarse como una operación atómica para evitar dobles reservas.                   |

No se almacena `cuposDisponibles`, porque puede calcularse restando las reservas existentes de `cuposTotales`. Almacenar ambos valores produciría información duplicada y potencialmente inconsistente.

---

## 3.9 `Reserva`

| Elemento                              | Justificación                                                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clase `Reserva`                       | RF3 permite agendar una prueba de manejo y RF4 permite agendar la renovación de la libreta. Corresponde a US10, US11 y US12.                                     |
| `id`                                  | Permite identificar una reserva concreta dentro de la agenda.                                                                                                    |
| Asociación con `Usuario`              | Permite conocer qué usuario realizó la reserva y proteger sus datos personales según RNF4.                                                                       |
| Asociación con `FranjaDisponibilidad` | La reserva debe ocupar una franja concreta. La fecha, horario y tipo de trámite se obtienen de esa franja y no se duplican en `Reserva`.                         |
| `crear(usuario, franja)`              | Deriva del verbo “agendarse” de RF3 y RF4. Debe comprobar que exista disponibilidad antes de persistir la reserva.                                               |
| `yaExistePara(usuario, franja)`       | Implementa RNF8 evitando que el mismo usuario genere dos reservas para la misma franja.                                                                          |
| `generarConfirmacion()`               | RNF9 y US14 exigen mostrar una confirmación visual después de completar la reserva. El método devuelve la información necesaria para presentar esa confirmación. |

Los datos personales adicionales del ciudadano no se detallan porque la versión académica no especifica qué campos son obligatorios. No deben inventarse teléfono, correo, domicilio u otros atributos sin un requerimiento que los respalde.

---

## 3.10 `ConsultaAgenda`

`ConsultaAgenda` se modela como una clase de servicio sin atributos persistentes. No representa una nueva entidad, sino diferentes formas de consultar las reservas existentes.

| Elemento                 | Justificación                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| Clase `ConsultaAgenda`   | RF14, RF15 y RF16 exigen visualizar la agenda utilizando diferentes períodos.                        |
| `listarPorDia(fecha)`    | Deriva directamente de RF14 y US18. Devuelve las reservas correspondientes al día indicado.          |
| `listarPorSemana(fecha)` | Deriva directamente de RF15 y US19. Devuelve las reservas comprendidas en la semana correspondiente. |
| `listarPorMes(fecha)`    | Deriva directamente de RF16 y US20. Devuelve las reservas comprendidas en el mes correspondiente.    |

`ConsultaAgenda` no genera una tabla propia porque los datos consultados ya pertenecen a `Reserva` y `FranjaDisponibilidad`.

---

## 3.11 `HistorialAccion`

| Elemento                               | Justificación                                                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Clase `HistorialAccion`                | RNF3 exige un historial completo de acciones administrativas y US25 expresa la misma necesidad desde la perspectiva del personal de la IMSJ. |
| `id`                                   | Identifica de manera única cada entrada del historial.                                                                                       |
| Asociación con `Usuario`               | Permite conocer qué integrante del personal realizó la acción.                                                                               |
| `accion`                               | Indica si se realizó una creación, modificación, publicación, despublicación o eliminación.                                                  |
| `fechaHora`                            | Permite conocer cuándo ocurrió la acción. La documentación de seguridad exige registrar fecha y hora.                                        |
| `tipoElemento`                         | Indica qué clase de elemento fue afectado, por ejemplo noticia, material, pregunta frecuente o franja.                                       |
| `elementoId`                           | Identifica la instancia concreta sobre la que se realizó la acción.                                                                          |
| `registrar(usuario, accion, elemento)` | Crea una entrada de auditoría con el usuario, la acción, la fecha y el elemento afectado, cumpliendo RNF3.                                   |

No se definen métodos normales para modificar o eliminar registros del historial, porque permitirlo comprometería la confiabilidad de la auditoría.

---

## 3.12 `PortalPublico`

`PortalPublico` es una clase de servicio sin persistencia propia. Su responsabilidad es consultar las entidades almacenadas y aplicar las reglas de visibilidad antes de enviarlas al frontend público.

| Elemento                   | Justificación                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Clase `PortalPublico`      | RF2, RF5 y RF6 definen las consultas públicas de noticias, materiales y preguntas frecuentes. |
| `consultarNoticias(fecha)` | Implementa RF2. Solo devuelve noticias publicadas y vigentes.                                 |
| `consultarMateriales()`    | Implementa RF5 y US21. Solo devuelve materiales con estado `PUBLICADO`.                       |
| `consultarPreguntas()`     | Implementa RF6 y US23. Solo devuelve preguntas frecuentes publicadas.                         |

No se crea una tabla para `PortalPublico` porque no almacena información propia.

---

# 4. Elementos no incorporados en el modelo inicial

| Elemento posible                                        | Motivo                                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Roles distintos de público y personal IMSJ              | No presentes en código actual; CC-03 requiere diferenciación posterior. |
| Aprobación de noticias por Dirección                    | Relevada en entrevista y ampliada por CC-03/RF21; pendiente, no excluida. |
| Categorías de preguntas frecuentes                      | Relevadas en entrevista/RF19; pendientes, no excluidas. |
| Estados adicionales para noticias                       | Ausentes en código; flujo de cuatro estados registrado en CC-03. |
| Costo de la renovación urgente                          | Letra académica exige registrar costo especial; valor/cálculo pendientes. No se incorpora por suposición. |
| Duración fija para todas las franjas                    | No se especifica; por eso se utilizan `horaInicio` y `horaFin`.                                |
| Datos personales concretos adicionales a la cédula      | No se especifica cuáles son obligatorios.                                                      |
| Estado confirmada, pendiente o cancelada para `Reserva` | La versión académica exige confirmación visual, pero no define un ciclo de estados de reserva. |
| Métodos para cancelar o reprogramar reservas            | No están en catálogo inicial; la letra sí incluye endpoint de cancelación. Alcance/equivalencia pendientes de decisión. |
| Modificación o eliminación del historial                | Contradiría el objetivo de auditoría de RNF3.                                                  |

---

# 5. Correspondencia con la implementación y el relevamiento posterior

**IA — Observación basada en `backend/app/` y esquema de `df581ab`:** las operaciones conceptuales no son necesariamente métodos de modelos Eloquent. No se crean clases nuevas para hacer coincidir el código con un dibujo.

| Concepto inicial | Clases/operaciones actuales | Trazabilidad y límite |
|---|---|---|
| Usuario / iniciar sesión | User; AuthController/AuthService; UserRepositoryInterface/EloquentUserRepository. | RF1/RNF1/RNF4. `password` tiene cast hashed; `nombre` y `activo` están presentes. |
| Noticia / CRUD / publicar | Noticia y scopes/relaciones; NoticiaController/NoticiaService; repositorio de noticias. | RF2/RF7–RF10. PUBLICADO/NO_PUBLICADO; CC-03 pendiente. |
| Galería y enlaces de Noticia | NoticiaImagen y NoticiaEnlace, cada uno con FK a noticia. | RF9. Persistencia diferenciada de colecciones del modelo conceptual. |
| MaterialEstudio | Modelo, controlador, servicio y repositorio del módulo. | RF5/RF17/RF20. PDF/imagen como archivo; VIDEO como URL. |
| PreguntaFrecuente | Modelo, controlador, servicio y repositorio del módulo. | RF6/RF18. Sin categorías RF19 ni colección específica de enlaces. |
| FranjaDisponibilidad | Modelo, controlador, servicio y repositorio del módulo. | RF11–RF13/RNF8. Tipo y cupos; sin costo urgente. |
| Reserva / ConsultaAgenda | ReservaController/ReservaService; ReservaRepositoryInterface/EloquentReservaRepository; Reserva y FranjaDisponibilidad. | RF3/RF4/RF14–RF16. `crear`, `obtenerDelUsuario` y `obtenerAgenda`; transacción y bloqueo en repositorio. `ConsultaAgenda` no existe como clase PHP. |
| HistorialAccion | Modelo con método estático `registrar`; consulta mediante controlador/servicio/repositorio. | RNF3. Registra actor/acción/elemento/fecha; no conserva valores anterior/nuevo. No se atribuye esa capacidad por copiar el ejemplo. |
| PortalPublico | Métodos `publicIndex`, servicios, repositorios y scopes. | RF2/RF5/RF6. No existe clase PHP con este nombre ni tabla propia. |
| RolUsuario / EstadoPublicacion / TipoMaterial / TipoTramite | Valores string validados y enumeraciones del esquema. | Conceptos del diseño; no enums PHP declarados. |
| PreguntaPrueba, ausente de la derivación inicial | Modelo con pregunta, opcion_a/b/c/d y respuesta_correcta; PreguntaPruebaController/Service y repositorio. | RF22/CC-01, US31. Servicio obtiene prueba y corrige; CRUD auditado. CC-04 no implementado. |
| Tokens de acceso | Sanctum y tabla personal_access_tokens; emisión/revocación en AuthService. | RF1/RNF4. Ocho horas observadas; fuera de las diez entidades del dibujo MER. |

## Reglas y supuestos que requieren revisión

- La duración/cupos de las franjas y el costo urgente no se inventan: el equipo debe completar su origen y criterio.
- La aprobación por Directora, categorías y gráficos requieren modelado cuando se cierren las reglas; no se dibujan como implementados.
- El campo `tipo_elemento`/`elemento_id` del historial identifica el objeto auditado sin FK para cada tipo. Su integridad y cobertura deben revisarse; no se declara historial de valores anterior/nuevo.
- La justificación de una asociación no prueba un resultado de ejecución. [Verificación](verificacion.md) separa archivos de prueba y evidencia.

Los [diagramas y sus aclaraciones](Diagramas/README.md) distinguen vista simplificada, esquema físico y responsabilidades actuales. Fuente: [modelado TamboTrace](https://github.com/portalutu/ing_software-3ro-bt/blob/ae1c0f118a959c5bba7fd6c8badf60de1b7ea23a/Practicos/ada-tambotrace.md), adaptando únicamente la estructura y no sus datos o decisiones.

# 6. Responsabilidades de destino — CC-05

**Grupo, 02/10/2026:** reemplazar Laravel por PHP sin framework y PDO, siguiendo las capas de `api-completa`. La sección 5 conserva correspondencia con el código Laravel presente; no describe clases PHP ya migradas.

**IA — Correspondencia técnica para revisión:** se mantienen entidades y reglas IMSJ. Los modelos de destino representan datos del dominio; los repositorios PDO realizan SQL; los servicios conservan negocio/transacciones; controladores, validadores y DTO atienden entradas HTTP. No se agrega Product ni Venta al modelo por usar ese ejemplo.

| Responsabilidad previa | Destino a implementar |
|---|---|
| Modelos Eloquent, relaciones y scopes | Objetos PHP y consultas explícitas para relaciones, publicación y vigencia; conservar tipos/null/arrays del JSON. |
| Repositorios Eloquent | Repositorios PDO con parámetros, búsquedas por id/cédula, FK/índices y transacciones. |
| Controladores/validación Laravel | Adaptadores HTTP, validadores y DTO por operación, sin entrada libre de campos sensibles. |
| Servicios y model binding | Reglas preservadas, búsqueda explícita y control de inexistencia/propiedad. |
| Sanctum y recursos/filesystem | Reemplazo de autenticación, serialización y archivos compatible; diseño de token y transición de sesiones pendientes. |

`personal_access_tokens` es una tabla técnica actual: no se borra ni se conserva como dependencia de Sanctum por decisión automática; su transición requiere diseño/evidencia. CC-03 Directora y CC-04 gráficos siguen pendientes y no se dibujan como implementados. Ver [diagramas](Diagramas/README.md), [migración](migracion_backend_vanilla.md) y [API](api.md).
