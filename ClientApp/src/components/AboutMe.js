import React, { Component } from 'react';
import './AboutMe.css';

export class AboutMe extends Component {
    static displayName = AboutMe.name;

    render() {
        return (
            <div>
                <div className="box-left">
                    <h5>Kontakt</h5>
                    <p>
                        E-mail: erik@hedaker.se<br />
                        Adress: Sergels Väg 14B, 21757 Malmö
                    </p>
                </div>
                <br /><br />
            </div>
        );
    }
}