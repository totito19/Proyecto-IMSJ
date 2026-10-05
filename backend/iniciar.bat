@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "IMSJ_EXIT_CODE=1"
set "IMSJ_WORKDIR_READY="
pushd "%~dp0"
if errorlevel 1 goto :error_carpeta
set "IMSJ_WORKDIR_READY=1"

echo Iniciando el sistema IMSJ...
echo.

rem Docker Desktop puede estar instalado por usuario sin figurar en el PATH.
set "IMSJ_DOCKER="
for /f "delims=" %%D in ('where.exe docker.exe 2^>nul') do if not defined IMSJ_DOCKER set "IMSJ_DOCKER=%%D"
if not defined IMSJ_DOCKER if exist "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" set "IMSJ_DOCKER=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe"
if not defined IMSJ_DOCKER if exist "%ProgramFiles%\Docker\Docker\resources\bin\docker.exe" set "IMSJ_DOCKER=%ProgramFiles%\Docker\Docker\resources\bin\docker.exe"
if not defined IMSJ_DOCKER goto :error_docker

"%IMSJ_DOCKER%" compose version >nul 2>&1
if errorlevel 1 goto :error_compose

rem Crear solo la plantilla que falta; nunca reemplazar claves o datos existentes.
if exist ".env" goto :validar_configuracion
if not exist ".env.example" goto :error_plantilla
copy /-Y ".env.example" ".env" >nul
if errorlevel 1 goto :error_copia
echo Se creo backend\.env a partir de .env.example.
echo Complete DB_PASSWORD y DB_ROOT_PASSWORD con claves propias.
echo Guarde el archivo y vuelva a ejecutar iniciar.bat.
goto :fin

:validar_configuracion
rem La plantilla contiene marcadores, no claves para iniciar una base nueva.
findstr /X /C:"DB_PASSWORD=CAMBIAR_CLAVE_LOCAL" /C:"DB_ROOT_PASSWORD=CAMBIAR_CLAVE_ROOT_LOCAL" ".env" >nul 2>&1
if not errorlevel 1 goto :error_claves
call :compose config --quiet
if errorlevel 1 goto :error_configuracion

"%IMSJ_DOCKER%" info >nul 2>&1
if not errorlevel 1 goto :iniciar_servicios

rem Recuperar el arranque de Docker Desktop sin depender del PATH global.
set "IMSJ_DOCKER_DESKTOP="
if exist "%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe" set "IMSJ_DOCKER_DESKTOP=%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe"
if not defined IMSJ_DOCKER_DESKTOP if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" set "IMSJ_DOCKER_DESKTOP=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
if not defined IMSJ_DOCKER_DESKTOP goto :error_motor
echo Abriendo Docker Desktop y esperando que su motor este listo...
powershell.exe -NoProfile -Command "Start-Process -FilePath $env:IMSJ_DOCKER_DESKTOP -WindowStyle Hidden"
if errorlevel 1 goto :error_motor
call :esperar_docker
if errorlevel 1 goto :error_motor

:iniciar_servicios
echo Construyendo e iniciando los contenedores...
call :compose up -d --build
if errorlevel 1 goto :error_inicio
echo.
echo Contenedores iniciados. Direcciones con los puertos por defecto:
echo API: http://localhost:8000/api/health
echo Portal: http://localhost:8080/frontend-publico/
echo Panel: http://localhost:8080/frontend-imsj/
echo Si es una base nueva, cree la primera cuenta siguiendo README.md.
set "IMSJ_EXIT_CODE=0"
goto :fin

:compose
rem Fijar archivos evita ejecutar otro proyecto por el directorio de la terminal.
"%IMSJ_DOCKER%" compose --env-file ".env" -f "compose.yaml" %*
exit /b %errorlevel%

:esperar_docker
rem Limitar la espera; si falla, conservar el diagnostico visible.
for /L %%I in (1,1,60) do (
  "%IMSJ_DOCKER%" info >nul 2>&1
  if not errorlevel 1 exit /b 0
  powershell.exe -NoProfile -Command "Start-Sleep -Seconds 2"
)
exit /b 1

:error_carpeta
echo ERROR: No se pudo acceder a la carpeta del backend.
goto :fin
:error_docker
echo ERROR: No se encontro docker.exe en el PATH ni en las carpetas de Docker Desktop.
echo Instale Docker Desktop para Windows y vuelva a ejecutar este archivo.
goto :fin
:error_compose
echo ERROR: Docker Compose no esta disponible o no se pudo ejecutar Docker.
echo Abra Docker Desktop y compruebe su instalacion. Consulte README.md.
goto :fin
:error_plantilla
echo ERROR: Falta .env.example. Restaure la plantilla del proyecto.
goto :fin
:error_copia
echo ERROR: No se pudo crear .env. Compruebe los permisos de esta carpeta.
goto :fin
:error_claves
echo ERROR: .env conserva las claves de ejemplo.
echo Complete DB_PASSWORD y DB_ROOT_PASSWORD con claves propias y vuelva a iniciar.
goto :fin
:error_configuracion
echo ERROR: La configuracion de Compose no es valida. Revise el detalle anterior.
echo Complete las variables requeridas en .env. Consulte README.md.
goto :fin
:error_motor
echo ERROR: No se pudo conectar al motor de Docker.
echo Abra Docker Desktop, espere que termine de iniciar y vuelva a intentarlo.
echo Si Docker muestra un error de WSL o virtualizacion, resuelvalo en Docker Desktop.
"%IMSJ_DOCKER%" info
goto :fin
:error_inicio
echo ERROR: No se pudieron iniciar los servicios. Revise el detalle anterior.
echo Los datos existentes no se borraron. Consulte README.md para diagnosticar.

:fin
echo.
rem Mantener visible el resultado al abrir con doble clic. La terminal puede omitir la pausa.
if /I not "%~1"=="--sin-pausa" pause
if defined IMSJ_WORKDIR_READY popd
exit /b %IMSJ_EXIT_CODE%
