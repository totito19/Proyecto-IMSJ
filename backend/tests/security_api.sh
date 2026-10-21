#!/usr/bin/env bash
# Auditoría reproducible de seguridad para una instancia local y autorizada de la API IMSJ.
# No usar contra producción ni contra datos reales.

set -uo pipefail

BASE_URL="${IMSJ_SECURITY_URL:-http://127.0.0.1:8000}"
BASE_URL="${BASE_URL%/}"
if [[ -n "${IMSJ_SECURITY_ALLOWED_ORIGIN:-}" ]]; then
    ALLOWED_ORIGIN="$IMSJ_SECURITY_ALLOWED_ORIGIN"
elif [[ "$BASE_URL" =~ ^(https?://)127\.0\.0\.1(:[0-9]+)?$ ]]; then
    # Compose publica en loopback, pero el frontend local usa localhost como Origin.
    ALLOWED_ORIGIN="${BASH_REMATCH[1]}localhost${BASH_REMATCH[2]:-}"
else
    ALLOWED_ORIGIN="$BASE_URL"
fi
STAFF_CEDULA="${IMSJ_SECURITY_STAFF_CEDULA:-}"
STAFF_PASSWORD="${IMSJ_SECURITY_STAFF_PASSWORD:-}"
EXPIRED_TOKEN="${IMSJ_SECURITY_EXPIRED_TOKEN:-}"
OTHER_TOKEN="${IMSJ_SECURITY_OTHER_TOKEN:-}"
FOREIGN_RESERVATION_ID="${IMSJ_SECURITY_FOREIGN_RESERVATION_ID:-}"
ALLOW_WRITES="${IMSJ_SECURITY_ALLOW_WRITES:-0}"
RUN_RATE_LIMIT="${IMSJ_SECURITY_RATE_LIMIT:-0}"
REQUIRE_FULL="${IMSJ_SECURITY_REQUIRE_FULL:-0}"
REPORT_PATH="${IMSJ_SECURITY_REPORT:-}"

passed=0
failed=0
skipped=0
LAST_STATUS=""
LAST_BODY=""
LAST_HEADERS=""
STAFF_TOKEN=""
ACCOUNT_ROLE=""
CREATED_FAQ_ID=""

if ! command -v curl >/dev/null 2>&1; then
    echo "ERROR: se requiere curl." >&2
    exit 1
fi

if [[ -n "$REPORT_PATH" ]]; then
    mkdir -p "$(dirname "$REPORT_PATH")"
    exec > >(tee "$REPORT_PATH") 2>&1
fi

TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/imsj-security.XXXXXX")"
cleanup() {
    rm -rf -- "$TEMP_DIR"
}
trap cleanup EXIT

pass() {
    passed=$((passed + 1))
    printf '[OK]   %s\n' "$1"
}

fail() {
    failed=$((failed + 1))
    printf '[FALLA] %s\n' "$1" >&2
}

skip() {
    skipped=$((skipped + 1))
    printf '[OMITE] %s\n' "$1"
}

json_escape() {
    local value="$1"
    local output=""
    local character=""
    local code=0
    local escaped=""
    local index=0
    LC_ALL=C
    for ((index = 0; index < ${#value}; index++)); do
        character="${value:index:1}"
        case "$character" in
            '"') output+='\"' ;;
            '\\') output+='\\\\' ;;
            $'\b') output+='\b' ;;
            $'\f') output+='\f' ;;
            $'\n') output+='\n' ;;
            $'\r') output+='\r' ;;
            $'\t') output+='\t' ;;
            *)
                printf -v code '%d' "'$character"
                if ((code < 32)); then
                    printf -v escaped '\\u%04x' "$code"
                    output+="$escaped"
                else
                    output+="$character"
                fi
                ;;
        esac
    done
    printf '%s' "$output"
}

strip_bracketed_paste_markers() {
    local value="$1"
    value="${value//$'\033[200~'/}"
    value="${value//$'\033[201~'/}"
    printf '%s' "$value"
}

status_expected() {
    local actual="$1"
    local expected_csv="$2"
    [[ ",$expected_csv," == *",$actual,"* ]]
}

body_has_internal_details() {
    grep -Eqi 'SQLSTATE|PDOException|Stack trace|Fatal error|/var/www/|DB_PASSWORD|DB_USERNAME|token_hash' "$LAST_BODY"
}

request() {
    local label="$1"
    local method="$2"
    local path="$3"
    local expected="$4"
    shift 4

    LAST_HEADERS="$TEMP_DIR/headers.txt"
    LAST_BODY="$TEMP_DIR/body.txt"
    : > "$LAST_HEADERS"
    : > "$LAST_BODY"

    LAST_STATUS="$(curl --silent --show-error --path-as-is --max-time 20 \
        --request "$method" \
        --dump-header "$LAST_HEADERS" \
        --output "$LAST_BODY" \
        --write-out '%{http_code}' \
        "$@" \
        "$BASE_URL$path")"
    local curl_status=$?

    if [[ $curl_status -ne 0 ]]; then
        fail "$label: curl terminó con código $curl_status"
        return 1
    fi
    if ! status_expected "$LAST_STATUS" "$expected"; then
        fail "$label: HTTP $LAST_STATUS; se esperaba $expected"
        sed -n '1,6p' "$LAST_BODY" >&2
        return 1
    fi
    if [[ "$LAST_STATUS" -ge 400 ]] && body_has_internal_details; then
        fail "$label: la respuesta expone detalles internos"
        return 1
    fi
    pass "$label → HTTP $LAST_STATUS"
    return 0
}

header_equals() {
    local label="$1"
    local name="$2"
    local value="$3"
    if grep -Eqi "^${name}:[[:space:]]*${value}[[:space:]]*\r?$" "$LAST_HEADERS"; then
        pass "$label"
    else
        fail "$label"
    fi
}

header_contains() {
    local label="$1"
    local name="$2"
    local value="$3"
    if grep -Eqi "^${name}:.*${value}" "$LAST_HEADERS"; then
        pass "$label"
    else
        fail "$label"
    fi
}

echo "Auditoría de seguridad API IMSJ"
echo "Objetivo autorizado: $BASE_URL"
echo "Fecha UTC: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo

if ! request "API disponible" GET "/api/health" "200"; then
    echo
    echo "No se puede continuar porque la API no responde."
    exit 1
fi
if grep -Eq '"status"[[:space:]]*:[[:space:]]*"ok"' "$LAST_BODY"; then
    pass "Healthcheck devuelve estado ok"
else
    fail "Healthcheck no devuelve estado ok"
fi
header_equals "API aplica nosniff" "X-Content-Type-Options" "nosniff"
header_equals "API evita caché de respuestas" "Cache-Control" "no-store"
header_equals "Protección anti-clickjacking activa" "X-Frame-Options" "DENY"
header_contains "Content-Security-Policy activa" "Content-Security-Policy" "default-src"
if grep -Eqi '^Server:.*[/ ][0-9]+\.' "$LAST_HEADERS"; then
    fail "El encabezado Server revela una versión"
else
    pass "El encabezado Server no revela una versión exacta"
fi

request "Ruta protegida sin token" GET "/api/me" "401"
request "Token Bearer inválido" GET "/api/me" "401" \
    --header "Authorization: Bearer 999999999|$(printf '0%.0s' {1..64})"
request "JSON mal formado" POST "/api/portal/prueba/corregir" "400" \
    --header "Content-Type: application/json" \
    --data-binary '{mal'
request "Ruta inexistente" GET "/api/ruta-que-no-existe" "404"
request "Método no admitido" TRACE "/api/health" "404,405"

request "Preflight desde origen permitido" OPTIONS "/api/noticias" "204" \
    --header "Origin: $ALLOWED_ORIGIN" \
    --header "Access-Control-Request-Method: GET"
header_equals "CORS devuelve únicamente el origen permitido" "Access-Control-Allow-Origin" "$ALLOWED_ORIGIN"
request "Preflight desde origen ajeno" OPTIONS "/api/noticias" "403" \
    --header "Origin: https://no-autorizado.example" \
    --header "Access-Control-Request-Method: GET"
if grep -Eqi '^Access-Control-Allow-Origin:' "$LAST_HEADERS"; then
    fail "CORS no debe autorizar el origen ajeno"
else
    pass "CORS no autoriza el origen ajeno"
fi

for private_path in "/.env" "/config.php" "/backend/database.sql" "/storage/../config.php"; do
    request "Recurso privado bloqueado: $private_path" GET "$private_path" "403,404"
done

if [[ -n "$STAFF_CEDULA" && -n "$STAFF_PASSWORD" ]]; then
    clean_cedula="$(strip_bracketed_paste_markers "$STAFF_CEDULA")"
    clean_password="$(strip_bracketed_paste_markers "$STAFF_PASSWORD")"
    if [[ "$clean_cedula" != "$STAFF_CEDULA" || "$clean_password" != "$STAFF_PASSWORD" ]]; then
        echo "[INFO] Se retiraron marcadores invisibles agregados por el pegado de Git Bash."
    fi
    STAFF_CEDULA="$clean_cedula"
    STAFF_PASSWORD="$clean_password"
    login_payload="{\"cedula\":\"$(json_escape "$STAFF_CEDULA")\",\"password\":\"$(json_escape "$STAFF_PASSWORD")\"}"
    if request "Login con cuenta de prueba" POST "/api/login" "200" \
        --header "Content-Type: application/json" \
        --data-binary "$login_payload"; then
        STAFF_TOKEN="$(sed -nE 's/.*"token"[[:space:]]*:[[:space:]]*"([0-9]+\|[a-fA-F0-9]{64})".*/\1/p' "$LAST_BODY" | head -n 1)"
        ACCOUNT_ROLE="$(sed -nE 's/.*"rol"[[:space:]]*:[[:space:]]*"([A-Z_]+)".*/\1/p' "$LAST_BODY" | head -n 1)"
        if [[ "$STAFF_TOKEN" =~ ^[0-9]+\|[a-fA-F0-9]{64}$ ]]; then
            pass "El token tiene formato opaco id|secreto"
        else
            fail "No se pudo extraer un token válido del login"
        fi
        case "$ACCOUNT_ROLE" in
            PUBLICO_GENERAL|PERSONAL_IMSJ|DIRECTORA)
                pass "La API informa el rol autenticado: $ACCOUNT_ROLE"
                ;;
            *)
                fail "No se pudo identificar el rol de la cuenta de prueba"
                ;;
        esac
        if grep -Fq "$STAFF_PASSWORD" "$LAST_BODY" || grep -Eqi 'password_hash|token_hash' "$LAST_BODY"; then
            fail "El login expone contraseña o hashes"
        else
            pass "El login no expone contraseña ni hashes"
        fi
    fi

    if [[ -n "$STAFF_TOKEN" ]]; then
        auth_header=(--header "Authorization: Bearer $STAFF_TOKEN")
        request "Token válido accede al perfil" GET "/api/me" "200" "${auth_header[@]}"

        if [[ "$ACCOUNT_ROLE" == "PUBLICO_GENERAL" ]]; then
            request "Rol PUBLICO_GENERAL no accede al panel" GET "/api/preguntas" "403" \
                "${auth_header[@]}"
            skip "Carga maliciosa: requiere una cuenta PERSONAL_IMSJ o DIRECTORA"
        else
            malicious_file="$TEMP_DIR/ataque.php"
            printf '%s\n' '<?php echo "no ejecutar";' > "$malicious_file"
            upload_file="$malicious_file"
            if command -v cygpath >/dev/null 2>&1; then
                upload_file="$(cygpath -w "$malicious_file")"
            fi
            request "Archivo PHP disfrazado de PDF" POST "/api/materiales" "422" \
                "${auth_header[@]}" \
                --form "nombre=Archivo rechazado" \
                --form "tipo=PDF" \
                --form "archivo=@$upload_file;type=application/pdf"
        fi

        if [[ "$ALLOW_WRITES" == "1" && "$ACCOUNT_ROLE" == "PERSONAL_IMSJ" ]]; then
            stamp="$(date -u '+%Y%m%d%H%M%S')"
            faq_payload="{\"pregunta\":\"Auditoria $stamp\",\"respuesta\":\"Registro descartable de seguridad\"}"
            if request "Crear FAQ descartable para probar permisos" POST "/api/preguntas" "201" \
                "${auth_header[@]}" \
                --header "Content-Type: application/json" \
                --data-binary "$faq_payload"; then
                CREATED_FAQ_ID="$(sed -nE 's/.*"id"[[:space:]]*:[[:space:]]*([0-9]+).*/\1/p' "$LAST_BODY" | head -n 1)"
            fi
            if [[ "$CREATED_FAQ_ID" =~ ^[0-9]+$ ]]; then
                request "Enviar FAQ descartable a revisión" PATCH "/api/preguntas/$CREATED_FAQ_ID/estado" "200" \
                    "${auth_header[@]}" \
                    --header "Content-Type: application/json" \
                    --data-binary '{"estado":"PENDIENTE"}'
                request "Rol PERSONAL_IMSJ no puede aprobar" PATCH "/api/preguntas/$CREATED_FAQ_ID/estado" "403" \
                    "${auth_header[@]}" \
                    --header "Content-Type: application/json" \
                    --data-binary '{"estado":"APROBADO"}'
                request "Eliminar FAQ descartable" DELETE "/api/preguntas/$CREATED_FAQ_ID" "204" \
                    "${auth_header[@]}"
            else
                fail "No se obtuvo el ID de la FAQ descartable"
            fi
        elif [[ "$ACCOUNT_ROLE" == "DIRECTORA" ]]; then
            skip "Prueba de rol insuficiente para aprobar: la cuenta indicada es DIRECTORA"
        elif [[ "$ACCOUNT_ROLE" == "PUBLICO_GENERAL" ]]; then
            pass "El rechazo 403 del panel acredita rol insuficiente"
        else
            skip "Prueba de rol insuficiente: definir IMSJ_SECURITY_ALLOW_WRITES=1 en una base descartable"
        fi

        if [[ -n "$OTHER_TOKEN" && "$FOREIGN_RESERVATION_ID" =~ ^[0-9]+$ ]]; then
            request "Un usuario no cancela una reserva ajena" DELETE "/api/reservas/$FOREIGN_RESERVATION_ID" "404" \
                --header "Authorization: Bearer $OTHER_TOKEN"
        else
            skip "Prueba de ID ajeno: proporcionar OTHER_TOKEN y FOREIGN_RESERVATION_ID descartables"
        fi

        request "Logout revoca el token actual" POST "/api/logout" "204" "${auth_header[@]}"
        request "Token revocado es rechazado" GET "/api/me" "401" "${auth_header[@]}"
    fi
else
    skip "Pruebas autenticadas: definir IMSJ_SECURITY_STAFF_CEDULA y IMSJ_SECURITY_STAFF_PASSWORD"
fi

if [[ -n "$EXPIRED_TOKEN" ]]; then
    request "Token expirado es rechazado" GET "/api/me" "401" \
        --header "Authorization: Bearer $EXPIRED_TOKEN"
else
    skip "Token expirado: proporcionar IMSJ_SECURITY_EXPIRED_TOKEN creado en la base descartable"
fi

sql_payload='{"respuestas":[{"pregunta_id":"1 OR 1=1","opcion":"A"}]}'
request "Entrada SQLi controlada no causa error interno" POST "/api/portal/prueba/corregir" "422" \
    --header "Content-Type: application/json" \
    --data-binary "$sql_payload"
xss_payload='{"respuestas":"<script>alert(1)</script>"}'
request "Entrada XSS controlada no se refleja ni causa error interno" POST "/api/portal/prueba/corregir" "422" \
    --header "Content-Type: application/json" \
    --data-binary "$xss_payload"
if grep -Fqi '<script>' "$LAST_BODY"; then
    fail "La respuesta refleja el payload XSS"
else
    pass "La respuesta no refleja el payload XSS"
fi

if [[ "$RUN_RATE_LIMIT" == "1" ]]; then
    rate_limited=0
    for attempt in 1 2 3 4 5 6; do
        request "Intento de login controlado $attempt" POST "/api/login" "422,429" \
            --header "Content-Type: application/json" \
            --data-binary '{"cedula":"99999999","password":"incorrecta"}'
        if [[ "$LAST_STATUS" == "429" ]]; then
            rate_limited=1
            break
        fi
    done
    if [[ $rate_limited -eq 1 ]]; then
        pass "El límite de intentos devuelve 429"
    else
        fail "No se observó 429 después de seis intentos"
    fi
else
    skip "Límite 429: definir IMSJ_SECURITY_RATE_LIMIT=1; bloquea el login de esta IP durante un minuto"
fi

echo
echo "Resumen: $passed aprobadas, $failed fallidas, $skipped omitidas."
if [[ $failed -gt 0 ]]; then
    exit 1
fi
if [[ "$REQUIRE_FULL" == "1" && $skipped -gt 0 ]]; then
    echo "La ejecución completa exige resolver todas las pruebas omitidas." >&2
    exit 2
fi
exit 0
