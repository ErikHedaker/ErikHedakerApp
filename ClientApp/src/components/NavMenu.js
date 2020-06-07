import React from 'react';
import { Container, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Styles.css';

export function NavMenu(props) {
    const DropdownThing = (route, name) => {
        return (
            <DropdownItem style={{ padding: "8px" }}>
                <NavLink tag={Link} to={route} className="text-dark">
                    {name}
                </NavLink>
            </DropdownItem>
        );
    };

    return (
        <Nav className="gradient-top">
            <Container style={{ marginTop: "12px", marginBottom: "24px", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <NavItem style={{ marginRight: "auto" }}>
                    <NavLink className="navmenu-header navmenu-border navmenu-hover-background"  tag={Link} to="/">
                        Erik Hedåker
                    </NavLink>
                </NavItem>
                <UncontrolledDropdown style={{ marginLeft: "2px" }}>
                    <DropdownToggle className="navmenu-header navmenu-border navmenu-hover-background" nav caret>
                        {text.Projects[props.language]}
                    </DropdownToggle>
                    <DropdownMenu className="navmenu-border" style={{ marginTop: "2px" }}>
                        {DropdownThing("/Overview", text.Overview[props.language])}
                        <DropdownItem divider />
                        {DropdownThing("/Dungeoncrawler", "Dungeoncrawler")}
                        {DropdownThing("/Snake", "Snake")}
                    </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem style={{ marginLeft: "2px" }}>
                    <NavLink className="navmenu-header navmenu-border navmenu-hover-background"  tag={Link} to="/AboutMe">
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