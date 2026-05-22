# 06 - Testing

## 1. Introduccion

Este documento describe la estrategia de pruebas aplicada al sistema de
Educacion Vial IMSJ, los tipos de prueba previstos y los criterios para
considerar exitosa cada etapa de verificacion.

## 2. Objetivos

- Asegurar el cumplimiento de los requerimientos funcionales.
- Detectar defectos tempranamente en el ciclo de desarrollo.
- Verificar el correcto funcionamiento de la integracion entre frontend y
  backend.
- Confirmar el cumplimiento de los requerimientos no funcionales.

## 3. Tipos de prueba

### 3.1 Pruebas unitarias

- Alcance: funciones y servicios del backend de manera aislada.
- Herramientas: framework de pruebas estandar del lenguaje utilizado.
- Criterio de exito: cobertura minima definida por el equipo y ausencia de
  fallas en la suite.

### 3.2 Pruebas de integracion

- Alcance: interaccion entre el backend y la base de datos, y entre el
  frontend y la API.
- Datos: se utiliza una base de datos de prueba con datos representativos.
- Criterio de exito: los flujos principales se completan sin errores.

### 3.3 Pruebas funcionales

- Alcance: validacion de los flujos de usuario definidos en los
  requerimientos.
- Ejecucion: manual o automatizada mediante herramientas de prueba de
  interfaz.
- Criterio de exito: cada flujo cumple con el resultado esperado.

### 3.4 Pruebas de seguridad

- Alcance: control de acceso, manejo de sesiones, validacion de entradas y
  proteccion contra inyecciones y XSS.
- Criterio de exito: ausencia de vulnerabilidades criticas y altas
  identificadas.

### 3.5 Pruebas de rendimiento

- Alcance: comportamiento del backend bajo carga normal y carga elevada.
- Criterio de exito: tiempos de respuesta dentro de los limites definidos en
  los requerimientos no funcionales.

### 3.6 Pruebas de accesibilidad

- Alcance: sitio publico y panel administrativo.
- Referencia: WCAG nivel AA.
- Criterio de exito: cumplimiento de los criterios obligatorios para los
  flujos principales.

## 4. Casos de prueba representativos

| ID    | Descripcion                                              | Tipo        |
|-------|----------------------------------------------------------|-------------|
| CP-01 | Listar novedades publicadas desde el sitio publico       | Funcional   |
| CP-02 | Crear una novedad desde el panel administrativo          | Funcional   |
| CP-03 | Login con credenciales validas                           | Funcional   |
| CP-04 | Login con credenciales invalidas y bloqueo posterior     | Seguridad   |
| CP-05 | Cargar un material superior al tamano permitido          | Seguridad   |
| CP-06 | Consultar `/novedades` sin token                         | Seguridad   |
| CP-07 | Consultar `/usuarios` con rol `admin`                    | Seguridad   |
| CP-08 | Tiempo de respuesta de `/cronograma` bajo carga          | Rendimiento |
| CP-09 | Navegacion del sitio publico con lector de pantalla      | Accesibilidad |
| CP-10 | Recuperacion del sistema tras reinicio de la base        | Integracion |

## 5. Entornos

- **Desarrollo**: entorno local de cada integrante del equipo.
- **Pruebas**: entorno compartido con datos representativos y aislado de
  produccion.
- **Produccion**: entorno final del IMSJ; no se ejecutan pruebas destructivas
  sobre este entorno.

## 6. Reportes

- Se generan reportes al cierre de cada etapa de pruebas.
- Cada defecto identificado se registra con: descripcion, pasos para
  reproducirlo, severidad y prioridad.
- Los defectos resueltos se incluyen en el reporte final de cada entrega.
