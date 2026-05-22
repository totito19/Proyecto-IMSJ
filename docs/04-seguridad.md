# 04 - Seguridad

## 1. Introduccion

Este documento describe las politicas y controles de seguridad aplicados al
sistema de Educacion Vial IMSJ. Aborda la autenticacion, la autorizacion, la
proteccion de datos y la respuesta ante incidentes.

## 2. Autenticacion

- El acceso al panel administrativo requiere usuario y contrasena.
- Las contrasenas se almacenan utilizando un algoritmo de hash robusto con
  sal individual (por ejemplo, bcrypt o argon2).
- La sesion se gestiona mediante tokens firmados (JWT) con una vigencia
  limitada y renovacion controlada.
- Tras un numero configurable de intentos fallidos, el sistema aplica un
  bloqueo temporal y registra el evento en la auditoria.

## 3. Autorizacion

- El control de acceso se basa en roles: `admin` y `superadmin`.
- Cada endpoint privado declara explicitamente el rol minimo requerido.
- El backend valida el rol del token en cada solicitud; el frontend no es
  considerado fuente confiable para esa decision.
- Las operaciones sobre usuarios administrativos solo se permiten al rol
  `superadmin`.

## 4. Proteccion en transito

- Todo el trafico debe servirse por HTTPS con certificados vigentes.
- Se habilita HSTS para forzar conexiones seguras en navegadores compatibles.
- Las cookies de sesion utilizan los atributos `Secure`, `HttpOnly` y
  `SameSite=Strict`.

## 5. Proteccion en reposo

- La base de datos almacena unicamente hashes de contrasenas, nunca el
  texto plano.
- Los archivos cargados se almacenan fuera del directorio publico y se
  sirven a traves del backend con validaciones de autorizacion.
- Las credenciales y claves se gestionan mediante variables de entorno; no
  se almacenan en el repositorio.

## 6. Validacion de entrada

- Todas las entradas externas se validan en el backend antes de ser
  procesadas o persistidas.
- Las consultas a la base de datos utilizan parametros vinculados para
  prevenir inyeccion SQL.
- El contenido enviado por usuarios se sanitiza antes de ser renderizado para
  evitar XSS.
- Se aplican limites de tamano y tipo a los archivos cargados.

## 7. Auditoria y registro

- Toda operacion administrativa relevante se registra en la entidad
  `Auditoria`.
- Los registros incluyen el usuario, la accion, la entidad afectada y la
  marca temporal.
- Los registros no contienen contrasenas, tokens ni datos sensibles.

## 8. Gestion de dependencias

- Las dependencias del proyecto se mantienen actualizadas.
- Se aplican parches de seguridad de manera prioritaria.
- Se utilizan herramientas automatizadas para deteccion de vulnerabilidades
  en paquetes de terceros.

## 9. Respuesta ante incidentes

- Cualquier incidente de seguridad se documenta y se comunica al responsable
  designado del IMSJ.
- Se contemplan acciones inmediatas (revocacion de credenciales, rotacion
  de claves, bloqueo de cuentas) y un analisis posterior para evitar la
  recurrencia.
