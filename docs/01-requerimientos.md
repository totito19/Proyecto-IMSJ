# 01 - Requerimientos

## 1. Introduccion

Este documento describe los requerimientos funcionales y no funcionales del
sistema de Educacion Vial del IMSJ. El sistema busca centralizar la
informacion publica de educacion vial, facilitar el acceso a materiales de
estudio y proveer al personal del IMSJ una herramienta para administrar
contenidos.

## 2. Alcance

El sistema se compone de:

- Un sitio publico (`frontend-publico`) accesible a la ciudadania.
- Un panel administrativo (`frontend-imsj`) para el personal autorizado.
- Una API REST (`backend`) que centraliza la logica y los datos.

## 3. Actores

- **Ciudadano**: usuario no autenticado que consulta el sitio publico.
- **Administrador IMSJ**: personal autorizado que gestiona contenidos.
- **Superadministrador**: rol con permisos completos sobre usuarios y
  contenidos.

## 4. Requerimientos funcionales

### 4.1 Sitio publico

- RF-01: Visualizar novedades publicadas por el IMSJ.
- RF-02: Consultar el cronograma de actividades y turnos disponibles.
- RF-03: Descargar materiales de estudio en distintos formatos.
- RF-04: Acceder a una seccion de preguntas frecuentes.
- RF-05: Disponer de un formulario de contacto basico.

### 4.2 Panel administrativo

- RF-06: Autenticacion mediante credenciales personales.
- RF-07: Alta, baja y modificacion de novedades.
- RF-08: Gestion del cronograma y los cupos disponibles.
- RF-09: Carga y eliminacion de materiales de estudio.
- RF-10: Administracion del listado de preguntas frecuentes.
- RF-11: Gestion de usuarios administrativos (solo superadministrador).

### 4.3 Backend

- RF-12: Exponer endpoints REST documentados para las operaciones anteriores.
- RF-13: Registrar auditoria de las operaciones administrativas.
- RF-14: Validar los datos recibidos antes de persistirlos.

## 5. Requerimientos no funcionales

- RNF-01: El sitio publico debe ser responsive y accesible (WCAG AA).
- RNF-02: El tiempo de respuesta de la API debe ser inferior a un segundo
  bajo carga normal.
- RNF-03: La informacion sensible debe almacenarse de forma segura.
- RNF-04: El sistema debe operar correctamente en los navegadores modernos
  vigentes.
- RNF-05: El codigo y la documentacion deben mantenerse en castellano.

## 6. Restricciones

- El sistema se desplegara en la infraestructura provista por el IMSJ.
- La base de datos sera relacional.
- El proyecto se distribuye bajo licencia MIT.

## 7. Supuestos

- El IMSJ proveera los contenidos iniciales para la carga.
- Los administradores cuentan con conectividad estable a internet.
- Los ciudadanos acceden mayoritariamente desde dispositivos moviles.
