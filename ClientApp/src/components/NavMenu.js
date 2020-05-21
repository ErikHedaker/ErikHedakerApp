import React, { Component } from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm mb-3" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">Erik Hedåker</NavbarBrand>
                        <ul className="navbar-nav flex-grow">
                            <UncontrolledDropdown title="Portfolio" id="collasible-nav-dropdown">
                                <DropdownToggle className="text-dark" nav caret>Projekt</DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/Snake">Snake</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink tag={Link} className="text-dark" to="/Dungeoncrawler">Dungeoncrawler</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/AboutMe">Om mig</NavLink>
                            </NavItem>
                        </ul>
                    </Container>
                </Navbar>
            </header>
        );
    }
}