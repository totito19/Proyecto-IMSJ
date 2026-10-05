param(
    [ValidateSet('iniciar', 'detener')][string]$Accion = 'iniciar',
    [switch]$SinNavegador
)
# Operacion local de Windows: solo requiere Docker/Compose y PowerShell del sistema.
$ErrorActionPreference = 'Stop'
$BackendRoot = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $BackendRoot 'compose.yaml'
$EnvFile = Join-Path $BackendRoot '.env'
$TemporaryEnv = $null
$Utf8 = [System.Text.UTF8Encoding]::new($false)

function Invoke-Docker {
    param([string[]]$Arguments, [switch]$Stream)
    # Capturar errores nativos permite consultar un motor apagado sin abortar la espera.
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        if ($Stream) {
            & $script:Docker @Arguments 2>&1 | ForEach-Object { Write-Host $_ }
            return @{ Code = $LASTEXITCODE; Text = '' }
        }
        $lines = @(& $script:Docker @Arguments 2>&1)
        return @{ Code = $LASTEXITCODE; Text = ($lines | ForEach-Object { $_.ToString() }) -join "`n" }
    } finally { $ErrorActionPreference = $previousPreference }
}

function Invoke-Compose {
    param([string[]]$Arguments, [string]$Configuration = $script:EnvFile, [switch]$Stream)
    Invoke-Docker -Arguments (@('compose', '--project-directory', $script:BackendRoot, '--env-file', $Configuration, '-f', $script:ComposeFile) + $Arguments) -Stream:$Stream
}

function Get-Configuration {
    param([string]$Configuration)
    $result = Invoke-Compose -Configuration $Configuration -Arguments @('config', '--format', 'json')
    if ($result.Code -ne 0) { Write-Host $result.Text; throw 'La configuracion de Compose no es valida.' }
    # La configuracion expandida contiene claves: se lee, nunca se imprime.
    $result.Text | ConvertFrom-Json
}

function Get-EnvValue {
    param([string[]]$Lines, [string]$Name)
    $value = ''
    foreach ($line in $Lines) {
        if ($line -match ('^\s*' + [regex]::Escape($Name) + '\s*=(.*)$')) {
            $value = $Matches[1].Trim().Trim('"').Trim("'")
        }
    }
    return $value
}

function Set-EnvValue {
    param([string[]]$Lines, [string]$Name, [string]$Value)
    $found = $false
    foreach ($line in $Lines) {
        if ($line -match ('^\s*' + [regex]::Escape($Name) + '\s*=')) {
            "$Name=$Value"
            $found = $true
        } else { $line }
    }
    if (-not $found) { "$Name=$Value" }
}

function New-LocalPassword {
    $bytes = New-Object byte[] 24
    $random = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $random.GetBytes($bytes); return ([BitConverter]::ToString($bytes)).Replace('-', '').ToLowerInvariant() }
    finally { $random.Dispose() }
}

function Test-FreePort {
    param([int]$Port)
    $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $Port)
    try { $listener.Start(); return $true }
    catch { return $false }
    finally { $listener.Stop() }
}

function Test-OwnPort {
    param([int]$Port, [string]$Configuration)
    $containers = Invoke-Compose -Configuration $Configuration -Arguments @('ps', '-aq', 'app')
    if ($containers.Code -ne 0 -or -not $containers.Text.Trim()) { return $false }
    foreach ($id in ($containers.Text.Trim() -split '\s+')) {
        $result = Invoke-Docker -Arguments @('inspect', '--format', '{{json .NetworkSettings.Ports}}', $id)
        if ($result.Code -eq 0 -and $result.Text.Trim()) {
            $ports = $result.Text | ConvertFrom-Json
            foreach ($binding in $ports.'80/tcp') {
                if ([int]$binding.HostPort -eq $Port) { return $true }
            }
        }
    }
    return $false
}

try {
    # PATH primero; alternativas relativas a la instalacion, sin nombres de usuario fijos.
    $command = Get-Command docker.exe -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    $candidates = @()
    if ($command) { $candidates += $command.Source }
    if ($env:LOCALAPPDATA) { $candidates += Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\resources\bin\docker.exe' }
    if ($env:ProgramFiles) { $candidates += Join-Path $env:ProgramFiles 'Docker\Docker\resources\bin\docker.exe' }
    $Docker = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
    if (-not $Docker) { throw 'No se encontro Docker. Instale Docker Desktop o agregue docker.exe al PATH.' }
    $version = Invoke-Docker -Arguments @('compose', 'version')
    if ($version.Code -ne 0) { Write-Host $version.Text; throw 'Se necesita Docker Compose (docker compose).' }

    $engine = Invoke-Docker -Arguments @('info', '--format', '{{.OSType}}')
    if ($engine.Code -ne 0 -and $Accion -eq 'iniciar') {
        $desktopCandidates = @((Join-Path (Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $Docker))) 'Docker Desktop.exe'))
        if ($env:LOCALAPPDATA) { $desktopCandidates += Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\Docker Desktop.exe' }
        if ($env:ProgramFiles) { $desktopCandidates += Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe' }
        $desktop = $desktopCandidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
        if (-not $desktop) { Write-Host $engine.Text; throw 'El motor de Docker no responde. Inicielo y vuelva a ejecutar el BAT.' }
        Write-Host 'Abriendo Docker Desktop y esperando su motor...'
        Start-Process -FilePath $desktop -WindowStyle Hidden
        $clock = [Diagnostics.Stopwatch]::StartNew()
        do {
            Start-Sleep -Seconds 2
            $engine = Invoke-Docker -Arguments @('info', '--format', '{{.OSType}}')
        } while ($engine.Code -ne 0 -and $clock.Elapsed.TotalSeconds -lt 180)
    }
    if ($engine.Code -ne 0) { Write-Host $engine.Text; throw 'Docker no responde. Revise su estado, WSL y virtualizacion en Docker Desktop.' }
    if ($engine.Text.Trim() -ne 'linux') { throw 'Este proyecto requiere el motor de contenedores Linux de Docker.' }

    if ($Accion -eq 'detener') {
        if (-not (Test-Path -LiteralPath $EnvFile)) { throw 'Falta .env. Recupere la configuracion usada al iniciar.' }
        $null = Get-Configuration -Configuration $EnvFile
        $stop = Invoke-Compose -Arguments @('stop') -Stream
        if ($stop.Code -ne 0) { throw 'No se pudieron detener los servicios.' }
        Write-Host 'Sistema detenido. Base, archivos y cache conservados.'
        exit 0
    }

    $source = $EnvFile
    if (-not (Test-Path -LiteralPath $source)) { $source = Join-Path $BackendRoot '.env.example' }
    if (-not (Test-Path -LiteralPath $source)) { throw 'Falta .env.example. Restaure la plantilla del proyecto.' }
    $lines = [IO.File]::ReadAllLines($source)
    $generate = $false
    foreach ($name in @('DB_PASSWORD', 'DB_ROOT_PASSWORD')) {
        $value = Get-EnvValue -Lines $lines -Name $name
        if (-not $value -or $value -like 'CAMBIAR_CLAVE_*') {
            $lines = @(Set-EnvValue -Lines $lines -Name $name -Value (New-LocalPassword))
            $generate = $true
        }
    }
    # Preparar fuera del archivo definitivo hasta comprobar que no hay una base previa.
    $TemporaryEnv = [IO.Path]::GetTempFileName()
    [IO.File]::WriteAllLines($TemporaryEnv, $lines, $Utf8)
    $model = Get-Configuration -Configuration $TemporaryEnv
    if ($generate) {
        $volume = Invoke-Docker -Arguments @('volume', 'inspect', $model.volumes.db_data.name)
        if ($volume.Code -eq 0) { throw 'Existe un volumen de base previo. Recupere sus claves originales en .env; no se cambiaran automaticamente.' }
        Write-Host 'Claves locales generadas para una base nueva; se guardan en .env sin mostrarlas.'
    }

    $port = [int]$model.services.app.ports[0].published
    if ($port -lt 1 -or $port -gt 65535) { throw 'APP_PORT debe ser un puerto entre 1 y 65535.' }
    if (-not (Test-FreePort -Port $port) -and -not (Test-OwnPort -Port $port -Configuration $TemporaryEnv)) {
        if ($env:APP_PORT) { throw 'El APP_PORT definido en la terminal esta ocupado. Elija otro puerto.' }
        $free = $false
        for ($candidate = $port + 1; $candidate -le [Math]::Min($port + 100, 65535); $candidate++) {
            if (Test-FreePort -Port $candidate) { $port = $candidate; $free = $true; break }
        }
        if (-not $free) { throw 'No se encontro un puerto libre. Configure APP_PORT en .env.' }
        $lines = @(Set-EnvValue -Lines $lines -Name 'APP_PORT' -Value $port)
        Write-Host "Puerto inicial ocupado; se utilizara $port."
    }
    $baseUrl = "http://localhost:$port"
    $configuredUrl = Get-EnvValue -Lines $lines -Name 'APP_URL'
    if (-not $env:APP_URL -and (-not $configuredUrl -or $configuredUrl -match '^http://(localhost|127\.0\.0\.1):\d+/?$')) {
        $lines = @(Set-EnvValue -Lines $lines -Name 'APP_URL' -Value $baseUrl)
    }
    [IO.File]::WriteAllLines($TemporaryEnv, $lines, $Utf8)
    $null = Get-Configuration -Configuration $TemporaryEnv
    # Escribir solo cuando cambia la configuracion; preservar claves reales existentes.
    $content = [IO.File]::ReadAllText($TemporaryEnv)
    if (-not (Test-Path -LiteralPath $EnvFile) -or [IO.File]::ReadAllText($EnvFile) -ne $content) {
        [IO.File]::WriteAllText($EnvFile, $content, $Utf8)
    }

    Write-Host 'Construyendo e iniciando Apache/PHP y MySQL. La primera descarga puede demorar...'
    # Retirar el frontend Nginx anterior del mismo proyecto, conservando los volumenes.
    $up = Invoke-Compose -Arguments @('up', '-d', '--build', '--remove-orphans', '--wait', '--wait-timeout', '180') -Stream
    if ($up.Code -ne 0) { throw 'No se pudo iniciar un sistema saludable. Consulte el error anterior y docker compose logs.' }
    # Verificar el puerto publicado antes de abrir la pagina, no solo el contenedor.
    foreach ($path in @('/api/health', '/api/portal/noticias', '/frontend-publico/', '/frontend-publico/login.html')) {
        $response = Invoke-WebRequest -UseBasicParsing -Uri ($baseUrl + $path) -TimeoutSec 10
        if ($response.StatusCode -ne 200) { throw 'El sistema no responde correctamente desde el equipo.' }
    }
    $portal = "$baseUrl/frontend-publico/"
    Write-Host "Sistema listo: $portal"
    Write-Host "Panel: $baseUrl/frontend-imsj/"
    Write-Host 'La primera cuenta de personal se crea segun README.md; no se crean usuarios de demostracion.'
    if (-not $SinNavegador) { Start-Process -FilePath $portal }
    exit 0
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    if ($TemporaryEnv -and (Test-Path -LiteralPath $TemporaryEnv)) { Remove-Item -LiteralPath $TemporaryEnv -Force }
}
