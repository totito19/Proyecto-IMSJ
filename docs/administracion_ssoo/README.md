# Administración de Sistemas Operativos

**Proyecto:** Educación Vial IMSJ - Portal Vial

**Plataforma objetivo:** Ubuntu Server 24.04 LTS

## Documentos de entrega

| Documento | Contenido |
|---|---|
| [Análisis de requerimientos](analisis-requerimientos.md) | Carga, supuestos, cálculo de servidor y requisitos operativos. |
| [Arquitectura propuesta](arquitectura_propuesta.md) | Ubuntu, red, firewall, Docker, volúmenes, backup y monitoreo. |
| [Justificación tecnológica](justificacion-tecnologica.md) | Motivo de cada tecnología y sus condiciones de uso. |
| [Documentación de infraestructura](documentacion-infraestructura.md) | Inventario, archivos, variables, servicios y operación. |
| [Reconstrucción](reconstruccion-infraestructura.md) | Instalación completa desde Ubuntu Server hasta backup y restauración. |

## Especificación principal

- 40 usuarios simultáneos.
- 6 vCPU.
- 8 GB de RAM.
- 50 GB SSD/NVMe.
- IP fija con Netplan.
- OpenSSH y Cockpit.
- UFW.
- Docker Engine y Docker Compose v2.
- Un backup diario, siete copias locales y una copia externa.

El dimensionamiento fue calculado con la herramienta docente. Los datos iniciales y el crecimiento son supuestos que deben ajustarse con mediciones reales.

## Archivos operativos

- [`compose.yaml`](../../backend/compose.yaml)
- [`Dockerfile`](../../backend/Dockerfile)
- [Plantilla de entorno](../../backend/.env.example)
- [Script de backup](../../backend/scripts/backup.sh)
- [Script de restauración](../../backend/scripts/restore.sh)

## Estado de evidencia

La configuración y el procedimiento están preparados. La instalación, el backup completo y la restauración deben ejecutarse y registrarse en una VM Ubuntu Server 24.04 LTS antes de imprimir la versión final.

## Fuentes docentes

- [Requerimientos por asignatura](https://github.com/portalutu/proyecto-3ro-bt-2026/blob/main/Lineamientos/requerimientos_por_asignatura.md)
- [Calculadora de servidor](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/calculadora_requerimientos_servidor.html)
- [Plan de servidor Linux con Docker](https://github.com/portalutu/3--Adm-SSOO/blob/main/Teoricos/plan_servidor_linux_docker.md)
- [Práctica Ubuntu Server 24.04 LTS](https://github.com/portalutu/3--Adm-SSOO/blob/main/Practicas/4_ubuntu_server_completo.md)
