import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import './Styles.css';

export function Layout(props) {
    return (
        <div>
            <NavMenu language={props.language} />
            <div className="side-bar gradient-left"  />
            <div className="side-bar gradient-right" />
            <Container>
                {props.children}
            </Container>
        </div>
    );
}