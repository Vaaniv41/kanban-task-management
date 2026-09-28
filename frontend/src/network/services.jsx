import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASEURL || "";

// GET
export const getBoards = async () => {
    return axios.get(`${BASE_URL}/api/getboards`)
}

export const getBoard = async (id) => {
    return axios.get(`${BASE_URL}/api/getboard/${id}`)
}


// CREATE
export const createColumn = async (payload) => {
    return axios.post(`${BASE_URL}/api/createcolumn`, payload)
}

export const createTask = async (payload) => {
    return axios.post(`${BASE_URL}/api/createtask`, payload)
}

export const createBoard = async (payload) => {
    return axios.post(`${BASE_URL}/api/createboard`, payload)
}



// PATCH
export const updateSubtask = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updatesubtask/${payload.id}`, payload.body)
}

export const updateTask = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updatetask/${payload.id}`, payload.body)
}

export const updateTaskColumn = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updatetask/updatecolumn/${payload.id}`, payload.body)
}

export const updateColumns = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updatecolumns/${payload.id1}/${payload.id2}`, payload.body)
}

export const updateColumn = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updatecolumn/${payload.id}`, payload.body)
}

export const updateBoardColumn = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updateboard/updatecolumn/${payload.id}`, payload.body)
}

export const updateBoard = async (payload) => {
    return axios.patch(`${BASE_URL}/api/updateboard/${payload.id}`, payload.body)
}


// Delete
export const deleteBoard = async (id) => {
    return axios.delete(`${BASE_URL}/api/deleteboard/${id}`)
}

export const deleteColumn = async (id) => {
    return axios.delete(`${BASE_URL}/api/deletecolumn/${id}`)
}

export const deleteTask = async (id) => {
    return axios.delete(`${BASE_URL}/api/deletetask/${id}`)
}

export const deleteSubtask = async (id) => {
    return axios.delete(`${BASE_URL}/api/deletesubtask/${id}`)
}

