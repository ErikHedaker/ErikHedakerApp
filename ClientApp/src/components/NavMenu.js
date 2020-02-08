import React, { Component } from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">Erik Hedaker's Webbsite</NavbarBrand>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-dark border border-dark" to="/Portfolio">Portfolio</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark border border-dark" to="/Projects">Projects</NavLink>
                            </NavItem>
                        </ul>
                    </Container>
                </Navbar>
            </header>
        );
    }
}