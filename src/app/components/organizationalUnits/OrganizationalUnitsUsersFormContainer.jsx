import React from 'react';
import jQuery from 'jquery';
import OrganizationalUnitsUsersEditForm from './OrganizationalUnitsUsersEditForm.jsx';

import config from 'config.jsx';

var OrganizationalUnitsUsersFormContainer = React.createClass({
	propTypes:{
		params: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			users: null,
			error: null,
			showModal: false
		};
	},
	componentWillMount: function() {
		this.loadUsersFromOrganizationalUnit();
	},
	loadUsersFromOrganizationalUnit: function() {
		jQuery.ajax({
			url: config.ouBaseUri + '/' + encodeURIComponent(this.props.params.organizationalUnit) + '/members',
			cache: false,
			dataType: 'json',
		})
		.done(function(users) {
			this.setState({users: users});
		}.bind(this))
		.fail(function(jqXhr) {
			console.log('failed to retrieve users',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText});
		}.bind(this));
},

	render: function() {
		console.log('Users: ', this.state.users);
		if (this.state.users) {
			return (
				<div>
					<OrganizationalUnitsUsersEditForm users={this.state.users} />
				</div>
			);
		}
		if (this.state.error) {
			return (
				<div>
					Error: {this.state.error}
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});
module.exports = OrganizationalUnitsUsersFormContainer;
