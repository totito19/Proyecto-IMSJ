@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

title IMSJ - Iniciar sistema
echo.
echo ========================================
echo   Iniciando el sistema IMSJ
echo ========================================
echo.

where docker >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no esta instalado o no esta disponible en el PATH.
    goto :error
)

docker info >nul 2>&1
if errorlevel 1 (
    if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
        echo Docker Desktop no esta activo. Iniciandolo...
        start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
        call :esperar_docker
        if errorlevel 1 (
            echo ERROR: Docker Desktop no quedo listo a tiempo.
            goto :error
        )
    ) else (
        echo ERROR: Docker no esta iniciado. Abrilo y volve a ejecutar este archivo.
        goto :error
    )
)

if not exist ".env" (
    echo Creando la configuracion local desde .env.example...
    copy /Y ".env.example" ".env" >nul
    if errorlevel 1 (
        echo ERROR: No se pudo crear el archivo .env.
        goto :error
    )
)

echo Construyendo e iniciando los servicios...
docker compose up -d --build
if errorlevel 1 (
    echo ERROR: No se pudieron iniciar los servicios.
    goto :error
)

findstr /R /B /C:"APP_KEY=." ".env" >nul 2>&1
if errorlevel 1 (
    echo Generando la clave de la aplicacion...
    docker compose exec -T app php artisan key:generate --force
    if errorlevel 1 (
        echo ERROR: No se pudo generar la clave de la aplicacion.
        goto :error
    )
)

set "BASE_NUEVA="
docker compose exec -T app php artisan migrate:status --no-ansi >nul 2>&1
if errorlevel 1 set "BASE_NUEVA=1"

echo Actualizando la base de datos...
docker compose exec -T app php artisan migrate --force
if errorlevel 1 (
    echo ERROR: No se pudieron aplicar las migraciones.
    goto :error
)

if defined BASE_NUEVA (
    echo Cargando los datos iniciales...
    docker compose exec -T app php artisan db:seed --force
    if errorlevel 1 (
        echo ERROR: No se pudieron cargar los datos iniciales.
        goto :error
    )
)

set "APP_PORT=8000"
for /f "tokens=1,* delims==" %%A in ('findstr /B /C:"APP_PORT=" ".env" 2^>nul') do set "APP_PORT=%%B"
set "FRONTEND_PORT=8080"
for /f "tokens=1,* delims==" %%A in ('findstr /B /C:"FRONTEND_PORT=" ".env" 2^>nul') do set "FRONTEND_PORT=%%B"

echo.
echo ========================================
echo   Sistema iniciado correctamente
echo   Web: http://localhost:%FRONTEND_PORT%/frontend-publico/
echo   API: http://localhost:%APP_PORT%/api
echo ========================================
echo.
echo Abriendo el sitio en el navegador...
start "" "http://localhost:%FRONTEND_PORT%/frontend-publico/"
echo.
pause
endlocal
exit /b 0

:esperar_docker
echo Esperando a que Docker quede listo...
for /L %%I in (1,1,60) do (
    docker info >nul 2>&1
    if not errorlevel 1 exit /b 0
    timeout /t 2 /nobreak >nul
)
exit /b 1

:error
echo.
pause
endlocal
exit /b 1
