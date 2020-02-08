import React, { Component } from 'react';
import './Snake.css';

export class Snake extends Component {
    static displayName = Snake.name;

    constructor(props) {
        super(props);

        this.state = {
            grid: new Grid(new Vector2i(20, 20), '-'),
            updateInterval: 100,
            direction: "east",
            current: new Vector2i(2, 2)
        };

        this.state.grid.Set(this.state.current, '#');
    }

    componentDidMount() {
        setInterval(this.Update(), 500);
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
        //const movement = {
        //    ["north"]: new Vector2i(0, -1),
        //    ["east"]:  new Vector2i(1, 0),
        //    ["south"]: new Vector2i(0, 1),
        //    ["west"]:  new Vector2i(-1, 0)
        //};
        //this.state.grid.Set(this.state.current, '-');
        //this.state.current.Add(movement[this.state.direction]);
        //this.state.grid.Set(this.state.current, '#');
        //this.forceUpdate();
    }

    GridToString() {
        let output = "";

        for (let x = 0; x < this.state.grid.GetSize().state.x; x++) {
            for (let y = 0; y < this.state.grid.GetSize().state.y; y++) {
                const position = new Vector2i(x, y);
                const icon = this.state.grid.Get(position);
                console.log(icon);
                output += icon;
            }
            output += "\n";
        }

        return output;
    }

    render() {
        return (
            <div className="block-base">
                <p>Test</p>
                <br />
                {this.GridToString()}
            </div>
        );
    }
}

//class Grid extends Component {
//    constructor(size, total, value) {
//        super();
//        this.state = {
//            size: size,
//            data: Array(total).fill(value)
//        };
//    }

//    Get(position) {
//        return this.state.data[(position.y * this.state.size.x) + position.x];
//    }

//    Set(position, value) {
//        this.state.data[(position.y * this.state.size.x) + position.x] = value;
//        this.forceUpdate();
//        //const index = (position.y * this.state.size.x) + position.x;
//        //this.setState(statePrev => ({ items: { ...statePrev.items, [statePrev.items[index].name]: value }}));
//    }

//    GetSize() {
//        return this.state.size;
//    }
//}

//class Vector2i extends Component {
//    constructor(x, y) {
//        super();
//        this.state = {
//            x: x,
//            y: y
//        };
//    }

//    Set(x, y) {
//        this.setState({ x: x, y: y })
//    }

//    Set(other) {
//        this.setState({ x: other.x, y: other.y });
//    }

//    Add(x, y) {
//        this.setState({ x: this.state.x + x, y: this.state.y + y });
//    }

//    Add(other) {
//        this.setState({ x: this.state.x + other.x, y: this.state.y + other.y });
//    }
//}

class Grid {
    constructor(sizeTemp, value) {
        this.state = {
            size: sizeTemp,
            data: Array(sizeTemp.state.x * sizeTemp.state.y).fill(value)
        };
        //this.size = sizeTemp;
        //this.data = Array(sizeTemp.state.x * sizeTemp.state.y).fill(value);
    }

    Get(position) {
        const index = (position.state.y * this.state.size.state.x) + position.state.x;
        return this.state.data[index];
    }

    Set(position, value) {
        const index = (position.state.y * this.state.size.state.x) + position.state.x;
        this.state.data[index] = value;
    }

    GetSize() {
        return this.state.size;
    }
}

class Vector2i {
    constructor(xTemp, yTemp) {
        this.state = {
            x: xTemp,
            y: yTemp
        };
    }

    Set(xTemp, yTemp) {
        this.state.x = xTemp;
        this.state.y = yTemp;
    }

    Set(other) {
        this.state.x = other.state.x;
        this.state.y = other.state.y;
    }

    Add(xTemp, yTemp) {
        this.state.x = this.state.x + xTemp;
        this.state.y = this.state.y + yTemp;
    }

    Add(other) {
        this.state.x = this.state.x + other.state.x;
        this.state.y = this.state.y + other.state.y;
    }
}