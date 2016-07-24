var React = require('react');
var GroupsContainer = require('./GroupsContainer.jsx');

const GroupsBox = (props) => (
	<div className="groupBox">
		<h1>Groups</h1>
		<GroupsContainer />
	</div>
);
module.exports = GroupsBox;
