import React, { Component } from 'react';
import './Snake.css';

export class Snake extends Component {
    static displayName = Snake.name;

    constructor() {
        super();
        this.state = {
            grid: new Grid(new Vector2i(20, 20), '-'),
            current: new Vector2i(1, 1),
            direction: "east",
            interval: 500
        };
        this.state.grid.Set(this.state.current, '#');
    }

    componentDidMount() {
        setInterval(this.Update.bind(this), this.state.interval);
        document.onkeydown = this.onKeyDown;
        this.forceUpdate();
    }

    onKeyDown = (e) => {
        e = e || window.event;
        switch (e.keyCode) {
            case 87:
                this.setState({ direction: "north" });
                break;
            case 68:
                this.setState({ direction: "east" });
                break;
            case 83:
                this.setState({ direction: "south" });
                break;
            case 65:
                this.setState({ direction: "west" });
                break;
        }
    }

    Update() {
        const movement = {
            ["north"]: new Vector2i(0, -1),
            ["east"]:  new Vector2i(1, 0),
            ["south"]: new Vector2i(0, 1),
            ["west"]:  new Vector2i(-1, 0)
        };
        this.state.grid.Set(this.state.current, '-');
        this.state.current.Add(movement[this.state.direction]);
        this.state.grid.Set(this.state.current, '#');
        this.forceUpdate();
    }

    GridToString() {
        let output = "";
        for (let y = 0; y < this.state.grid.size.y; y++) {
            for (let x = 0; x < this.state.grid.size.x; x++) {
                const position = new Vector2i(x, y);
                const icon = this.state.grid.Get(position);
                output += icon;
            }
            output += "\n";
        }
        return output;
    }

    render() {
        return (
            <div className="block-base">
                {this.GridToString()}
            </div>
        );
    }
}

class Grid {
    constructor(sizeTemp, value) {
        this.size = sizeTemp;
        this.data = Array(sizeTemp.x * sizeTemp.y).fill(value);
    }

    Get(position) {
        const index = (position.y * this.size.x) + position.x;
        return this.data[index];
    }

    Set(position, value) {
        const index = (position.y * this.size.x) + position.x;
        this.data[index] = value;
    }
}

class Vector2i {
    constructor(xTemp, yTemp) {
        this.x = xTemp;
        this.y = yTemp;
    }

    Set(xTemp, yTemp) {
        this.x = xTemp;
        this.y = yTemp;
    }

    Set(other) {
        this.x = other.x;
        this.y = other.y;
    }

    Add(xTemp, yTemp) {
        this.x += xTemp;
        this.y += yTemp;
    }

    Add(other) {
        this.x += other.x;
        this.y += other.y;
    }
}