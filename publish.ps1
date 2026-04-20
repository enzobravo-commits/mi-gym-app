$ErrorActionPreference = "Stop"

param(
    [string]$Message = "update app"
)

$git = "C:\Program Files\Git\cmd\git.exe"

if (-not (Test-Path $git)) {
    throw "No se encontro git en $git"
}

Write-Host "Agregando cambios..."
& $git add .

$status = & $git status --porcelain
if (-not $status) {
    Write-Host "No hay cambios para publicar."
    exit 0
}

Write-Host "Creando commit..."
& $git commit -m $Message

Write-Host "Subiendo a GitHub..."
& $git push

Write-Host "Listo. Vercel deberia redeployar automaticamente."
