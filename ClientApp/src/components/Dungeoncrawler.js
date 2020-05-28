import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Dungeoncrawler.css';

function UUIDv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export class Dungeoncrawler extends Component {
    static displayName = Dungeoncrawler.name;

    constructor(props) {
        super(props);
        this.state = {
            output: <div className="box"><em>Loading, please wait.</em></div>,
        };
        this.keyPressed = false;
        this.controller = "api/Dungeoncrawler";
        this.input = "";
        this.id = UUIDv4();
    }

    componentDidMount() {
        document.onkeydown = this.OnKeyDown.bind(this);
        document.onkeyup = this.OnKeyUp.bind(this);
        window.onbeforeunload = function () {
            this.ProcessDelete();
        }
        this.Reset();
    }

    componentWillUnmount() {
        this.ProcessDelete();
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                {this.state.output}
                <br />
                <div className="box">
                    {this.id}
                </div>
            </div>
        );
    }

    URL() {
        return this.controller + "/" + this.id;
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
            <div className="box output">
                {OutputLines(data)}
            </div>
        );
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
                console.log(error.response.data);
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
            console.log(error.response.data);
        });
    }

    Reset() {
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
            })
        }).then(response => {
            if (!response.ok) {
                throw Error(response.status + " " + response.statusText);
            }
            return response.json();
        }).then(data => {
            this.setState({ output: this.TranformOutput(data) })
        }).catch(error => {
            this.setState({ output: this.ErrorOutput(error) });
            console.log(error.response.data);
        });
    }

    ErrorOutput(error) {
        return (
            <div>
                <div className="box">
                    <h5>
                        HTTP Error
                    </h5>
                    <br />
                    <p>
                        <em>{error.message}</em>
                    </p>
                </div>
                <br /><br /><br />
                <div className="box" style={{ textAlign: "left" }}>
                    <p>
                        The server has responded with an http error code (4xx and 5xx).
                        <br />
                        If it's 404 then the likely reason is that the process was automatically killed by the server for being idle for 60 seconds.
                        <br />
                        If it's 500 then the process is unresponsive, due to being killed prior or the server OS encountered a problem handling the process.
                    </p>
                </div>
                <br /><br /><br />
                <div className="box">
                    <p>
                        Press the button below to attempt to fix it.
                    </p>
                    <Button variant="primary" onClick={this.Reset.bind(this)}>
                        Start new process on server
                    </Button>
                </div>
            </div>
        );
    }
}