import { 
    getBoards, 
    getBoard, 

    updateSubtask, 
    updateTask,
    updateTaskColumn,
    updateColumns,
    updateColumn,
    updateBoardColumn,
    updateBoard,

    createTask,
    createColumn,
    createBoard,

    deleteSubtask,
    deleteTask, 
    deleteColumn,
    deleteBoard, 
} from "../../network/services";
import { useQuery, useMutation } from 'react-query';
import { useQueryClient } from 'react-query';
import { errorToast } from "./useToast";


// GET
export const useBoardsData = (calling) => {
    const onError = () => {
        // console.log("delete error", error );
    }

    const { isLoading, data, refetch } = useQuery('getBoards', () => getBoards(),{
        onError, 
        enabled: calling
    });

    return { boardsData: data, isBoardLoading: isLoading, boardsRefetch: refetch }
}

export const useBoardData = (id) => {
    const { isLoading, data, refetch } = useQuery( ['getboardById', id], ({queryKey}) => getBoard(queryKey[1]),{
        // enabled:true
    });
    return { isLoading, data, refetch }
}

// CREATE
export const useCreateColumn = () => {

    const { mutateAsync, isLoading, isSuccess, data, error } = useMutation(createColumn);
    return { createColumn: mutateAsync, isLoading, columnIsSuccess: isSuccess, newColumn:data, error }
}

export const useCreateTask = () => {

    const onError = (error) => {
        errorToast("Error creating task");
    }

    const { mutateAsync, isLoading, isSuccess, data, error } = useMutation(createTask, { onError });
    return { createTask: mutateAsync, isLoading, taskIsSuccess: isSuccess, newTask:data, error }
} 

export const useCreateBoard = () => {

    const onError = (error) => {
        errorToast("Error creating board");
    }

    const { mutateAsync, isLoading, isSuccess, data, error } = useMutation(createBoard, { onError });
    return { createBoard: mutateAsync, isLoading, boardIsSuccess: isSuccess, newBoard:data, error }
} 


// UPDATE
export const useUpdateSubtask = () => {

    const { mutateAsync, isLoading, error } = useMutation(updateSubtask);
    return { updateSubtask: mutateAsync, isLoading, error }
}

export const useUpdateTask = () => {
    const onError = (error) => {
        errorToast("Error updating task");
    }

    const { mutateAsync, isLoading, isSuccess, data, error } = useMutation(updateTask, { onError });
    return { updateTask: mutateAsync, isLoading, updateTaskSuccess: isSuccess, updatedTask:data, error }
}

export const useUpdateTaskColumn = () => {
    const { mutateAsync, isLoading, error } = useMutation(updateTaskColumn);
    return { updateTaskColumn: mutateAsync, isLoading, error }
}

export const useUpdateColumns = () => {
    const { mutateAsync, isLoading, error } = useMutation(updateColumns);
    return { updateColumns: mutateAsync, isLoading, error }
}

export const useUpdateColumn = () => {
    const { mutateAsync, isLoading, error } = useMutation(updateColumn);
    return { updateColumn: mutateAsync, isLoading, error }
}

export const useUpdateBoardColumn = () => {
    const { mutateAsync, isLoading, error } = useMutation(updateBoardColumn);
    return { updateBoardColumn: mutateAsync, isLoading, error }
}

export const useUpdateBoard = () => {
    const onError = (error) => {
        errorToast("Error updating board");
    }

    const { mutateAsync, isLoading, isSuccess, data, error } = useMutation(updateBoard, { onError });
    return { updateBoard: mutateAsync, isLoading, updateBoardSuccess: isSuccess, updatedBoard:data, error }
}

// DELETE
export const useDeleteBoard = () => {
    const client = useQueryClient();

    const onSuccess = () => {
        client.invalidateQueries(["getBoards"]);
    }

    const { mutateAsync, isLoading, error } = useMutation(deleteBoard, { onSuccess });
    return { deleteBoard: mutateAsync, isLoading, error }
}

export const useDeleteColumn = () => {

    const onError = (error) => {
        errorToast("Error updating board");
    }

    const { mutateAsync, isLoading, isSuccess, error } = useMutation(deleteColumn, { onError });
    return { deleteColumn: mutateAsync, isLoading,  deleteColumnSuccess: isSuccess, error }
}

export const useDeleteTask = () => {
    const client = useQueryClient();

    const onSuccess = () => {
        client.invalidateQueries(["getboardById"]);
    }


    const { mutateAsync, isLoading, error } = useMutation(deleteTask, { onSuccess });
    return { deleteTask: mutateAsync, deleteTaskLoading: isLoading, deleteTaskError: error }
}

export const useDeleteSubtask = () => {

    const onError = (error) => {
        errorToast("Error updating task");
    }

    const { mutateAsync, isLoading, isSuccess, error } = useMutation(deleteSubtask, { onError });
    return { deleteSubtask: mutateAsync, isLoading,  deleteSubtaskSuccess: isSuccess, error }
}
