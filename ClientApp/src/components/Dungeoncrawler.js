import React, { Component } from 'react';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Styles.css';

export class Dungeoncrawler extends Component {
    static displayName = Dungeoncrawler.name;
    constructor(props) {
        super(props);
        this.state = { output: [] };
        this.keyPressed = false;
        this.controller = "api/Dungeoncrawler";
        this.id = "";
        this.inputAllow = true;
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
        let ButtonMobile = (key) => {
            return (
                <Button className="dungeoncrawler-controls-button" onClick={this.ProcessUpdate.bind(this, key)}>
                    {key}
                </Button>
            );
        };

        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    {this.state.output}
                </div>
                <div style={{ position: "absolute", bottom: "0", left: "0", width: "100%", display: "flex", justifyContent: "center" }}>
                    <div className="monospace-text dungeoncrawler-controls">
                        <div style={{ textAlign: "center", display: "table", marginTop: "auto" }}>
                            {ButtonMobile("W")}
                            <br />
                            {ButtonMobile("A")}
                            {ButtonMobile("S")}
                            {ButtonMobile("D")}
                        </div>
                        <div style={{ marginTop: "auto" }}>
                            <div style={{ textAlign: "center", marginBottom: "1px" }}>
                                <InputManual
                                    InputAllow={this.InputAllow.bind(this)}
                                    InputBlock={this.InputBlock.bind(this)}
                                    ProcessUpdate={this.ProcessUpdate.bind(this)}
                                />
                            </div>
                            <div style={{ textAlign: "center", width: "100%" }}>
                                {ButtonMobile("1")}
                                {ButtonMobile("2")}
                                {ButtonMobile("3")}
                                {ButtonMobile("4")}
                                {ButtonMobile("5")}
                            </div>
                        </div>
                        <div style={{ textAlign: "center", display: "table", marginTop: "auto" }}>
                            {ButtonMobile("E")}
                            <br />
                            {ButtonMobile("F")}
                            {ButtonMobile("G")}
                            {ButtonMobile("H")}
                        </div>
                    </div>
                </div>
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

        if (!this.keyPressed && this.id && this.inputAllow) {
            this.keyPressed = true;
            this.ProcessUpdate(String.fromCharCode(event.keyCode));
        }
    }
    InputAllow() {
        this.inputAllow = true;
    }
    InputBlock() {
        this.inputAllow = false;
    }
    ProcessUpdate(value) {
        let data = JSON.stringify(value);
        fetch(this.URI(), {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
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
    ProcessStart() {
        fetch(this.controller, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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

        this.ProcessStart();
    }
    ButtonReset() {
        return (
            <div className="box-static">
                <Button className="button-default" onClick={this.Reset.bind(this)}>
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

class InputManual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }
    render() {
        return (
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText className="dungeoncrawler-manual-input">
                        Manual
                    </InputGroupText>
                </InputGroupAddon>
                <Input
                    className="dungeoncrawler-manual-input"
                    onFocus={this.props.InputBlock.bind(this)}
                    onBlur={this.props.InputAllow.bind(this)}
                    onChange={this.HandleChange.bind(this)}
                    value={this.state.value}
                    autoComplete="off"
                    style={{ width: "0px" }}
                />
                <InputGroupAddon addonType="append">
                    <Button className="dungeoncrawler-manual-input" onClick={this.HandleClick.bind(this)}>
                        Input
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        );
    }
    HandleClick() {
        this.props.InputAllow();
        this.props.ProcessUpdate(this.state.value);
        this.setState({ value: "" });
    }
    HandleChange(event) {
        this.setState({ value: event.target.value });
    }
}