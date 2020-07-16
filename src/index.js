//this is the root file. It contains all the data-layer control considerations
//for the application (Redux). Direct child is App.js, which
//controls rendering with React Router.

import 'materialize-css/dist/css/materialize.min.css'
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk"

import App from "./components/App";
import reducers from "./reducers"


//first argument is a combined reducer, second argument is initial state of application, third is middlewares
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

//react DOM takes two arguments: the root component, and where in the DOM we want the root to render
//root component is instance of App: <App/>
//location of root component is the <div id = "root"> call in public/index.html. this is what querySelector is referring to
    //App is wrapped by Provider, which is linked to Redux Store, and provides Store data to all of the App's children. 
ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,

  document.querySelector("#root")
);

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//REDUX: manages state in our application.

//two reducers in our app: authReducer to record if authenticated
//and notesReducer to record a list of notes user has created.

//HOW REDUX WORKS:
//Redux Store at the top, where all of our state exists.
// From a react Component, we call an Action Creator, which
//returns an Action, which is sent to all our reducers, which
//update all the state in our Redux Store, after which
//all that state is send to the React Component again to update it.

//IN DEPTH::
//Inside index.js we create a Redux Store and a Provider tag.
//Provider is a component that makes the store accessibl to every component in the App/
//it's a React Component provided to us by react-redux library
//glue between React and Redux
//Lower Level components (like NotesList) can access global data in Store because of Provider tag
