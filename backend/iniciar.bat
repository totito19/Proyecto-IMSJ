@echo off
setlocal
cd /d "%~dp0"
rem No reemplazar configuraciones ni volver a cargar datos de demostracion.
if not exist .env (
  echo Cree .env a partir de .env.example y complete las claves antes de iniciar.
  exit /b 1
)
docker compose up -d --build
if errorlevel 1 exit /b 1
echo API: http://localhost:8000/api/health
echo Portal: http://localhost:8080/frontend-publico/
echo Panel: http://localhost:8080/frontend-imsj/
echo Si es una base nueva, cree la primera cuenta siguiendo README.md.
