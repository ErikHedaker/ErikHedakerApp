import React from 'react';
import { Link } from 'react-router-dom';
import './Standard.css';

export function Overview(props) {
    let Project = (route, name, body) => {
        return (
            <div className="standard-box">
                <Link tag={Link} to={route} className="text-dark">
                    <span style={{ display: "block" }}>
                        <h5>
                            {name}
                        </h5>
                        <br />
                        {body}
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div>
            {Project("/Dungeoncrawler", "Dungeoncrawler", "Test")}
            <br /><br /><br />
            {Project("/Snake", "Snake", "Test")}
        </div>
    );
}