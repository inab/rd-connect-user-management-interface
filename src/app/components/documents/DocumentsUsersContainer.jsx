import React from 'react';
import jQuery from 'jquery';
import DocumentsUsers from './DocumentsUsers.jsx';

import config from 'config.jsx';

var DocumentsUsersContainer = React.createClass({
	getInitialState: function() {
		return {
			data: []
		};

	},
	componentWillMount: function() {
		this.loadUsersFromServer();
		setInterval(this.loadUsersFromServer, 15000);
	},
	loadUsersFromServer: function() {
		jQuery.ajax({
			url: config.usersBaseUri,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/users.json", status, err);
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
					<DocumentsUsers data={this.state.data}/>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});

module.exports = DocumentsUsersContainer;
