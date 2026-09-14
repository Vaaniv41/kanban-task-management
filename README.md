# kanban

**Dashboard**


Usage is shown in the gif below, It shows completed and not completed based on the subtasks if marked as checked even though the dashoard is descriptive.

![dashboard_screenshot](https://raw.githubusercontent.com/AhmedAli288/kanban/master/kanban.gif)


**Frontend**

It's a React based frontend app with react query used for API calls. It has "Dark" & "Light" theme options a sidebar with boards inlisted init, you can also see a glimpse in the above gif. The setup procedure is in the readme of frontend folder.


**Backend**

It's a "Node" & "Express" server app in the backend directory. It's database is based on "Prisma ORM" with "PostgreSQL". The setup procedure is simple just use "PostgreSQL", create a database init with the name of "test" and use "npm i" to install node and express dependencies. Also create a ".env" file add "DATABASE_URL=***************", this will be your link to the database. After this done, hit "npm run start" if you're a windows user. 
