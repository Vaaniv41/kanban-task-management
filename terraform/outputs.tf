# ============================================================
# VPC OUTPUTS
# ============================================================

output "vpc_id" {
  description = "The ID of the Kanban VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the Kanban VPC"
  value       = aws_vpc.main.cidr_block
}

# ============================================================
# SUBNET OUTPUTS
# ============================================================

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value = [
    aws_subnet.public_1.id,
    aws_subnet.public_2.id
  ]
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value = [
    aws_subnet.private_1.id,
    aws_subnet.private_2.id
  ]
}

# ============================================================
# NAT GATEWAY OUTPUT
# ============================================================

output "nat_gateway_public_ip" {
  description = "Public IP address associated with the NAT Gateway"
  value       = aws_eip.nat.public_ip
}

# ============================================================
# APPLICATION LOAD BALANCER OUTPUT
# ============================================================

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

# ============================================================
# DATABASE OUTPUT
# ============================================================

output "db_endpoint" {
  description = "Endpoint of the RDS PostgreSQL database"
  value       = module.database.db_endpoint
}
