import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import './Standard.css';

export function Layout(props) {
    return (
        <div>
            <NavMenu language={props.language} />
            <div className="side-bar fade-bar-left"  />
            <div className="side-bar fade-bar-right" />
            <Container>
                {props.children}
            </Container>
        </div>
    );
}