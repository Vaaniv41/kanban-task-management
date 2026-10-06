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

  allocated_storage = var.snapshot_identifier == null ? 20 : null
  storage_type      = "gp3"

  snapshot_identifier = var.snapshot_identifier
  db_name             = var.snapshot_identifier == null ? var.db_name : null
  username            = var.snapshot_identifier == null ? var.db_username : null
  password            = var.db_password
  port                = var.db_port

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