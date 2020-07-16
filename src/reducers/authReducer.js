//exports a function
import { FETCH_USER } from "../actions/types";

//by default, state isn ull bc we don't know the user's login status
export default function (state = null, action) {
  //console.log(action);
  switch (action.type) {
    case FETCH_USER:
        //if action.payload = "" (i.e. no user logged in, then
        //the below return equates to false
        //otherwise, it returns the action payload
      return action.payload || false; 

    default:
      return state;
  }
}
