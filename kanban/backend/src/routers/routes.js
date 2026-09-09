const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require('uuid');

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()



// GET Requests
// Board
router.get("/getboards", async (req, res)=>{
    try{
        const boards = await prisma.board.findMany({
            include:{
                columns: {
                    include: {
                        tasks: {
                            include: {
                                subtasks: true,
                            }
                        }
                    }
                }
            }
        })
        res.status(200).send(boards)
    } catch(e){
        res.status(400).send(e)
    }
});

router.get("/getboard/:id", async (req, res)=>{
    try{

        let _id = Number(req.params.id)

        const board = await prisma.board.findUnique({
            where:{
                id: _id
            },
            include:{
                columns: {
                    include: {
                        tasks: {
                            include: {
                                subtasks: true,
                            }
                        }
                    }
                }
            }
        })
        res.status(200).send(board)
    } catch(e){
        res.status(400).send(e)
    }
});

// Column
router.get("/getcolumns", async (req, res)=>{
    try{
        const columns = await prisma.column.findMany({
            include: {
                tasks: {
                    include: {
                        subtasks: true,
                    }
                }
            }
        })
        res.status(200).send(columns)
    } catch(e){
        res.status(400).send(e)
    }
});

router.get("/getcolumn/:id", async (req, res)=>{
    try{

        let _id = Number(req.params.id)

        const column = await prisma.column.findUnique({
            where:{
                id: _id
            },
            include: {
                tasks: {
                    include: {
                        subtasks: true,
                    }
                }
            }
        })
        res.status(200).send(column)
    } catch(e){
        res.status(400).send(e)
    }
});


// Task
router.get("/gettasks", async (req, res)=>{
    try{
        const tasks = await prisma.task.findMany({
            include: {
                Column: true,
                subtasks: true
            }
        })
        res.status(200).send(tasks)
    } catch(e){
        res.status(400).send(e)
    }
});

router.get('/gettask/:id', async (req, res) => {
    try{
        const _id = req.params.id
        const task = await prisma.task.findUnique({
            where: {
                id: _id
            },
            include: {
                Column: true,
                subtasks: true
            }
        })  
        res.status(200).send(task)
    } catch(e){
        res.status(400).send(e)
    }
});


// POST Requests
// Board
router.post('/createboard', async (req, res) => {
    const { name, columns } = req.body;
  
    try {
      const board = await prisma.board.create({
        data: {
          name,
          columns: {
            create: columns.map(column => {
              return {
                id: uuidv4(),
                name: column.name,
              }
            })
          }
        },
        include: {
          columns: true
        }
      });
  
      res.status(201).json(board);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating board');
    }
});


// Column
router.post('/createcolumn', async (req, res) => {
    
    const id  = uuidv4()

    const { name, boardId } = req.body;
  
    try {
      const column = await prisma.column.create({
        data: {
          id,
          name,
          boardId,
        },
        include: {
            tasks: {
                include: {
                    subtasks: true,
                }
            }
        }
      });
  
      res.status(201).send(column)
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating column');
    }
});


// Task
router.post('/createtask', async (req, res) => {
    
    const id  = uuidv4()

    const { title, description, columnId, subtasks } = req.body;
  
    try {
      const task = await prisma.task.create({
        data: {
          id,
          title,
          description,
          columnId,
          subtasks: {
            create: subtasks.map((subtask) => ({
              title: subtask.title,
              completed: subtask.completed,
            })),
          },
        },
        include: {
          subtasks: true,
        },
      });
  
      res.status(201).send(task)
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating task');
    }
});



// PATCH Requests
// Subtask
router.patch('/updatesubtask/:id', async (req, res) => {
    const subtaskId = Number(req.params.id);
    const { completed } = req.body;
  
    try {
      const updatedSubtask = await prisma.subtask.update({
        where: { id: subtaskId },
        data: { completed: completed }
      });
  
      res.status(200).send(updatedSubtask);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating subtask');
    }
});


// Task
router.patch('/updatetask/updatecolumn/:id', async (req, res) => {
  const taskId = req.params.id;
  const { newColumnId } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { Column: { connect: { id: newColumnId } } },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating task');
  }
});


router.patch('/updatetask/:id/', async (req, res) => {
    try {
        const _id = req.params.id
        const { title, description, columnId, subtasks } = req.body

        const updatedSubtasks = subtasks
            ? await Promise.all(subtasks.map(async (subtask) => {
                if (subtask.id) {
                    return await prisma.subtask.update({
                        where: { id: subtask.id },
                        data: { title: subtask.title }
                    })
                } else {
                    return await prisma.subtask.create({
                        data: { title: subtask.title, completed: subtask.completed, Task: { connect: { id: _id } } }
                    })
                }
            }))
            : []

        const updatedTask = await prisma.task.update({
            where: { id: _id },
            data: { title, description, columnId },
            include: { subtasks: true }
        })

        const updatedTasks = { ...updatedTask, subtasks: updatedSubtasks }

        res.status(200).send(updatedTasks)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Column
router.patch('/updatecolumns/:idOne/:idTwo', async (req, res) => {
    try{

        const { idOne, idTwo } = req.params
        const { colOne, colTwo } = req.body

        // Update tasks' columnId in the database
        const updatedTasks = await prisma.$transaction(
            colOne.tasks.map((task) =>
                prisma.task.update({
                where: { id: task.id },
                data: { columnId: idOne },
                }),
            ).concat(
            colTwo.tasks.map((task) =>
                prisma.task.update({
                where: { id: task.id },
                data: { columnId: idTwo },
                }),
            ),
            ),
        );
        res.status(200).send(updatedTasks)
    }catch(e){
        res.status(400).send(e)
    }
});

router.patch('/updatecolumn/:id', async (req, res) => {
    const columnId = req.params.id;
    const { newCol } = req.body
  
    try {
        const updatedColumn = await prisma.$transaction(
            newCol.tasks.map((task) =>
            prisma.task.update({
                where: { id: task.id },
                data: { columnId: columnId },
            }),
            )
        );
  
        res.status(200).send(updatedColumn)
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating column');
    }
});


// Board
router.patch('/updateboard/updatecolumn/:id', async (req, res) => {

    const id = Number(req.params.id);
    const { newBoard } = req.body
  
    try {
        const updatedBoard = await prisma.$transaction(
            newBoard.columns.map((column) =>
            prisma.column.update({
                where: { id: column.id },
                data: { boardId: id },
            }),
            )
        );
  
        res.status(200).send(updatedBoard)
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating column');
    }
});

router.patch('/updateboard/:id/', async (req, res) => {
    try {
        const _id = Number(req.params.id)
        const { name, columns } = req.body

        const updatedColumns = columns
            ? await Promise.all(columns.map(async (column) => {
                if (column.id) {
                    return await prisma.column.update({
                        where: { id: column.id },
                        data: { name: column.name }
                    })
                } else {
                    return await prisma.column.create({
                        data: { 
                            id:uuidv4(),
                            name: column.name, 
                            Board: { connect: { id: _id } } 
                        }
                    })
                }
            }))
            : []

        const updatedBoard = await prisma.board.update({
            where: { id: _id },
            data: { name },
            include: { columns: true }
        })

        const updatedBoards = { ...updatedBoard, columns: updatedColumns }

        res.status(200).send(updatedBoards)
    } catch (e) {
        res.status(400).send(e)
    }
})




// Delete Requests
// Board
router.delete('/deleteboard/:id', async (req, res) => {
    const boardId = parseInt(req.params.id);
  
    try {
      const deletedBoard = await prisma.$transaction(async (prisma) => {
        await prisma.subtask.deleteMany({
          where: { Task: { Column: { boardId: boardId } } },
        });
  
        await prisma.task.deleteMany({
          where: { Column: { boardId: boardId } },
        });
  
        await prisma.column.deleteMany({ where: { boardId: boardId } });
  
        return prisma.board.delete({ where: { id: boardId } });
      });
  
      res.status(202).send(`Deleted board with ID ${deletedBoard.id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting board');
    }
});


// Column
router.delete('/deletecolumn/:id', async (req, res) => {
    const columnId = req.params.id;
  
    try {
      const deletedColumn = await prisma.$transaction(async (prisma) => {
        await prisma.subtask.deleteMany({
          where: { Task: { columnId: columnId } },
        });
  
        await prisma.task.deleteMany({
          where: { columnId: columnId },
        });
  
        return prisma.column.delete({ where: { id: columnId } });
      });
  
      res.status(202).send(`Deleted column with ID ${deletedColumn.id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting column');
    }
});


// Task
router.delete('/deletetask/:id', async (req, res) => {
    try{

        const _id = req.params.id

        const deleteTask = prisma.task.delete({
            where: {
                id: _id,
            },
        })

        const deleteSubtasks = prisma.subtask.deleteMany({
            where: {
                taskId: _id,
            },
        })
        
        
        const transaction = await prisma.$transaction([deleteSubtasks, deleteTask])

        res.status(202).send(`Task with id: ${transaction[1].id}, Deleted Successfully with all of its subtasks`)
        
    }catch(e){
        res.status(500).send(e)
    }
})


// Subtask
router.delete('/deletesubtask/:id', async (req, res) => {
    try{

        const _id = Number(req.params.id)

        const deleteSubtask = await prisma.subtask.delete({
            where: {
                id: _id,
            },
        })        

        res.status(202).send(`Subtask with id: ${deleteSubtask.id}, Deleted Successfully!`)
        
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router;