import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/kanban.png"
import darkLogo from "../../assets/images/kanban-light.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlus, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import AppContext from '../../context/AppContext';
import MobileSidebar from '../sidebar/MobileSidebar';
import Modal from 'react-modal';
import Select from '../features/Select';
import "../../assets/css/deletemodal.css"
import { useDeleteBoard, useBoardsData, useCreateTask, useDeleteColumn, useUpdateBoard } from '../features/customHooks';
import { successToast, errorToast } from '../features/useToast';

const Header = () => {
    
    const Navigate = useNavigate();
    const context = useContext(AppContext);
    const { sidebarHidden, darkTheme, boardsOverview, setBoardsOverview, selectedBoard, setSelectedBoard, columnsName, columns, setColumns, columnOrder, setColumnOrder } = context;

    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [editBoardModal, setEditBoardModal] = useState(false);
    const [editColumns, setEditColumns] = useState([{id:"", name: '' }]);
    const [editBoard, setEditBoard] = useState({id:0, name:"", columns:editColumns});
    const [deletedColumnInd, setDeletedColumnInd] = useState({id:"", ind:0});

    const { deleteBoard } = useDeleteBoard();
    const { createTask, taskIsSuccess, newTask } = useCreateTask();
    const { deleteColumn, deleteColumnSuccess } = useDeleteColumn();
    const { boardsData, isBoardLoading, boardsRefetch } = useBoardsData(true)
    const { updateBoard, updateBoardSuccess, updatedBoard } = useUpdateBoard();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState([{ title: '', completed: false }]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (taskIsSuccess) {

            const Column = columns[newTask.data.columnId];
            const newTasks = [...Column.tasks, newTask.data];
        
            setColumns({
              ...columns,
              [newTask.data.columnId]: {
                ...Column,
                tasks: newTasks
              }
            });
        }
    }, [taskIsSuccess, newTask]);

    useEffect(() => {
        if (updateBoardSuccess) {

            const updatedColumns = updatedBoard.data.columns.map((column) => {
                const selectedColumn = selectedBoard.columns.find((c) => c.id === column.id);
                if (selectedColumn) {
                  return {
                    ...column,
                    tasks: [...selectedColumn?.tasks],
                  };
                }
                return column;
              });
              
              const updatedBoardWithTasks = {
                ...updatedBoard.data,
                columns: updatedColumns,
              };
            console.log("updatedBoard => ", updatedBoardWithTasks);
            setSelectedBoard(updatedBoardWithTasks)
            successToast("Board updated successfully!");
        }
    }, [updateBoardSuccess, updatedBoard]);
    
    useEffect(() => {
        if (deleteColumnSuccess) {
            const newColums = [...columnOrder]
            const colIndex = columnOrder.findIndex(item => item === deletedColumnInd.id)
            newColums.splice(colIndex, 1)
            setColumnOrder(newColums)
            const updatedCols = {...columns}
            delete updatedCols[deletedColumnInd.id]
            setColumns(updatedCols)
            setEditColumns(editColumns.filter((_, i) => i !== deletedColumnInd.ind));
        }
    }, [deleteColumnSuccess]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function openModal() {
        setShowModal(true);
    }

    function closeModal() {
        setTitle("")
        setDescription("")
        setSubtasks([{ title: '', completed: false }])
        setStatus("")
        setShowModal(false);
    }
        
    const handleFormSubmit = (e) => {
        e.preventDefault();
      //   const allSubtasksFilled = subtasks.every((subtask) => subtask.title !== '');
        const allSubtasksFilled = subtasks.length === 0 || subtasks.every((subtask) => subtask.title !== '');
   
        if (title && description && allSubtasksFilled && status) {
  
          const payload = {
              title,
              description,
              columnId:status,
              subtasks
          }
  
          createTask(payload)
          successToast("Task Created");
          closeModal()
        } else {
          errorToast("Please fill all the fields");
        }
    };

    const handleAddSubtask = () => {
        setSubtasks([...subtasks, { title: '', completed: false }]);
    };
    
    const handleRemoveSubtask = (index) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };
    

    if(!isBoardLoading && boardsData){
        setBoardsOverview(boardsData.data)
    }
    

    const handleDeleteBoard = () =>{
        
        deleteBoard(selectedBoard.id)
        boardsRefetch()
        if(boardsOverview.length>0){
            Navigate(`/board/${boardsOverview[0].id}`)
        }else{
            Navigate('/dashboard')
        }
        setDeleteModal(false)
    }

    const handleAddColumn = () => {
        setEditColumns([...editColumns, { name: '' }]);
    };

    const handleRemoveColumn = (index) => {
        const removedColumn = editColumns[index];
        if(removedColumn.id){
            setDeletedColumnInd({id:removedColumn.id, ind:index})
            deleteColumn(removedColumn.id)
        }else{
            setEditColumns(editColumns.filter((_, i) => i !== index));
        }
    };

    const closeEditBoardModal = () => {
        setEditBoardModal(false)
    }

    const onOpenEditBoard = () => {
        setEditColumns(columnsName)
        setEditBoard({id:selectedBoard.id, name:selectedBoard.name, columns:editColumns})
        setEditBoardModal(true)
    }

    const handleEditBoardFormSubmit = (e) => {
        e.preventDefault();
        const allColumnsFilled = editColumns.every((column) => column.name !== '');
   
        if (editBoard.name && allColumnsFilled) {
  
            const payload = {
                id: selectedBoard.id,
                body:{
                    name:editBoard.name,
                    columns:editColumns
                }
            }
            console.log("selected board => ", JSON.stringify(selectedBoard));
            updateBoard(payload)
            closeEditBoardModal()
        } else {
          errorToast("Please fill all the fields");
        }
    };

    return (
        <>
            <div className='mainDiv'>
                {windowWidth > 600 &&
                <div className={sidebarHidden?'col-lg-3 col-md-4 sidebr borderBottom' : 'col-lg-3 col-md-4 sidebr'}>
                    <div className='row'>
                        <div className="me-3 ms-3 mb-4 logo col-12">
                            <div className="line one" />
                            <div className="line two" />
                            <div className="line three" />
                            <img src={darkTheme? darkLogo : logo} alt="logo.png" className="logoimg ms-3" />
                        </div>
                    </div>
                </div>
                }
                <div className={windowWidth < 600 ? 'col-12':'col-lg-9 col-md-8'}>
                    <div className='rightSide borderBottom'>
                        <div className='headerBar mob-logo'>
                            {windowWidth < 600 && <div className="logo">
                                <div className="line one" />
                                <div className="line two" />
                                <div className="line three" />
                            </div>}
                            <h4 className='mb-0'>{selectedBoard?.name}</h4>
                            {windowWidth < 600 && 
                                <span style={{padding:"8px"}} className='elipses dropdown' >
                                    <FontAwesomeIcon className="dropbtn" icon={faChevronDown} />
                                    <div className="dropdown-content mob-menu">
                                        <MobileSidebar />
                                    </div>
                                </span>
                            }
                        </div>
                        <div className='menuBtn'>
                            {windowWidth > 600?(
                                <button 
                                    className={selectedBoard?.columns?.length? 'newTaskBtn': 'newTaskBtn disable-btn-bg'} 
                                    onClick={openModal}
                                    disabled={!selectedBoard?.columns?.length}
                                >
                                    +Add New Task
                                </button>
                            ):(
                                <button 
                                    className={selectedBoard.columns.length? 'newTaskBtn': 'newTaskBtn disable-btn-bg'} 
                                    onClick={openModal}
                                    disabled={!selectedBoard.columns.length}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            )}

                            <span className='elipses dropdown' >
                                <FontAwesomeIcon className="dropbtn" style={{color:"#828FA3"}} icon={faEllipsisVertical} />
                                <div className="dropdown-content all-menu">
                                    <a onClick={onOpenEditBoard} className='editbtn' >   
                                        <span>
                                            Edit Board
                                        </span>
                                    </a>
                                    <a onClick={()=>{setDeleteModal(true)}} className='deletebtn' >
                                        <span>
                                            Delete Board
                                        </span>
                                    </a>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Edit Board Modal */}
            <Modal
                isOpen={editBoardModal}
                onRequestClose={closeEditBoardModal}
                className="modalss"
                overlayClassName="overlay-modalss"
            >
            <form onSubmit={handleEditBoardFormSubmit}>
                <div className='modal-header' style={{display:"flex"}}>
                    <h2>Edit Board</h2>
                </div>
                <div className='modal-body'>
                    <h6>Name <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                    <input type='text' value={editBoard.name} onChange={(e)=>{setEditBoard({...editBoard, name:e.target.value})}} />
                              
                    <h6>Columns <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                    <span className='subtask-input'>
                    {editColumns.map(({ name }, index) => (
                        <span key={index}>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => {
                            const newColumns = [...editColumns];
                            newColumns[index].name = e.target.value;
                            setEditColumns(newColumns);
                            }}
                        />
                        <FontAwesomeIcon
                            className='subtask-close'
                            icon={faXmark}
                            onClick={() => handleRemoveColumn(index)}
                        />
                        </span>
                    ))}
                    </span>
                    <button type='button' className='newSubtaskbtn' onClick={handleAddColumn}>
                        + Add New Column
                    </button>
                </div>
                <div className='modal-footer'>
                    <button type='submit' className='createTask'>
                        Submit
                    </button>
                </div>
            </form>
            </Modal>


            {/* Delete Board Modal */}
            <Modal
                isOpen={deleteModal}
                onRequestClose={()=>setDeleteModal(false)}
                className="delete-modal"
                overlayClassName="overlay-modalss"
            >
                <div className='delete-modal-header' style={{display:"flex"}}>
                    <h2>Delete this board?</h2>
                </div>
                <div className='delete-modal-body'>
                    <p>
                        Are you sure you want to delete the ‘{selectedBoard.name}’ board? 
                        This action will remove all columns and tasks and cannot be reversed.
                    </p>
                    
                </div>
                <div className='delete-modal-footer'>
                    <button onClick={handleDeleteBoard} className='deletebtn'>
                        Delete
                    </button>
                    <button onClick={()=>setDeleteModal(false)} className='cancelbtn'>
                        Cancel
                    </button>
                </div>
            </Modal>

            {/* Add New Task Modal */}
            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                className="modalss"
                overlayClassName="overlay-modalss"
            >
            <form onSubmit={handleFormSubmit}>
                <div className='modal-header' style={{display:"flex"}}>
                    <h2>Add New Task</h2>
                </div>
                <div className='modal-body'>
                    <h6>Title <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                    <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                    <h6>Description <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                    <textarea cols='30' rows='3' value={description} onChange={(e) => setDescription(e.target.value)} />
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
                    <h6>Status <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                    
                    <Select options={columnsName} onSelect={(selectedOption) => setStatus(selectedOption.id)} />
                </div>
                <div className='modal-footer'>
                    <button type='submit' className='createTask'>
                    Create Task
                    </button>
                </div>
            </form>
            </Modal>
        </>
    );
};

export default Header;