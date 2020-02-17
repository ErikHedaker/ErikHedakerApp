import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Snake.css';

class Vector2i {
    constructor(xTemp, yTemp) {
        this.x = xTemp;
        this.y = yTemp;
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

const movement = {
    ["north"]: new Vector2i( 0, -1),
    ["east"]:  new Vector2i( 1,  0),
    ["south"]: new Vector2i( 0,  1),
    ["west"]:  new Vector2i(-1,  0)
};

const reactStringReplace = require('react-string-replace');

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
    let obstacles = new Array();
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

export class Snake extends Component {
    static displayName = Snake.name;

    constructor(props) {
        super(props);
        this.toggleDisplay = true;
        this.Reset();
        document.onkeydown = this.KeyPress.bind(this);
    }

    Reset() {
        clearInterval(this.intervalID);
        this.size = new Vector2i(17, 17);
        this.player = new Player(new Vector2i(1, Math.floor(this.size.y / 2)), 5);
        this.obstacles = BorderObstacles(this.size);
        this.food = [];
        this.direction = "east";
        this.directionPrev = this.direction;
        this.intervalID = setInterval(this.Update.bind(this), 100);
    }

    ToggleDisplay() {
        this.toggleDisplay = !this.toggleDisplay;
        this.forceUpdate();
    }

    KeyPress(event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87:
                if (this.directionPrev !== "south") {
                    this.direction = "north";
                }
                break;
            case 68:
                if (this.directionPrev !== "west") {
                    this.direction = "east";
                }
                break;
            case 83:
                if (this.directionPrev !== "north") {
                    this.direction = "south";
                }
                break;
            case 65:
                if (this.directionPrev !== "east") {
                    this.direction = "west";
                }
                break;
            case 82:
                this.Reset();
                break;
            case 70:
                this.ToggleDisplay();
                break;
        }
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
        while (this.food.length < 2) {
            this.AddRandomFood();
        }
        this.forceUpdate();
        if (CollisionCheckArrayVector2i([this.player.Head()], this.obstacles) ||
            CollisionCheckArrayVector2i([this.player.Head()], this.player.body.slice(1))) {
            clearInterval(this.intervalID);
        }
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

    ToCharacters() {
        const icon = {
            empty: '-',
            obstacle: 'H',
            food: 'X',
            snake: 'O',
            snakeHead: 'P'
        };
        let output = new Array(this.size.x * this.size.y).fill(icon.empty);
        this.obstacles.forEach(position => {
            output[Vector2iToArrayIndex(position, this.size)] = icon.obstacle;
        }, this);
        this.food.forEach(position => {
            output[Vector2iToArrayIndex(position, this.size)] = icon.food;
        }, this);
        this.player.body.forEach(position => {
            output[Vector2iToArrayIndex(position, this.size)] = icon.snake;
        }, this);
        output[Vector2iToArrayIndex(this.player.Head(), this.size)] = icon.snakeHead;
        for (let i = this.size.y - 1; i > 0; i--) {
            output.splice(this.size.x * i, 0, '\n');
        }
        output = reactStringReplace(output, new RegExp("(" + icon.obstacle + ")", "g"), () => <span style={{ color: 'red' }}>{icon.obstacle}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.food + ")", "g"), () => <span style={{ color: 'green' }}>{icon.food}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.snake + ")", "g"), () => <span style={{ color: 'skyblue' }}>{icon.snake}</span>);
        output = reactStringReplace(output, new RegExp("(" + icon.snakeHead + ")", "g"), () => <span style={{ color: 'blue' }}>{icon.snake}</span>);
        return output;
    }

    RenderCharacters() {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className="box game-characters">
                    {this.ToCharacters()}
                </div>
            </div>
        );
    }

    RenderGraphics() {
        let DivRender = (positions, size, string) => {
            return positions.map(position => {
                return (
                    <div className={`game-graphics-base game-graphics-${string}`} style={{
                        top:  ((position.y / size.y) * 100) + '%',
                        left: ((position.x / size.x) * 100) + '%'
                    }}></div>
                );
            })
        };

        return (
            <div style={{ textAlign: 'center' }}>
                <div className="game-graphics-area" style={{ width: this.size.x * 30, height: this.size.y * 30 }}>
                    {DivRender(this.obstacles, this.size, "obstacles")}
                    {DivRender(this.food, this.size, "food")}
                    {DivRender(this.player.body.slice(1), this.size, "snake")}
                    {DivRender([this.player.Head()], this.size, "snake-head")}

                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.toggleDisplay ? this.RenderCharacters() : this.RenderGraphics()}<br/>
                <Button className="button-reset" onClick={this.ToggleDisplay.bind(this)}>Toggle Display</Button><br/>
                <div style={{ textAlign: 'center' }}>
                    <div className="box text-base text-length">
                        Length: {this.player.body.length}
                    </div>
                </div><br/>
                <div className="box text-base text-controls">
                    <h4><strong>Controls</strong></h4>
                    <br/>[W] Up
                    <br/>[S] Down
                    <br/>[A] Left
                    <br/>[D] Right
                    <br/>[R] Reset
                    <br/>[F] Display
                </div>
            </div>
        );
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
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }
        this.Head().Add(movement[direction]);
    }
}