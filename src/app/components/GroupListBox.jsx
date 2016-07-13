var React = require('react');
var GroupListContainer = require('./GroupListContainer.jsx');    

const GroupListBox = ({props}) => (
	<div className="groupBox">
    	<h1>Groups</h1>
    	<GroupListContainer />
 	</div>
);
module.exports = GroupListBox;