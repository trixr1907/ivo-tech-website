# Cloudflare DNS Update Script
# Dieses Script aktualisiert automatisch deine DNS-Records wenn sich deine öffentliche IP ändert

param(
    [string]$ApiToken = $env:CLOUDFLARE_API_TOKEN,
    [string]$ZoneId = $env:CLOUDFLARE_ZONE_ID,
    [string]$RecordName = "ivo-tech.com",
    [switch]$Verbose = $false
)

# Logging-Funktion
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] [$Level] $Message"
    
    # Ausgabe auf Console
    switch ($Level) {
        "ERROR" { Write-Host $LogMessage -ForegroundColor Red }
        "WARN" { Write-Host $LogMessage -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $LogMessage -ForegroundColor Green }
        default { Write-Host $LogMessage -ForegroundColor White }
    }
    
    # Ausgabe in Log-Datei
    $LogFile = "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\logs\dns-update.log"
    $LogDir = Split-Path $LogFile -Parent
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    Add-Content -Path $LogFile -Value $LogMessage
}

# Prüfe API-Token und Zone-ID
if (-not $ApiToken -or -not $ZoneId) {
    Write-Log "Fehler: CLOUDFLARE_API_TOKEN und CLOUDFLARE_ZONE_ID Umgebungsvariablen müssen gesetzt sein" "ERROR"
    Write-Log "Setze diese mit: `$env:CLOUDFLARE_API_TOKEN = 'dein_token'" "ERROR"
    Write-Log "Setze diese mit: `$env:CLOUDFLARE_ZONE_ID = 'deine_zone_id'" "ERROR"
    exit 1
}

Write-Log "Starte DNS-Update für $RecordName"

try {
    # Aktuelle öffentliche IP ermitteln
    Write-Log "Ermittle aktuelle öffentliche IP-Adresse..."
    $CurrentIP = (Invoke-RestMethod -Uri "https://api.ipify.org" -TimeoutSec 10).Trim()
    Write-Log "Aktuelle öffentliche IP: $CurrentIP"
    
    # Cloudflare API Headers
    $Headers = @{
        "Authorization" = "Bearer $ApiToken"
        "Content-Type" = "application/json"
    }
    
    # DNS Record ID ermitteln
    Write-Log "Ermittle DNS-Record-Informationen..."
    $RecordResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?name=$RecordName&type=A" -Headers $Headers -TimeoutSec 10
    
    if (-not $RecordResponse.success -or $RecordResponse.result.Count -eq 0) {
        Write-Log "DNS-Record für $RecordName nicht gefunden" "ERROR"
        exit 1
    }
    
    $RecordId = $RecordResponse.result[0].id
    $CurrentDNSIP = $RecordResponse.result[0].content
    
    Write-Log "Aktuelle DNS-IP: $CurrentDNSIP"
    
    # Nur updaten wenn IP sich geändert hat
    if ($CurrentIP -ne $CurrentDNSIP) {
        Write-Log "IP-Adresse hat sich geändert ($CurrentDNSIP -> $CurrentIP)" "WARN"
        Write-Log "Aktualisiere DNS-Record..."
        
        $UpdateData = @{
            type = "A"
            name = $RecordName
            content = $CurrentIP
            ttl = 300
        } | ConvertTo-Json
        
        $UpdateResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$RecordId" -Method PUT -Headers $Headers -Body $UpdateData -TimeoutSec 10
        
        if ($UpdateResponse.success) {
            Write-Log "DNS erfolgreich aktualisiert auf $CurrentIP" "SUCCESS"
            
            # Warte kurz und prüfe das Update
            Start-Sleep -Seconds 2
            $VerifyResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$RecordId" -Headers $Headers -TimeoutSec 10
            if ($VerifyResponse.result.content -eq $CurrentIP) {
                Write-Log "DNS-Update erfolgreich verifiziert" "SUCCESS"
            } else {
                Write-Log "DNS-Update konnte nicht verifiziert werden" "WARN"
            }
        } else {
            Write-Log "Fehler beim DNS-Update: $($UpdateResponse.errors)" "ERROR"
            exit 1
        }
    } else {
        Write-Log "IP-Adresse unverändert - kein Update notwendig"
    }
    
    # Zusätzliche Subdomains aktualisieren
    $Config = Get-Content "C:\Users\admin\Desktop\ivo-tech.com\ivo-tech\config\config.json" | ConvertFrom-Json
    foreach ($Subdomain in $Config.cloudflare.subdomains) {
        $SubdomainName = "$Subdomain.ivo-tech.com"
        Write-Log "Prüfe Subdomain: $SubdomainName"
        
        # Prüfe ob Subdomain existiert
        $SubResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records?name=$SubdomainName&type=A" -Headers $Headers -TimeoutSec 10
        
        if ($SubResponse.success -and $SubResponse.result.Count -gt 0) {
            $SubRecordId = $SubResponse.result[0].id
            $SubCurrentIP = $SubResponse.result[0].content
            
            if ($SubCurrentIP -ne $CurrentIP) {
                Write-Log "Aktualisiere Subdomain $SubdomainName von $SubCurrentIP zu $CurrentIP"
                
                $SubUpdateData = @{
                    type = "A"
                    name = $SubdomainName
                    content = $CurrentIP
                    ttl = 300
                } | ConvertTo-Json
                
                $SubUpdateResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/dns_records/$SubRecordId" -Method PUT -Headers $Headers -Body $SubUpdateData -TimeoutSec 10
                
                if ($SubUpdateResponse.success) {
                    Write-Log "Subdomain $SubdomainName erfolgreich aktualisiert" "SUCCESS"
                } else {
                    Write-Log "Fehler beim Update von Subdomain $SubdomainName" "WARN"
                }
            }
        }
    }
    
} catch {
    Write-Log "Fehler beim DNS-Update: $($_.Exception.Message)" "ERROR"
    exit 1
}

Write-Log "DNS-Update abgeschlossen"
