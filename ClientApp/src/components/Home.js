import React from 'react';
import './Standard.css';

export function Home(props) {
    return (
        <div className="standard-box">
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