# Ivo-Tech Website Infrastruktur

Diese Repository enthält die Infrastruktur-als-Code (IaC) für die Ivo-Tech Website, implementiert mit Terraform.

## Voraussetzungen

- AWS CLI konfiguriert mit entsprechenden Berechtigungen
- Terraform >= 1.0.0
- Docker für lokale Entwicklung
- Eine Domain, die in AWS Route53 verwaltet wird

## Erste Schritte

1. **AWS Credentials einrichten**

```bash
aws configure
```

2. **Terraform State Bucket erstellen**

```bash
aws s3 mb s3://ivo-tech-terraform-state --region eu-central-1
aws dynamodb create-table \
    --table-name terraform-state-lock \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region eu-central-1
```

3. **Terraform initialisieren**

```bash
cd infrastructure/terraform
terraform init
```

4. **Staging-Umgebung erstellen**

```bash
terraform workspace new staging
terraform plan
terraform apply
```

5. **Produktionsumgebung erstellen**

```bash
terraform workspace new prod
terraform plan
terraform apply
```

## GitHub Actions Secrets

Folgende Secrets müssen in GitHub eingerichtet werden:

- `AWS_ACCESS_KEY_ID`: AWS Access Key für GitHub Actions
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Key für GitHub Actions
- `ECR_REGISTRY`: AWS ECR Registry URL

## Umgebungsvariablen

Für jede Umgebung (staging/prod) müssen folgende Umgebungsvariablen in AWS Systems Manager Parameter Store gesetzt werden:

```bash
# Staging
aws ssm put-parameter --name "/ivo-tech/staging/DATABASE_URL" --value "..." --type "SecureString"
aws ssm put-parameter --name "/ivo-tech/staging/JWT_SECRET" --value "..." --type "SecureString"
# usw.

# Production
aws ssm put-parameter --name "/ivo-tech/prod/DATABASE_URL" --value "..." --type "SecureString"
aws ssm put-parameter --name "/ivo-tech/prod/JWT_SECRET" --value "..." --type "SecureString"
# usw.
```

## Monitoring & Alarme

Die Infrastruktur enthält:

- CloudWatch Dashboards für ECS und ALB Metriken
- Alarme für:
  - CPU Auslastung
  - Memory Auslastung
  - Service Gesundheit
  - 5XX Fehler
  - Antwortzeiten

Alarme werden an das konfigurierte SNS Topic gesendet.

## SSL/TLS

Die Infrastruktur verwendet AWS Certificate Manager für SSL/TLS Zertifikate. Stellen Sie sicher, dass Ihre Domain validiert ist:

```bash
aws acm request-certificate \
    --domain-name ivo-tech.com \
    --validation-method DNS \
    --subject-alternative-names "*.ivo-tech.com"
```

## Backup & Disaster Recovery

- RDS hat automatische Backups aktiviert (7 Tage Retention)
- ECS Tasks werden über mehrere Availability Zones verteilt
- Alle Daten werden verschlüsselt gespeichert

## Sicherheit

- Alle Dienste laufen in privaten Subnets
- Nur der ALB ist öffentlich zugänglich
- Security Groups sind nach dem Least-Privilege-Prinzip konfiguriert
- Alle Secrets werden in AWS Secrets Manager verwaltet

## Kosten-Optimierung

- Auto-Scaling basierend auf CPU/Memory
- Spot Instances für nicht-kritische Workloads
- RDS und ElastiCache Instanzgrößen sind umgebungsspezifisch

## Nützliche Befehle

```bash
# Infrastruktur Status prüfen
terraform show

# Ressourcen zerstören (nur für Staging!)
terraform destroy

# Plan anzeigen
terraform plan -out=tfplan

# Spezifisches Modul aktualisieren
terraform apply -target=module.ecs
```
