# Build Script für ivo-tech.com
# Erstellt eine optimierte Version der Website

param(
    [switch]$Development = $false,
    [switch]$Production = $true,
    [switch]$Clean = $true
)

Write-Host "=== IVO-Tech Build Process ===" -ForegroundColor Green

# Setze Working Directory
$ProjectRoot = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech"
Set-Location $ProjectRoot

# Lade Konfiguration
$Config = Get-Content "$ProjectRoot\config\config.json" | ConvertFrom-Json

if ($Clean) {
    Write-Host "1. Bereinige vorherige Builds..." -ForegroundColor Yellow
    
    # Lösche out-Verzeichnis
    if (Test-Path "$ProjectRoot\apps\web\out") {
        Remove-Item -Recurse -Force "$ProjectRoot\apps\web\out"
    }
    
    # Lösche .next-Verzeichnis
    if (Test-Path "$ProjectRoot\apps\web\.next") {
        Remove-Item -Recurse -Force "$ProjectRoot\apps\web\.next"
    }
    
    Write-Host "Bereinigung abgeschlossen" -ForegroundColor Green
}

# Installiere Dependencies
Write-Host "2. Installiere Dependencies..." -ForegroundColor Yellow
pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Fehler bei der Installation der Dependencies!" -ForegroundColor Red
    exit 1
}

# Setze Umgebungsvariablen
if ($Production) {
    $env:NODE_ENV = "production"
    $env:NEXT_BASE_PATH = ""
} else {
    $env:NODE_ENV = "development"
}

Write-Host "3. Baue Website..." -ForegroundColor Yellow

# Führe Build mit pnpm aus
pnpm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "Build erfolgreich abgeschlossen!" -ForegroundColor Green

# Zurück zum Projekt-Root
Set-Location $ProjectRoot

# Zeige Build-Informationen
$BuildPath = "$ProjectRoot\apps\web\out"
if (Test-Path $BuildPath) {
    $BuildSize = (Get-ChildItem $BuildPath -Recurse | Measure-Object -Property Length -Sum).Sum
    $BuildSizeMB = [math]::Round($BuildSize / 1MB, 2)
    
    Write-Host "Build-Verzeichnis: $BuildPath" -ForegroundColor Cyan
    Write-Host "Build-Größe: $BuildSizeMB MB" -ForegroundColor Cyan
    
    # Zeige Dateien im Build-Verzeichnis
    Write-Host "Build-Inhalt:" -ForegroundColor Cyan
    Get-ChildItem $BuildPath -Name | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
}

Write-Host "=== Build abgeschlossen ===" -ForegroundColor Green
Write-Host "Nächster Schritt: Führe .\scripts\deploy.ps1 aus, um die Website zu deployen" -ForegroundColor Yellow
