var React = require('react');
var UsersContainer = require('./UsersContainer.jsx');

const UsersBox = () => (
	<div className="userBox">
		<h1>Users</h1>
		<UsersContainer />
	</div>
);

module.exports = UsersBox;
