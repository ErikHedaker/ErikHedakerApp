import React, { Component } from 'react';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Styles.css';

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
        this.isMobile = window.innerWidth <= 800;
        this.Restart();
    }
    componentDidMount() {
        document.onkeydown = this.KeyPress.bind(this);
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    render() {
        return (
            <div>
                <div style={{ textAlign: "center" }}>
                    {this.DisplayGame()}
                </div>
                <div style={{ position: "fixed", bottom: "0", right: "0" }}>
                    {this.MovementPanel()}
                    <br />
                    {this.ControlPanel()}
                </div>
                <div className="monospace-text" style={{ position: "fixed", bottom: "0", left: "0" }}>
                    <div className="box-responsive monospace-text" style={{ marginBottom: "2px" }}>
                        Current length: {this.player.body.length}
                    </div>
                    <br />
                    <ConfigurationFormInput isMobile={this.isMobile} config={this.config} SnakeSet={this.SnakeSet.bind(this)} />
                </div>
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
            <div className="box-responsive monospace-text" style={{ textAlign: "center", margin: "1px" }}>
                <h1 className="header-responsive">
                    Movement
                </h1>
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
            <div className="box-responsive monospace-text" style={{ textAlign: "center", margin: "1px" }}>
                <h1 className="header-responsive">
                    Controls
                </h1>
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
            const random = new Vector2i(
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
                <div className="box-static snake-characters-responsive">
                    {output}
                </div>
            </div>
        );
    }
    RenderGraphics(sizeBlock, spacing) {
        const DivBlocks = (positions, color) => {
            return positions.map((position, index) => {
                const blocks = {
                    top: ((position.y / this.height) * 100) + "%",
                    left: ((position.x / this.width) * 100) + "%",
                    width: (sizeBlock - spacing) + "px",
                    height: (sizeBlock - spacing) + "px",
                    position: "absolute",
                    background: color
                };
                return <div key={index} style={blocks} />;
            })
        };
        const board = {
            width: this.width * sizeBlock,
            height: this.height * sizeBlock
        }
        return (
            <div>
                <div className="snake-graphics-responsive" style={{ ...board }}>
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
        const size = this.isMobile ? 20 : 30;
        return this.toggleDisplay ? this.RenderGraphics(size, 1) : this.RenderCharacters();
    }
}

class ConfigurationFormInput extends Component {
    constructor(props) {
        super(props);
        this.state     = { ...this.props.config };
        this.temporary = { ...this.props.config };
        Object.keys(this.temporary).forEach(key => this.temporary[key] = "");
    }
    render() {
        return (
            <div className="box-responsive box-config-responsive" style={{ display: "flex", flexWrap: "wrap" }}>
                <h2 className="header-responsive" style={{ width: "100%", textAlign: "center" }}>
                    Game configuration
                </h2>
                <br />
                {this.InputBox("Game width",   "width",    " input-responsive-pad-large")}
                {this.InputBox("Game height",  "height",   " input-responsive-pad-small")}
                {this.InputBox("Food amount",  "food",     " input-responsive-pad-small")}
                {this.InputBox("Start length", "length",   "")}
                {this.InputBox("Update speed", "interval", "")}
                <br />
                <Button className="button-default input-responsive" style={{ flex: "1", padding: "0px" }} onClick={this.OnClick.bind(this)}>
                    Save and Restart
                </Button>
            </div>
        );
    }
    InputBox(text, key, classname) {
        return (
            <InputGroup>
                <InputGroupAddon className="input-responsive" addonType="prepend">
                    <InputGroupText className={"input-responsive" + classname}>
                        {text}
                    </InputGroupText>
                </InputGroupAddon>
                <Input
                    className="input-responsive"
                    name={key}
                    value={this.temporary[key]}
                    placeholder={this.state[key]}
                    onChange={this.OnInputChange.bind(this)}
                    autoComplete="off" />
            </InputGroup>
        );
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
        <Button className="button-default" onClick={func} style={style}>
            {text}
        </Button>
    );
}
const reactStringReplace = require('react-string-replace');