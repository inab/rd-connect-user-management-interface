var React = require('react');
var jQuery = require('jquery');
var GroupList = require('./GroupList.jsx');

var GroupListContainer = React.createClass({
	loadGroupsFromServer: function() {
	    jQuery.ajax({
	    	url: "json/groups.json",
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
	        	//console.error("json/groups.json", status, err);
	        	console.error(xhr.status);
	        	this.setState({error: xhr.status + ' (Retrieving groups)'});
	      	}.bind(this)
	    });
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
	    this.loadGroupsFromServer();
	    //setInterval(this.loadGroupsFromServer, 20000);
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
	      			<GroupList data={this.state.data} />
	      		</div>
	      	)
	    }
	}
});

module.exports = GroupListContainer;
