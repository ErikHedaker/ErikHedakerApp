import React from 'react';
import { Link } from 'react-router-dom';
import './Styles.css';

export function Overview(props) {
    const Project = (name, body) => {
        return (
            <div className="box-static">
                <Link tag={Link} to={"/" + name} className="text-dark">
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
            {Project("Dungeoncrawler", "Test")}
            <br /><br /><br />
            {Project("Snake", "Test")}
        </div>
    );
}