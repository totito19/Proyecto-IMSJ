# Reconstrucción de la infraestructura

**Proyecto:** Educación Vial IMSJ - Portal Vial

**Sistema objetivo:** Ubuntu Server 26.04 LTS

## 1. Preparar el servidor

Crear una máquina virtual o servidor con:

- 2 vCPU;
- 4 GB de RAM;
- 30 GB de disco SSD/NVMe, o 40–50 GB si se conservarán siete backups completos dentro de la VM;
- adaptador de red con acceso desde los equipos autorizados;
- ISO de Ubuntu Server 26.04 LTS.

Durante la instalación seleccionar Ubuntu Server, habilitar OpenSSH Server, crear un usuario administrativo distinto de `root` y utilizar el nombre `srv-imsj` o uno equivalente.

## 2. Actualizar Ubuntu

```bash
sudo apt update
sudo apt full-upgrade -y
sudo timedatectl set-timezone America/Montevideo
sudo reboot
```

Después del reinicio:

```bash
hostnamectl
free -h
df -h
ip -br address
ip route
```

La salida debe identificar Ubuntu 26.04 LTS y los recursos asignados.

## 3. Configurar la IP fija

Identificar la interfaz y los datos entregados por la red:

```bash
ip -br address
ip route
```

Editar el archivo de Netplan disponible en `/etc/netplan/`. Ejemplo:

```yaml
network:
  version: 2
  ethernets:
    INTERFAZ:
      dhcp4: false
      addresses:
        - IP_SERVIDOR/PREFIJO
      routes:
        - to: default
          via: PUERTA_DE_ENLACE
      nameservers:
        addresses:
          - DNS_1
          - DNS_2
```

Validar antes de aplicar, especialmente si la sesión es remota:

```bash
sudo netplan try
sudo netplan apply
ip -br address
ip route
```

Los valores de interfaz, IP, prefijo, gateway y DNS deben corresponder a la red real; no se copian literalmente los nombres del ejemplo.

## 4. Configurar SSH y UFW

Instalar las herramientas necesarias:

```bash
sudo apt install -y openssh-server ufw curl ca-certificates git jq gzip
sudo systemctl enable --now ssh
```

Permitir SSH antes de activar el firewall. Sustituir `RED_ADMIN` y `RED_USUARIOS` por las redes reales, por ejemplo una red con formato `192.168.1.0/24`.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from RED_ADMIN to any port 22 proto tcp
sudo ufw allow from RED_USUARIOS to any port 8000 proto tcp
sudo ufw allow from RED_ADMIN to any port 9090 proto tcp
sudo ufw enable
sudo ufw status verbose
```

No se abre el puerto 3306 de MySQL.

## 5. Instalar Docker Engine y Compose

Eliminar paquetes incompatibles si estuvieran instalados:

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do
  sudo apt remove -y "$pkg"
done
```

Agregar el repositorio oficial:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo docker run --rm hello-world
docker compose version
```

Agregar el usuario administrativo al grupo Docker y volver a iniciar sesión:

```bash
sudo usermod -aG docker "$USER"
```

Pertenecer al grupo Docker otorga privilegios administrativos sobre el servidor; no se agrega a usuarios comunes.

## 6. Instalar Cockpit

```bash
sudo apt install -y cockpit
sudo systemctl enable --now cockpit.socket
systemctl is-active cockpit.socket
```

Cockpit queda disponible en `https://IP_SERVIDOR:9090` únicamente desde la red administrativa permitida en UFW.

## 7. Copiar el proyecto

Crear la ubicación de trabajo y copiar o clonar la versión de entrega:

```bash
sudo mkdir -p /srv/imsj
sudo chown "$USER":"$USER" /srv/imsj
cd /srv/imsj
git clone URL_DEL_REPOSITORIO Proyecto-IMSJ
cd Proyecto-IMSJ/backend
```

Si el proyecto se entrega mediante pendrive, copiar la carpeta completa a `/srv/imsj/Proyecto-IMSJ` conservando ambos frontends y el backend.

## 8. Configurar el entorno

```bash
cp .env.example .env
nano .env
```

Completar como mínimo:

```dotenv
APP_ENV=production
APP_BIND=0.0.0.0
APP_PORT=8000
APP_URL=http://IP_SERVIDOR:8000
FRONTEND_ORIGIN=http://IP_SERVIDOR:8000
DB_DATABASE=imsj
DB_USERNAME=imsj
DB_PASSWORD=CLAVE_SEGURA
DB_ROOT_PASSWORD=OTRA_CLAVE_SEGURA
```

Aplicar permisos:

```bash
chmod 600 .env
docker compose config --quiet
```

Las claves reales no se guardan en Git ni se muestran en capturas.

## 9. Iniciar el sistema

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail 100 app db
```

Comprobar desde el servidor:

```bash
curl -I http://127.0.0.1:8000/
curl http://127.0.0.1:8000/api/health
```

Desde otra computadora autorizada abrir:

```text
http://IP_SERVIDOR:8000/frontend-publico/
http://IP_SERVIDOR:8000/frontend-imsj/
```

## 10. Crear la primera cuenta

```bash
read -r -p "Cédula: " INITIAL_ADMIN_CEDULA
read -r -p "Nombre: " INITIAL_ADMIN_NOMBRE
read -r -s -p "Contraseña: " INITIAL_ADMIN_PASSWORD
echo
export INITIAL_ADMIN_CEDULA INITIAL_ADMIN_NOMBRE INITIAL_ADMIN_PASSWORD

docker compose exec \
  -e INITIAL_ADMIN_CEDULA \
  -e INITIAL_ADMIN_NOMBRE \
  -e INITIAL_ADMIN_PASSWORD \
  app php scripts/crear_admin.php

unset INITIAL_ADMIN_CEDULA INITIAL_ADMIN_NOMBRE INITIAL_ADMIN_PASSWORD
```

Las cuentas siguientes se crean desde el panel.

## 11. Configurar backups diarios

```bash
sudo mkdir -p /srv/backups/imsj
sudo chown "$USER":"$USER" /srv/backups/imsj
cd /srv/imsj/Proyecto-IMSJ/backend
chmod +x scripts/backup.sh scripts/restore.sh
./scripts/backup.sh /srv/backups/imsj
```

Verificar los hashes del backup generado:

```bash
cd /srv/backups/imsj/backup-FECHA
sha256sum -c SHA256SUMS
```

Programar una ejecución diaria a las 02:00:

```bash
crontab -e
```

```cron
0 2 * * * cd /srv/imsj/Proyecto-IMSJ/backend && BACKUP_RETENTION_DAYS=2 ./scripts/backup.sh /srv/backups/imsj >> /srv/backups/imsj/backup.log 2>&1
```

La retención de dos días corresponde a la VM base de 30 GB. Copiar cada backup válido a un medio externo protegido y conservar allí al menos siete copias diarias. Si se desea usar la retención local predeterminada de siete días del script, asignar 40–50 GB de disco. La copia externa no debe quedar montada permanentemente con permisos de escritura para todos los usuarios.

## 12. Probar la restauración

La prueba se realiza en otra carpeta y con otro nombre de proyecto Compose para evitar los volúmenes principales.

```bash
cp -a /srv/imsj/Proyecto-IMSJ /srv/imsj/Proyecto-IMSJ-restauracion
cd /srv/imsj/Proyecto-IMSJ-restauracion/backend
```

Editar `.env` y utilizar `APP_PORT=8001`, `APP_URL=http://IP_SERVIDOR:8001` y `FRONTEND_ORIGIN=http://IP_SERVIDOR:8001`. Permitir temporalmente el puerto 8001 solo desde la red administrativa.

```bash
export COMPOSE_PROJECT_NAME=imsj_restauracion
IMSJ_RESTORE_CONFIRM=YES ./scripts/restore.sh /srv/backups/imsj/backup-FECHA
docker compose ps
curl http://127.0.0.1:8001/api/health
```

Comprobar cuentas, contenidos, adjuntos, consultas y reservas. Registrar fecha, backup, hash, versión, resultado y responsable. Al terminar, detener el entorno de prueba sin tocar el principal.

## 13. Verificación después de reiniciar

```bash
sudo reboot
```

Después del reinicio:

```bash
systemctl is-active docker
docker compose -f /srv/imsj/Proyecto-IMSJ/backend/compose.yaml \
  --env-file /srv/imsj/Proyecto-IMSJ/backend/.env ps
curl http://127.0.0.1:8000/api/health
sudo ufw status verbose
```

Los contenedores deben iniciar automáticamente por su política `restart: unless-stopped`.

## 14. Evidencia de entrega

Guardar capturas o salidas de:

- `cat /etc/os-release` y `hostnamectl`;
- `ip -br address` e `ip route`;
- `sudo ufw status verbose`;
- `docker --version` y `docker compose version`;
- `docker compose ps`;
- portal y panel abiertos desde otro equipo;
- carpeta de backup, manifiesto y validación SHA-256;
- restauración aislada funcionando.

No declarar la instalación o la restauración como realizadas hasta obtener esta evidencia en Ubuntu Server 26.04 LTS.
