import React from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Standard.css';

export function NavMenu(props) {
    let DropdownThing = (route, name) => {
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
            <Navbar style={style.BarGradient} className="navbar-expand-sm mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/" className="hover-background" style={Object.assign({ padding: "2px 12px 6px" }, style.Border)}>
                        Erik Hedåker
                    </NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <UncontrolledDropdown>
                            <DropdownToggle className="text-dark hover-background" style={style.Border} nav caret>
                                <strong>
                                    {text.Projects[props.language]}
                                </strong>
                            </DropdownToggle>
                            <DropdownMenu style={style.Border}>
                                {DropdownThing("/Overview", text.Overview[props.language])}
                                <DropdownItem divider />
                                {DropdownThing("/Dungeoncrawler", "Dungeoncrawler")}
                                {DropdownThing("/Snake", "Snake")}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem style={Object.assign({ marginLeft: "40px" }, style.Border)}>
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

const style = {
    Border: {
        border: "3px solid slategray",
        borderRadius: "10px"
    },
    BarGradient: {
        background: "linear-gradient(rgba(150, 250, 250, 0.4), transparent)",
        backgroundColor: "#FAFAFA"
    }
};