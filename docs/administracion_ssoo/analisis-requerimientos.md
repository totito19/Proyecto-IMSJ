# Análisis de requerimientos de infraestructura

**Proyecto:** Educación Vial IMSJ - Portal Vial

**Plataforma:** Ubuntu Server 24.04 LTS

## 1. Objetivo

Definir la infraestructura necesaria para ejecutar el portal público, el panel IMSJ, la API PHP y la base MySQL en un servidor Linux administrable, recuperable y accesible desde la red autorizada.

## 2. Carga de trabajo

| Dato | Valor utilizado |
|---|---|
| Usuarios simultáneos | 40 |
| Aplicaciones web | 1 |
| Bases de datos | 1 |
| Contenedores auxiliares | 0 |
| Perfil | Pequeña producción |
| Datos iniciales | 1 GB estimado |
| Crecimiento mensual | 10 % estimado |
| Proyección | 12 meses |
| Backups completos | 1 por día |
| Retención local | 7 días |
| Administración | Cockpit |
| Margen para SO y picos | 25 % |
| Copia externa | Sí |
| RAID1 | No, por tratarse de una VM con backup externo |

Los 40 usuarios simultáneos fueron definidos por el equipo. El volumen inicial y el crecimiento son supuestos de dimensionamiento y deberán sustituirse por mediciones reales cuando el sistema entre en operación.

## 3. Dimensionamiento

Se utilizó la calculadora docente de requerimientos para Ubuntu Server y Docker. Con los valores anteriores, la estimación produce:

| Recurso | Cálculo | Recomendación |
|---|---:|---:|
| CPU | 5 vCPU mínimos | **6 vCPU** |
| Memoria | 7 GB mínimos | **8 GB RAM** |
| Disco útil | 44 GB mínimos | **50 GB SSD/NVMe** |
| Datos al mes 12 | 3,1 GB | Incluidos en el disco recomendado |
| Backups locales | 14,3 GB aproximados | Incluidos en el disco recomendado |

La estimación es inicial. Durante la operación deben revisarse CPU, memoria, espacio, logs y crecimiento de datos.

## 4. Requerimientos del servidor

| Código | Requerimiento |
|---|---|
| RS-01 | Utilizar Ubuntu Server 24.04 LTS de 64 bits. |
| RS-02 | Asignar 6 vCPU, 8 GB de RAM y 50 GB de disco SSD/NVMe. |
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
| RS-14 | Mantener siete backups locales y una copia externa protegida. |
| RS-15 | Probar la restauración sobre una instalación aislada antes de considerar válido un backup. |
| RS-16 | Supervisar CPU, RAM, disco, logs, contenedores y estado de los servicios. |

## 5. Servicios y puertos

| Servicio | Puerto | Exposición |
|---|---:|---|
| SSH | 22/TCP | Solo administración autorizada |
| Portal, panel y API | 8000/TCP | Red autorizada |
| Cockpit | 9090/TCP | Solo administración autorizada |
| MySQL | 3306/TCP | Únicamente dentro de Docker |

La demostración utiliza HTTP en una red controlada. Una publicación en Internet requiere dominio, HTTPS y un proxy inverso administrado por la institución.

## 6. Criterios de aceptación

- Ubuntu informa la versión 24.04 LTS.
- La IP del servidor permanece estable después de reiniciar.
- SSH, UFW, Docker y Cockpit se encuentran activos.
- `app` y `db` aparecen saludables en Docker Compose.
- El portal responde desde otra computadora autorizada de la red.
- MySQL no acepta conexiones directas desde la red.
- Los datos y adjuntos permanecen después de recrear los contenedores.
- El backup genera archivos verificables mediante SHA-256.
- Una restauración aislada recupera cuentas, contenidos, adjuntos, consultas y reservas.

## Referencias docentes

- [Calculadora de requerimientos](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/calculadora_requerimientos_servidor.html)
- [Servidor Linux con Docker](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/plan_servidor_linux_docker.md)
- [Ubuntu Server 24.04 LTS](https://github.com/portalutu/3--Adm-SSOO/blob/main/Practicas/4_ubuntu_server_completo.md)
