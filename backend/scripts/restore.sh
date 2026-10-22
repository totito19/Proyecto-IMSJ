#!/usr/bin/env bash
set -Eeuo pipefail

# Restauración completa sobre una instalación aislada de Ubuntu Server.
# Uso: IMSJ_RESTORE_CONFIRM=YES ./scripts/restore.sh /ruta/al/backup

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${1:-}"

[[ "${IMSJ_RESTORE_CONFIRM:-}" == "YES" ]] || {
  echo "Definir IMSJ_RESTORE_CONFIRM=YES para confirmar la restauración." >&2
  exit 1
}

[[ -n "$BACKUP_DIR" && -d "$BACKUP_DIR" ]] || {
  echo "Indicar una carpeta de backup válida." >&2
  exit 1
}

BACKUP_DIR="$(cd -- "$BACKUP_DIR" && pwd)"

for required_file in base.sql.gz adjuntos.tar.gz SHA256SUMS; do
  [[ -f "$BACKUP_DIR/$required_file" ]] || {
    echo "Falta $required_file en el backup." >&2
    exit 1
  }
done

[[ -f "$BACKEND_DIR/.env" ]] || {
  echo "Falta backend/.env para la instalación de destino." >&2
  exit 1
}

cd "$BACKUP_DIR"
sha256sum -c SHA256SUMS

cd "$BACKEND_DIR"
docker compose config --quiet
docker compose up -d db

for _ in $(seq 1 60); do
  if docker compose exec -T db sh -c \
    'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqladmin ping -h localhost -u root --silent' >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqladmin ping -h localhost -u root --silent' >/dev/null

docker compose stop app >/dev/null 2>&1 || true

gzip -dc "$BACKUP_DIR/base.sql.gz" \
  | docker compose exec -T db sh -c \
      'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u "$MYSQL_USER" --default-character-set=utf8mb4 "$MYSQL_DATABASE"'

docker compose run --rm --no-deps -T --user root --entrypoint sh app -c \
  'find /var/www/html/storage/app/public -mindepth 1 -maxdepth 1 ! -name .gitkeep -exec rm -rf -- {} +; tar -xzf - -C /var/www/html/storage/app/public; chown -R www-data:www-data /var/www/html/storage/app/public' \
  < "$BACKUP_DIR/adjuntos.tar.gz"

docker compose up -d app
docker compose ps

echo "Restauración terminada. Verificar ingreso, contenidos, adjuntos, reservas y consultas."
