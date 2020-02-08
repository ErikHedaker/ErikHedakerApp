import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Projects extends Component {
    static displayName = Projects.name;

    render() {
        return (
            <div>
                <h1>Projects</h1>
                <br />
                <Link tag={Link} className="text-dark border border-dark" to="/TicTacToe">TicTacToe</Link>
                <span> Not my code, using this as a test component</span>
                <br />
                <Link tag={Link} className="text-dark border border-dark" to="/Snake/Snake">Snake</Link>
                <span> React JS app</span>
            </div>
        );
    }
}