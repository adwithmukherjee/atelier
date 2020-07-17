//used for top-level rendering layer control (react Router)

//if the class exports a component, upper case the first letter
import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Header from "./Header"; 
import { connect } from 'react-redux'; 
import * as actions from '../actions' 


const Dashboard = () => <h2> Dashboard - here go the notes</h2>;
const Landing = () => <div style = {{textAlign: "center"}}><h1 > Welcome to Atelier! </h1><h3>please login</h3></div>;

class App extends Component{
  //we use class-based so we can access these lifetime cycle methods 
  //it is here we make our initial ajax requests. 
  componentDidMount() {
    this.props.fetchUser(); 
 
  }

  

  render() {
    return (
    <div className = "container">
     
      <BrowserRouter>
        <div>
          
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/dashboard" component={Dashboard} />
          
        </div>
      </BrowserRouter>
    </div>
    );
  }
};

//connect is used to connect REact and Redux. 
//basically adds actions to the props of App class
export default connect(null, actions)(App);
