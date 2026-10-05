@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "IMSJ_PAUSA=1"
if /I "%~1"=="--sin-pausa" set "IMSJ_PAUSA=0"
rem Detiene el mismo proyecto Compose; conserva los volumenes de datos y archivos.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\docker.ps1" -Accion detener
set "IMSJ_RESULTADO=%errorlevel%"
if "%IMSJ_PAUSA%"=="1" pause
exit /b %IMSJ_RESULTADO%
