import React, { Component } from 'react';
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
}

const movement = {
    ["north"]: new Vector2i( 0, -1),
    ["east"]:  new Vector2i( 1,  0),
    ["south"]: new Vector2i( 0,  1),
    ["west"]:  new Vector2i(-1,  0)
};

function Vector2iToArrayIndex(value, size) {
    return (value.y * size.x) + value.x;
}

function ChangeString(string, char, size, array) {
    array.forEach(function (position) {
        string[Vector2iToArrayIndex(position, size)] = char;
    }, this);
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

export class Snake extends Component {
    static displayName = Snake.name;

    constructor(props) {
        super(props);
        this.size = new Vector2i(20, 20);
        this.player = new Player(new Vector2i(2, 2), 10);
        this.obstacles = BorderObstacles(this.size);
        this.direction = "east";
        this.interval = 125;
    }

    componentDidMount() {
        setInterval(this.Update.bind(this), this.interval);
        document.onkeydown = this.onKeyDown;
    }

    onKeyDown = (e) => {
        e = e || window.event;
        switch (e.keyCode) {
            case 87:
                if (this.direction !== "south")
                    this.direction = "north";
                break;
            case 68:
                if (this.direction !== "west")
                    this.direction = "east";
                break;
            case 83:
                if (this.direction !== "north")
                    this.direction = "south";
                break;
            case 65:
                if (this.direction !== "east")
                    this.direction = "west";
                break;
        }
    }

    Update() {
        this.player.Move(this.direction);
        this.forceUpdate();
    }

    ToString() {
        let output = new Array(this.size.x * this.size.y).fill('-');
        ChangeString(output, 'O', this.size, this.player.body);
        ChangeString(output, '=', this.size, this.obstacles);
        for (let i = this.size.y; i > 0; i--)
        {
            output.splice(this.size.x * i, 0, '\n');
        }
        return output;
    }

    render() {
        return (
            <div className="block-base">
                {this.ToString()}
            </div>
        );
    }
}

class Player {
    constructor(start, length) {
        this.body = new Array(length).fill(start);
    }

    Move(direction) {
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }
        this.body[0].Add(movement[direction]);
    }
}