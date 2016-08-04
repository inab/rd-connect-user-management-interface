var React = require('react');
var jQuery = require('jquery');
var OrganizationalUnitsUsersEditForm = require('./OrganizationalUnitsUsersEditForm.jsx');

var OrganizationalUnitsUsersFormContainer = React.createClass({
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
			url: 'json/users-from-' + this.props.params.organizationalUnit + '.json',
			type: 'GET',
			dataType: 'json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			contentType: 'application/json; charset=utf-8',
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
