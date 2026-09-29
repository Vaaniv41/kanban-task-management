output "ecs_cluster_id" {
  description = "ECS cluster ID"
  value       = aws_ecs_cluster.kanban.id
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.kanban.name
}

output "frontend_service_name" {
  description = "Frontend ECS service name"
  value       = aws_ecs_service.frontend.name
}

output "backend_service_name" {
  description = "Backend ECS service name"
  value       = aws_ecs_service.backend.name
}

output "frontend_task_definition_arn" {
  description = "Frontend ECS task definition ARN"
  value       = aws_ecs_task_definition.frontend.arn
}

output "backend_task_definition_arn" {
  description = "Backend ECS task definition ARN"
  value       = aws_ecs_task_definition.backend.arn
}