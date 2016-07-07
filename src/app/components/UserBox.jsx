var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jQuery');
var UserList = require('./UserList.jsx');    
var UserForm = require('./UserForm.jsx');    
//var Navigation = require('./navigation.jsx');

var UserBox = React.createClass({
	loadUsersFromServer: function() {
	    jQuery.ajax({
	    	url: "/json/users.json",
	    	dataType: 'json',
	      	cache: false,
	      	success: function(data) {
	      		console.log("success!");
	        	this.setState({data: data});
	        	console.log(this.state.data);
	      	}.bind(this),
	      	error: function(xhr, status, err) {
	        	console.error("/json/users.json", status, err.toString());
	      	}.bind(this)
	    });
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
	    this.loadUsersFromServer();
	    setInterval(this.loadUsersFromServer, 20000);
	},
  	render: function() {
    	return (
	     	<div className="userBox">
	        	<h1>Users</h1>
	        	<UserList data={this.state.data} />
	        	<UserForm />
	     	</div>
    	);
  	}
});

module.exports = UserBox;