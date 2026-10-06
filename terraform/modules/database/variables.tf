variable "database_subnet_ids" {
  description = "Private subnet IDs for the RDS database"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group ID for the RDS database"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "PostgreSQL port"
  type        = number
  default     = 5432
}

variable "snapshot_identifier" {
  description = "RDS snapshot to restore from"
  type        = string
  default     = null
}