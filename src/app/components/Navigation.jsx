import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


var Navigation = React.createClass({

    render: function() {
        return (
            <Navbar inverse fixedTop >
	    	<Navbar.Header>
    		    <Navbar.Brand>
                            <a style={{padding: 0}} href=""><img src="images/rdconnect-logo.jpg" alt={this.props.projectName} style={{height: '100%',paddingRight: '1em',paddingLeft: '1em',backgroundColor: 'white'}}/></a>
    		    </Navbar.Brand>
    		</Navbar.Header>
                <Nav>
                    <LinkContainer to='/' onlyActiveOnIndex={true}><MenuItem eventKey={1}>Home</MenuItem></LinkContainer>
                    <NavDropdown id="NavDropdown-Users" eventKey={2} title="Users">
                        <LinkContainer to="/users"><MenuItem eventKey="1">List Users</MenuItem></LinkContainer>
                        <LinkContainer to="/users/new"><MenuItem eventKey="2">New User</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/users/groups"><MenuItem eventKey="1">User's list of groups</MenuItem></LinkContainer>
                        <LinkContainer to="/userAction2"><MenuItem eventKey="2">User's Documents </MenuItem></LinkContainer>
                    </NavDropdown>
                    <NavDropdown id="NavDropdown-Organizations" eventKey={4} title="Organizations">
                        <LinkContainer to="/organizationalUnits"><MenuItem eventKey="1">List Organizations</MenuItem></LinkContainer>
                        <LinkContainer to="/organizationalUnits/new"><MenuItem eventKey="2">New Organization</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/organizationalUnits/users"><MenuItem eventKey="1">Users in Organizations</MenuItem></LinkContainer>
                    </NavDropdown>
                    <NavDropdown id="NavDropdown-Groups" eventKey={5} title="Groups">
                        <LinkContainer to="/groups"><MenuItem eventKey="1">List Groups</MenuItem></LinkContainer>
                        <LinkContainer to="/groups/new"><MenuItem eventKey="2">New Group</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/groupAction5"><MenuItem eventKey="3">Separated Groups link</MenuItem></LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = Navigation;
