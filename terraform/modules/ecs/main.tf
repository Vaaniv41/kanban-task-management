resource "aws_ecs_cluster" "kanban" {
  name = "kanban-ecs-cluster"

  tags = {
    Name        = "kanban-ecs-cluster"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/kanban-frontend"
  retention_in_days = 7

  tags = {
    Name        = "kanban-frontend-logs"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/kanban-backend"
  retention_in_days = 7

  tags = {
    Name        = "kanban-backend-logs"
    Environment = var.environment
  }
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "kanban-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = "256"
  memory = "512"

  execution_role_arn = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "kanban-frontend"
      image     = var.frontend_image
      essential = true

      portMappings = [
        {
          containerPort = var.frontend_port
          hostPort      = var.frontend_port
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "frontend"
        }
      }
    }
  ])

  tags = {
    Name        = "kanban-frontend-task"
    Environment = var.environment
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "kanban-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = "256"
  memory = "512"

  execution_role_arn = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "kanban-backend"
      image     = var.backend_image
      essential = true

      portMappings = [
        {
          containerPort = var.backend_port
          hostPort      = var.backend_port
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "backend"
        }
      }

      environment = [
        {
          name  = "DB_HOST"
          value = var.db_address
        },
        {
          name  = "DB_PORT"
          value = tostring(var.db_port)
        },
        {
          name  = "DB_NAME"
          value = var.db_name
        },
        {
          name  = "DB_USER"
          value = var.db_username
        },
        {
          name  = "DB_PASSWORD"
          value = var.db_password
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.db_username}:${var.db_password}@${var.db_endpoint}/${var.db_name}?schema=public"
        }
      ]
    }
  ])

  tags = {
    Name        = "kanban-backend-task"
    Environment = var.environment
  }
}

resource "aws_ecs_service" "frontend" {
  name            = "kanban-frontend-service"
  cluster         = aws_ecs_cluster.kanban.id
  task_definition = aws_ecs_task_definition.frontend.arn

  desired_count = var.desired_count

  launch_type = "FARGATE"

  network_configuration {
    subnets = var.private_subnet_ids

    security_groups = [
      var.ecs_security_group_id
    ]

    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.frontend_target_group_arn
    container_name   = "kanban-frontend"
    container_port   = var.frontend_port
  }

  depends_on = [
    aws_ecs_task_definition.frontend
  ]

  tags = {
    Name        = "kanban-frontend-service"
    Environment = var.environment
  }
}

resource "aws_ecs_service" "backend" {
  name            = "kanban-backend-service"
  cluster         = aws_ecs_cluster.kanban.id
  task_definition = aws_ecs_task_definition.backend.arn

  desired_count = var.desired_count

  launch_type = "FARGATE"

  network_configuration {
    subnets = var.private_subnet_ids

    security_groups = [
      var.ecs_security_group_id
    ]

    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.backend_target_group_arn
    container_name   = "kanban-backend"
    container_port   = var.backend_port
  }

  depends_on = [
    aws_ecs_task_definition.backend
  ]

  tags = {
    Name        = "kanban-backend-service"
    Environment = var.environment
  }
}