import React, { useEffect } from 'react';
import "../../assets/css/dragndrop.css";
import { Draggable } from 'react-beautiful-dnd';


function Task({ task, index, setTask, setSubtasks, viewTask }) {

  const completed = task?.subtasks.filter(item => item.completed == true);

  const doubleClicked = () => {
    setTask(task);
    setSubtasks(task.subtasks);
    viewTask();
  }

  
  return (
    <Draggable key={task?.id} draggableId={task?.id.toString()} index={index}>
    {(provided, snapshot) => {
      return(
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className='task-container'
          onDoubleClick={doubleClicked}
        >
          <h6 className='task-heading'>
              {task?.title}
          </h6>
          <p className='task-subtasks'>
              {completed.length} out of {task.subtasks?.length} subtasks
          </p>
        </div>
        )
      }}
    </Draggable>
  )
}

export default React.memo(Task);