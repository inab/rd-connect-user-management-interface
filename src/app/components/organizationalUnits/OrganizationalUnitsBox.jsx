var React = require('react');
var OrganizationalUnitsContainer = require('./OrganizationalUnitsContainer.jsx');    

const OrganizationalUnitsBox = ({props}) => (
	<div className="userBox">
    	<h1>Organizational Units</h1>
    	<OrganizationalUnitsContainer />
 	</div>
);

module.exports = OrganizationalUnitsBox;