import React from 'react';
import jQuery from 'jquery';
import DocumentsGroup from './DocumentsGroup.jsx';

import config from 'config.jsx';
import auth from 'components/auth.jsx';

//This container should retrieve information about documents related to a given user
var DocumentsGroupContainer = React.createClass({
	propTypes:{
		route: React.PropTypes.array,
		params: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			data: null
		};

	},
	componentWillMount: function() {
		this.loadGroupDocumentsInfoFromServer();
		//setInterval(this.loadUsersFromServer, 20000);
		console.log('This state contains data for group: ', this.state.data);
	},
	loadGroupDocumentsInfoFromServer: function() {
		jQuery.ajax({
			url: config.groupsBaseUri + '/' + encodeURIComponent(this.props.params.groupName) + '/documents',
			type: 'GET',
			dataType: 'json',
			cache: false,
			headers: auth.getAuthHeaders(),
		})
		.done(function(data) {
			this.setState({data: data});
		}.bind(this))
		.fail(function(jqXhr) {
			console.log('Failed to retrieve Documents for this group',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve Documents. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve Documents. Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve Documents. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve Documents. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve Documents. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve Documents. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve Documents. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
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
					<DocumentsGroup data={this.state.data} groupName={this.props.params.groupName} />
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});
module.exports = DocumentsGroupContainer;
