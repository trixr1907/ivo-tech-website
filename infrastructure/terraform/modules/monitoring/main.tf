variable "environment" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "service_name" {
  type = string
}

variable "alarm_actions" {
  type = list(string)
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/ivo-tech-${var.environment}"
  retention_in_days = 30
}

# CPU Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "cpu_utilization_high" {
  alarm_name          = "ivo-tech-${var.environment}-cpu-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "CPUUtilization"
  namespace          = "AWS/ECS"
  period             = "300"
  statistic          = "Average"
  threshold          = "85"
  alarm_description  = "Dieser Alarm wird ausgelöst, wenn die CPU-Auslastung über 85% liegt"
  alarm_actions      = var.alarm_actions

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_name
  }
}

# Memory Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "memory_utilization_high" {
  alarm_name          = "ivo-tech-${var.environment}-memory-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "MemoryUtilization"
  namespace          = "AWS/ECS"
  period             = "300"
  statistic          = "Average"
  threshold          = "85"
  alarm_description  = "Dieser Alarm wird ausgelöst, wenn die Speicherauslastung über 85% liegt"
  alarm_actions      = var.alarm_actions

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_name
  }
}

# Service Health Alarm
resource "aws_cloudwatch_metric_alarm" "service_health" {
  alarm_name          = "ivo-tech-${var.environment}-service-health"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "HealthyHostCount"
  namespace          = "AWS/ApplicationELB"
  period             = "300"
  statistic          = "Minimum"
  threshold          = "1"
  alarm_description  = "Dieser Alarm wird ausgelöst, wenn keine gesunden Tasks mehr verfügbar sind"
  alarm_actions      = var.alarm_actions

  dimensions = {
    TargetGroup = aws_lb_target_group.app.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# 5XX Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "http_5xx_errors" {
  alarm_name          = "ivo-tech-${var.environment}-5xx-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "HTTPCode_Target_5XX_Count"
  namespace          = "AWS/ApplicationELB"
  period             = "300"
  statistic          = "Sum"
  threshold          = "10"
  alarm_description  = "Dieser Alarm wird ausgelöst, wenn zu viele 5XX Fehler auftreten"
  alarm_actions      = var.alarm_actions

  dimensions = {
    TargetGroup = aws_lb_target_group.app.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# Response Time Alarm
resource "aws_cloudwatch_metric_alarm" "response_time" {
  alarm_name          = "ivo-tech-${var.environment}-response-time"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "TargetResponseTime"
  namespace          = "AWS/ApplicationELB"
  period             = "300"
  statistic          = "Average"
  threshold          = "5"
  alarm_description  = "Dieser Alarm wird ausgelöst, wenn die durchschnittliche Antwortzeit über 5 Sekunden liegt"
  alarm_actions      = var.alarm_actions

  dimensions = {
    TargetGroup = aws_lb_target_group.app.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "ivo-tech-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", var.cluster_name, "ServiceName", var.service_name],
            [".", "MemoryUtilization", ".", ".", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "eu-central-1"
          title   = "ECS Metriken"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix],
            [".", "HTTPCode_Target_4XX_Count", ".", "."],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "eu-central-1"
          title   = "ALB Metriken"
        }
      }
    ]
  })
}

# SNS Topic für Alarme
resource "aws_sns_topic" "alarms" {
  name = "ivo-tech-${var.environment}-alarms"
}

# Outputs
output "log_group_name" {
  value = aws_cloudwatch_log_group.ecs.name
}

output "dashboard_name" {
  value = aws_cloudwatch_dashboard.main.dashboard_name
}

output "sns_topic_arn" {
  value = aws_sns_topic.alarms.arn
}
