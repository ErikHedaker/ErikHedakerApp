import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Portfolio extends Component {
    static displayName = Portfolio.name;

    render() {
        return (
            <div>
                <h1>Portfolio</h1>
                <br />
                <Link tag={Link} className="text-dark border border-dark" to="/Snake">Snake</Link>
                <span>My implementation of the game Snake, written in JavaScript and React</span>
            </div>
        );
    }
}