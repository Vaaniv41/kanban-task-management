variable "aws_region" {
  description = "AWS region for ECS resources"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "ID of the Kanban VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "ecs_task_execution_role_arn" {
  description = "IAM execution role ARN for ECS tasks"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "ALB target group ARN for frontend"
  type        = string
}

variable "backend_target_group_arn" {
  description = "ALB target group ARN for backend"
  type        = string
}

variable "frontend_image" {
  description = "ECR image URI for frontend"
  type        = string
}

variable "backend_image" {
  description = "ECR image URI for backend"
  type        = string
}

variable "frontend_port" {
  description = "Frontend container port"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "Backend container port"
  type        = number
  default     = 4000
}

variable "desired_count" {
  description = "Number of ECS tasks to run for each service"
  type        = number
  default     = 1
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "db_username" {
  description = "PostgreSQL username"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "db_endpoint" {
  description = "RDS database endpoint"
  type        = string
}

variable "db_address" {
  description = "RDS database hostname address"
  type        = string
}

variable "db_port" {
  description = "PostgreSQL database port"
  type        = number
  default     = 5432
}