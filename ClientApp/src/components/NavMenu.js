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
            <Navbar style={styles.BarGradient} className="navbar-expand-sm mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/" className="hover-background" style={{ ...styles.Border, padding: "3px 12px 7px" }}>
                        Erik Hedåker
                    </NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <UncontrolledDropdown>
                            <DropdownToggle className="text-dark hover-background" style={styles.Border} nav caret>
                                <strong>
                                    {text.Projects[props.language]}
                                </strong>
                            </DropdownToggle>
                            <DropdownMenu style={styles.Border} right>
                                {DropdownThing("/Overview", text.Overview[props.language])}
                                <DropdownItem divider />
                                {DropdownThing("/Dungeoncrawler", "Dungeoncrawler")}
                                {DropdownThing("/Snake", "Snake")}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem style={{ ...styles.Border, marginLeft: "40px" }}>
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

const styles = {
    Border: {
        border: "3px solid slategray",
        borderRadius: "10px"
    },
    BarGradient: {
        background: "linear-gradient(rgba(150, 250, 250, 0.3), transparent)",
        backgroundColor: "#FAFAFA"
    }
};