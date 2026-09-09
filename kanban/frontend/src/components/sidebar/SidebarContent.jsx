import React, { useState, useContext, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faTableList, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import AppContext from '../../context/AppContext';
import { useBoardsData, useCreateBoard } from '../features/customHooks';
import { successToast, errorToast } from '../features/useToast';
import Modal from 'react-modal';



const SidebarContent = () => {

  const Navigate = useNavigate();
  const context = useContext(AppContext);
  const { sidebarHidden, setSidebarHidden, darkTheme, setDarkTheme, boardsOverview, setBoardsOverview, selectedBoard } = context;

  const [name, setName] = useState('');
  const [columnName, setColumnName] = useState([{ name: '' }]);
  const [showModal, setShowModal] = useState(false);

  const boardFlag = boardsOverview? false:true; 

  const { boardsData, isBoardLoading } = useBoardsData(boardFlag)
  const { createBoard, boardIsSuccess, newBoard } = useCreateBoard();

  const toggleSwitch = () => {
    setDarkTheme(!darkTheme);
  };

  useEffect(()=>{
    
    localStorage.setItem("dark-theme", darkTheme)
    
    if(darkTheme == true){
      document.body.className = "dark-theme"
    }else{
      document.body.className = "light-theme"
    }
  }, [darkTheme])

  useEffect(() => {
    if (boardIsSuccess) {
      setBoardsOverview(prev => [...prev, newBoard.data])
      Navigate(`/board/${newBoard.data.id}`)
    }
  }, [boardIsSuccess, newBoard]);


  if(!isBoardLoading && boardsData){
    setBoardsOverview(boardsData?.data)
  }

  if (isBoardLoading) return 'Loading...';
  // if (error) return `Error: ${error.message}`;

  function closeModal() {
    setName("");
    setColumnName([{ name: '' }])
    setShowModal(false);
  }

  const handleAddColumn = () => {
    setColumnName([...columnName, { name: '' }]);
  };

  const handleRemoveColumn = (index) => {
    setColumnName(columnName.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const allColumnFilled = columnName.every((column) => column.name !== '');

    if (name && allColumnFilled) {
      const payload = {
        name,
        columns:columnName
      }

      createBoard(payload)
      successToast("Board Created");
      closeModal()
    } else {
      errorToast("Please fill all the fields");
    }
  };


  return (
    <>
    {!isBoardLoading && 
      <div className="row sidebar" style={{display: sidebarHidden && "none"}}>
        
        <div style={{flexGrow:"1"}}>
          <h2 className='me-3 ms-3 mb-3'>ALL BOARDS ({boardsOverview?.length})</h2>
          <ul>
            {boardsOverview?.map((link, ind) => (
              <span key={ind} onClick={()=>{Navigate(`/board/${link.id}`)}} className={link.id == selectedBoard.id?"Platform-Launch":"Marketing"}>
                <FontAwesomeIcon className="me-3 ms-3" icon={faTableList} rotation={180} />
                <li>{link.name}</li>
              </span>
            ))}
            <span onClick={() => {setShowModal(true)}} className="Board">
              <FontAwesomeIcon className="me-3 ms-3" icon={faTableList} rotation={180} />
              <li>+Create New Board</li>
            </span>
          </ul>
        </div>
        <div className="footer">
          <div className=" me-3 ms-3 mode between-mode">
            <span><FontAwesomeIcon icon={faSun} /></span>
            <label className="toggle-switch">
              <input type="checkbox" checked={darkTheme} onChange={toggleSwitch} />
              <span className="toggle-slider" />
            </label>
            <span><FontAwesomeIcon icon={faMoon} /></span>
          </div>
          <div className="sider mt-2 mb-4">
            <span className="Marketing" onClick={()=>{setSidebarHidden(true)}}>
              <FontAwesomeIcon className="me-3 ms-3" icon={faEyeSlash}  /> Hide Sidebar
            </span>
          </div>      
        </div>
      </div>
    }

      {/* Add New Board Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        className="board-modal"
        overlayClassName="overlay-modalss"
      >
        <form onSubmit={handleFormSubmit}>
            <div className='modal-header' style={{display:"flex"}}>
                <h2>Add New Board</h2>
            </div>
            <div className='modal-body'>
                <h6>Name <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />

                <h6>Columns <p style={{color:"red", marginBottom:"0px"}}>*</p></h6>
                <span className='subtask-input'>
                {columnName.map(({ name }, index) => (
                    <span key={index}>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => {
                        const newColumns = [...columnName];
                        newColumns[index].name = e.target.value;
                        setColumnName(newColumns);
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
                Create Board
                </button>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default SidebarContent;