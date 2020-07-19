import { FETCH_TASKS, DELETE_TASK } from "../actions/types"

export default function (state = [],action){
 
    switch (action.type) {
        case FETCH_TASKS: 
            return action.payload;
        case DELETE_TASK: 
        
            const newTasks = state.filter((element) => element._id !== action.payload._id)

            return newTasks;
        default: 
            
            return state

    }
}