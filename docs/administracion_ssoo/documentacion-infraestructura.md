# Documentación de infraestructura

**Proyecto:** Educación Vial IMSJ - Portal Vial

**Entorno objetivo:** Ubuntu Server 24.04 LTS

## 1. Inventario del servidor

| Elemento | Configuración |
|---|---|
| CPU | 6 vCPU |
| Memoria | 8 GB RAM |
| Disco | 50 GB SSD/NVMe |
| Red | IP fija con Netplan |
| Administración | OpenSSH y Cockpit |
| Firewall | UFW |
| Contenedores | Docker Engine y Docker Compose v2 |
| Automatización | Bash y cron |

## 2. Archivos operativos

| Archivo | Función |
|---|---|
| `backend/Dockerfile` | Construye la imagen Apache/PHP e instala las extensiones necesarias. |
| `backend/compose.yaml` | Define aplicación, base, volúmenes, reinicio, salud, logs y exposición de red. |
| `backend/apache.conf` | Configura la API y los alias de los frontends. |
| `backend/.env.example` | Plantilla sin secretos para crear `.env`. |
| `backend/database.sql` | Crea el esquema inicial cuando el volumen de MySQL está vacío. |
| `backend/scripts/migrar.php` | Aplica cambios incrementales de esquema sin borrar datos. |
| `backend/scripts/crear_admin.php` | Crea la primera cuenta de personal. |
| `backend/scripts/salud.php` | Comprueba aplicación, base y portal. |
| `backend/scripts/backup.sh` | Genera backup completo, manifiesto y hashes. |
| `backend/scripts/restore.sh` | Restaura base y adjuntos en una instalación confirmada. |

## 3. Servicios Docker

| Servicio | Imagen | Usuario | Exposición | Persistencia |
|---|---|---|---|---|
| `app` | Construida desde `php:8.5-apache` | `www-data` | `APP_BIND:APP_PORT` hacia 80 | `app_uploads`, `cache` |
| `db` | `mysql:8.4` | `mysql` | Sin puerto publicado | `db_data` |

Ambos servicios utilizan `restart: unless-stopped`, raíz de solo lectura, `no-new-privileges`, capacidades reducidas y rotación de logs. `app` espera que `db` esté saludable.

## 4. Volúmenes

| Volumen | Contenido | Incluido en backup |
|---|---|---|
| `db_data` | Datos internos de MySQL | Mediante dump lógico comprimido |
| `app_uploads` | PDF e imágenes cargados | Sí, como archivo comprimido |
| `cache` | Contadores temporales de autenticación | No; puede reconstruirse |

## 5. Variables de configuración

| Variable | Uso |
|---|---|
| `APP_ENV` | `production` en el servidor. |
| `APP_BIND` | `0.0.0.0` para escuchar en las interfaces del servidor. |
| `APP_PORT` | Puerto publicado, 8000 por defecto. |
| `APP_URL` | URL completa con IP fija o dominio. |
| `FRONTEND_ORIGIN` | Origen permitido para el navegador. |
| `DB_DATABASE` | Nombre de la base. |
| `DB_USERNAME` | Usuario de aplicación. |
| `DB_PASSWORD` | Contraseña del usuario de aplicación. |
| `DB_ROOT_PASSWORD` | Contraseña administrativa de MySQL. |
| `INITIAL_ADMIN_*` | Datos temporales para crear la primera cuenta. |

`.env` debe pertenecer al administrador y utilizar permisos `600`. No se guarda en Git.

## 6. Red y firewall

La IP se configura mediante Netplan con los datos reales de la red. UFW aplica:

- denegar conexiones entrantes por defecto;
- permitir salidas;
- permitir 22/TCP desde la red administrativa;
- permitir 8000/TCP desde la red autorizada;
- permitir 9090/TCP únicamente desde la red administrativa;
- no permitir 3306/TCP desde el host.

El puerto publicado por Compose escucha en `0.0.0.0`, pero la autorización efectiva queda en UFW.

## 7. Operación

```bash
cd /srv/imsj/Proyecto-IMSJ/backend
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs --tail 100 app db
```

Para detener sin borrar datos:

```bash
docker compose stop
```

No se utiliza `docker compose down -v` durante la operación normal porque elimina los volúmenes persistentes.

## 8. Monitoreo

```bash
hostnamectl
ip -br address
uptime
free -h
df -h
ss -tulpn
systemctl status docker
docker compose ps
docker stats --no-stream
docker system df
```

Cockpit complementa estas comprobaciones desde el puerto 9090 restringido a administración.

## 9. Backup

Ejecución manual:

```bash
cd /srv/imsj/Proyecto-IMSJ/backend
chmod +x scripts/backup.sh scripts/restore.sh
./scripts/backup.sh /srv/backups/imsj
```

Cada backup contiene:

```text
backup-AAAA-MM-DD_HH-MM-SS/
├── base.sql.gz
├── adjuntos.tar.gz
├── proyecto.tar.gz
├── config/
│   ├── .env
│   ├── compose.yaml
│   ├── Dockerfile
│   └── apache.conf
├── MANIFIESTO.txt
└── SHA256SUMS
```

La carpeta contiene configuración sensible y debe almacenarse con acceso restringido. Además de la copia local se conserva otra copia en un medio externo protegido.

## 10. Restauración

La restauración se realiza sobre una instalación aislada y requiere confirmación explícita:

```bash
IMSJ_RESTORE_CONFIRM=YES ./scripts/restore.sh /srv/backups/imsj/backup-FECHA
```

Después se comprueban portal, ingreso, contenidos, adjuntos, consultas, reservas y conteos de la base.

## Documentos relacionados

[Análisis](analisis-requerimientos.md), [arquitectura](arquitectura_propuesta.md), [justificación](justificacion-tecnologica.md) y [reconstrucción](reconstruccion-infraestructura.md).
