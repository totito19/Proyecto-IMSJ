@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "IMSJ_EXIT_CODE=1"
set "IMSJ_WORKDIR_READY="
pushd "%~dp0"
if errorlevel 1 goto :error_carpeta
set "IMSJ_WORKDIR_READY=1"

echo Deteniendo el sistema IMSJ...
echo.
rem La instalacion por usuario puede no estar incluida en el PATH.
set "IMSJ_DOCKER="
for /f "delims=" %%D in ('where.exe docker.exe 2^>nul') do if not defined IMSJ_DOCKER set "IMSJ_DOCKER=%%D"
if not defined IMSJ_DOCKER if exist "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" set "IMSJ_DOCKER=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe"
if not defined IMSJ_DOCKER if exist "%ProgramFiles%\Docker\Docker\resources\bin\docker.exe" set "IMSJ_DOCKER=%ProgramFiles%\Docker\Docker\resources\bin\docker.exe"
if not defined IMSJ_DOCKER goto :error_docker

"%IMSJ_DOCKER%" compose version >nul 2>&1
if errorlevel 1 goto :error_compose
if not exist ".env" goto :error_configuracion
rem Validar sin imprimir la configuracion expandida ni sus contrasenas.
"%IMSJ_DOCKER%" compose --env-file ".env" -f "compose.yaml" config --quiet
if errorlevel 1 goto :error_configuracion
"%IMSJ_DOCKER%" info >nul 2>&1
if errorlevel 1 goto :error_motor

rem Stop conserva contenedores y todos los volumenes de base, archivos y cache.
"%IMSJ_DOCKER%" compose --env-file ".env" -f "compose.yaml" stop
if errorlevel 1 goto :error_detener
echo Sistema detenido. La base de datos y los archivos fueron conservados.
set "IMSJ_EXIT_CODE=0"
goto :fin

:error_carpeta
echo ERROR: No se pudo acceder a la carpeta del backend.
goto :fin
:error_docker
echo ERROR: No se encontro docker.exe en el PATH ni en las carpetas de Docker Desktop.
echo Compruebe la instalacion de Docker Desktop para Windows.
goto :fin
:error_compose
echo ERROR: Docker Compose no esta disponible o no se pudo ejecutar Docker.
echo Abra Docker Desktop y compruebe su instalacion. Consulte README.md.
goto :fin
:error_configuracion
echo ERROR: Falta .env o la configuracion de Compose no es valida.
echo Restaure la configuracion usada al iniciar. No cambie las claves de una base existente.
goto :fin
:error_motor
echo ERROR: No se pudo conectar al motor de Docker para comprobar o detener los servicios.
echo Si Docker Desktop esta cerrado, sus contenedores no estan ejecutandose localmente.
echo Si esta abierto, revise el error siguiente y su estado en Docker Desktop.
"%IMSJ_DOCKER%" info
goto :fin
:error_detener
echo ERROR: No se pudieron detener los servicios. Revise el detalle anterior.

:fin
echo.
rem Dejar visible el resultado con doble clic; --sin-pausa sirve para la terminal.
if /I not "%~1"=="--sin-pausa" pause
if defined IMSJ_WORKDIR_READY popd
exit /b %IMSJ_EXIT_CODE%
