import React, { Component, createRef } from "react";
import "./dashboard.scss";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";
import { connect } from "react-redux";

import * as actions from "../actions";

import { findByLabelText } from "@testing-library/react";
import styled from "styled-components";

const ReactDOM = require("react-dom");

const { ipcMain, ipcRenderer } = window.require("electron");

const taskArray = [
  {
    name: "email adwith",
    id: "fsdlkvha894",
  },
  {
    name: "write back to sameer on slack",
    id: "slfkuh2q34098",
  },
];

const Input = styled.input`
  borderbottomwidth: 0;
  bordercolor: #211b23;
  color: #fcf9fd;
  marginleft: 26;
  marginright: 26;
  verticalalign: center;
  boxshadow: none;
  underlinecolor: transparent;
`;

const pillView = { x: 324, y: 84 };
const inputView = { x: 700, y: 60 };
const mainView = { x: 600, y: 250 };

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      // newTask: {
      //   task: "",
      //   id: "",
      // },
      pill: { toggle: true, taskName: "" },
      textinput: false,
      hoverIndex: null,
      hoverId: null, 
      autoToggle: true,
      taskListFocus: false,
      input: "",
      
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.textBar = createRef();
    this.taskList = createRef();
  }
  togglePill = (index, x, y, toggle) => {
    this.setState({
      ...this.state.pill,
      pill: { toggle: toggle, id: index,}
    });
    ipcRenderer.send("toggle-pill", { x: x, y: y });
  };

  removeItem(id) {


   
    this.props.deleteTask({_id:id})
    this.props.fetchTasks();

    const newTasks = this.state.tasks.filter((element) => element._id !== id)
    const tasks = this.props.listOfTasks.length === 0 ? newTasks : this.props.listOfTasks
    

    //let newList = this.state.tasks.filter((item) => item.id !== id);
    this.setState({ tasks });
  }

  /*
  // FOR HANDLING LOCAL KEY EVENTS. implemented in componentDidMount. Look up the requisite keyCodes. 
  */
  handleKeyEvents = (event) => {
    switch (event.keyCode) {
      // case 74: //forward slash
      //   console.log("forward slash");
      //   if (this.textBar.current) {
      //     //focus the text bar (if it exists)
      //     this.textBar.current.focus();
      //   }
      //   break;
      case 40: //down
        if (!this.state.pill.toggle) {
          this.setState({
            ...this.state.hoverIndex,
            hoverIndex:
              this.state.hoverIndex == null
                ? 0
                : this.state.hoverIndex >= this.state.tasks.length - 1
                ? this.state.tasks.length - 1
                : this.state.hoverIndex + 1,
          });
        }
        //console.log(hoverIndex)
        // console.log("Move down hotkey called!", this.state.hoverIndex);
        break;
      case 38: //up
        if (!this.state.pill.toggle) {
          this.setState({
            ...this.state.hoverIndex,
            hoverIndex:
              this.state.hoverIndex == null || this.state.hoverIndex <= 0
                ? 0
                : this.state.hoverIndex - 1,
          });
          //console.log(hoverIndex)
          console.log("Move up hotkey called!", this.state.hoverIndex);
        }
        break;
      case 9: //tab
        if (this.state.tasks.length > 0) {
          if (!this.state.pill.toggle) {
            if (this.state.hoverIndex != null) {
              //this toggle the input only view (command P)
              this.togglePill(
                this.state.hoverIndex,
                pillView.x,
                pillView.y,
                true
              );
            }
          } else {
            this.togglePill(
              this.state.hoverIndex,
              mainView.x,
              mainView.y,
              false
            );
          }
        }
        break;
      case 16: //shift, but should be E
        
          
          this.removeItem(this.state.hoverId);
          
        
        break;

      default:
        break;
    }
  };

  componentWillReceiveProps(){
    this.props.fetchTasks();
    this.setState({
      tasks: this.props.listOfTasks
    })
  }



  componentDidMount() {

  
    document.addEventListener("keyup", this.handleKeyEvents);

    
    ipcRenderer.on("text-input", (event, arg) => {
      //using this to trigger command J or command P and either resize to fit text input
      //or make it a pill with the first task
      console.log(arg);
      if (arg) {
        //sets the size for the pill
        ipcRenderer.send("toggle-pill", { x: inputView.x, y: inputView.y });
      } else {
        if (this.state.tasks.length == 0) {
          this.togglePill(0, mainView.x, mainView.y, false);
        } else {
          this.togglePill(
            this.state.hoverIndex == null ? 0 : this.state.hoverIndex,
            pillView.x,
            pillView.y,
            true
          );
        }
      }
      this.setState({
        textinput: arg,
      });
    });

    ipcRenderer.on("tabbed", (event, arg) => {
      //use this to be able to remove the task you were working on and move on to
      //the next one in pill view GLOBALLY
      if (this.state.pill.toggle) {
        this.removeItem(this.state.hoverId);
      }
      if (this.state.hoverIndex == this.state.tasks.length) {
        console.log("too big");
        this.setState({
          ...this.state.hoverIndex,
          hoverIndex: 0,
        });
        this.setState({
          ...this.state.pill,
          pill: { toggle: true, id: this.state.hoverIndex },
        });
      }
      if (this.state.tasks.length == 0) {
        ipcRenderer.send("hide-pill", null);
      }
    });
    ipcRenderer.on("escaping", (event, arg) => {
      //use this to be able to remove the task you were working on and move on to
      //the next one in pill view GLOBALLY
      console.log("leaving");
      this.setState({
        ...this.state.pill,
        pill: { toggle: true, id: null },
      });
    });
    if (document.activeElement === ReactDOM.findDOMNode(this.textBar.current)) {
      console.log("true");
    }
  }



  handleSubmit(e) {
    e.preventDefault();
    const { tasks } = this.state,
      name = this.textBar.current.value,
      id = new Date().getTime();

  if (this.textBar.current.value) {
    this.props.submitTask({name})
    this.textBar.current.value = "";
    this.props.fetchTasks(); 

    //const newTasks = this.props.listOfTasks ? this.props.listOfTasks : [...tasks, { name, id}]
    this.setState(
      {
        tasks: this.props.listOfTasks
      },
      () => {
        this.textBar.current.value = "";
      }
    );
  }


    if (this.state.textinput) {
      ipcRenderer.send("hide-pill", null);
    }
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  onListLoad = () => {
    
    this.props.fetchTasks()
    this.setState({tasks: this.props.listOfTasks})

  }

  

  render() {
    
    
    
    const {
      tasks,
      pill,
      textinput,
      hoverIndex,
      hoverId,
      autoToggle,
      taskListFocus,
    } = this.state;

    //this.checkActive();

    return (
      <div
        style={{ WebkitAppRegion: "drag", userSelect: "none", margin: 0 }}
        className="fill"
      >
        {textinput ? (
          <div>
            <form
              onSubmit={this.handleSubmit}
              style={{
                marginLeft: "26px",
                marginRight: "26px",
                marginTop: "6px",
                //verticalAlign: "center",
                WebkitAppRegion: "drag",
                userSelect: "none",
              }}
            >
              <input
                autoFocus={this.state.autoToggle}
                type="text"
                style={{
                  borderBottomWidth: 0,
                  borderColor: "#211B23",
                  color: "#FCF9FD ",
                  fontSize: 24,
                  boxShadow: "none",
                  underlineColor: "transparent",
                }}
                ref={this.textBar}
                placeholder="what's on your mind?"
              />
              {/* <button type="submit">Submit</button> */}
            </form>
          </div>
        ) : (
          <div>
            {!pill.toggle ? (
              <div
                className="fill"
                style={{
                  WebkitAppRegion: "drag",
                  userSelect: "none",
                  overflowX: "hidden",
                  width: mainView.x,
                }}
              >
                <form onSubmit={this.handleSubmit}>
                  <label>
                    <input
                      //  autoFocus={this.state.autoToggle}
                      type="text"
                      ref={this.textBar}
                      className="input"
                      placeholder="what's on your mind?"
                      style={{
                        overflowX: "hidden",

                        borderBottomWidth: 0,
                        borderColor: "#211B23",
                        color: "#FCF9FD ",
                        marginLeft: 26,
                        marginRight: 0,
                        marginTop: 0,
                        marginBottom: 0,
                        borderBottomWidth: 0,
                        width: mainView.x,
                        verticalAlign: "center",
                        boxShadow: "none",
                        underlineColor: "transparent",
                      }}
                    />
                  </label>
                </form>

                <ul style={{ marginTop: 0 }} ref={this.taskList} componentdidmount = {this.onListLoad} >
                  {tasks.map((task, index) => (
                    <li
                      style={{
                        backgroundColor: hoverIndex === index ? "#5A4F5E" : "#211B23",

                      }}
                      onMouseEnter={() => {
                        this.setState({ hoverIndex: index });
                        console.log(this.state.hoverIndex)
                        
                      }}
                      onMouseOver = {() => {

                        this.setState({hoverId: task._id})
                        console.log(this.state.hoverId)
                      }}
                      
                      onClick={() => {
                        //this.removeItem(task.id);
                        this.togglePill(index, pillView.x, pillView.y, true);
                      }}

                   

                    >
                      <p
                        style={{
                          display: "flex",
                          color: "#FCF9FD ",
                          verticalAlign: "center",
                          lineHeight: "36px",
                          //  justifyContent: "center",
                          //alignItems: "center",
                          marginLeft: 26 * 1.5,
                          marginRight: 0,
                          marginBottom: 0,
                          marginTop: 0,
                        }}
                      >
                        {`${task.name}`}
                      </p>
                    </li>

                  ))}
                </ul>
              </div>
            ) : (
              <div
                className="fill"
                style={{
                  WebkitAppRegion: "drag",
                  userSelect: "none",
                  color: "#FCF9FD",
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  //verticalAlign: "center",
                  textAlign: "center",
                  borderWidth: 8,
                  fontSize: 18,
                  // lineHeight: 60,
                }}
                onClick={() => {
                  //this opens the pill view on click
                  this.togglePill(0, mainView.x, mainView.y, false);
                }}
              >

               

                {pill.id < this.state.tasks.length && pill.id != null
                  ? `${tasks[pill.id].name}`
                  : ``}

              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

// const taskStyle = (hover) => ({
//   width: `200px`,
//   height: `200px`,
//   backgroundColor: `#1DA1F2`,
//   backgroundImage: isPreview ? "url(/path/to/image.jpg)" : "none",
// });

// const Option = styled.div<{ highlighted?: boolean }>`
//   padding: 8px;
//   font-size: 13px;
//   color: #fff;
//   background: ${({ highlighted }) =>
//     highlighted ? "rgba(147, 134, 108, 0.6)" : "transparent"};
// `;



function mapStateToProps({auth, tasks}){
  return { listOfTasks: tasks, auth }

}
export default connect(mapStateToProps, actions)(Dashboard);
