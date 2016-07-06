import React from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


var Navigation = React.createClass({

    render: function() {
        return (
            <Navbar inverse fixedTop >
	    	<Navbar.Header>
    		    <Navbar.Brand>
                            <a href="#">{this.props.projectName}</a>
    		    </Navbar.Brand>
    		</Navbar.Header>
                <Nav>
                    <LinkContainer to='/'>
                      <MenuItem eventKey={1}>Home</MenuItem>
                    </LinkContainer>
                    <NavDropdown eventKey={2} title="Users">
                        <LinkContainer to="/listUsers"><MenuItem>List Users</MenuItem></LinkContainer>
                        <MenuItem eventKey="1">List Users</MenuItem>
                        <MenuItem eventKey="2">Create User</MenuItem>
                        <MenuItem eventKey="3">Users Action 3</MenuItem>
                        <MenuItem eventKey="4">Users Action 4</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="5">Separated Users link</MenuItem>
                    </NavDropdown>
                    <NavDropdown eventKey={3} title="Organizations">
                        <MenuItem eventKey="1">List Organizations</MenuItem>
                        <MenuItem eventKey="2">Create Organization</MenuItem>
                        <MenuItem eventKey="3">Organizations Action 3</MenuItem>
                        <MenuItem eventKey="4">Organizations Action 4</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="5">Separated Organizations link</MenuItem>
                    </NavDropdown>
                    <NavDropdown eventKey={4} title="Groups">
                        <MenuItem eventKey="1">List Groups</MenuItem>
                        <MenuItem eventKey="2">Create Group</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4">Separated link</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = Navigation;
