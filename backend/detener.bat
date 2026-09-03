@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

title IMSJ - Detener sistema
echo.
echo ========================================
echo   Deteniendo el sistema IMSJ
echo ========================================
echo.

where docker >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no esta instalado o no esta disponible en el PATH.
    goto :error
)

docker info >nul 2>&1
if errorlevel 1 (
    echo Docker ya esta detenido. No hay nada que cerrar.
    goto :fin
)

docker compose down
if errorlevel 1 (
    echo ERROR: No se pudieron detener los servicios.
    goto :error
)

echo.
echo Sistema detenido correctamente.
echo La base de datos y los archivos cargados fueron conservados.

:fin
echo.
pause
endlocal
exit /b 0

:error
echo.
pause
endlocal
exit /b 1
