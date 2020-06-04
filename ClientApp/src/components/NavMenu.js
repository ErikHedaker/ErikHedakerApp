import React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Styles.css';

export function NavMenu(props) {
    const DropdownThing = (route, name) => {
        return (
            <DropdownItem>
                <NavLink tag={Link} to={route} className="text-dark">
                    {name}
                </NavLink>
            </DropdownItem>
        );
    };

    return (
        <header>
            <Navbar className="gradient-top navbar-expand-sm mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/" className="border-navbar-item hover-background" style={{ padding: "3px 12px 7px" }}>
                        Erik Hedåker
                    </NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <UncontrolledDropdown>
                            <DropdownToggle className="border-navbar-item hover-background text-dark" nav caret>
                                <strong>
                                    {text.Projects[props.language]}
                                </strong>
                            </DropdownToggle>
                            <DropdownMenu className="border-navbar-item" right>
                                {DropdownThing("/Overview", text.Overview[props.language])}
                                <DropdownItem divider />
                                {DropdownThing("/Dungeoncrawler", "Dungeoncrawler")}
                                {DropdownThing("/Snake", "Snake")}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem className="border-navbar-item" style={{ marginLeft: "40px" }}>
                            <NavLink tag={Link} to="/AboutMe" className="text-dark hover-background">
                                <strong>
                                    {text.AboutMe[props.language]}
                                </strong>
                            </NavLink>
                        </NavItem>
                    </ul>
                </Container>
            </Navbar>
        </header>
    );
}

const text = {
    Overview: {
        "en": "Overview",
        "sv": "Översikt"
    },
    AboutMe: {
        "en": "About me",
        "sv": "Om mig"
    },
    Projects: {
        "en": "Projects",
        "sv": "Projekt"
    }
};