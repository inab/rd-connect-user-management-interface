import React from 'react';
import jQuery from 'jquery';
import UsersGroups from './UsersGroups.jsx';

import config from 'config.jsx';

var UsersGroupsContainer = React.createClass({
	getInitialState: function() {
		return {
			data: []
		};
	},
	componentDidMount: function() {
		this.loadUsersFromServer();
		this.loadUsersInterval = setInterval(this.loadUsersFromServer, 15000);
	},
	componentWillUnmount: function(){
		clearInterval(this.loadUsersInterval);
		this.serverRequest.abort();
	},
	loadUsersFromServer: function() {
		this.serverRequest = jQuery.ajax({
			url: config.usersBaseUri,
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

	render: function() {
	//console.log("Schema: ", this.state.schema);
	//console.log("Data: ", this.state.data);
	//console.log("Groups: ", this.state.groups);
		if(this.state.data) {
			return (
				<div>
					<UsersGroups data={this.state.data} />
				</div>
			);
		}
		if(this.state.error) {
			return (
				<div>
					Error: {this.state.error}
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});
module.exports = UsersGroupsContainer;

