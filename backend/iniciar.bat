@echo off
setlocal EnableExtensions DisableDelayedExpansion
set "IMSJ_PAUSA=1"
set "IMSJ_NAVEGADOR="
:argumentos
if /I "%~1"=="--sin-pausa" set "IMSJ_PAUSA=0"
if /I "%~1"=="--sin-navegador" set "IMSJ_NAVEGADOR=-SinNavegador"
if not "%~1"=="" (shift /1 & goto :argumentos)
rem Rutas relativas al BAT: funciona desde cualquier carpeta de Windows.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\docker.ps1" -Accion iniciar %IMSJ_NAVEGADOR%
set "IMSJ_RESULTADO=%errorlevel%"
if "%IMSJ_PAUSA%"=="1" pause
exit /b %IMSJ_RESULTADO%
