var React = require('react');
var UsersGroupsContainer = require('./UsersGroupsContainer.jsx');    

const UsersGroupsBox = ({props}) => (
	<div className="userBox">
    	<h1>Users</h1>
    	<UsersGroupsContainer/>
 	</div>
);

module.exports = UsersGroupsBox;