import React, { Component } from 'react';
import './Home.css';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div className="box">
                <span>
                    V&auml;lkommen!<br/>
                    Bes&ouml;k min <a href="https://github.com/ErikHedaker">Github</a> f&ouml;r k&auml;llkoden av sidan.
                </span>
            </div>
        );
    }
}