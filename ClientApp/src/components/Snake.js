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

function Vector2iToArrayIndex(position, size) {
    return (position.y * size.x) + position.x;
}

function ChangeString(output, insert, size, array) {
    array.forEach(function (position) {
        output.splice(Vector2iToArrayIndex(position, size), 1, insert);
    });
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
        this.size = new Vector2i(21, 21);
        this.player = new Player(new Vector2i(1, 10), 5);
        this.obstacles = BorderObstacles(this.size);
        this.direction = "east";
        this.interval = 125;
        this.intervalID;
    }

    componentDidMount() {
        this.Reset();
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
        if (this.CollisionCheck()) {
            this.Stop();
        }
        else {
            this.player.Move(this.direction);
            this.forceUpdate();
        }
    }

    Reset() {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(this.Update.bind(this), this.interval);
        this.player = new Player(new Vector2i(1, 10), 5);
        this.direction = "east";
    }

    Stop() {
        clearInterval(this.intervalID);
    }

    CollisionCheck() {
        let check = false;
        if (this.obstacles) {
            this.obstacles.forEach(position => {
                //if (this.player.Head().Equal(position)) {
                //    return true;
                //}
                if (this.player.body[0].x === position.x &&
                    this.player.body[0].y === position.y) {
                    check = true;
                }
            }, this);
        }
        return check;
    }

    ToString() {
        let output = new Array(this.size.x * this.size.y).fill('-');
        this.player.body.forEach(function (position) {
            output[Vector2iToArrayIndex(position, this.size)] = 'O';
        }, this);
        this.obstacles.forEach(function (position) {
            output[Vector2iToArrayIndex(position, this.size)] = 'X';
        }, this);
        for (let i = this.size.y; i > 0; i--) {
            output.splice(this.size.x * i, 0, '\n');
        }
        output = reactStringReplace(output, /(O)/g, (match, i) => (<span style={{ color: 'blue' }}>{match}</span>));
        output = reactStringReplace(output, /(X)/g, (match, i) => (<span style={{ color: 'red' }}>{match}</span>));
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