import React, { Component } from 'react';
import './Home.css';

export class Home extends Component {
    static displayName = Home.name;
    
    render() {
        return (
            <div className="box-left">
                <h5 style={{ textAlign: "center" }}>
                    Välkommen!
                </h5>
                <br />
                Besök min <a href="https://github.com/ErikHedaker?tab=repositories">Github</a> för källkoden av sidan.
                <br />
                Alternativt besök min <a href="https://hub.docker.com/u/erikhedaker">Docker</a> för en docker image byggd för Linux.
            </div>
        );
    }
}