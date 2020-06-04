import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Styles.css';

export class Dungeoncrawler extends Component {
    static displayName = Dungeoncrawler.name;

    constructor(props) {
        super(props);
        this.state = { output: [] };
        this.keyPressed = false;
        this.controller = "api/Dungeoncrawler";
        this.id = "";
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
    URI() {
        return this.controller + "/" + this.id;
    }
    OnKeyUp() {
        this.keyPressed = false;
    }
    OnKeyDown(event) {
        event = event || window.event;

        if (!this.keyPressed && this.id) {
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
        fetch(this.URI(), {
            method: 'DELETE'
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
            output:
                <div className="box-static">
                    <em>
                        Loading, please wait
                    </em>
                </div>
        });

        if (this.id) {
            this.ProcessDelete();
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
                throw Error(response.status + " " + response.statusText);
            }
            return response.json();
        }).then(body => {
            this.setState({ output: this.TranformOutput(body.output) });
            this.id = body.id;
        }).catch(error => {
            this.setState({ output: this.ErrorOutput(error) });
            console.log(error.message);
        });
    }
    ButtonReset() {
        return (
            <div className="box-static">
                <Button variant="primary" onClick={this.Reset.bind(this)}>
                    Start new process on server
                </Button>
            </div>
        );
    }
    TranformOutput(data) {
        const OutputLines = lines => {
            return lines.map((line, index) => {
                return (
                    <p key={index}>
                        {line}
                    </p>
                );
            });
        };

        return (
            <div className="dungeoncrawler-output-responsive">
                {OutputLines(data)}
            </div>
        );
    }
    ErrorOutput(error) {
        const Explaination = message => {
            const code = message.substr(0, 3);
            if (code === "404") return "The server killed the Dungeoncrawler process after being idle for 60 seconds";
            if (code === "500") return "The server encountered an unexpected error and was unable to handle it";
            return "The server has responded with an http error code (4xx and 5xx)";
        };

        return (
            <div>
                <div className="box-static">
                    <h5>
                        HTTP Error
                    </h5>
                    <br />
                    <em>
                        {error.message}
                    </em>
                </div>
                <br /><br /><br />
                <div className="box-static">
                    {Explaination(error.message)}
                </div>
                <br /><br /><br />
                {this.ButtonReset()}
            </div>
        );
    }
}