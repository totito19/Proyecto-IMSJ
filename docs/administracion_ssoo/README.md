# Administración de Sistemas Operativos

**Proyecto:** Educación Vial IMSJ - Portal Vial

**Plataforma objetivo:** Ubuntu Server 26.04 LTS

## Documentos de entrega

| Documento | Contenido |
|---|---|
| [Análisis de requerimientos](analisis-requerimientos.md) | Carga, supuestos, cálculo de servidor y requisitos operativos. |
| [Arquitectura propuesta](arquitectura_propuesta.md) | Ubuntu, red, firewall, Docker, volúmenes, backup y monitoreo. |
| [Justificación tecnológica](justificacion-tecnologica.md) | Motivo de cada tecnología y sus condiciones de uso. |
| [Documentación de infraestructura](documentacion-infraestructura.md) | Inventario, archivos, variables, servicios y operación. |
| [Reconstrucción](reconstruccion-infraestructura.md) | Instalación completa desde Ubuntu Server hasta backup y restauración. |

## Especificación principal

- Objetivo inicial de 90 sesiones simultáneas, sujeto a prueba de carga.
- 2 vCPU.
- 4 GB de RAM.
- 30 GB SSD/NVMe; 40–50 GB si se mantienen siete backups completos dentro de la VM.
- IP fija con Netplan.
- OpenSSH y Cockpit.
- UFW.
- Docker Engine y Docker Compose v2.
- Un backup diario, las dos copias más recientes en la VM y al menos siete copias diarias en un medio externo protegido.

El dimensionamiento contempla accesos repentinos, como dos clases que abren el portal mediante un código QR durante una charla, además del tráfico habitual. Una sesión abierta no equivale a una solicitud PHP activa permanentemente. La configuración se valida midiendo latencia, errores, CPU, RAM e I/O con 90 sesiones; un uso sostenido superior al 70 % activa la revisión o ampliación del recurso afectado.

## Archivos operativos

- [`compose.yaml`](../../backend/compose.yaml)
- [`Dockerfile`](../../backend/Dockerfile)
- [Plantilla de entorno](../../backend/.env.example)
- [Script de backup](../../backend/scripts/backup.sh)
- [Script de restauración](../../backend/scripts/restore.sh)

## Estado de evidencia

La configuración y el procedimiento están preparados. La instalación, el backup completo y la restauración deben ejecutarse y registrarse en una VM Ubuntu Server 26.04 LTS antes de imprimir la versión final.

## Referencias técnicas

- [Calculadora de servidor](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/calculadora_requerimientos_servidor.html)
- [Plan de servidor Linux con Docker](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/plan_servidor_linux_docker.md)
- [Ciclo de soporte de Ubuntu](https://ubuntu.com/about/release-cycle)
- [Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
