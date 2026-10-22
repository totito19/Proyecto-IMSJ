# Justificación tecnológica

**Proyecto:** Educación Vial IMSJ - Portal Vial

## Decisiones de infraestructura

| Tecnología | Justificación | Condición |
|---|---|---|
| Ubuntu Server 24.04 LTS | Es la plataforma de servidor solicitada y ofrece soporte prolongado, administración por terminal, Netplan, UFW y systemd. | Debe mantenerse actualizado y administrarse con un usuario `sudo`. |
| Docker Engine | Aísla la aplicación y la base del sistema anfitrión y permite reconstruir el entorno de forma repetible. | Se instala desde el repositorio oficial de Docker para Ubuntu. |
| Docker Compose v2 | Define servicios, volúmenes, variables, dependencias y controles de salud en un solo archivo. | La configuración sensible permanece en `.env`, fuera de Git. |
| Apache y PHP 8.5 | Ejecutan la API PHP y publican el portal y el panel desde el mismo origen. | Solo `public/` y los alias de frontend quedan expuestos. |
| MySQL 8.4 | Conserva las relaciones, restricciones y transacciones del sistema. | El puerto 3306 permanece dentro de Docker. |
| Volúmenes Docker | Separan datos, adjuntos y caché del ciclo de vida de los contenedores. | Deben formar parte del backup y de la prueba de restauración. |
| Netplan | Mantiene una dirección estable para que los clientes localicen el servidor. | La interfaz, IP, gateway y DNS dependen de la red real. |
| UFW | Limita las conexiones entrantes a los servicios autorizados. | SSH debe permitirse antes de activar el firewall. |
| OpenSSH | Permite administrar el servidor sin interfaz gráfica. | Se utiliza un usuario administrativo distinto de `root`. |
| Cockpit | Permite observar servicios, recursos y registros desde una interfaz de administración. | El puerto 9090 se restringe a la red administrativa. |
| Bash y cron | Automatizan backups diarios y tareas operativas con herramientas nativas de Linux. | Los scripts generan hashes de integridad. |

## Dimensionamiento

La calculadora docente se utilizó con 40 usuarios simultáneos, una aplicación, una base, pequeña producción, 1 GB inicial, 10 % de crecimiento mensual, doce meses, siete backups diarios retenidos, Cockpit y 25 % de margen.

El resultado recomendado es **6 vCPU, 8 GB de RAM y 50 GB SSD/NVMe útiles**. La capacidad debe revisarse con métricas reales de CPU, memoria, disco y crecimiento.

## Organización de los servicios

El despliegue mantiene dos contenedores:

- `app`: Apache, PHP, API y frontends;
- `db`: MySQL.

Esta separación permite actualizar la aplicación sin reemplazar los datos. MySQL no se expone hacia la red y solo `app` publica el puerto de la aplicación.

No se incorpora Portainer porque no es necesario para operar dos servicios y su acceso al socket de Docker amplía privilegios. Cockpit y la terminal permiten realizar las tareas administrativas requeridas.

## Disponibilidad y operación

`restart: unless-stopped` permite recuperar los servicios después de reiniciar Ubuntu. Los healthchecks verifican aplicación y base; los logs se rotan para evitar crecimiento indefinido. La persistencia depende de los volúmenes, no de los contenedores.

## Backup y recuperación

El backup incluye código, dump MySQL, adjuntos, configuración protegida, manifiesto y hashes. Se ejecuta una vez por día, conserva siete copias locales y requiere una copia externa. La restauración se prueba sobre una instalación aislada.

Copiar únicamente el repositorio no recupera los datos. Copiar únicamente un volumen MySQL mientras está escribiendo tampoco sustituye un dump lógico consistente.

## Seguridad

- Administración mediante usuario `sudo`, no mediante uso habitual de `root`.
- UFW con denegación de entradas por defecto.
- MySQL sin puerto publicado.
- Contraseñas únicamente en `.env` protegido.
- Contenedores con usuarios de servicio, raíz de solo lectura y capacidades reducidas.
- HTTPS obligatorio antes de una publicación en Internet.

## Referencias

[Análisis](analisis-requerimientos.md), [arquitectura](arquitectura_propuesta.md), [inventario](documentacion-infraestructura.md) y [reconstrucción](reconstruccion-infraestructura.md).
