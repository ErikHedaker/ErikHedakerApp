﻿import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Dungeoncrawler.css';

function UUIDv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function ErrorOutput(error) {
    return (
        <div className="box"><em>{error.message}</em></div>
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
        this.exist = false;
        this.id = UUIDv4();
    }

    componentDidMount() {
        document.onkeydown = this.OnKeyDown.bind(this);
        document.onkeyup = this.OnKeyUp.bind(this);
        window.onbeforeunload = function () {
            console.log("Unloading, calling DELETE")
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
                <br /><br /><br />
                {this.ResetButton()}
            </div>
        );
    }

    URI() {
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

    ResetButton() {
        return (
            <Button variant="primary" onClick={ this.Reset.bind(this) }>Start new process on server</Button>
        );
    }

    OnKeyUp() {
        this.keyPressed = false;
    }

    OnKeyDown(event) {
        event = event || window.event;

        if (!this.keyPressed) {
            this.keyPressed = true;
            fetch(this.URI(), {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(String.fromCharCode(event.keyCode))
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(data => {
                this.setState({ output: this.TranformOutput(data) })
            }).catch(error => {
                console.log(error);
                this.setState({ output: ErrorOutput(error) });
            });
        }
    }

    ProcessDelete() {
        fetch(this.URI(), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
        }).catch(error => {
            console.log(error);
            this.setState({ output: ErrorOutput(error) });
        });
        this.exist = false;
    }

    Reset() {
        if (this.exist) {
            this.ProcessDelete();
            this.id = UUIDv4();
        }

        fetch(this.controller, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.id)
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            this.setState({ output: this.TranformOutput(data) })
        }).catch(error => {
            console.log(error);
            this.setState({ output: ErrorOutput(error) });
        });
        this.exist = true;
    }
}