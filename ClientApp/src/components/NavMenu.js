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
            <Navbar style={styleBarGradient} className="navbar-expand-sm mb-3" light>
                <Container>
                    <NavbarBrand tag={Link} to="/" className="hover-background" style={Object.assign({ padding: "2px 12px 6px" }, styleBorder)}>
                        Erik Hedåker
                    </NavbarBrand>
                    <ul className="navbar-nav flex-grow">
                        <UncontrolledDropdown>
                            <DropdownToggle className="text-dark hover-background" style={styleBorder} nav caret>
                                <strong>
                                    Projekt
                                </strong>
                            </DropdownToggle>
                            <DropdownMenu style={styleBorder}>
                                {DropdownThing("/Overview", "Översikt")}
                                <DropdownItem divider />
                                {DropdownThing("/Dungeoncrawler", "Dungeoncrawler")}
                                {DropdownThing("/Snake", "Snake")}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem style={Object.assign({ marginLeft: "40px" }, styleBorder)}>
                            <NavLink tag={Link} to="/AboutMe" className="text-dark hover-background">
                                <strong>
                                    Om mig
                                </strong>
                            </NavLink>
                        </NavItem>
                    </ul>
                </Container>
            </Navbar>
        </header>
    );
}

let styleBorder = {
    border: "3px solid slategray",
    borderRadius: "10px"
}

let styleBarGradient = {
    background: "linear-gradient(rgba(150, 250, 250, 0.4), transparent)",
    backgroundColor: "#FAFAFA"
}