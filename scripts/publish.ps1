# Haupt-Script fuer ivo-tech.com
# Fuehrt den kompletten Build-und-Deploy-Workflow aus

param(
    [switch]$SkipBuild = $false,
    [switch]$SkipDeploy = $false,
    [switch]$DryRun = $false,
    [string]$Message = "Automatisches Update"
)

$ErrorActionPreference = "Stop"

Write-Host "=== IVO-Tech Complete Workflow ===" -ForegroundColor Green
Write-Host "Nachricht: $Message" -ForegroundColor Cyan

# Setze Working Directory
$ProjectRoot = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech"
Set-Location $ProjectRoot

# Pruefe ob Git-Repository clean ist
Write-Host "1. Pruefe Git-Status..." -ForegroundColor Yellow
$GitStatus = git status --porcelain
if ($GitStatus -and -not $DryRun) {
    Write-Host "Uncommitted changes gefunden:" -ForegroundColor Yellow
    git status --short
    
    $Response = Read-Host "Moechtest du die Aenderungen committen? (j/n)"
    if ($Response -eq "j" -or $Response -eq "y") {
        git add .
        git commit -m $Message
        Write-Host "Aenderungen committed" -ForegroundColor Green
    }
}

# Build-Prozess
if (-not $SkipBuild) {
    Write-Host "2. Starte Build-Prozess..." -ForegroundColor Yellow
    & "$ProjectRoot\scripts\build.ps1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build fehlgeschlagen!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "2. Build übersprungen (SkipBuild = true)" -ForegroundColor Yellow
}

# Deployment
if (-not $SkipDeploy) {
    Write-Host "3. Starte Deployment..." -ForegroundColor Yellow
    
    if ($DryRun) {
        & "$ProjectRoot\scripts\deploy.ps1" -DryRun
    } else {
        & "$ProjectRoot\scripts\deploy.ps1"
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Deployment fehlgeschlagen!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "3. Deployment übersprungen (SkipDeploy = true)" -ForegroundColor Yellow
}

# Git push (falls nicht DryRun)
if (-not $DryRun) {
    Write-Host "4. Pushe zu Git Repository..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git push erfolgreich" -ForegroundColor Green
    } else {
        Write-Host "Git push fehlgeschlagen (nicht kritisch)" -ForegroundColor Yellow
    }
}

# Zusammenfassung
Write-Host ""
Write-Host "=== Workflow abgeschlossen ===" -ForegroundColor Green
Write-Host "Website verfügbar unter: https://ivo-tech.com" -ForegroundColor Cyan
Write-Host "Deployment-Zeit: $(Get-Date -Format 'dd.MM.yyyy HH:mm:ss')" -ForegroundColor Cyan

# Zeige nützliche Befehle
Write-Host ""
Write-Host "Nützliche Befehle:" -ForegroundColor Yellow
Write-Host "  .\scripts\update-dns.ps1     - DNS manuell aktualisieren" -ForegroundColor Gray
Write-Host "  .\scripts\build.ps1          - Nur Build" -ForegroundColor Gray
Write-Host "  .\scripts\deploy.ps1 -DryRun - Test-Deployment" -ForegroundColor Gray
Write-Host "  .\scripts\publish.ps1 -DryRun - Kompletter Test-Workflow" -ForegroundColor Gray
