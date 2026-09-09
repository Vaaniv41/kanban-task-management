import axios from "axios";

// GET
export const getBoards = async () => {
    return axios.get(`${process.env.REACT_APP_BASEURL}/getboards`)
}

export const getBoard = async (id) => {
    return axios.get(`${process.env.REACT_APP_BASEURL}/getboard/${id}`)
}


// CREATE
export const createColumn = async (payload) => {
    return axios.post(`${process.env.REACT_APP_BASEURL}/createcolumn`, payload)
}

export const createTask = async (payload) => {
    return axios.post(`${process.env.REACT_APP_BASEURL}/createtask`, payload)
}

export const createBoard = async (payload) => {
    return axios.post(`${process.env.REACT_APP_BASEURL}/createboard`, payload)
}



// PATCH
export const updateSubtask = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updatesubtask/${payload.id}`, payload.body)
}

export const updateTask = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updatetask/${payload.id}`, payload.body)
}

export const updateTaskColumn = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updatetask/updatecolumn/${payload.id}`, payload.body)
}

export const updateColumns = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updatecolumns/${payload.id1}/${payload.id2}`, payload.body)
}

export const updateColumn = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updatecolumn/${payload.id}`, payload.body)
}

export const updateBoardColumn = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updateboard/updatecolumn/${payload.id}`, payload.body)
}

export const updateBoard = async (payload) => {
    return axios.patch(`${process.env.REACT_APP_BASEURL}/updateboard/${payload.id}`, payload.body)
}


// Delete
export const deleteBoard = async (id) => {
    return axios.delete(`${process.env.REACT_APP_BASEURL}/deleteboard/${id}`)
}

export const deleteColumn = async (id) => {
    return axios.delete(`${process.env.REACT_APP_BASEURL}/deletecolumn/${id}`)
}

export const deleteTask = async (id) => {
    return axios.delete(`${process.env.REACT_APP_BASEURL}/deletetask/${id}`)
}

export const deleteSubtask = async (id) => {
    return axios.delete(`${process.env.REACT_APP_BASEURL}/deletesubtask/${id}`)
}
