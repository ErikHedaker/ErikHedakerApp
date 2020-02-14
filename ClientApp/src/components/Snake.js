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

    Multiply(value) {
        this.x *= value;
        this.y *= value;
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
    if (first) {
        first.forEach(one => {
            if (second) {
                second.forEach(two => {
                    if (one.Equal(two)) {
                        collision = true;
                    }
                });
            }
        });
    }
    return collision;
}

export class Snake extends Component {
    static displayName = Snake.name;

    constructor(props) {
        super(props);
        this.Reset();
        document.onkeydown = this.KeyPress.bind(this);
    }

    Reset() {
        clearInterval(this.intervalID);
        this.size = new Vector2i(17, 17);
        this.player = new Player(new Vector2i(1, 8), 5);
        this.obstacles = BorderObstacles(this.size);
        this.food = new Food();
        this.direction = "east";
        this.directionPrev = "east";
        this.interval = 100;
        this.intervalID = setInterval(this.Update.bind(this), this.interval);
    }

    KeyPress(event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 87:
                if (this.directionPrev !== "south")
                    this.direction = "north";
                break;
            case 68:
                if (this.directionPrev !== "west")
                    this.direction = "east";
                break;
            case 83:
                if (this.directionPrev !== "north")
                    this.direction = "south";
                break;
            case 65:
                if (this.directionPrev !== "east")
                    this.direction = "west";
                break;
        }
    }

    Update() {
        if (CollisionCheckArrayVector2i([this.player.Head()], this.obstacles)) {
            clearInterval(this.intervalID);
        }
        else {
            this.player.Move(this.direction);
            this.directionPrev = this.direction;
            for (let i = this.food.Amount() - 1; i >= 0; i--) {
                if (this.food.positions[i].Equal(this.player.Head())) {
                    this.food.positions.splice(i, 1);
                    this.player.Grow();
                }
            }
            while (this.food.Amount() < 2) {
                this.AddRandomFood();
            }
            this.forceUpdate();
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
                !CollisionCheckArrayVector2i([random], this.food.positions)) {
                this.food.Add(random);
                return;
            }
        }
    }

    ToString() {
        let output = new Array(this.size.x * this.size.y).fill('-');
        this.player.body.forEach(function (position) {
            output[Vector2iToArrayIndex(position, this.size)] = 'O';
        }, this);
        this.obstacles.forEach(function (position) {
            output[Vector2iToArrayIndex(position, this.size)] = 'X';
        }, this);
        if (this.food.positions) {
            this.food.positions.forEach(function (position) {
                output[Vector2iToArrayIndex(position, this.size)] = 'S';
            }, this);
        }
        for (let i = this.size.y; i > 0; i--) {
            output.splice(this.size.x * i, 0, '\n');
        }
        output = reactStringReplace(output, /(O)/g, (match) => (<span style={{ color: 'blue'  }}>{match}</span>));
        output = reactStringReplace(output, /(X)/g, (match) => (<span style={{ color: 'red'   }}>{match}</span>));
        output = reactStringReplace(output, /(S)/g, (match) => (<span style={{ color: 'green' }}>{match}</span>));
        return output;
    }

    render() {
        return (
            <div className="base">
                {this.ToString()}
                <Button onClick={this.Reset.bind(this)}>Reset</Button>
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

class Food {
    constructor() {
        this.positions = new Array();
    }

    Amount() {
        return this.positions.length;
    }

    Add(position) {
        this.positions.push(position);
    }

    Remove(position) {
        for (let i = 0; i < this.positions.length; i++) {
            if (this.positions[i].Equal(position)) {
                this.positions.splice(i, 1);
                return;
            }
        }
    }
}