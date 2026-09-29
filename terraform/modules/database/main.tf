resource "aws_db_subnet_group" "kanban" {
  name       = "kanban-db-subnet-group"
  subnet_ids = var.database_subnet_ids

  tags = {
    Name = "kanban-db-subnet-group"
  }
}

resource "aws_db_instance" "kanban" {
  identifier = "kanban-postgres"

  engine         = "postgres"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = var.db_port

  db_subnet_group_name   = aws_db_subnet_group.kanban.name
  vpc_security_group_ids = [var.rds_security_group_id]

  publicly_accessible = false
  multi_az            = false

  backup_retention_period = 0
  skip_final_snapshot     = true
  deletion_protection     = false

  tags = {
    Name = "kanban-postgres"
  }
}