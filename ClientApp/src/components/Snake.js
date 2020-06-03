import React, { Component } from 'react';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Standard.css';

export class Snake extends Component {
    static displayName = Snake.name;

    constructor(props) {
        super(props);
        this.config = {
            width: 17,
            height: 17,
            length: 5,
            food: 2,
            interval: 100
        };
        this.toggleDisplay = true;
        this.Restart();
    }

    componentDidMount() {
        document.onkeydown = this.KeyPress.bind(this);
    }

    render() {
        return (
            <div style={{ textAlign: "center" }}>
                {this.DisplayGame()}
                <br />
                <div>
                    <div className="standard-box" style={style.Text}>
                        Length: {this.player.body.length}
                    </div>
                </div>
                <div style={{ position: "fixed", left: "39%", bottom: "0" }}>
                    {this.MovementPanel()}
                    {this.ControlPanel()}
                </div>
                <ConfigurationFormInput config={this.config} SnakeSet={this.SnakeSet.bind(this)} />
            </div>
        );
    }

    Restart() {
        clearInterval(this.intervalID);
        this.width = this.config.width;
        this.height = this.config.height;
        this.player = new Player(new Vector2i(1, Math.floor(this.height / 2)), this.config.length);
        this.obstacles = BorderObstacles(this.width, this.height);
        this.foodAmount = this.config.food;
        this.food = [];
        this.direction = "east";
        this.directionPrev = this.direction;
        this.intervalID = setInterval(this.Update.bind(this), this.config.interval);
    }

    ToggleDisplay() {
        this.toggleDisplay = !this.toggleDisplay;
        this.forceUpdate();
    }

    KeyPress(event) {
        event = event || window.event;
        const key = String.fromCharCode(event.keyCode);

        switch (key) {
            case "W":
            case "D":
            case "S":
            case "A":
                this.Movement(key);
                break;
            case "R":
                this.Restart();
                break;
            case "F":
                this.ToggleDisplay();
                break;
            default:
                break;
        }
    }

    Movement(key) {
        const opposite = {
            "north": "south",
            "east": "west",
            "south": "north",
            "west": "east"
        };
        const directions = {
            "W": "north",
            "D": "east",
            "S": "south",
            "A": "west"
        };

        if (directions[key] !== opposite[this.directionPrev]) {
            this.direction = directions[key];
        }
    }

    MovementPanel() {
        return (
            <div className="standard-box" style={Object.assign({}, style.Text, { textAlign: "center", margin: "0px 2px" })}>
                <h2 style={{ fontSize: "24px" }}>
                    <strong>
                        Movement
                    </strong>
                </h2>
                <br />
                {ButtonFunction("[W]", this.Movement.bind(this, "W"), { margin: "1px" })}
                <br />
                {ButtonFunction("[A]", this.Movement.bind(this, "A"), { margin: "1px" })}
                {ButtonFunction("[S]", this.Movement.bind(this, "S"), { margin: "1px" })}
                {ButtonFunction("[D]", this.Movement.bind(this, "D"), { margin: "1px" })}
            </div>
        );
    }

    ControlPanel() {
        return (
            <div className="standard-box" style={Object.assign({}, style.Text, { textAlign: "center", margin: "0px 2px" })}>
                <h2 style={{ fontSize: "24px" }}>
                    <strong>
                        Controls
                    </strong>
                </h2>
                <br />{ButtonFunction("[R]", this.Restart.bind(this),       { margin: "1px" })} Restart
                <br />{ButtonFunction("[F]", this.ToggleDisplay.bind(this), { margin: "1px" })} Display
            </div>
        );
    }

    Update() {
        this.player.Move(this.direction);
        this.directionPrev = this.direction;
        for (let i = this.food.length - 1; i >= 0; i--) {
            if (this.food[i].Equal(this.player.Head())) {
                this.food.splice(i, 1);
                this.player.Grow();
            }
        }
        while (this.food.length < this.foodAmount &&
            (this.width - 2) * (this.height - 2) > this.food.length + this.player.body.length) {
            this.AddRandomFood();
        }
        if (CollisionCheckArrayVector2i([this.player.Head()], this.obstacles) ||
            CollisionCheckArrayVector2i([this.player.Head()], this.player.body.slice(1))) {
            clearInterval(this.intervalID);
        }
        this.forceUpdate();
    }

    SnakeSet(config) {
        this.config.width    = Number.isInteger(config.width)    && config.width    > 0 ? config.width    : this.config.width;
        this.config.height   = Number.isInteger(config.height)   && config.height   > 0 ? config.height   : this.config.height;
        this.config.length   = Number.isInteger(config.length)   && config.length   > 1 ? config.length   : this.config.length;
        this.config.food     = Number.isInteger(config.food)     && config.food     > 0 ? config.food     : this.config.food;
        this.config.interval = Number.isInteger(config.interval) && config.interval > 0 ? config.interval : this.config.interval;
        this.Restart();
    }

    AddRandomFood() {
        while (true) {
            let random = new Vector2i(
                RandomNumberGenerator(1, this.width - 2),
                RandomNumberGenerator(1, this.height - 2)
            );
            if (!CollisionCheckArrayVector2i([random], this.obstacles) &&
                !CollisionCheckArrayVector2i([random], this.player.body) &&
                !CollisionCheckArrayVector2i([random], this.food)) {
                this.food.push(random);
                return;
            }
        }
    }

    RenderCharacters() {
        const icon = {
            empty: '-',
            obstacle: 'H',
            food: 'X',
            snake: 'O',
            snakeHeadTemp: 'S'
        };
        let output = new Array(this.width * this.height).fill(icon.empty);
        let ChangeCharacter = (positions, icon) => {
            positions.forEach(position => {
                output[Vector2iToArrayIndex(position, this.width)] = icon;
            }, this);
        };
        ChangeCharacter(this.obstacles, icon.obstacle);
        ChangeCharacter(this.food, icon.food);
        ChangeCharacter(this.player.body, icon.snake);
        ChangeCharacter([this.player.Head()], icon.snakeHeadTemp);
        for (let i = this.height - 1; i > 0; i--) {
            output.splice(this.width * i, 0, '\n');
        }
        output = reactStringReplace(output, new RegExp("(" + icon.obstacle + ")", "g"), () => <span style={{ color: 'red' }}>{icon.obstacle}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.food + ")", "g"), () => <span style={{ color: 'green' }}>{icon.food}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.snake + ")", "g"), () => <span style={{ color: 'skyblue' }}>{icon.snake}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.snakeHeadTemp + ")", "g"), () => <span style={{ color: 'blue' }}>{icon.snake}</span>);
        return (
            <div>
                <div className="standard-box" style={style.Characters}>
                    {output}
                </div>
            </div>
        );
    }

    RenderGraphics(sizeBlock, spacing) {
        let DivBlocks = (positions, color) => {
            return positions.map((position, index) => {
                let styleBlock = {
                    top: ((position.y / this.height) * 100) + "%",
                    left: ((position.x / this.width) * 100) + "%",
                    width: (sizeBlock - spacing) + "px",
                    height: (sizeBlock - spacing) + "px",
                    position: "absolute",
                    background: color
                };
                return <div key={index} style={styleBlock} />;
            })
        };
        let areaPlayable = {
            width: this.width * sizeBlock,
            height: this.height * sizeBlock
        }
        return (
            <div>
                <div style={Object.assign({}, style.Graphics, areaPlayable)}>
                    {DivBlocks(this.obstacles, "red")}
                    {DivBlocks(this.food, "green")}
                    {DivBlocks(this.player.body.slice(1), "skyblue")}
                    {DivBlocks([this.player.Head()], "blue")}
                </div>
                <br /><br />
            </div>
        );
    }

    DisplayGame() {
        return this.toggleDisplay ? this.RenderGraphics(30, 1) : this.RenderCharacters();
    }
}

class Player {
    constructor(start, length) {
        this.body = new Array(length).fill(start);
    }

    Head() {
        return this.body[0];
    }

    Grow() {
        this.body.push(this.body[this.body.length - 1]);
    }

    Move(direction) {
        const movement =
        {
            "north": new Vector2i(0, -1),
            "east": new Vector2i(1, 0),
            "south": new Vector2i(0, 1),
            "west": new Vector2i(-1, 0)
        };
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }
        this.Head().Add(movement[direction]);
    }
}

class ConfigurationFormInput extends Component {
    constructor(props) {
        super(props);
        this.state     = { ...this.props.config };
        this.temporary = { ...this.props.config };
        Object.keys(this.temporary).forEach(key => this.temporary[key] = "");
    }

    OnInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.temporary[event.target.name] = event.target.value;
    }

    OnClick() {
        this.props.SnakeSet({
            width:    parseInt(this.state.width),
            height:   parseInt(this.state.height),
            length:   parseInt(this.state.length),
            food:     parseInt(this.state.food),
            interval: parseInt(this.state.interval)
        });
        Object.keys(this.temporary).forEach(key => this.temporary[key] = "");
    }

    InputBox(text, name, placeholder, style, value) {
        return (
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText style={style} >
                        {text}
                    </InputGroupText>
                </InputGroupAddon>
                <Input autoComplete="off" value={value} name={name} placeholder={placeholder} onChange={this.OnInputChange.bind(this)} />
            </InputGroup>
        );
    }

    render() {
        return (
            <div className="standard-box" style={Object.assign({ position: "fixed", bottom: "0", left: "0"}, style.Text)}>
                <h2 style={{ fontSize: "20px" }}>
                    <strong>
                        Game configuration
                    </strong>
                </h2>
                <br />
                {this.InputBox("Board width", "width", this.state.width, { paddingRight: "22px" }, this.temporary.width)}
                {this.InputBox("Board height", "height", this.state.height, {}, this.temporary.height)}
                {this.InputBox("Snake length", "length", this.state.length, {}, this.temporary.length)}
                {this.InputBox("Maximum food", "food", this.state.food, {}, this.temporary.food)}
                {this.InputBox("Game speed", "interval", this.state.interval, { paddingRight: "32px" }, this.temporary.interval)}
                <br />
                <Button style={{ display: "block" }} onClick={this.OnClick.bind(this)}>
                    Save and Restart
                </Button>
            </div>
        );
    }
}

class Vector2i {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    Equal(other) {
        return (
            this.x === other.x &&
            this.y === other.y
        );
    }
}

function RandomNumberGenerator(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Vector2iToArrayIndex(position, width) {
    return (position.y * width) + position.x;
}

function OnBorder(position, width, height) {
    return (
        position.x === 0 ||
        position.y === 0 ||
        position.x === width - 1 ||
        position.y === height - 1
    );
}

function BorderObstacles(width, height) {
    let obstacles = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const position = new Vector2i(x, y);
            if (OnBorder(position, width, height)) {
                obstacles.push(position);
            }
        }
    }
    return obstacles;
}

function CollisionCheckArrayVector2i(first, second) {
    let collision = false;
    first.forEach(one => {
        second.forEach(two => {
            if (one.Equal(two)) {
                collision = true;
            }
        });
    });
    return collision;
}

function ButtonFunction(text, func, style) {
    return (
        <Button onClick={func} style={style}>
            {text}
        </Button>
    );
};

const reactStringReplace = require('react-string-replace');

let style = {
    Text: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "16px",
        lineHeight: "normal",
        textAlign: "left",
        color: "black"
    },
    Characters: {
        display: "inline-block",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "42px",
        lineHeight: "70%",
        whiteSpace: "pre-wrap",
        color: "black"
    },
    Graphics: {
        display: "inline-block",
        position: "relative",
        top: "30px"
    }
}