import React, { Component } from 'react';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Standard.css';

export class Snake extends Component {
    static displayName = Snake.name;

    constructor(props) {
        super(props);
        this.config = {
            size: new Vector2i(17, 17),
            length: 5,
            food: 2,
            interval: 100,
            lengthSet: function (value) { this.length = Number.isInteger(value) && value > 1 ? value : 5; },
            foodSet: function (value) { this.food = Number.isInteger(value) && value > 0 ? value : 2; },
            intervalSet: function (value) { this.interval = Number.isInteger(value) && value > 0 ? value : 100; },
            sizeSet: function (value) {
                this.size.x = Number.isInteger(value.x) && value.x > 0 ? value.x : 17;
                this.size.y = Number.isInteger(value.y) && value.y > 0 ? value.y : 17;
            },
        };
        this.toggleDisplay = true;
        this.Restart(this.config);
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
                    <div className="standard-box" style={styleTextBase}>
                        Length: {this.player.body.length}
                    </div>
                </div>
                {this.MovementPanel()}
                {this.ControlPanel()}
                <ConfigurationFormInput config={this.config} ConfigUpdate={this.ConfigUpdate.bind(this)} />
            </div>
        );
    }

    Restart(config) {
        clearInterval(this.intervalID);
        this.size = config.size;
        this.player = new Player(new Vector2i(1, Math.floor(this.size.y / 2)), config.length);
        this.obstacles = BorderObstacles(this.size);
        this.foodAmount = config.food;
        this.food = [];
        this.direction = "east";
        this.directionPrev = this.direction;
        this.intervalID = setInterval(this.Update.bind(this), config.interval);
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
                this.Restart(this.config);
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
        let stylePanel = {
            textAlign: "center",
            position: "fixed",
            bottom: "0",
            left: "38%"
        };
        return (
            <div className="standard-box" style={Object.assign({}, styleTextBase, stylePanel)}>
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
        let stylePanel = {
            textAlign: "center",
            position: "fixed",
            bottom: "0",
            left: "50.1%"
        };
        return (
            <div className="standard-box" style={Object.assign({}, styleTextBase, stylePanel)}>
                <h2 style={{ fontSize: "24px" }}>
                    <strong>
                        Controls
                    </strong>
                </h2>
                <br />{ButtonFunction("[R]", this.Restart.bind(this, this.config), { margin: "1px" })} Restart
                <br />{ButtonFunction("[F]", this.ToggleDisplay.bind(this),        { margin: "1px" })} Display
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
            (this.size.x - 2) * (this.size.y - 2) > this.food.length + this.player.body.length) {
            this.AddRandomFood();
        }
        if (CollisionCheckArrayVector2i([this.player.Head()], this.obstacles) ||
            CollisionCheckArrayVector2i([this.player.Head()], this.player.body.slice(1))) {
            clearInterval(this.intervalID);
        }
        this.forceUpdate();
    }

    ConfigUpdate(state) {
        this.config.sizeSet(new Vector2i(parseInt(state.width), parseInt(state.height)));
        this.config.lengthSet(parseInt(state.length));
        this.config.foodSet(parseInt(state.food));
        this.config.intervalSet(parseInt(state.interval));
        this.Restart(this.config);
    }

    AddRandomFood() {
        while (true) {
            let random = new Vector2i(
                RandomNumberGenerator(1, this.size.x - 2),
                RandomNumberGenerator(1, this.size.y - 2)
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
        let output = new Array(this.size.x * this.size.y).fill(icon.empty);
        let ChangeCharacter = (positions, icon) => {
            positions.forEach(position => {
                output[Vector2iToArrayIndex(position, this.size)] = icon;
            }, this);
        };
        ChangeCharacter(this.obstacles, icon.obstacle);
        ChangeCharacter(this.food, icon.food);
        ChangeCharacter(this.player.body, icon.snake);
        ChangeCharacter([this.player.Head()], icon.snakeHeadTemp);
        for (let i = this.size.y - 1; i > 0; i--) {
            output.splice(this.size.x * i, 0, '\n');
        }
        output = reactStringReplace(output, new RegExp("(" + icon.obstacle + ")", "g"), () => <span style={{ color: 'red' }}>{icon.obstacle}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.food + ")", "g"), () => <span style={{ color: 'green' }}>{icon.food}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.snake + ")", "g"), () => <span style={{ color: 'skyblue' }}>{icon.snake}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.snakeHeadTemp + ")", "g"), () => <span style={{ color: 'blue' }}>{icon.snake}</span>);
        return (
            <div>
                <div className="standard-box" style={styleGameCharacters}>
                    {output}
                </div>
            </div>
        );
    }

    RenderGraphics(sizeBlock, spacing) {
        let DivBlocks = (positions, color) => {
            return positions.map((position, index) => {
                let styleBlock = {
                    top: ((position.y / this.size.y) * 100) + "%",
                    left: ((position.x / this.size.x) * 100) + "%",
                    width: (sizeBlock - spacing) + "px",
                    height: (sizeBlock - spacing) + "px",
                    position: "absolute",
                    background: color
                };
                return <div key={index} style={styleBlock} />;
            })
        };
        let areaPlayable = {
            width: this.size.x * sizeBlock,
            height: this.size.y * sizeBlock
        }
        return (
            <div>
                <div style={Object.assign({}, styleGameGraphicsArea, areaPlayable)}>
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
        this.state = {
            width: this.props.config.size.x,
            height: this.props.config.size.y,
            length: this.props.config.length,
            food: this.props.config.food,
            interval: this.props.config.interval
        };
    }

    OnInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    OnClick() {
        this.props.ConfigUpdate(this.state);
    }

    InputBox(text, name, placeholder, styleText) {
        return (
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText style={styleText} >
                        {text}
                    </InputGroupText>
                </InputGroupAddon>
                <Input name={name} placeholder={placeholder} onChange={this.OnInputChange.bind(this)} />
            </InputGroup>
        );
    }

    render() {
        return (
            <div className="standard-box" style={Object.assign({}, styleTextBase, styleTextConfig)}>
                <h2 style={{ fontSize: "20px" }}>
                    <strong>
                        Game configuration
                    </strong>
                </h2>
                <br />
                {this.InputBox("Board width", "width", this.props.config.size.x, { paddingRight: "22px" })}
                {this.InputBox("Board height", "height", this.props.config.size.y, {})}
                {this.InputBox("Snake length", "length", this.props.config.length, {})}
                {this.InputBox("Maximum food", "food", this.props.config.food, {})}
                {this.InputBox("Game speed", "interval", this.props.config.interval, { paddingRight: "32px" })}
                <Button style={{ display: "inline-block" }} onClick={this.OnClick.bind(this)}>
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

function Vector2iToArrayIndex(position, size) {
    return (position.y * size.x) + position.x;
}

function OnBorder(position, size) {
    return (
        position.x === 0 ||
        position.y === 0 ||
        position.x === size.x - 1 ||
        position.y === size.y - 1
    );
}

function BorderObstacles(size) {
    let obstacles = [];
    for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
            const position = new Vector2i(x, y);
            if (OnBorder(position, size)) {
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

let styleTextBase = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "16px",
    lineHeight: "normal",
    textAlign: "left",
    color: "black"
}

let styleTextConfig = {
    position: "fixed",
    bottom: "0",
    left: "0"
}

let styleGameCharacters = {
    display: "inline-block",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "42px",
    lineHeight: "70%",
    whiteSpace: "pre-wrap",
    color: "black"
}

let styleGameGraphicsArea = {
    display: "inline-block",
    position: "relative",
    top: "30px"
}