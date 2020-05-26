import React, { Component } from 'react';
import { Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Snake.css';

const reactStringReplace = require( 'react-string-replace' );

class Vector2i {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
    }

    Add( other ) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    Equal( other ) {
        return (
            this.x === other.x &&
            this.y === other.y
        );
    }
}

function RandomNumberGenerator( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

function Vector2iToArrayIndex( position, size ) {
    return ( position.y * size.x ) + position.x;
}

function OnBorder( position, size ) {
    return (
        position.x === 0 ||
        position.y === 0 ||
        position.x === size.x - 1 ||
        position.y === size.y - 1
    );
}

function BorderObstacles( size ) {
    let obstacles = [];
    for( let y = 0; y < size.y; y++ ) {
        for( let x = 0; x < size.x; x++ ) {
            const position = new Vector2i( x, y );
            if( OnBorder( position, size ) ) {
                obstacles.push( position );
            }
        }
    }
    return obstacles;
}

function CollisionCheckArrayVector2i( first, second ) {
    let collision = false;
    first.forEach( one => {
        second.forEach( two => {
            if( one.Equal( two ) ) {
                collision = true;
            }
        } );
    } );
    return collision;
}

export class Snake extends Component {
    static displayName = Snake.name;

    constructor( props ) {
        super( props );
        this.config = {
            size: new Vector2i( 17, 17 ),
            length: 5,
            food: 2,
            interval: 100,
            lengthSet:   function( value ) { this.length   = Number.isInteger( value ) && value > 1 ? value : 5;   },
            foodSet:     function( value ) { this.food     = Number.isInteger( value ) && value > 0 ? value : 2;   },
            intervalSet: function( value ) { this.interval = Number.isInteger( value ) && value > 0 ? value : 100; },
            sizeSet:     function( value ) {
                this.size.x = Number.isInteger( value.x ) && value.x > 0 ? value.x : 17;
                this.size.y = Number.isInteger( value.y ) && value.y > 0 ? value.y : 17;
            },
        };
        this.toggleDisplay = true;
        this.Restart( this.config );
        document.onkeydown = this.KeyPress.bind( this );
    }

    Restart( config ) {
        clearInterval( this.intervalID );
        this.size = config.size;
        this.player = new Player( new Vector2i( 1, Math.floor( this.size.y / 2 ) ), config.length );
        this.obstacles = BorderObstacles( this.size );
        this.foodAmount = config.food;
        this.food = [];
        this.direction = "east";
        this.directionPrev = this.direction;
        this.intervalID = setInterval( this.Update.bind( this ), config.interval );
    }

    ToggleDisplay() {
        this.toggleDisplay = !this.toggleDisplay;
        this.forceUpdate();
    }

    KeyPress( event ) {
        const directionOpposite =
        {
            "north": "south",
            "east":  "west",
            "south": "north",
            "west":  "east"
        };
        const directionCode =
        {
            87: "north",
            68: "east",
            83: "south",
            65: "west"
        };
        event = event || window.event;
        switch( event.keyCode ) {
            case 87:
            case 68:
            case 83:
            case 65:
                const directionKey = directionCode[event.keyCode];
                const oppositePrev = directionOpposite[this.directionPrev];
                if( directionKey !== oppositePrev ) {
                    this.direction = directionKey;
                }
                break;
            case 82:
                this.Restart( this.config );
                break;
            case 70:
                this.ToggleDisplay();
                break;
            default:
                break;
        }
    }

    Update() {
        this.player.Move( this.direction );
        this.directionPrev = this.direction;
        for( let i = this.food.length - 1; i >= 0; i-- ) {
            if( this.food[i].Equal( this.player.Head() ) ) {
                this.food.splice( i, 1 );
                this.player.Grow();
            }
        }
        while( this.food.length < this.foodAmount &&
            ( this.size.x - 2 ) * ( this.size.y - 2 ) > this.food.length + this.player.body.length ) {
            this.AddRandomFood();
        }
        if( CollisionCheckArrayVector2i( [this.player.Head()], this.obstacles ) ||
            CollisionCheckArrayVector2i( [this.player.Head()], this.player.body.slice( 1 ) ) ) {
            clearInterval( this.intervalID );
        }
        this.forceUpdate();
    }

    ConfigUpdate( state ) {
        this.config.sizeSet( new Vector2i( parseInt( state.width ), parseInt( state.height ) ) );
        this.config.lengthSet( parseInt( state.length ) );
        this.config.foodSet( parseInt( state.food ) );
        this.config.intervalSet( parseInt( state.interval ) );
        this.Restart( this.config );
    }

    AddRandomFood() {
        while( true ) {
            let random = new Vector2i(
                RandomNumberGenerator( 1, this.size.x - 2 ),
                RandomNumberGenerator( 1, this.size.y - 2 )
            );
            if( !CollisionCheckArrayVector2i( [random], this.obstacles ) &&
                !CollisionCheckArrayVector2i( [random], this.player.body ) &&
                !CollisionCheckArrayVector2i( [random], this.food ) ) {
                this.food.push( random );
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
        let output = new Array( this.size.x * this.size.y ).fill( icon.empty );
        let ChangeCharacter = ( positions, icon ) => {
            positions.forEach( position => {
                output[Vector2iToArrayIndex( position, this.size )] = icon;
            }, this );
        };
        ChangeCharacter( this.obstacles, icon.obstacle );
        ChangeCharacter( this.food, icon.food );
        ChangeCharacter( this.player.body, icon.snake );
        ChangeCharacter( [this.player.Head()], icon.snakeHeadTemp );
        for( let i = this.size.y - 1; i > 0; i-- ) {
            output.splice( this.size.x * i, 0, '\n' );
        }
        output = reactStringReplace( output, new RegExp( "(" + icon.obstacle + ")", "g" ), () => <span style={{ color: 'red' }}>{icon.obstacle}</span> );
        output = reactStringReplace( output, new RegExp( "(" + icon.food + ")", "g" ), () => <span style={{ color: 'green' }}>{icon.food}</span> );
        output = reactStringReplace( output, new RegExp( "(" + icon.snake + ")", "g" ), () => <span style={{ color: 'skyblue' }}>{icon.snake}</span> );
        output = reactStringReplace( output, new RegExp( "(" + icon.snakeHeadTemp + ")", "g" ), () => <span style={{ color: 'blue' }}>{icon.snake}</span> );
        return (
            <div style={{ textAlign: 'center' }}>
                <div className="box game-characters">
                    {output}
                </div>
            </div>
        );
    }

    RenderGraphics( sizeBlock, spacing ) {
        let DivBlocks = ( positions, color ) => {
            return positions.map( ( position, index ) => {
                return (
                    <div key={index} style={{
                        top: ( ( position.y / this.size.y ) * 100 ) + '%',
                        left: ( ( position.x / this.size.x ) * 100 ) + '%',
                        width: ( sizeBlock - spacing ) + "px",
                        height: ( sizeBlock - spacing ) + "px",
                        position: "absolute",
                        background: color
                    }}></div>
                );
            } )
        };
        return (
            <div style={{ textAlign: 'center' }}>
                <div className="game-graphics-area" style={{ width: this.size.x * sizeBlock, height: this.size.y * sizeBlock }}>
                    {DivBlocks( this.obstacles, "red" )}
                    {DivBlocks( this.food, "green" )}
                    {DivBlocks( this.player.body.slice( 1 ), "skyblue" )}
                    {DivBlocks( [this.player.Head()], "blue" )}
                </div>
            </div>
        );
    }

    DisplayGame() {
        return this.toggleDisplay ? this.RenderGraphics( 30, 1 ) : this.RenderCharacters();
    }

    render() {
        return (
            <div>
                {this.DisplayGame()}
                <br />
                <br />
                <div style={{ textAlign: 'center' }}>
                    <div className="box text-base text-length">
                        Length: {this.player.body.length}
                    </div>
                </div>
                <br />
                <div className="box text-base text-controls">
                    <h2 style={{ fontSize: "24px" }}><strong>Controls</strong></h2>
                    <br />[W] Up
                    <br />[S] Down
                    <br />[A] Left
                    <br />[D] Right
                    <br />[R] Restart
                    <br />[F] Display
                </div>
                <ConfigurationFormInput config={this.config} ConfigUpdate={this.ConfigUpdate.bind( this )} />
            </div>
        );
    }
}

class Player {
    constructor( start, length ) {
        this.body = new Array( length ).fill( start );
    }

    Head() {
        return this.body[0];
    }

    Grow() {
        this.body.push( this.body[this.body.length - 1] );
    }

    Move( direction ) {
        const movement =
        {
            "north": new Vector2i(  0, -1 ),
            "east":  new Vector2i(  1,  0 ),
            "south": new Vector2i(  0,  1 ),
            "west":  new Vector2i( -1,  0 )
        };
        for( let i = this.body.length - 1; i > 0; i-- ) {
            this.body[i] = { ...this.body[i - 1] };
        }
        this.Head().Add( movement[direction] );
    }
}

class ConfigurationFormInput extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            width: this.props.config.size.x,
            height: this.props.config.size.y,
            length: this.props.config.length,
            food: this.props.config.food,
            interval: this.props.config.interval
        };
    }

    OnInputChange( event ) {
        this.setState( {
            [event.target.name]: event.target.value
        } );
    }

    OnClick() {
        this.props.ConfigUpdate( this.state );
    }

    InputBox( text, name, placeholder ) {
        return (
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>{text}</InputGroupText>
                </InputGroupAddon>
                <Input name={name} placeholder={placeholder} onChange={this.OnInputChange.bind( this )} />
            </InputGroup>
        );
    }

    render() {
        return (
            <div className="box text-base text-config">
                <h2 style={{ fontSize: "20px" }}><strong>Game configuration</strong></h2>
                {this.InputBox( "Board width", "width", this.props.config.size.x )}
                {this.InputBox( "Board height", "height", this.props.config.size.y )}
                {this.InputBox( "Snake length", "length", this.props.config.length )}
                {this.InputBox( "Maximum food", "food", this.props.config.food )}
                {this.InputBox( "Game speed", "interval", this.props.config.interval )}
                <Button style={{ display: "inline-block" }} onClick={this.OnClick.bind( this )}>Save and Restart</Button>
            </div>
        );
    }
}