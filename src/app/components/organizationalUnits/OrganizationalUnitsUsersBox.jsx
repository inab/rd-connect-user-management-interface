var React = require('react');
var OrganizationalUnitsUsersContainer = require('./OrganizationalUnitsUsersContainer.jsx');    

const OrganizationalUnitsUsersBox = ({props}) => (
	<div className="organizationalUnitsUsersBox">
    	<h1>Organizational Units</h1>
    	<OrganizationalUnitsUsersContainer />
 	</div>
);

module.exports = OrganizationalUnitsUsersBox;