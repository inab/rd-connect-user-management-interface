import React from 'react';
import jQuery from 'jquery';
import DocumentsGroups from './DocumentsGroups.jsx';

import config from 'config.jsx';

var DocumentsGroupsContainer = React.createClass({
	getInitialState: function() {
		return {
			data: []
		};

	},
	componentWillMount: function() {
		this.loadGroupsFromServer();
		setInterval(this.loadGroupsFromServer, 15000);
	},
	loadGroupsFromServer: function() {
		jQuery.ajax({
			url: config.groupsBaseUri,
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
					<DocumentsGroups data={this.state.data}/>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});

module.exports = DocumentsGroupsContainer;
