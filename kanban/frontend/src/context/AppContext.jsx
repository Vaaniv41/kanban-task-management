import React, { createContext, useState } from 'react';

const AppContext = createContext(null);

const getPrefferedTheme = () => {

    let theme = localStorage.getItem("dark-theme");
    if(theme){
        return JSON.parse(localStorage.getItem("dark-theme"));
    } else {
        return false
    }
}

const AppProvider = (props) => {
    const [sidebarHidden, setSidebarHidden] = useState(false);
    const [darkTheme, setDarkTheme] = useState(getPrefferedTheme());
    const [boardsOverview, setBoardsOverview] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState({});
    const [columnsName, setColumnsName] = useState([{}]);
    const [columns, setColumns] = useState({0: { id:0, name:"", tasks:[] } })
    const [columnOrder, setColumnOrder] = useState([""])


    return (
        <AppContext.Provider
            value={{
                sidebarHidden,
                setSidebarHidden,
                darkTheme, 
                setDarkTheme,
                boardsOverview, 
                setBoardsOverview,
                selectedBoard, 
                setSelectedBoard,
                columnsName, 
                setColumnsName,
                columns, 
                setColumns,
                columnOrder, 
                setColumnOrder
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContext;

export { AppProvider };