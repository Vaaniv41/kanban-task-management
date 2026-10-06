# ============================================================
# AWS CONFIGURATION
# ============================================================

variable "aws_region" {
  description = "AWS region where resources will be deployed"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name used for tagging and resource naming"
  type        = string
  default     = "dev"
}

# ============================================================
# VPC CONFIGURATION
# ============================================================

variable "vpc_cidr" {
  description = "Primary IPv4 CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# ============================================================
# AVAILABILITY ZONES
# ============================================================

variable "availability_zones" {
  description = "List of Availability Zones to distribute subnets across"
  type        = list(string)

  default = [
    "ap-south-1a",
    "ap-south-1b"
  ]

  validation {
    condition     = length(var.availability_zones) == 2
    error_message = "Exactly two Availability Zones must be provided."
  }
}

# ============================================================
# PUBLIC SUBNETS
# ============================================================

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets"
  type        = list(string)

  default = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  validation {
    condition     = length(var.public_subnet_cidrs) == 2
    error_message = "Exactly two public subnet CIDRs must be provided."
  }
}

# ============================================================
# PRIVATE SUBNETS
# ============================================================

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets"
  type        = list(string)

  default = [
    "10.0.10.0/24",
    "10.0.11.0/24"
  ]

  validation {
    condition     = length(var.private_subnet_cidrs) == 2
    error_message = "Exactly two private subnet CIDRs must be provided."
  }
}

# ============================================================
# DATABASE CONFIGURATION
# ============================================================

variable "db_name" {
  description = "Kanban PostgreSQL database name"
  type        = string
}

variable "db_username" {
  description = "Kanban PostgreSQL username"
  type        = string
}

variable "db_password" {
  description = "Kanban PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "snapshot_identifier" {
  description = "Optional RDS snapshot identifier to restore from"
  type        = string
  default     = null
}
