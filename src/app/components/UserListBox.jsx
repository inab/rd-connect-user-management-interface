var React = require('react');
var UserListContainer = require('./UserListContainer.jsx');    

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

module.exports = UserListBox;