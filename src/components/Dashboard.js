import React, { Component } from "react";
import "./dashboard.scss";

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
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    //  this.handleInput = this.handleInput.bind(this);
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

  render() {
    const { tasks } = this.state;
    return (
      <div style={{ "-webkit-app-region": "drag", "user-select": "none" }}>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" ref="task" placeholder="what's on your mind?" />
          </label>
          <button type="submit">Submit</button>
        </form>
        <ul>
          {tasks.map((task) => (
            <div className="task" onClick={console.log("hi")}>
              <li>{`Task: ${task.task} ID: ${task.id}`}</li>
            </div>
          ))}
        </ul>
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

export default Dashboard;
