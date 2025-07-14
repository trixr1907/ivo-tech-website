# Vollständiges Setup-Script für ivo-tech.com
# Richtet alles automatisch ein

Write-Host "=== IVO-Tech Setup ===" -ForegroundColor Green

# 1. Prüfe Voraussetzungen
Write-Host "1. Prüfe Voraussetzungen..." -ForegroundColor Yellow

# Prüfe ob pnpm installiert ist
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm nicht gefunden - installiere pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Prüfe ob turbo installiert ist
if (-not (Get-Command turbo -ErrorAction SilentlyContinue)) {
    Write-Host "turbo nicht gefunden - installiere turbo..." -ForegroundColor Yellow
    npm install -g turbo
}

# 2. Installiere Dependencies
Write-Host "2. Installiere Dependencies..." -ForegroundColor Yellow
pnpm install --dev

# 3. Erstelle Build
Write-Host "3. Erstelle Build..." -ForegroundColor Yellow
pnpm run build

# 4. Erstelle out-Verzeichnis
Write-Host "4. Erstelle out-Verzeichnis..." -ForegroundColor Yellow
& ".\scripts\create-out.ps1"

# 5. Prüfe Konfiguration
Write-Host "5. Prüfe Konfiguration..." -ForegroundColor Yellow
$Config = Get-Content ".\config\config.json" | ConvertFrom-Json
Write-Host "Container IP: $($Config.deployment.container_ip)" -ForegroundColor Cyan
Write-Host "Domain: $($Config.cloudflare.domain)" -ForegroundColor Cyan

# 6. Erstelle benötigte Verzeichnisse
Write-Host "6. Erstelle Verzeichnisse..." -ForegroundColor Yellow
@("logs", "backups") | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force
        Write-Host "Verzeichnis $_ erstellt" -ForegroundColor Green
    }
}

# 7. Teste DNS-Update (ohne API-Token)
Write-Host "7. Teste DNS-Update..." -ForegroundColor Yellow
if ($env:CLOUDFLARE_API_TOKEN -and $env:CLOUDFLARE_ZONE_ID) {
    Write-Host "Cloudflare-Credentials gefunden - teste DNS-Update..." -ForegroundColor Green
    & ".\scripts\update-dns.ps1"
} else {
    Write-Host "Cloudflare-Credentials nicht gesetzt - überspringe DNS-Test" -ForegroundColor Yellow
    Write-Host "Setze diese später mit:" -ForegroundColor Yellow
    Write-Host "  `$env:CLOUDFLARE_API_TOKEN = 'dein_token'" -ForegroundColor Gray
    Write-Host "  `$env:CLOUDFLARE_ZONE_ID = 'deine_zone_id'" -ForegroundColor Gray
}

# 8. Teste Deployment (Dry Run)
Write-Host "8. Teste Deployment..." -ForegroundColor Yellow
& ".\scripts\deploy.ps1" -DryRun

Write-Host ""
Write-Host "=== Setup abgeschlossen ===" -ForegroundColor Green
Write-Host ""
Write-Host "Verfügbare Befehle:" -ForegroundColor Yellow
Write-Host "  .\setup.ps1                    - Dieses Setup" -ForegroundColor Gray
Write-Host "  .\scripts\build.ps1            - Nur Build" -ForegroundColor Gray
Write-Host "  .\scripts\create-out.ps1       - Erstelle out-Verzeichnis" -ForegroundColor Gray
Write-Host "  .\scripts\deploy.ps1           - Deployment" -ForegroundColor Gray
Write-Host "  .\scripts\deploy.ps1 -DryRun   - Test-Deployment" -ForegroundColor Gray
Write-Host "  .\scripts\update-dns.ps1       - DNS-Update" -ForegroundColor Gray
Write-Host "  .\scripts\publish.ps1          - Kompletter Workflow" -ForegroundColor Gray
Write-Host ""
Write-Host "Nächste Schritte:" -ForegroundColor Yellow
Write-Host "1. Setze Cloudflare API-Credentials (falls noch nicht geschehen)" -ForegroundColor Gray
Write-Host "2. Passe Container-IP in config\config.json an" -ForegroundColor Gray
Write-Host "3. Richte SSH-Keys für Container ein" -ForegroundColor Gray
Write-Host "4. Führe .\scripts\publish.ps1 aus" -ForegroundColor Gray
