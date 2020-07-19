//we call this file index.js index.js so we can just call the reducers 
//directory, which routes from the index file. 
import authReducer from "./authReducer"
import { combineReducers } from "redux"; 
import taskReducer from "./taskReducer";

export default combineReducers({ //properties are the pieces of state each included reducer hangles 
    auth: authReducer, //authReducer handles the auth pieces of state
    tasks: taskReducer, 
})