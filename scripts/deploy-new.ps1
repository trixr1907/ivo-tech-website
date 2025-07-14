# Deployment Script fuer ivo-tech.com
# Synchronisiert lokale Aenderungen mit dem Proxmox LXC Container

param(
    [string]$ContainerIP,
    [string]$ContainerUser = "root",
    [string]$SourcePath = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\apps\web\out",
    [string]$TargetPath = "/var/www/html",
    [switch]$DryRun = $false,
    [switch]$BuildFirst = $false
)

# Lade Konfiguration
$ConfigPath = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\config\config.json"
$Config = Get-Content $ConfigPath | ConvertFrom-Json

# Setze Standard-Werte aus Konfiguration
if (-not $ContainerIP) {
    $ContainerIP = $Config.deployment.container_ip
}
$ContainerUser = $Config.deployment.container_user
$TargetPath = $Config.deployment.web_root

Write-Host "=== ivo-tech.com Deployment ===" -ForegroundColor Green

# Pruefe ob Source-Verzeichnis existiert
if (-not (Test-Path $SourcePath)) {
    Write-Host "Fehler: Source-Verzeichnis nicht gefunden: $SourcePath" -ForegroundColor Red
    Write-Host "Tipp: Fuehre zuerst einen Build aus" -ForegroundColor Yellow
    exit 1
}

# DNS Update ausfuehren (falls IP sich geaendert hat)
Write-Host "1. Pruefe DNS-Status..." -ForegroundColor Yellow
try {
    & "$PSScriptRoot\update-dns.ps1"
} catch {
    Write-Host "DNS-Update fehlgeschlagen (nicht kritisch): $_" -ForegroundColor Yellow
}

if ($DryRun) {
    Write-Host "DRY RUN - Keine Aenderungen werden durchgefuehrt" -ForegroundColor Cyan
    Write-Host "Wuerde synchronisieren: $SourcePath -> $ContainerUser@$ContainerIP`:$TargetPath" -ForegroundColor Cyan
} else {
    Write-Host "2. Synchronisiere Dateien..." -ForegroundColor Yellow
    
    # Pruefe SSH-Verbindung
    Write-Host "Pruefe SSH-Verbindung zu $ContainerUser@$ContainerIP..." -ForegroundColor Yellow
    $SshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes "$ContainerUser@$ContainerIP" "echo 'SSH OK'"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "SSH-Verbindung fehlgeschlagen!" -ForegroundColor Red
        Write-Host "Pruefe:" -ForegroundColor Yellow
        Write-Host "  1. Container-IP: $ContainerIP" -ForegroundColor Yellow
        Write-Host "  2. SSH-Keys eingerichtet" -ForegroundColor Yellow
        Write-Host "  3. Container laeuft" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "SSH-Verbindung erfolgreich" -ForegroundColor Green
    
    # Erstelle Ziel-Verzeichnis falls nicht vorhanden
    ssh "$ContainerUser@$ContainerIP" "mkdir -p $TargetPath"
    
    # Verwende SCP fuer Datei-Transfer (falls rsync nicht verfuegbar)
    Write-Host "Kopiere Dateien mit SCP..." -ForegroundColor Yellow
    scp -r "$SourcePath/*" "$ContainerUser@$ContainerIP`:$TargetPath/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dateien erfolgreich kopiert" -ForegroundColor Green
        
        # Setze Berechtigungen
        ssh "$ContainerUser@$ContainerIP" "chown -R www-data:www-data $TargetPath"
        ssh "$ContainerUser@$ContainerIP" "chmod -R 755 $TargetPath"
        
        # Webserver neu starten
        Write-Host "3. Starte Webserver neu..." -ForegroundColor Yellow
        ssh "$ContainerUser@$ContainerIP" "systemctl restart nginx"
        
        Write-Host "=== Deployment abgeschlossen ===" -ForegroundColor Green
        Write-Host "Webseite erreichbar unter: https://ivo-tech.com" -ForegroundColor Cyan
    } else {
        Write-Host "Fehler beim Kopieren der Dateien!" -ForegroundColor Red
        exit 1
    }
}

# Backup erstellen
Write-Host "4. Erstelle Backup..." -ForegroundColor Yellow
$BackupName = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$BackupPath = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\backups\$BackupName"

if (-not (Test-Path "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\backups")) {
    New-Item -ItemType Directory -Path "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\backups" -Force
}

Copy-Item -Path $SourcePath -Destination $BackupPath -Recurse -Force
Write-Host "Backup erstellt: $BackupPath" -ForegroundColor Green
