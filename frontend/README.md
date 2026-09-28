# Kanban Task Management

A full-stack Kanban task management application that allows users to organize boards, columns, tasks, and subtasks in a visual workflow.

The project consists of a React frontend, Node.js/Express backend, PostgreSQL database, and Docker-based local development environment.

---

## 📌 Project Overview

The Kanban Task Management application is designed to help users organize and manage their work using the Kanban methodology.

Users can work with:

- Boards
- Columns
- Tasks
- Subtasks
- Task status
- Task organization

The application provides a frontend interface for interacting with the task management system, while the backend provides APIs for application operations and communicates with the PostgreSQL database.

---

## 🛠️ Technologies Used

### Frontend

- React
- Chakra UI
- React Modal
- React Beautiful DnD

### Backend

- Node.js
- Express.js
- CORS
- REST APIs

### Database

- PostgreSQL
- Prisma ORM

### Containerization

- Docker
- Docker Compose

### Version Control

- Git
- GitHub

### Future Infrastructure

- AWS
- Terraform
- GitHub Actions
- Amazon ECS
- AWS Fargate
- Amazon RDS
- Amazon ECR

---

# 📁 Project Structure

```text
kanban/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .dockerignore
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── terraform/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .gitignore
└── README.md