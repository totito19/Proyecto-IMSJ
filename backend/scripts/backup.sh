#!/usr/bin/env bash
set -Eeuo pipefail

# Backup completo para Ubuntu Server: código, base MySQL, adjuntos y configuración.
# Uso: ./scripts/backup.sh [/srv/backups/imsj]

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
PROJECT_DIR="$(cd -- "$BACKEND_DIR/.." && pwd)"
BACKUP_ROOT="${1:-/srv/backups/imsj}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
STAMP="$(date +'%Y-%m-%d_%H-%M-%S')"
APP_WAS_RUNNING=0

umask 077

for command_name in docker gzip tar sha256sum; do
  command -v "$command_name" >/dev/null 2>&1 || {
    echo "Falta el comando requerido: $command_name" >&2
    exit 1
  }
done

[[ -f "$BACKEND_DIR/.env" ]] || {
  echo "Falta backend/.env" >&2
  exit 1
}

mkdir -p "$BACKUP_ROOT"
BACKUP_ROOT="$(cd -- "$BACKUP_ROOT" && pwd)"
case "$BACKUP_ROOT/" in
  "$PROJECT_DIR"/*)
    echo "La carpeta de backup debe estar fuera del proyecto." >&2
    exit 1
    ;;
esac
TARGET="$BACKUP_ROOT/backup-$STAMP"
mkdir -p "$TARGET/config"

cd "$BACKEND_DIR"
docker compose config --quiet

docker compose ps --status running --services | grep -Fxq db || {
  echo "El servicio db debe estar iniciado." >&2
  exit 1
}

if docker compose ps --status running --services | grep -Fxq app; then
  APP_WAS_RUNNING=1
  docker compose stop app
fi

restore_app() {
  if [[ "$APP_WAS_RUNNING" -eq 1 ]]; then
    docker compose start app >/dev/null
  fi
}
trap restore_app EXIT

docker compose exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump -u "$MYSQL_USER" --single-transaction --routines --events --no-tablespaces --default-character-set=utf8mb4 "$MYSQL_DATABASE"' \
  | gzip -9 > "$TARGET/base.sql.gz"

docker compose run --rm --no-deps -T --entrypoint sh app \
  -c 'tar -czf - -C /var/www/html/storage/app/public .' \
  > "$TARGET/adjuntos.tar.gz"

tar \
  --exclude='.git' \
  --exclude='tmp' \
  --exclude='output' \
  --exclude='backend/.env' \
  -czf "$TARGET/proyecto.tar.gz" \
  -C "$PROJECT_DIR" .

cp "$BACKEND_DIR/.env" "$TARGET/config/.env"
cp "$BACKEND_DIR/compose.yaml" "$TARGET/config/compose.yaml"
cp "$BACKEND_DIR/Dockerfile" "$TARGET/config/Dockerfile"
cp "$BACKEND_DIR/apache.conf" "$TARGET/config/apache.conf"
chmod 600 "$TARGET/config/.env"

COMMIT="sin-registro"
WORKTREE="no-disponible"
if command -v git >/dev/null 2>&1 && git -C "$PROJECT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  COMMIT="$(git -C "$PROJECT_DIR" rev-parse HEAD)"
  if [[ -n "$(git -C "$PROJECT_DIR" status --porcelain)" ]]; then
    WORKTREE="con-cambios"
  else
    WORKTREE="limpio"
  fi
fi

{
  echo "Proyecto: Educación Vial IMSJ - Portal Vial"
  echo "Fecha: $(date --iso-8601=seconds)"
  echo "Host: $(hostname)"
  echo "Sistema: $(. /etc/os-release && echo "$PRETTY_NAME")"
  echo "Kernel: $(uname -r)"
  echo "Commit: $COMMIT"
  echo "Estado del repositorio: $WORKTREE"
  echo "Docker: $(docker --version)"
  echo "Compose: $(docker compose version)"
  echo "Retención local configurada: $RETENTION_DAYS días"
} > "$TARGET/MANIFIESTO.txt"

(
  cd "$TARGET"
  sha256sum base.sql.gz adjuntos.tar.gz proyecto.tar.gz config/.env config/compose.yaml > SHA256SUMS
)

# Elimina únicamente carpetas antiguas creadas por este script dentro de BACKUP_ROOT.
find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d \
  -name 'backup-????-??-??_??-??-??' -mtime "+$RETENTION_DAYS" -print0 \
  | while IFS= read -r -d '' old_backup; do
      rm -rf -- "$old_backup"
    done

echo "Backup creado: $TARGET"
echo "Copiar este directorio además a un medio externo protegido."
