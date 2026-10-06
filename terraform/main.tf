# ============================================================
# 1. VPC
# ============================================================

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "kanban_vpc"
  }
}

# ============================================================
# 2. PUBLIC SUBNETS
# ============================================================

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1a"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1b"
  }
}

# ============================================================
# 3. PRIVATE SUBNETS
# ============================================================

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "private-subnet-1a"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "private-subnet-1b"
  }
}

# ============================================================
# 4. INTERNET GATEWAY
# ============================================================

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "kanban-igw"
  }
}

# ============================================================
# 5. ELASTIC IP FOR NAT GATEWAY
# ============================================================

resource "aws_eip" "nat" {
  domain = "vpc"

  depends_on = [
    aws_internet_gateway.gw
  ]

  tags = {
    Name = "kanban-nat-eip"
  }
}

# ============================================================
# 6. NAT GATEWAY
# ============================================================

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_1.id

  depends_on = [
    aws_internet_gateway.gw
  ]

  tags = {
    Name = "kanban-nat"
  }
}

# ============================================================
# 7. PUBLIC ROUTE TABLE
# ============================================================

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "public-rt"
  }
}

# ============================================================
# 8. PUBLIC ROUTE TABLE ASSOCIATIONS
# ============================================================

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public.id
}

# ============================================================
# 9. PRIVATE ROUTE TABLE
# ============================================================

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "private-rt"
  }
}

# ============================================================
# 10. PRIVATE ROUTE TABLE ASSOCIATIONS
# ============================================================

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private.id
}

# ============================================================
# 11. SECURITY MODULE
# ============================================================

module "security" {
  source = "./modules/security"

  vpc_id = aws_vpc.main.id

  frontend_port = 80
  backend_port  = 4000
  database_port = 5432
}

# ============================================================
# 12. DATABASE MODULE
# ============================================================

module "database" {
  source = "./modules/database"

  database_subnet_ids = [
    aws_subnet.private_1.id,
    aws_subnet.private_2.id
  ]

  rds_security_group_id = module.security.rds_security_group_id

  snapshot_identifier = var.snapshot_identifier

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
  db_port     = 5432
}

# ============================================================
# 13. APPLICATION LOAD BALANCER MODULE
# ============================================================

module "alb" {
  source = "./modules/alb"

  vpc_id = aws_vpc.main.id

  public_subnet_ids = [
    aws_subnet.public_1.id,
    aws_subnet.public_2.id
  ]

  alb_security_group_id = module.security.alb_security_group_id

  frontend_port = 80
  backend_port  = 4000
}

# ============================================================
# 14. ECS MODULE
# ============================================================

module "ecs" {
  source = "./modules/ecs"

  aws_region  = var.aws_region
  environment = var.environment

  vpc_id = aws_vpc.main.id

  private_subnet_ids = [
    aws_subnet.private_1.id,
    aws_subnet.private_2.id
  ]

  ecs_security_group_id       = module.security.ecs_security_group_id
  ecs_task_execution_role_arn = module.security.ecs_task_execution_role_arn

  frontend_target_group_arn = module.alb.frontend_target_group_arn
  backend_target_group_arn  = module.alb.backend_target_group_arn

  frontend_image = "598606890027.dkr.ecr.ap-south-1.amazonaws.com/kanban-frontend:latest"
  backend_image  = "598606890027.dkr.ecr.ap-south-1.amazonaws.com/kanban-backend:latest"

  frontend_port = 80
  backend_port  = 4000

  desired_count = 1

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password

  db_endpoint = module.database.db_endpoint
  db_address  = module.database.db_address
  db_port     = module.database.db_port
}
