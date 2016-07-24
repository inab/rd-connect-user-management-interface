var React = require('react');
var jQuery = require('jquery');
var UsersGroupsEditForm = require('./UsersGroupsEditForm.jsx');
var UsersGroupsViewForm = require('./UsersGroupsViewForm.jsx');

var UsersGroupsFormContainer = React.createClass({
	getInitialState: function() {
		console.log('TASK: ', this.props.route.task);
		return {
			schema: null,
			data: null,
			groups: null,
			error: null,
			showModal: false,
			task: this.props.route.task
		};
	},
	componentDidMount: function() {
		this.loadUserSchema();
	},
	loadUserFromServer: function() {
		jQuery.ajax({
			url: 'json/user-' + this.props.params.username + '.json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			dataType: 'json',
			cache: false,
		})
		.done(function(data) {
				//console.log('success!');
				this.setState({data: data});
				//console.log(this.state.data);
		}.bind(this))
		.fail(function(xhr, status, err) {
				//console.error('json/users.json', status, err);
				console.error(xhr.status);
				this.setState({error: xhr.status + ' (Retrieving users)'});
		}.bind(this));
	},
	loadGroupsFromServer: function() {
		jQuery.ajax({
			url: 'json/groups.json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			dataType: 'json',
			cache: false,
		})
		.done(function(groups) {
			//console.log('success!');
			this.setState({groups: groups});
			this.loadUserFromServer();
		}.bind(this))
		.fail(function(xhr, status, err) {
			//console.error('json/OrganizationalUnitalUnits.json', status, err);
			console.error(xhr.status);
			this.setState({error: xhr.status + ' (Retrieving Groups)'});
		}.bind(this));
	},
	loadUserSchema: function() {
		jQuery.ajax({
			url: 'json/userValidation.json',
			type: 'GET',
			dataType: 'json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			contentType: 'application/json; charset=utf-8',
		})
		.done(function(schema) {
			this.setState({schema: schema});
			this.loadGroupsFromServer();
		}.bind(this))
		.fail(function(jqXhr) {
			console.log('failed to retrieve user Schema',jqXhr);
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
		console.log('Schema: ', this.state.schema);
		console.log('Data: ', this.state.data);
		console.log('Groups: ', this.state.groups);
		console.log('TASK: ', this.state.task);

		if ((this.state.schema) && (this.state.data) && (this.state.groups)) {
			if (this.state.task === 'users_groups_view'){
				return (
					<div>
						<UsersGroupsViewForm schema={this.state.schema} data={this.state.data} groups={this.state.groups} />
					</div>
				);
			} else if (this.state.task === 'users_groups_edit'){
				return (
					<div>
						<UsersGroupsEditForm schema={this.state.schema} data={this.state.data} groups={this.state.groups} />
					</div>
				);
			}

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
module.exports = UsersGroupsFormContainer;
