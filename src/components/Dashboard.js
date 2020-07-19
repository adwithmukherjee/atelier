import React, { Component, createRef } from "react";
import "./dashboard.scss";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";
import { connect } from "react-redux";
import { findByLabelText } from "@testing-library/react";
const ReactDOM = require("react-dom");

const { ipcMain, ipcRenderer } = window.require("electron");

const taskArray = [
  {
    task: "email adwith",
    id: "fsdlkvha894",
  },
  {
    task: "write back to sameer on slack",
    id: "slfkuh2q34098",
  },
];

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      tasks: taskArray,
      // newTask: {
      //   task: "",
      //   id: "",
      // },
      pill: { toggle: true, id: 0 },
      textinput: false,
      hoverIndex: null,
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
      pill: { toggle: toggle, id: index },
    });
    ipcRenderer.send("toggle-pill", { x: x, y: y });
  };

  removeItem(id) {
    //remove from array
    this.state.tasks.splice(id, 1);

    //let newList = this.state.tasks.filter((item) => item.id !== id);
    this.setState({ ...this.state.tasks, tasks: this.state.tasks });
  }

  /*
  // FOR HANDLING LOCAL KEY EVENTS. implemented in componentDidMount. Look up the requisite keyCodes. 
  */
  handleKeyEvents = (event) => {
    switch (event.keyCode) {
      case 191: //forward slash
        console.log("forward slash");
        if (this.textBar.current) {
          //focus the text bar (if it exists)
          this.textBar.current.focus();
        }
        break;
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
              this.togglePill(this.state.hoverIndex, 400, 100, true);
            }
          } else {
            this.togglePill(this.state.hoverIndex, 400, 200, false);
          }
        }
        break;
      case 16: //shift, but should be E
        if (this.state.hoverIndex >= 0) {
          this.removeItem(this.state.hoverIndex);
          if (this.state.hoverIndex == this.state.tasks.length) {
            console.log("too big");
            this.setState({
              ...this.state.hoverIndex,
              hoverIndex: 0,
            });
          }
        }
        break;

      default:
        break;
    }
  };

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyEvents);

    console.log("mounting");
    ipcRenderer.on("text-input", (event, arg) => {
      //using this to trigger command J or command P and either resize to fit text input
      //or make it a pill with the first task
      console.log(arg);
      if (arg) {
        ipcRenderer.send("toggle-pill", { x: 500, y: 500 });
      } else {
        this.setState({
          ...this.state.pill,
          pill: { toggle: true, id: 0 },
        });
      }
      this.setState({
        textinput: arg,
      });
    });

    ipcRenderer.on("tabbed", (event, arg) => {
      //use this to be able to remove the task you were working on and move on to
      //the next one in pill view GLOBALLY
      if (this.state.pill.toggle) {
        this.removeItem(this.state.hoverIndex);
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
      task = this.textBar.current.value,
      id = new Date().getTime();
    this.setState(
      {
        tasks: [
          ...tasks,
          {
            task,
            id,
          },
        ],
      },
      () => {
        this.textBar.current.value = "";
      }
    );
    if (this.state.textinput) {
      ipcRenderer.send("hide-pill", null);
    }
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }
  checkActive() {
    if (document.getActiveElement) {
      console.log(document.getActiveElement);
      console.log(document.getActiveElement.tagName);
      if (document.getActiveElement.tagName === "INPUT") {
        // console.log("hi");
      }
    }
  }

  render() {
    const {
      tasks,
      pill,
      textinput,
      hoverIndex,
      autoToggle,
      taskListFocus,
    } = this.state;
    setInterval(this.checkActive, 300);

    //this.checkActive();

    return (
      <div
        style={{ WebkitAppRegion: "drag", userSelect: "none", margin: 0 }}
        className="fill"
      >
        {textinput ? (
          <div style={{ WebkitAppRegion: "drag", userSelect: "none" }}>
            <form onSubmit={this.handleSubmit}>
              <label>
                <input
                  autoFocus={this.state.autoToggle}
                  type="text"
                  ref={this.textBar}
                  // value={this.textBar.value}
                  // onChange={this.handleChange}
                  placeholder="what's on your mind?"
                />
              </label>
              {/* <button type="submit">Submit</button> */}
            </form>
          </div>
        ) : (
          <div>
            {!pill.toggle ? (
              <div style={{ WebkitAppRegion: "drag", userSelect: "none" }}>
                <form onSubmit={this.handleSubmit}>
                  <label>
                    <input
                      //  autoFocus={this.state.autoToggle}
                      type="text"
                      ref={this.textBar}
                      placeholder="what's on your mind?"
                    />
                  </label>
                </form>
                <ul ref={this.taskList}>
                  {tasks.map((task, index) => (
                    <li
                      className="entry"
                      style={{
                        backgroundColor:
                          hoverIndex == index ? "#5A4F5E" : "#211B23",
                      }}
                      onMouseEnter={() => {
                        this.setState({ ...hoverIndex, hoverIndex: index });
                        console.log(index);
                      }}
                      onClick={() => {
                        //this.removeItem(task.id);
                        this.togglePill(index, 400, 100, true);
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
                          marginLeft: 52,
                          marginTop: 0,
                        }}
                      >
                        {`${task.task}`}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                style={{
                  WebkitAppRegion: "drag",
                  userSelect: "none",
                  color: "#FCF9FD",
                }}
                onClick={() => {
                  this.togglePill(0, 800, 300, false);
                }}
              >
                <ul>
                  {pill.id < this.state.tasks.length && pill.id != null
                    ? `Task: ${tasks[pill.id].task} ID: ${pill.id}`
                    : ``}
                </ul>
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

function mapStateToProps({ tasks }) {
  return { tasks };
}
export default connect(mapStateToProps)(Dashboard);
