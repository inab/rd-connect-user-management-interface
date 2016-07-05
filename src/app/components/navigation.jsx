var React = require('react');
var Bootstrap = require('react-bootstrap');

var Navbar = Bootstrap.Navbar;
var Nav = Bootstrap.Nav;
var NavItem = Bootstrap.NavItem;
var NavDropdown = Bootstrap.NavDropdown;
var MenuItem = Bootstrap.MenuItem;

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
                    <NavItem active eventKey={1} href="#home">Home</NavItem>
                    <NavItem eventKey={2} href="#about">About</NavItem>
                    <NavItem eventKey={2} href="#about">Contact</NavItem>
                    <NavDropdown eventKey={3} title="Dropdown">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
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
