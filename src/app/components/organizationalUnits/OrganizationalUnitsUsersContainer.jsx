import React from 'react';
import jQuery from 'jquery';
import OrganizationalUnitsUsers from './OrganizationalUnitsUsers.jsx';

import config from 'config.jsx';

var OrganizationalUnitsUsersContainer = React.createClass({
	propTypes:{
		task: React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			data: []
		};

	},
	componentWillMount: function() {
		this.loadUsersFromServer();
		this.loadUsersInterval = setInterval(this.loadUsersFromServer, 20000);
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
					//console.log('success!');
					this.setState({data: data});
					//console.log(this.state.data);
				}.bind(this),
				error: function(xhr, status, err) {
					//console.error('json/users.json', status, err);
					console.error(xhr.status);
					this.setState({error: xhr.status + ' (Retrieving users)'});
				}.bind(this)
			});
	},
	render: function() {
		if (this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if (this.state.data) {
			return (
				<div>
					<OrganizationalUnitsUsers data={this.state.data} task="viewEdit"/>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});

module.exports = OrganizationalUnitsUsersContainer;
