import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
//if logged in, we dont want to display the LOGIN WITH GOOGLE header
//if not logged in, we do want to show it
class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <Redirect to="/" />
            <a href="/auth/google">Log in with Google</a>
          </li>
        );
      default:
        return (
          <li>
            <Redirect to="/dashboard" />
            {/* <a href="/api/logout">Logout</a> */}
          </li>
        );
    }
  }

  render() {
    console.log("header props");
    console.log(this.props);
    return (
      // <nav>
      <div style={{ "-webkit-app-region": "drag", "user-select": "none" }}>
        {/* className="nav-wrapper" */}
        {/* <a className="left brand-logo" style={{ marginLeft: 15 }} href="/">
            Atelier
          </a> */}
        {/* className="right" */}
        <ul>{this.renderContent()}</ul>
      </div>
      // </nav>
    );
  }
}

//pulls of the auth piece of state (see combineReducers) and returns it
//this will be added to the Header props using connect()
function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(Header);
