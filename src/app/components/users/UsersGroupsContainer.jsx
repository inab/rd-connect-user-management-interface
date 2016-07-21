var React = require('react');
var jQuery = require('jquery');
var UsersGroups = require('./UsersGroups.jsx');

var UsersGroupsContainer = React.createClass({
  	getInitialState: function() {
    	return { 
    		data: []
    	};
  	},
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
  	componentDidMount: function() {
    	this.loadUsersFromServer();
  	},

  	render: function() {
  		//console.log("Schema: ", this.state.schema);
  		//console.log("Data: ", this.state.data);
  		//console.log("Groups: ", this.state.groups);
    	if (this.state.data) {
	    	return (
	    		<div>
	      			<UsersGroups data={this.state.data} />
	      		</div>
	      	);	      	
    	}
	    if (this.state.error) {
	    	return (
	      		<div>
		    		Error: {this.state.error}
		    	</div>
	      	)
	    }
	    return <div>Loading...</div>;
	}
});
module.exports = UsersGroupsContainer;
