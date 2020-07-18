import React, { Component } from "react";
import "./dashboard.scss";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";

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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log("mounting");
    ipcRenderer.on("text-input", (event, arg) => {
      console.log(arg);
      this.setState({
        textinput: arg,
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { tasks } = this.state,
      task = this.refs.task.value,
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
        this.refs.task.value = "";
      }
    );
  }

  removeItem(id) {
    //remove from array
    let newList = this.state.tasks.filter((item) => item.id !== id);
    this.setState({ tasks: newList });
  }

  render() {
    const { tasks, pill, textinput, hoverIndex, autoToggle } = this.state;
    const togglePill = (index, x, y, toggle) => {
      this.setState({
        ...pill,
        pill: { toggle: toggle, id: index },
      });
      ipcRenderer.send("toggle-pill", { x: x, y: y });
    };

    const keyMap = {
      deleteNode: "del",
      moveDown: "down",
      moveUp: "up",
      pillView: "enter",
      type: "/", //THIS IS SUPPOSED TO FOCUS ON TEXT INPUT BUT DOESN'T
    };
    const handlers = {
      moveUp: (event) => {
        this.setState({
          ...hoverIndex,
          hoverIndex:
            this.state.hoverIndex == null || this.state.hoverIndex <= 0
              ? 0
              : this.state.hoverIndex - 1,
        });
        //console.log(hoverIndex)
        console.log("Move up hotkey called!", this.state.hoverIndex);
      },
      moveDown: (event) => {
        this.setState({
          ...hoverIndex,
          hoverIndex:
            this.state.hoverIndex == null
              ? 0
              : this.state.hoverIndex >= this.state.tasks.length - 1
              ? this.state.tasks.length - 1
              : this.state.hoverIndex + 1,
        });
        //console.log(hoverIndex)
        console.log("Move down hotkey called!", this.state.hoverIndex);
      },
      pillView: (event) => {
        if (hoverIndex) {
          togglePill(hoverIndex, 400, 100, true);
        }
      },
      type: (event) => {
        console.log("fired");
        this.setState({
          ...autoToggle,
          autoToggle: true,
        });
      },
    };

    return (
      <HotKeys
        //focused={false}
        //attach={window}
        keyMap={keyMap}
        handlers={handlers}
        className="hotkey"
      >
        {textinput ? (
          <div style={{ WebkitAppRegion: "drag", userSelect: "none" }}>
            <form onSubmit={this.handleSubmit}>
              <label>
                <input
                  autoFocus={this.state.autoToggle}
                  type="text"
                  ref="task"
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
                      autoFocus={this.state.autoToggle}
                      type="text"
                      ref="task"
                      placeholder="what's on your mind?"
                    />
                  </label>
                </form>
                <ul>
                  {tasks.map((task, index) => (
                    <li
                      style={{
                        backgroundColor: hoverIndex == index ? "red" : "white",
                      }}
                      onMouseEnter={() => {
                        this.setState({ ...hoverIndex, hoverIndex: index });
                        console.log(index);
                      }}
                      onClick={() => {
                        //this.removeItem(task.id);
                        togglePill(index, 400, 100, true);
                      }}
                    >{`Task: ${task.task} ID: ${task.id}`}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                style={{ WebkitAppRegion: "drag", userSelect: "none" }}
                className="task"
                onClick={() => {
                  togglePill(0, 800, 300, false);
                }}
              >
                <ul>{`Task: ${tasks[pill.id].task} ID: ${pill.id}`}</ul>
              </div>
            )}
          </div>
        )}
      </HotKeys>
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

export default Dashboard;
