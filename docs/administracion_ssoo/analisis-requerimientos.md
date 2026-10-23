# Análisis de requerimientos de infraestructura

**Proyecto:** Educación Vial IMSJ - Portal Vial

**Plataforma:** Ubuntu Server 26.04 LTS

## 1. Objetivo

Definir la infraestructura necesaria para ejecutar el portal público, el panel IMSJ, la API PHP y la base MySQL en un servidor Linux administrable, recuperable y accesible desde la red autorizada.

## 2. Carga de trabajo

| Dato | Valor utilizado |
|---|---|
| Usuarios simultáneos | 90 |
| Aplicaciones web | 1 |
| Bases de datos | 1 |
| Contenedores auxiliares | 0 |
| Perfil | Pequeña producción |
| Datos iniciales | 1 GB estimado |
| Crecimiento mensual | 10 % estimado |
| Proyección | 12 meses |
| Backups completos | 1 por día |
| Retención local en la VM base | 2 días |
| Retención externa inicial | 7 copias diarias |
| Administración | Cockpit |
| Umbral de revisión | 70 % sostenido de CPU, RAM o disco |
| Copia externa | Sí |
| RAID1 | No, por tratarse de una VM con backup externo |

La estimación de 90 usuarios simultáneos contempla una situación de difusión concentrada, por ejemplo compartir el portal mediante un código QR durante una charla en un liceo. Dos clases pueden aportar aproximadamente 60 accesos al mismo tiempo; el resto de la capacidad permite atender a ciudadanos y personal que ya estén utilizando el sitio. Este valor describe sesiones con el portal abierto, no 90 solicitudes PHP ejecutándose de forma permanente.

El portal entrega principalmente HTML, CSS, JavaScript e imágenes estáticas. PHP y MySQL intervienen en solicitudes breves de consulta, autenticación, reserva y administración. Por esa razón, el dimensionamiento se basa en el tipo y la duración de las operaciones, los dos contenedores desplegados y un margen operativo, en lugar de asignar una cantidad fija de memoria por usuario. La concurrencia y el crecimiento deberán contrastarse con métricas reales.

## 3. Dimensionamiento

Se adopta una configuración inicial que cubre Ubuntu Server, Docker, Cockpit, Apache/PHP y MySQL, y que puede ampliarse después de medir el entorno objetivo:

| Recurso | Fundamento | Configuración inicial |
|---|---|---:|
| CPU | Operaciones HTTP y SQL breves, sin procesamiento intensivo | **2 vCPU** |
| Memoria | SO, Docker, Apache/PHP, MySQL, Cockpit y margen para picos | **4 GB RAM** |
| Disco útil | SO, imágenes Docker, aplicación, datos, adjuntos, logs y las dos copias diarias más recientes | **30 GB SSD/NVMe** |
| Disco con 7 copias completas locales | Mayor retención dentro de la misma VM | **40–50 GB SSD/NVMe** |

Los videos se conservan como enlaces externos y no ocupan almacenamiento local. Los elementos de mayor tamaño son los PDF y las imágenes cargados por el personal. La configuración de 30 GB requiere trasladar cada respaldo válido a un medio externo y limitar la retención dentro de la VM a dos días. Si se mantienen siete copias completas en la VM, se deben asignar entre 40 y 50 GB.

La configuración es un punto de partida, no una capacidad garantizada. Una prueba de carga de 90 sesiones deberá registrar solicitudes por segundo, latencia, errores, CPU, memoria e I/O. Si un recurso supera de forma sostenida el 70 %, se ajustará la VM.

## 4. Requerimientos del servidor

| Código | Requerimiento |
|---|---|
| RS-01 | Utilizar Ubuntu Server 26.04 LTS de 64 bits. |
| RS-02 | Asignar inicialmente 2 vCPU, 4 GB de RAM y 30 GB de disco SSD/NVMe. |
| RS-03 | Configurar un usuario administrativo con `sudo`, sin trabajar habitualmente como `root`. |
| RS-04 | Habilitar OpenSSH Server para la administración remota. |
| RS-05 | Configurar una IP fija mediante Netplan. |
| RS-06 | Aplicar UFW con denegación de entradas por defecto y permitir solo SSH, aplicación y Cockpit desde redes autorizadas. |
| RS-07 | Instalar Docker Engine desde el repositorio oficial y Docker Compose v2. |
| RS-08 | Ejecutar la aplicación y MySQL mediante `compose.yaml`. |
| RS-09 | Mantener MySQL sin puerto publicado hacia el host. |
| RS-10 | Conservar base, adjuntos y caché en volúmenes persistentes. |
| RS-11 | Reiniciar los contenedores automáticamente después de reiniciar el servidor. |
| RS-12 | Limitar el tamaño y la cantidad de archivos de log de Docker. |
| RS-13 | Realizar un backup diario de base, adjuntos, código y configuración. |
| RS-14 | Mantener localmente las dos copias diarias más recientes y al menos siete copias diarias en un medio externo protegido; usar 40–50 GB si se requieren siete copias completas dentro de la VM. |
| RS-15 | Probar la restauración sobre una instalación aislada antes de considerar válido un backup. |
| RS-16 | Supervisar CPU, RAM, disco, logs, contenedores y estado de los servicios. |
| RS-17 | Validar la configuración con 90 sesiones simultáneas y ampliar recursos si CPU, RAM o disco superan de forma sostenida el 70 %. |

## 5. Servicios y puertos

| Servicio | Puerto | Exposición |
|---|---:|---|
| SSH | 22/TCP | Solo administración autorizada |
| Portal, panel y API | 8000/TCP | Red autorizada |
| Cockpit | 9090/TCP | Solo administración autorizada |
| MySQL | 3306/TCP | Únicamente dentro de Docker |

La demostración utiliza HTTP en una red controlada. Una publicación en Internet requiere dominio, HTTPS y un proxy inverso administrado por la institución.

## 6. Criterios de aceptación

- Ubuntu informa una versión 26.04 LTS actualizada.
- La IP del servidor permanece estable después de reiniciar.
- SSH, UFW, Docker y Cockpit se encuentran activos.
- `app` y `db` aparecen saludables en Docker Compose.
- El portal responde desde otra computadora autorizada de la red.
- MySQL no acepta conexiones directas desde la red.
- Los datos y adjuntos permanecen después de recrear los contenedores.
- El backup genera archivos verificables mediante SHA-256.
- Una restauración aislada recupera cuentas, contenidos, adjuntos, consultas y reservas.
- Una prueba de carga de 90 sesiones simultáneas confirma tiempos de respuesta y consumo de CPU, memoria e I/O aceptables antes de la publicación institucional.

## Referencias

- [Calculadora didáctica de requerimientos](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/calculadora_requerimientos_servidor.html)
- [Servidor Linux con Docker](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/plan_servidor_linux_docker.md)
- [Ciclo de soporte de Ubuntu](https://ubuntu.com/about/release-cycle)
- [Instalación oficial de Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
