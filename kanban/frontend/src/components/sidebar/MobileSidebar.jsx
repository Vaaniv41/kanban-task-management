import React, { useState, useContext, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faTableList, faXmark } from '@fortawesome/free-solid-svg-icons'
import AppContext from '../../context/AppContext';
import { useBoardsData, useCreateBoard } from '../features/customHooks';
import { successToast, errorToast } from '../features/useToast';
import Modal from 'react-modal';


const MobileSidebar = () => {

  const Navigate = useNavigate();
  const context = useContext(AppContext);
  const { darkTheme, setDarkTheme, boardsOverview, setBoardsOverview, selectedBoard } = context;

  
  const [name, setName] = useState('');
  const [columnName, setColumnName] = useState([{ name: '' }]);
  const [showModal, setShowModal] = useState(false);

  const boardFlag = boardsOverview? false:true; 

  const { boardsData, isBoardLoading }  = useBoardsData(boardFlag)
  const { createBoard, boardIsSuccess, newBoard } = useCreateBoard();

  const toggleSwitch = () => {
    setDarkTheme(!darkTheme);
  };

  useEffect(()=>{
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
    const allColumnFilled = columnName.length === 0 || columnName.every((column) => column.name !== '');

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
    <span style={{display:showModal&&"none"}}>
      <div style={{paddingRight:"6px"}}>
        <h6 className='m-3'>ALL BOARDS ({boardsOverview?.length})</h6>
        <ul className='mobUl'>
          {boardsOverview?.map((link, ind) => (
            <span key={ind} onClick={()=>{Navigate(`/board/${link.id}`)}} className={link.id == selectedBoard.id?"mobPlatform mobRow":"mobMarketing mobRow"}>
              <FontAwesomeIcon className='me-3 ms-3' icon={faTableList} rotation={180} />
              <li>{link.name}</li>
            </span>
          ))}
          <span onClick={()=>{setShowModal(true)}} className="mobBoard">
            <FontAwesomeIcon className="me-3 ms-3" icon={faTableList} rotation={180} />
            <li>+Create New Board</li>
          </span>
        </ul>
      </div>
      <div className="footer">
        <div className="ms-2 mb-2 mode between-mode">
          <span><FontAwesomeIcon icon={faSun} /></span>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkTheme} onChange={toggleSwitch} />
            <span className="toggle-slider" />
          </label>
          <span><FontAwesomeIcon icon={faMoon} /></span>
        </div>  
      </div>
    </span>


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

export default MobileSidebar;