terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "ivo-tech-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "eu-central-1"
    
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = "eu-central-1"
  
  default_tags {
    tags = {
      Project     = "ivo-tech-website"
      Environment = terraform.workspace
      ManagedBy   = "terraform"
    }
  }
}

# VPC Konfiguration
module "vpc" {
  source = "./modules/vpc"
  
  environment = terraform.workspace
  cidr_block  = local.vpc_cidr[terraform.workspace]
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"
  
  environment     = terraform.workspace
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  container_name = local.container_name
  container_port = local.container_port
  
  desired_count  = local.ecs_desired_count[terraform.workspace]
  cpu           = local.ecs_cpu[terraform.workspace]
  memory        = local.ecs_memory[terraform.workspace]
}

# ECR Repository
module "ecr" {
  source = "./modules/ecr"
  
  repository_name = "ivo-tech-${terraform.workspace}"
}

# Monitoring & Logging
module "monitoring" {
  source = "./modules/monitoring"
  
  environment    = terraform.workspace
  cluster_name   = module.ecs.cluster_name
  service_name   = module.ecs.service_name
  alarm_actions  = [aws_sns_topic.alerts.arn]
}

# Datenbank
module "rds" {
  source = "./modules/rds"
  
  environment     = terraform.workspace
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  instance_class = local.rds_instance_class[terraform.workspace]
}

# Redis für Caching
module "redis" {
  source = "./modules/redis"
  
  environment     = terraform.workspace
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  instance_type  = local.redis_instance_type[terraform.workspace]
}

# Variablen für verschiedene Umgebungen
locals {
  container_name = "ivo-tech-web"
  container_port = 3000
  
  vpc_cidr = {
    staging = "10.0.0.0/16"
    prod    = "10.1.0.0/16"
  }
  
  ecs_desired_count = {
    staging = 1
    prod    = 2
  }
  
  ecs_cpu = {
    staging = 256
    prod    = 512
  }
  
  ecs_memory = {
    staging = 512
    prod    = 1024
  }
  
  rds_instance_class = {
    staging = "db.t3.micro"
    prod    = "db.t3.small"
  }
  
  redis_instance_type = {
    staging = "cache.t3.micro"
    prod    = "cache.t3.small"
  }
}
