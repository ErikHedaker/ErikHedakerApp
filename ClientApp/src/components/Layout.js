import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import './Standard.css';

export class Layout extends Component {
    render() {
        return (
            <div>
                <NavMenu />
                <div className="style-bar-side style-bar-left"  />
                <div className="style-bar-side style-bar-right" />
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}