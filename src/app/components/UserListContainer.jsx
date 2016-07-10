var React = require('react');
var jQuery = require('jquery');
var UserList = require('./UserList.jsx');

var UserListContainer = React.createClass({
	loadUsersFromServer: function() {
	    jQuery.ajax({
	    	url: "json/users.json",
	    	dataType: 'json',
	      	cache: false,
	      	success: function(data) {
	      		console.log("success!");
	        	this.setState({data: data});
	        	//console.log(this.state.data);
	      	}.bind(this),
	      	error: function(xhr, status, err) {
	        	console.error("json/users.json", status, err);
	      	}.bind(this)
	    });
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
	    this.loadUsersFromServer();
	    //setInterval(this.loadUsersFromServer, 20000);
	},
  	render: function() {
    	return (
        	<UserList data={this.state.data} />
    	);
  	}
});

module.exports = UserListContainer;
