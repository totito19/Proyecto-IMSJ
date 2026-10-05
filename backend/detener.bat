@echo off
setlocal
cd /d "%~dp0"
rem Detener sin borrar los volumenes de base, archivos o cache.
docker compose stop
