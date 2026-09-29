resource "aws_security_group" "alb" {
  name        = "kanban-alb-sg"
  description = "Security group for Kanban Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kanban-alb-sg"
  }
}

resource "aws_security_group" "ecs" {
  name        = "kanban-ecs-sg"
  description = "Security group for Kanban ECS tasks"
  vpc_id      = var.vpc_id

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kanban-ecs-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ecs_frontend" {
  security_group_id            = aws_security_group.ecs.id
  referenced_security_group_id = aws_security_group.alb.id

  from_port   = var.frontend_port
  to_port     = var.frontend_port
  ip_protocol = "tcp"

  description = "Allow ALB to access frontend"
}

resource "aws_vpc_security_group_ingress_rule" "ecs_backend" {
  security_group_id            = aws_security_group.ecs.id
  referenced_security_group_id = aws_security_group.alb.id

  from_port   = var.backend_port
  to_port     = var.backend_port
  ip_protocol = "tcp"

  description = "Allow ALB to access backend"
}

resource "aws_security_group" "rds" {
  name        = "kanban-rds-sg"
  description = "Security group for Kanban PostgreSQL database"
  vpc_id      = var.vpc_id

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kanban-rds-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "rds_postgres" {
  security_group_id            = aws_security_group.rds.id
  referenced_security_group_id = aws_security_group.ecs.id

  from_port   = var.database_port
  to_port     = var.database_port
  ip_protocol = "tcp"

  description = "Allow ECS backend to access PostgreSQL"
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "kanban-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "kanban-ecs-task-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}