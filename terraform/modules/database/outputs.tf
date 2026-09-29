output "db_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.kanban.endpoint
}

output "db_address" {
  description = "RDS database address"
  value       = aws_db_instance.kanban.address
}

output "db_port" {
  description = "RDS database port"
  value       = aws_db_instance.kanban.port
}