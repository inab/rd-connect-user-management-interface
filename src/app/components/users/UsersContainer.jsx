var React = require('react');
var jQuery = require('jquery');
var Users = require('./Users.jsx');

var UsersContainer = React.createClass({
	loadUsersFromServer: function() {
	    jQuery.ajax({
	    	url: "json/users.json",
	    	headers: {
				'X-CAS-Referer': window.location.href
			},
	    	dataType: 'json',
	      	cache: false,
	      	success: function(data) {
	      		//console.log("success!");
	        	this.setState({data: data});
	        	//console.log(this.state.data);
	      	}.bind(this),
	      	error: function(xhr, status, err) {
	        	//console.error("json/users.json", status, err);
	        	console.error(xhr.status);
	        	this.setState({error: xhr.status + ' (Retrieving users)'});
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
  		
  		if (this.state.error) {
	      	return (
	      		<div>Error {this.state.error}</div>
	      	)
	    }
  		if (this.state.data) {
	    	return (
	    		<div>
	      			<Users data={this.state.data} />
	      		</div>
	      	)
	    }
	}
});

module.exports = UsersContainer;
