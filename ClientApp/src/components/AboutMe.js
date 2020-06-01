import React, { Component } from 'react';

export class AboutMe extends Component {
    static displayName = AboutMe.name;

    render() {
        return (
            <div style={styleBox}>
                <h5>
                    Kontakt
                </h5>
                <br />
                E-mail: erik@hedaker.se
                <br />
                Adress: Sergels Väg 14B, 21757 Malmö
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
};