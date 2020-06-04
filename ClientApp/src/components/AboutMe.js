import React from 'react';
import './Styles.css';

export function AboutMe(props) {
    return (
        <div className="box-static">
            <h5>
                {text.Title[props.language]}
            </h5>
            <br />
            {text.Mail[props.language]}
            <br />
            {text.Phone[props.language]}
        </div>
    );
}

const text = {
    Title: {
        "en": "Contact",
        "sv": "Kontakt"
    },
    Mail: {
        "en": "E-Mail: erik@hedaker.se",
        "sv": "E-Mail: erik@hedaker.se"
    },
    Phone: {
        "en": "Mobile: +46722182488",
        "sv": "Mobil: 0722182488"
    }
};