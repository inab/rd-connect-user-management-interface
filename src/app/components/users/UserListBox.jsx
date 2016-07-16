var React = require('react');
var UserListContainer = require('./UserListContainer.jsx');    

const UserListBox = ({props}) => (
	<div className="userBox">
    	<h1>Users</h1>
    	<UserListContainer />
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
module.exports = UserListBox;