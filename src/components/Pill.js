import React, {Component} from "react"
const { ipcRenderer } = window.require("electron")


class Pill extends Component { 
    state = {
        task : ""
    }

    componentDidMount() {
        ipcRenderer.on('task', (event, arg) => {
            this.setState({
                task: arg
            })
        })
    }

    render() {
        return(
            <div>
                {this.state.task}
            </div>
        )
    }
}

export default Pill; 