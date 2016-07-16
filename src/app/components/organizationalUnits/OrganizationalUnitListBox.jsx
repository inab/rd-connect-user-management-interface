var React = require('react');
var OrganizationalUnitListContainer = require('./OrganizationalUnitListContainer.jsx');    

const OrganizationalUnitListBox = ({props}) => (
	<div className="userBox">
    	<h1>Organizational Units</h1>
    	<OrganizationalUnitListContainer />
 	</div>
);
/*
var UserListBox = React.createClass({
  	render: function() {
    	return (
	     	<div className="userBox">
	        	<h1>Users</h1>
	        	<UserListContainer />
	     	</div>
    	);
  	}
});
*/
module.exports = OrganizationalUnitListBox;