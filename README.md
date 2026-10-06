# kanban

**Dashboard**


Usage is shown in the gif below, It shows completed and not completed based on the subtasks if marked as checked even though the dashoard is descriptive.

![dashboard_screenshot](https://raw.githubusercontent.com/AhmedAli288/kanban/master/kanban.gif)

## Deploy to AWS

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the frontend and backend images, pushes them to ECR, and applies the Terraform stack on pushes to `main` (or when started manually from the Actions tab).

Before the first run:

1. Create the Terraform state S3 bucket `kanban-terraform-state-598606890027` and DynamoDB lock table `kanban-terraform-locks` in `ap-south-1`. Terraform needs these before it can initialize.
2. Add these GitHub Actions repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD`. The AWS identity needs access to the Terraform-managed AWS resources, ECR, the state bucket and lock table, and `iam:PassRole` for ECS task execution.
3. Ensure your AWS account is `598606890027`, which is currently used in the ECR image names and remote state bucket. Update those values in the workflow and Terraform if deploying to another account.

After a successful run, the workflow logs the Application Load Balancer DNS name. Database credentials are passed to ECS through Terraform and should be treated as deployment secrets.


**Frontend**

It's a React based frontend app with react query used for API calls. It has "Dark" & "Light" theme options a sidebar with boards inlisted init, you can also see a glimpse in the above gif. The setup procedure is in the readme of frontend folder.


**Backend**

It's a "Node" & "Express" server app in the backend directory. It's database is based on "Prisma ORM" with "PostgreSQL". The setup procedure is simple just use "PostgreSQL", create a database init with the name of "test" and use "npm i" to install node and express dependencies. Also create a ".env" file add "DATABASE_URL=***************", this will be your link to the database. After this done, hit "npm run start" if you're a windows user. 
