import React from 'react';
import './Standard.css';

export function Home(props) {
    return (
        <div className="standard-box" style={{ display: "block" }}>
            <h5>
                {text.Title[props.language]}
            </h5>
            <br />
            {text.Info[props.language]}
            <br />
            {text.Body.A[props.language]}
            <a href="https://github.com/ErikHedaker/ErikHedakerApp">Github</a>
            {text.Body.B[props.language]}
            <a href="https://hub.docker.com/r/erikhedaker/erikhedakerapp">Dockerhub</a>
            {text.Body.C[props.language]}
        </div>
    );
}

const text = {
    Title: {
        "en": "Welcome!",
        "sv": "Välkommen!"
    },
    Info: {
        "en": "This website is a ASP.NET Core 3.1 Web App, deployed in a Docker container, with React.js as frontend, hosted with Nginx reverse proxy on a DigitalOcean VPS with Ubuntu 18.04",
        "sv": "Denna hemsidan är en ASP.NET Core 3.1 Web App, körd i en Docker container, med React.js som frontend, hostad med Nginx reverse proxy på en DigitalOcean VPS med Ubuntu 18.04"
    },
    Body: {
        A: {
            "en": "Visit my ",
            "sv": "Besök min "
        },
        B: {
            "en": " for the source code of the website, alternatively visit my ",
            "sv": " för källkoden av sidan, alternativt besök min "
        },
        C: {
            "en": " for a docker image built for Linux",
            "sv": " för en docker image byggd för Linux"
        }
    }
};