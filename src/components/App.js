//used for top-level rendering layer control (react Router)

//if the class exports a component, upper case the first letter
import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Dashboard from "./Dashboard";
import { connect } from "react-redux";
import * as actions from "../actions";

//const Dashboard = () => (
// <h2 style={{ "-webkit-app-region": "drag" }}>
//    Dashboard - here go the notes
//  </h2>
//);

const Landing = () => (
  <div
    style={{
      textAlign: "center",
      "-webkit-app-region": "drag",
      "user-select": "none",
    }}
  >
    {/* <h1> Welcome to Atelier! </h1> */}
    {/* <h3>please login</h3> */}
  </div>
);

const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => <li>{number}</li>);

class App extends Component {
  //we use class-based so we can access these lifetime cycle methods
  //it is here we make our initial ajax requests.
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <body style={{ "-webkit-app-region": "drag", "user-select": "none" }}>
        <div
          className="container"
          style={{ "-webkit-app-region": "drag", "user-select": "none" }}
        >
          <BrowserRouter
            style={{ "-webkit-app-region": "drag", "user-select": "none" }}
          >
            <div
              style={{ "-webkit-app-region": "drag", "user-select": "none" }}
            >
              <Header />
              <Route exact path="/" component={Landing} />
              <Route exact path="/dashboard" component={Dashboard} />
            </div>
          </BrowserRouter>
        </div>
      </body>
    );
  }
}

//connect is used to connect REact and Redux.
//basically adds actions to the props of App class
export default connect(null, actions)(App);

//https://stackoverflow.com/questions/39769513/react-form-to-submit-object-which-is-then-pushed-to-array
//https://reactjs.org/docs/forms.html
