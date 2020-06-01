import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;
    
    render() {
        return (
            <div style={styleBox}>
                <h5>
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

let styleBox = {
    display: "inline-block",
    textAlign: "left",
    background: "white",
    border: "1px solid lightgrey",
    borderRadius: "30px",
    padding: "30px"
}