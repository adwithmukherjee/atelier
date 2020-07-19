import { FETCH_TASKS, DELETE_TASK } from "../actions/types"

export default function (state = [],action){
 
    switch (action.type) {
        case FETCH_TASKS: 
            return action.payload;
        case DELETE_TASK: 
            console.log("delete tasks:")
            console.log(action.payload)
            const newTasks = state.filter((element) => element._id !== action.payload._id)
            console.log(newTasks)
            return newTasks;
        
        default: 
            
            return state

    }
}