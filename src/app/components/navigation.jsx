import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


var Navigation = React.createClass({

    render: function() {
        return (
            <Navbar inverse fixedTop >
	    	<Navbar.Header>
    		    <Navbar.Brand>
                            <a style={{padding: 0}} href="#"><img src="images/rdconnect-logo.jpg" alt={this.props.projectName} style={{height: '100%','padding-right': '1em','padding-left': '1em','background-color': 'white'}}/></a>
    		    </Navbar.Brand>
    		</Navbar.Header>
                <Nav>
                    <LinkContainer to='/' onlyActiveOnIndex={true}><MenuItem eventKey={1}>Home</MenuItem></LinkContainer>
                    <NavDropdown eventKey={2} title="Users">
                        <LinkContainer to="/listUsers"><MenuItem eventKey="1">List Users</MenuItem></LinkContainer>
                        <LinkContainer to="/newUser"><MenuItem eventKey="2">New User</MenuItem></LinkContainer>
                        <LinkContainer to="/userAction3"><MenuItem eventKey="3">Users Action 3</MenuItem></LinkContainer>
                        <LinkContainer to="/userAction4"><MenuItem eventKey="4">Users Action 4</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/userAction5"><MenuItem eventKey="5">Separated Users link</MenuItem></LinkContainer>

                    </NavDropdown>
                    <NavDropdown eventKey={3} title="Organizations">
                        <LinkContainer to="/listOrganizations"><MenuItem eventKey="1">List Organizations</MenuItem></LinkContainer>
                        <LinkContainer to="/newOrganization"><MenuItem eventKey="2">New Organization</MenuItem></LinkContainer>
                        <LinkContainer to="/organizationAction3"><MenuItem eventKey="3">Organizations Action 3</MenuItem></LinkContainer>
                        <LinkContainer to="/organizationAction4"><MenuItem eventKey="4">Organizations Action 4</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/organizationAction5"><MenuItem eventKey="5">Separated Organizations link</MenuItem></LinkContainer>
                        
                    </NavDropdown>
                    <NavDropdown eventKey={4} title="Groups">
                        <LinkContainer to="/listGroups"><MenuItem eventKey="1">List Groups</MenuItem></LinkContainer>
                        <LinkContainer to="/newGroup"><MenuItem eventKey="2">New Group</MenuItem></LinkContainer>
                        <LinkContainer to="/groupAction3"><MenuItem eventKey="3">Groups Action 3</MenuItem></LinkContainer>
                        <LinkContainer to="/groupAction4"><MenuItem eventKey="4">Groups Action 4</MenuItem></LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/groupAction5"><MenuItem eventKey="5">Separated Groups link</MenuItem></LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = Navigation;
