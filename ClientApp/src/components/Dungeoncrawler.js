import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Standard.css';

export class Dungeoncrawler extends Component {
    static displayName = Dungeoncrawler.name;

    constructor(props) {
        super(props);
        this.state = { output: [] };
        this.keyPressed = false;
        this.controller = "api/Dungeoncrawler";
        this.id = "temp";
    }
    componentDidMount() {
        document.onkeydown = this.OnKeyDown.bind(this);
        document.onkeyup = this.OnKeyUp.bind(this);
        window.onbeforeunload = () => this.ProcessDelete();
        this.Reset();
    }
    componentWillUnmount() {
        this.ProcessDelete();
    }
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                {this.state.output}
            </div>
        );
    }
    URL() {
        return this.controller + "/" + this.id;
    }
    OnKeyUp() {
        this.keyPressed = false;
    }
    OnKeyDown(event) {
        event = event || window.event;

        if (!this.keyPressed) {
            this.keyPressed = true;
            fetch(this.URL(), {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(String.fromCharCode(event.keyCode))
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.status + " " + response.statusText);
                }
                return response.json();
            }).then(data => {
                this.setState({ output: this.TranformOutput(data) })
            }).catch(error => {
                this.setState({ output: this.ErrorOutput(error) });
                console.log(error.message);
            });
        }
    }
    ProcessDelete() {
        fetch(this.URL(), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw Error(response.status + " " + response.statusText);
            }
        }).catch(error => {
            this.setState({ output: this.ErrorOutput(error) });
            console.log(error.message);
        });
    }
    Reset() {
        this.setState({
            output: <div className="standard-box"><em>Loading, please wait</em></div> })
        fetch(this.URL()).then(response => {
            if (response.ok) {
                this.ProcessDelete();
            }
            this.id = UUIDv4();
            return fetch(this.controller, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.id)
            });
        }).then(response => {
            if (!response.ok) {
                throw Error(response.status + " " + response.statusText);
            }
            return response.json();
        }).then(data => {
            this.setState({ output: this.TranformOutput(data) });
        }).catch(error => {
            this.setState({ output: this.ErrorOutput(error) });
            console.log(error.message);
        });
    }
    ButtonReset() {
        return (
            <div className="standard-box">
                <Button variant="primary" onClick={this.Reset.bind(this)}>
                    Start new process on server
                </Button>
            </div>
        );
    }
    TranformOutput(data) {
        let OutputLines = lines => {
            return lines.map((line, index) => {
                return (
                    <p key={index}>
                        {line}
                    </p>
                );
            });
        };

        return (
            <div style={styleOutput}>
                {OutputLines(data)}
            </div>
        );
    }
    ErrorOutput(error) {
        let Explaination = message => {
            let code = message.substr(0, 3);
            if (code === "404") return "The server killed the Dungeoncrawler process after being idle for 60 seconds";
            if (code === "500") return "The server encountered an unexpected error and was unable to handle it";
            return "The server has responded with an http error code (4xx and 5xx)";
        };

        return (
            <div>
                <div className="standard-box">
                    <h5>
                        HTTP Error
                    </h5>
                    <br />
                    <em>
                        {error.message}
                    </em>
                </div>
                <br /><br /><br />
                <div className="standard-box">
                    {Explaination(error.message)}
                </div>
                <br /><br /><br />
                {this.ButtonReset()}
            </div>
        );
    }
}

function UUIDv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let styleOutput = {
    display: "inline-block",
    background: "black",
    border: "3px solid black",
    borderRadius: "10px",
    padding: "20px 12px 2px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "22px",
    lineHeight: "40%",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    color: "white"
}