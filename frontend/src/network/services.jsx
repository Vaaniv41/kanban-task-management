import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASEURL || "http://localhost:4000";

// GET
export const getBoards = async () => {
    return axios.get(`${BASE_URL}/getboards`)
}

export const getBoard = async (id) => {
    return axios.get(`${BASE_URL}/getboard/${id}`)
}


// CREATE
export const createColumn = async (payload) => {
    return axios.post(`${BASE_URL}/createcolumn`, payload)
}

export const createTask = async (payload) => {
    return axios.post(`${BASE_URL}/createtask`, payload)
}

export const createBoard = async (payload) => {
    return axios.post(`${BASE_URL}/createboard`, payload)
}



// PATCH
export const updateSubtask = async (payload) => {
    return axios.patch(`${BASE_URL}/updatesubtask/${payload.id}`, payload.body)
}

export const updateTask = async (payload) => {
    return axios.patch(`${BASE_URL}/updatetask/${payload.id}`, payload.body)
}

export const updateTaskColumn = async (payload) => {
    return axios.patch(`${BASE_URL}/updatetask/updatecolumn/${payload.id}`, payload.body)
}

export const updateColumns = async (payload) => {
    return axios.patch(`${BASE_URL}/updatecolumns/${payload.id1}/${payload.id2}`, payload.body)
}

export const updateColumn = async (payload) => {
    return axios.patch(`${BASE_URL}/updatecolumn/${payload.id}`, payload.body)
}

export const updateBoardColumn = async (payload) => {
    return axios.patch(`${BASE_URL}/updateboard/updatecolumn/${payload.id}`, payload.body)
}

export const updateBoard = async (payload) => {
    return axios.patch(`${BASE_URL}/updateboard/${payload.id}`, payload.body)
}


// Delete
export const deleteBoard = async (id) => {
    return axios.delete(`${BASE_URL}/deleteboard/${id}`)
}

export const deleteColumn = async (id) => {
    return axios.delete(`${BASE_URL}/deletecolumn/${id}`)
}

export const deleteTask = async (id) => {
    return axios.delete(`${BASE_URL}/deletetask/${id}`)
}

export const deleteSubtask = async (id) => {
    return axios.delete(`${BASE_URL}/deletesubtask/${id}`)
}

