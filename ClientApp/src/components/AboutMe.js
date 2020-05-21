import React, { Component } from 'react';
import './AboutMe.css';

export class AboutMe extends Component {
    static displayName = AboutMe.name;

    render() {
        return (
            <div>
                <div className="box">
                    <h4>Kontakt</h4>
                    <p>
                        E-mail: erik@hedaker.se<br />
                        Adress: Sergels Väg 14B, 21757 Malmö
                    </p>
                </div>
                <br /><br />
                <div className="box">
                    <h4>Utbildning</h4>
                    <p>
                        Pauliskolan, Teknikprogrammet (2013 - 2016, slutförd via Komvux 2019)
                    </p>
                </div>
            </div>
        );
    }
}