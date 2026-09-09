import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Droppable } from "react-beautiful-dnd";
import Modal from 'react-modal';
import Task from './Task';
import Select from "../features/Select";
import AppContext from '../../context/AppContext';
import "../../assets/css/checkmark.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faXmark } from '@fortawesome/free-solid-svg-icons'
import "../../assets/css/deletemodal.css"
import { useDeleteTask, useBoardData, useUpdateSubtask, useUpdateTaskColumn, useDeleteSubtask, useUpdateTask } from '../features/customHooks';
import { successToast, errorToast } from '../features/useToast';


function ColumnBody({ droppableId, column, columns, setColumns }) {
    const context = useContext(AppContext);
    const { boardId } = useParams()
    const { columnsName, setSelectedBoard, } = context;

    const [showModal, setShowModal] = useState(false);
    const [subtasks, setSubtasks] = useState([{id: 0, title: "", completed: false, taskId: ""}])
    const [task, setTask] = useState({id: 0, title: "", description: "", subtasks:subtasks, columnId:""})
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deletedSubtaskInd, setDeletedSubtaskInd] = useState(0);

    const { deleteTask } = useDeleteTask()
    const { updateSubtask } = useUpdateSubtask()
    const { updateTaskColumn } = useUpdateTaskColumn()
    const { isLoading, error, data, refetch } = useBoardData(boardId);
    const { deleteSubtask, deleteSubtaskSuccess } = useDeleteSubtask()
    const { updateTask, updateTaskSuccess, updatedTask } = useUpdateTask()

    useEffect(() => {
        if (deleteSubtaskSuccess) {
            setSubtasks(subtasks.filter((_, i) => i !== deletedSubtaskInd));
        }
    }, [deleteSubtaskSuccess]);
    
    useEffect(() => {
        if (updateTaskSuccess) {
            const Column = columns[updatedTask.data.columnId]
            const beforeTasks = [...Column.tasks]
            const taskIndex = beforeTasks?.findIndex(item => item.id === updatedTask.data.id);
            beforeTasks.splice(taskIndex, 1, updatedTask.data);
            setColumns({
                ...columns,
                [updatedTask.data.columnId]: {
                    ...Column,
                    tasks: beforeTasks
                }
            })
            successToast("Task updated successfully!");
        }
    }, [updateTaskSuccess, updatedTask]);

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, { title: '', completed: false }]);
    };

    const handleRemoveSubtask = (index) => {
        const removedSubtask = subtasks[index];
        if(removedSubtask.id){
            deleteSubtask(removedSubtask.id)
            setDeletedSubtaskInd(index)
        }else{
            console.log("subtask deleted => ",subtasks[index]);
            setSubtasks(subtasks.filter((_, i) => i !== index));
        }
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
      //   const allSubtasksFilled = subtasks.every((subtask) => subtask.title !== '');
        const allSubtasksFilled = subtasks.length === 0 || subtasks.every((subtask) => subtask.title !== '');
   
        if (task.title && task.description && allSubtasksFilled) {
  
            const payload = {
                id: task.id,
                body:{
                    title:task.title,
                    description:task.description,
                    columnId:task.columnId,
                    subtasks
                }
            }
  
            updateTask(payload)
            closeEditModal()
        } else {
          errorToast("Please fill all the fields");
        }
    };

    function closeEditModal() {
        setEditModal(false);
    }  

    function openEditModal() {
        closeModal()
        setEditModal(true);
    }  


    if(!isLoading && !error && data.data){
        setSelectedBoard(data.data)
    }

    function openModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    const handleUpdateSubtask = (subtaskId, event) => {
        const completed = event.target.checked;
        const updatedSubtasks = subtasks.map((subtask) =>
          subtask.id === subtaskId ? { ...subtask, completed } : subtask
        );
        setSubtasks(updatedSubtasks);
        setTask({ ...task, subtasks: updatedSubtasks });


        const col = columns[droppableId]

        const taskIndex = col.tasks.findIndex(item => item.id === task.id);

        const updatedTasks = [...col.tasks];
        updatedTasks[taskIndex] = { ...task, subtasks: updatedSubtasks };

        const newCol = {
            ...columns,
            [droppableId]:{
                ...col,
                tasks:updatedTasks
            }
        }

        setColumns(newCol)
       
        const payload = {
            id: subtaskId,
            body: {completed}
        }
        
        updateSubtask(payload)
    };

    const openDeleteModal = () => {
        closeModal()
        setDeleteModal(true)
    }

    const handleDeleteTask = () => {
        deleteTask(task.id)
        refetch()
        setDeleteModal(false)
    }

    const handleSelect = (option) => {

        const sourceColumn = columns[task.columnId];
        const destColumn = columns[option.id];
        const sourceItems = [...sourceColumn.tasks];
        const destItems = [...destColumn.tasks];

        const taskIndex = sourceColumn.tasks.findIndex(item => item.id === task.id);

        const [removed] = sourceItems.splice(taskIndex, 1);
        destItems.splice(0, 0, removed);
    
        setColumns({
          ...columns,
          [task.columnId]: {
            ...sourceColumn,
            tasks: sourceItems
          },
          [option.id]: {
            ...destColumn,
            tasks: destItems
          }
        });


        const payload = {
            id: task.id,
            body: {newColumnId:option.id}
        }
        updateTaskColumn(payload)
    }

    const handleChange = (e) => {
        setTask({...task, [e.target.name]:e.target.value});
    }

  return (
    <>
    <Droppable 
        droppableId={droppableId}
        key={droppableId}
        type="task"
    >
    {(provided, snapshot)=>(
        <div     
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='col-body'
        >
            {column?.tasks?.map((item, ind) => {
                return(
                    <Task 
                        task={item} 
                        key={ind} 
                        index={ind} 
                        setTask={setTask}
                        setSubtasks={setSubtasks}
                        viewTask={openModal}
                    />
                )
            })}
        {provided.placeholder}
        </div>
    )}
    </Droppable> 

    {/* View Task Modal */}
    <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        // style={customStyles}
        className="view-task-modal"
        overlayClassName="overlay-modalss"
    >
        <div className='modal-header' style={{display:"flex"}}>
            <h2>{task.title}</h2>
            <span className='elipses dropdown' >
                <FontAwesomeIcon className="dropbtn" style={{color:"#828FA3"}} icon={faEllipsisVertical} />
                <div className="dropdown-content all-menu">
                    <a onClick={openEditModal} className='editbtn' >   
                        <span>
                            Edit Task
                        </span>
                    </a>
                    <a onClick={openDeleteModal} className='deletebtn' >
                        <span>
                            Delete Task
                        </span>
                    </a>
                </div>
            </span>
        </div>
        <div className='modal-body'>
            <p className='view-modal-desc'>{task.description}</p>
            <p className='view-modal-subt mt-2 mb-3'>Subtasks()</p>
                {subtasks.map((item)=>{
                    return (
                    <div className='subtasks-view'>
                        <label className="checkbox-container">
                            <input type="checkbox" checked={item.completed} onChange={(e)=>handleUpdateSubtask(item.id, e)} />
                            <span className="checkmark"></span>
                        </label>
                        <p className={item.completed?'view-modal-subt line-through': 'view-modal-subt'}>{item.title}</p>
                    </div>
                    )
                })}
            <p className='view-modal-subt mt-4'>Current Status</p>
            <Select onSelect={handleSelect} selected={task.columnId} options={columnsName} />
            
        </div>
    </Modal>

    {/* Edit Task Modal */}
    <Modal
        isOpen={editModal}
        onRequestClose={closeEditModal}
        className="modalss"
        overlayClassName="overlay-modalss"
    >
    <form onSubmit={handleEditFormSubmit}>
        <div className='modal-header' style={{display:"flex"}}>
            <h2>Edit Task</h2>
        </div>
        <div className='modal-body'>
            <h6>Title <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
            <input type='text' name="title" value={task.title} onChange={handleChange} />
            
            <h6>Description <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
            <textarea name="description" value={task.description} onChange={handleChange} cols='30' rows='3' />
            
            <h6>Subtasks <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
            <span className='subtask-input'>
            {subtasks.map(({ title, completed }, index) => (
                <span key={index}>
                <input
                    type='text'
                    value={title}
                    onChange={(e) => {
                    const newSubtasks = [...subtasks];
                    newSubtasks[index].title = e.target.value;
                    setSubtasks(newSubtasks);
                    }}
                />
                <FontAwesomeIcon
                    className='subtask-close'
                    icon={faXmark}
                    onClick={() => handleRemoveSubtask(index)}
                />
                </span>
            ))}
            </span>
            <button type='button' className='newSubtaskbtn' onClick={handleAddSubtask}>
                + Add New Subtask
            </button>
        </div>
        <div className='modal-footer'>
            <button type='submit' className='createTask'>
                Submit
            </button>
        </div>
    </form>
    </Modal>


    {/* Delete Task Modal */}
    <Modal
        isOpen={deleteModal}
        onRequestClose={()=>setDeleteModal(false)}
        // style={customStyles}
        className="delete-modal"
        overlayClassName="overlay-modalss"
    >
        <div className='delete-modal-header' style={{display:"flex"}}>
            <h2>Delete this task?</h2>
        </div>
        <div className='delete-modal-body'>
            <p>
                Are you sure you want to delete the ‘{task.title}’ task? 
                This action will remove all subtasks and cannot be reversed.
            </p>
            
        </div>
        <div className='delete-modal-footer'>
            <button onClick={handleDeleteTask} className='deletebtn'>
                Delete
            </button>
            <button onClick={()=>setDeleteModal(false)} className='cancelbtn'>
                Cancel
            </button>
        </div>
    </Modal>
    </>
  )
}

export default ColumnBody