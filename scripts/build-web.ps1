# Vereinfachtes Build Script nur fuer die Web-App

Write-Host "=== IVO-Tech Web Build ===" -ForegroundColor Green

$WebPath = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\apps\web"
$OutPath = "$WebPath\out"

# Wechsle ins Web-Verzeichnis
Set-Location $WebPath

# Loesche alte Builds
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}

Write-Host "Installiere Web-Dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Starte Build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build erfolgreich!" -ForegroundColor Green
    
    if (Test-Path "out") {
        Write-Host "Out-Verzeichnis erstellt: $OutPath" -ForegroundColor Green
        Get-ChildItem "out" | Select-Object Name, Length
    } else {
        Write-Host "Out-Verzeichnis nicht gefunden - verwende .next/static" -ForegroundColor Yellow
        
        # Erstelle out-Verzeichnis manuell
        New-Item -ItemType Directory -Path "out" -Force
        
        # Kopiere statische Dateien
        if (Test-Path ".next\static") {
            Copy-Item -Path ".next\static" -Destination "out\_next\static" -Recurse -Force
        }
        
        # Kopiere HTML-Dateien
        if (Test-Path ".next\server\app") {
            Copy-Item -Path ".next\server\app\*.html" -Destination "out\" -Force
        }
    }
} else {
    Write-Host "Build fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

# Zurueck zum Hauptverzeichnis
Set-Location "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech"
