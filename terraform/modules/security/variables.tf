variable "vpc_id" {
  description = "ID of the Kanban VPC"
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

variable "database_port" {
  description = "PostgreSQL port"
  type        = number
  default     = 5432
}