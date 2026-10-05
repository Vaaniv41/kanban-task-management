terraform {
  backend "s3" {
    bucket         = "kanban-terraform-state-598606890027"
    key            = "kanban/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "kanban-terraform-locks"
    encrypt        = true
  }
}