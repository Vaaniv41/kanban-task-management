import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Draggable, Droppable, } from "react-beautiful-dnd";
import Modal from 'react-modal';
import AppContext from '../../context/AppContext';
import "../../assets/css/dragndrop.css"
import ColumnBody from './ColumnBody';
import { 
  useBoardData, useUpdateBoardColumn, useUpdateColumns, useUpdateColumn, useCreateColumn 
} from '../features/customHooks';


const onDragEnd = (result, updateBoardColumn, updateColumns, updateColumn, refetch, selectedBoard, columnOrder, setColumnOrder, columns, setColumns) => {

  const {source, destination, draggableId, type} = result;  

  if(destination.droppableId === source.droppableId && destination.index === source.index) return;

  if (type === 'column') {
    const newColumnOrder = Array.from(columnOrder);
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);
    
    const copiedColumns = [...selectedBoard.columns];
    const [removed] = copiedColumns.splice(source.index, 1);
    copiedColumns.splice(destination.index, 0, removed);

    const payload = {
      id:selectedBoard.id,
      body:{newBoard:{columns:copiedColumns}}
    }
    
    updateBoardColumn(payload)
    refetch()
    setColumnOrder(newColumnOrder)

    return;
  }

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.tasks];
    const destItems = [...destColumn.tasks];
    const [removed] = sourceItems.splice(source.index, 1);
    
    destItems.splice(destination.index, 0, removed);

    const payload = {
      id1:sourceColumn.id,
      id2: destColumn.id,
      body:{ 
        colOne:{tasks:sourceItems},
        colTwo:{tasks:destItems}
      }
    }

    updateColumns(payload)

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destItems
      }
    });

  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.tasks];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    
    const payload ={
      id:column.id,
      body:{newCol:{tasks:copiedItems}}
    }

    updateColumn(payload)

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        tasks: copiedItems
      }
    });
    
  }
}

function Area() {
  const context = useContext(AppContext);
  const { boardId } = useParams()
  const { sidebarHidden, setSidebarHidden, selectedBoard, setSelectedBoard, setColumnsName, columns, setColumns, columnOrder, setColumnOrder } = context;

  const [createColumnModal, setCreateColumnModal] = useState(false);
  const [columnName, setColumnName] = useState("");

  const { isLoading, error, data, refetch } = useBoardData(boardId);
  const { updateBoardColumn } = useUpdateBoardColumn();
  const { updateColumns } = useUpdateColumns();
  const { updateColumn } = useUpdateColumn();
  const { createColumn, columnIsSuccess, newColumn } = useCreateColumn();

  if(!isLoading && !error && data.data){
    setSelectedBoard(data.data)
  }

  useEffect(()=>{
      
    if(Object.keys(selectedBoard).length !== 0){
      const obj = selectedBoard.columns.reduce((p,c)=>({...p, [c.id]:{...c}}),{})
      setColumns(obj)

      const obg = selectedBoard.columns.reduce((p, c)=>([...p,{id:c.id,name:c.name}]),[])
      setColumnsName(obg)

      const keys= Object.keys(obj)
      setColumnOrder(keys)
    }

  },[selectedBoard])

  useEffect(() => {
    if (columnIsSuccess) {
      const data = newColumn;
      const newId = data.data.id;
      const newData = data.data;
      const updatedColumns = { ...columns, [newId]: newData };

      const newColumnName = {
        id: newId,
        name: data.data.name
      }

      setColumnOrder(prev => [...prev, newId]);
      setColumnsName(prev => [...prev, newColumnName]);
      setColumns(updatedColumns)
    }
  }, [columnIsSuccess, newColumn]);

  const onColumnClose = () => {
    setColumnName("")
    setCreateColumnModal(false)
  }

  const handleCreateColumn = () => {

    const payload = {
      name: columnName,
      boardId: selectedBoard.id
    }

    createColumn(payload)
    onColumnClose()
  }




  return (
    <>
    {columnOrder.length? (
    <DragDropContext 
      onDragEnd={(result)=> onDragEnd(result, updateBoardColumn, updateColumns, updateColumn, refetch, selectedBoard, columnOrder, setColumnOrder, columns, setColumns)}   
    >
        <div className='populated-area'>
          <Droppable 
              droppableId="mainColumn"
              direction='horizontal'
              type='column'
          >
              {(provided)=>{
              return (
                <>
                  <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{display:"flex"}}
                  >
                      {columnOrder.map((columnId, ind)=>{
                          const columnd = columns[columnId]
                          return (
                          <Draggable
                              key={columnId}
                              draggableId={columnId}
                              index = {ind}
                          >
                          {
                              ((provided)=>{
                                  return(
                                  <div
                                      {...provided.draggableProps}
                                      
                                      ref={provided.innerRef}
                                      key={columnId} 
                                      className='task-col'
                                  >
                                      <div
                                          {...provided.dragHandleProps} 
                                          className='col-header'
                                      >
                                          <FontAwesomeIcon className='col-icon' style={{color:"green"}} icon={faCircle} />
                                          <h4>{columnd?.name}</h4>
                                          <h4>({columnd?.tasks? columnd.tasks.length : "0"})</h4>
                                      </div>
                                      <ColumnBody 
                                          droppableId={columnId}
                                          key={columnId}
                                          index={ind}
                                          column={columnd} 
                                          columns={columns}
                                          setColumns={setColumns}

                                      />
                                  </div>
                              )})
                          }
                          </Draggable>
                          )
                          })}
                      {provided.placeholder}
                  </div>
                </>
              )
              }}
          </Droppable>
            
          <div onClick={()=> setCreateColumnModal(true)} className='task-col addColumn'>
            <p>+ New Column</p>
          </div>
        </div>

    </DragDropContext>
    ):(  
      <div className='mainArea'>
          <div className='empty'>
              <p className='emptyPara'>This board is empty. Create a new column to get started.</p>
              <button onClick={()=> setCreateColumnModal(true)} className='addNewColBtn'>
                  +Add New Column
              </button>
          </div>
      </div>
    )}
        
    <div 
        className="eye-button" 
        style={{display:sidebarHidden?"":"none"}} 
        onClick={()=>{setSidebarHidden(false)}}
    >
        <FontAwesomeIcon className="me-3 ms-3" icon={faEye} />
    </div>


    {/* Add New Column Modal */}
    <Modal
      isOpen={createColumnModal}
      onRequestClose={onColumnClose}
      className="column-modal"
      overlayClassName="overlay-modalss"
    >
      <div className='modal-header' style={{display:"flex"}}>
        <h2>Add New Column</h2>
      </div>
      <div className='modal-body'>
        <h6>Title</h6>
        <input value={columnName} onChange={(e)=>setColumnName(e.target.value)} type='text' />
          
      </div>
      <div className='modal-footer'>
        <button onClick={handleCreateColumn} className='createTask'>
          Create Column
        </button>
      </div>
    </Modal>
    </>
  )
}

export default Area