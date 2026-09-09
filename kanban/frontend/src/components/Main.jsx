import { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import Header from './header/Header';
import SidebarContent from "./sidebar/SidebarContent";
import "../App.css"
import "../assets/css/bootstrap.css"
import AppContext from '../context/AppContext';
import Area from './dragNdrop/Area';
import { useBoardData } from './features/customHooks';


export default function Main() {

  const { boardId } = useParams()
  const context = useContext(AppContext);
  const { sidebarHidden, setSelectedBoard } = context;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isLoading, error, data } = useBoardData(boardId)

  if(!isLoading && !error){
    setSelectedBoard(data.data)
  }

  if (isLoading) return 'Loading...';
  if (error) return `Error: ${error.message}`;


  return (
    <>
      {!isLoading && !error &&
      <>
      <Header />
      <div className="row" id="main-row">
        {windowWidth>600 &&
        <div className={sidebarHidden? "": "col-lg-3 col-md-4"}>
          <SidebarContent />  
        </div>
        }
        <div className={windowWidth<600||sidebarHidden? "col-12 main-area": "col-lg-9 col-md-8 main-area"} >
          <Area />
        </div>
       </div>
       </>
      }
    </>
  );
}