import axios from "axios";
import { FETCH_USER, FETCH_TASKS } from "./types";


export const fetchUser = () => async (dispatch) => {
  //making a get request to our backend, to the /api/current_user route

  //when the fetchUser action creator returns a function, Redux Thunk automatically
  //calls that function with the dispatch argument.
  //remember, dispatch is one catch-all function that takes in an Action object and sends to reducers. 
  //this allows us to wait until the get function is asynchronously completed
  
    const res = await axios.get("/api/current_user")
    dispatch({type: FETCH_USER, payload: res.data })
    //dispatch an action with payload of the api's response

};


export const fetchTasks = () => async (dispatch) => {
  const res = await axios.get("/tasks")
  dispatch({type: FETCH_TASKS, payload: res.data})
}

export const submitTask = (values) => async (dispatch) => {
  await axios.post("/tasks", values)
}

//we're only putting the relative path to
//our backend here.

//in dev, we make use of the proxy to forward request to api.
//in prod, there's no proxy or React app so it goes directly to api backend

//we set up the proxy rule for dev in setupProxy.js
