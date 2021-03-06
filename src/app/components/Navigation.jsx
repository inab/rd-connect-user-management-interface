import React from 'react';
import { Glyphicon, Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import TemplateDomains from './TemplateDomains.jsx';

class Navigation extends React.Component {
    render() {
        return (
            <Navbar fixedTop className="navigation" >
                <Navbar.Header>
                    <Navbar.Brand>
                        <LinkContainer to="/" ><img src="images/rdconnect-logo.jpg" alt={this.props.projectName} /></LinkContainer>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
					<Nav>
						<LinkContainer to="/"><NavItem eventKey={1}><Glyphicon glyph="home"> Home</Glyphicon></NavItem></LinkContainer>
						<NavDropdown id="NavDropdown-Users" eventKey={2} title={<Glyphicon glyph="user"> Users</Glyphicon>}>
							<LinkContainer to="/users/list" ><MenuItem eventKey={2.1}>List Users</MenuItem></LinkContainer>
							<LinkContainer to="/users/new"><MenuItem eventKey={2.2}>New User</MenuItem></LinkContainer>
							<LinkContainer to="/users/new-unprivileged"><MenuItem eventKey={2.3}>New User (unprivileged)</MenuItem></LinkContainer>
							<MenuItem divider />
							<LinkContainer to="/users/groups/list"><MenuItem eventKey={2.4}>User's list of groups</MenuItem></LinkContainer>
						</NavDropdown>
						<NavDropdown id="NavDropdown-Organizations" eventKey={3} title={<Glyphicon glyph="education"> Organizations</Glyphicon>}>
							<LinkContainer to="/organizationalUnits/list"><MenuItem eventKey={3.1}>List Organizations</MenuItem></LinkContainer>
							<LinkContainer to="/organizationalUnits/new"><MenuItem eventKey={3.2}>New Organization</MenuItem></LinkContainer>
							<MenuItem divider />
							<LinkContainer to="/organizationalUnits/users"><MenuItem eventKey={3.3}>Users in Organizations</MenuItem></LinkContainer>
						</NavDropdown>
						<NavDropdown id="NavDropdown-Groups" eventKey={4} title={<Glyphicon glyph="tags"> Groups</Glyphicon>}>
							<LinkContainer to="/groups/list"><MenuItem eventKey={4.1}>List Groups</MenuItem></LinkContainer>
							<LinkContainer to="/groups/new"><MenuItem eventKey={4.2}>New Group</MenuItem></LinkContainer>
						</NavDropdown>
					</Nav>
					<Nav pullRight>
						<NavDropdown id="NavDropdown-Mailing" eventKey={6} title={<Glyphicon glyph="envelope"> <span style={{wordSpacing: '-0.5em'}}>Mail tasks</span></Glyphicon>}>
							<LinkContainer to="/mail/platformMailing"><MenuItem eventKey={6.1}>Send e-mail to the platform</MenuItem></LinkContainer>
							<MenuItem divider />
							<TemplateDomains />
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
            </Navbar>
        );
    }
}

/* These menu items have been removed, as they are not properly implemented yet
							<LinkContainer to="/documents/users"><MenuItem eventKey={2.5}>User's Documents </MenuItem></LinkContainer>
 *
						<NavDropdown id="NavDropdown-Documents" eventKey={5} title={<Glyphicon glyph="folder-open"> Documents</Glyphicon>}>
								<LinkContainer to="/documents/users"><MenuItem eventKey={5.1}>Users</MenuItem></LinkContainer>
								<LinkContainer to="/documents/groups"><MenuItem eventKey={5.2}>Groups</MenuItem></LinkContainer>
						</NavDropdown>
*/


Navigation.propTypes = {
	projectName: React.PropTypes.string.isRequired
};
    


export default Navigation;
