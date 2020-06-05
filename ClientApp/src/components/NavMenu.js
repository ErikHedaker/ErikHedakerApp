import React from 'react';
import { Container, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
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
        <Nav className="gradient-top">
            <Container style={{ marginTop: "12px", marginBottom: "24px", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <NavItem className="border-navbar-item hover-background" style={{ marginRight: "auto" }}>
                    <NavLink className="nav-item" tag={Link} to="/">
                        Erik Hedåker
                    </NavLink>
                </NavItem>
                <UncontrolledDropdown className="border-navbar-item hover-background text-dark" style={{ marginLeft: "2px" }}>
                    <DropdownToggle className="nav-item" nav caret>
                        {text.Projects[props.language]}
                    </DropdownToggle>
                    <DropdownMenu className="border-navbar-item" style={{ margin: "5px 0px 0px -3px" }}>
                        {DropdownThing("/Overview", text.Overview[props.language])}
                        <DropdownItem divider />
                        {DropdownThing("/Dungeoncrawler", "Dungeoncrawler")}
                        {DropdownThing("/Snake", "Snake")}
                    </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem className="nav-item hover-background border-navbar-item" style={{ marginLeft: "2px" }}>
                    <NavLink className="nav-item" tag={Link} to="/AboutMe">
                        {text.AboutMe[props.language]}
                    </NavLink>
                </NavItem>
            </Container>
        </Nav>
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