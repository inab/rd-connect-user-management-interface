import React from 'react';
import { Link, Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


var Navigation = React.createClass({
    propTypes:{
        projectName: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <Navbar fixedTop className="navigation" >
                <Navbar.Header>
                    <Navbar.Brand>
                        <LinkContainer to="/" ><img src="images/rdconnect-logo.jpg" alt={this.props.projectName} /></LinkContainer>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <LinkContainer to="/" onlyActiveOnIndex><MenuItem eventKey={1}>Home</MenuItem></LinkContainer>
                    <NavDropdown id="NavDropdown-Users" eventKey={2} title="Users">
                        <LinkContainer to="/users/list" ><MenuItem eventKey={2.1}>List Users</MenuItem></LinkContainer>
                        <LinkContainer to="/users/new"><MenuItem eventKey={2.2}>New User</MenuItem></LinkContainer>
                        <LinkContainer to="/users/new-unprivileged"><MenuItem eventKey={2.3}>New User (unprivileged)</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/users/groups/list"><MenuItem eventKey={2.4}>User's list of groups</MenuItem></LinkContainer>
                        <LinkContainer to="/documents/users"><MenuItem eventKey={2.5}>User's Documents </MenuItem></LinkContainer>
                    </NavDropdown>
                    <NavDropdown id="NavDropdown-Organizations" eventKey={3} title="Organizations">
                        <LinkContainer to="/organizationalUnits/list"><MenuItem eventKey={3.1}>List Organizations</MenuItem></LinkContainer>
                        <LinkContainer to="/organizationalUnits/new"><MenuItem eventKey={3.2}>New Organization</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/organizationalUnits/users"><MenuItem eventKey={3.3}>Users in Organizations</MenuItem></LinkContainer>
                    </NavDropdown>
                    <NavDropdown id="NavDropdown-Groups" eventKey={4} title="Groups">
                        <LinkContainer to="/groups/list"><MenuItem eventKey={4.1}>List Groups</MenuItem></LinkContainer>
                        <LinkContainer to="/groups/new"><MenuItem eventKey={4.2}>New Group</MenuItem></LinkContainer>
                    </NavDropdown>
                    <NavDropdown id="NavDropdown-Documents" eventKey={5} title="Documents">
                            <LinkContainer to="/documents/users"><MenuItem eventKey={5.1}>Users</MenuItem></LinkContainer>
                            <LinkContainer to="/documents/groups"><MenuItem eventKey={5.2}>Groups</MenuItem></LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = Navigation;
