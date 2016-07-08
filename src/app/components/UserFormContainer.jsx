var React = require('react');
var jQuery = require('jquery');
var UserForm = require('./UserForm.jsx');

var UserFormContainer = React.createClass({
	loadUserFromServer: function() {
	    jQuery.ajax({
	    	url: "json/user-"+this.props.params.username+".json",
	    	dataType: 'json',
	      	cache: false,
	      	success: function(data) {
	      		console.log("success!");
	        	this.setState({data: data});
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
	    this.loadUserFromServer();
	    setInterval(this.loadUserFromServer, 200000);
	},
  	render: function() {
    	return (
        	<UserForm data={this.state.data} />
    	);
  	}
});

module.exports = UserFormContainer;
