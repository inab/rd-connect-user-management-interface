var React = require('react');
var jQuery = require('jquery');
var UserNewForm = require('./UserNewForm.jsx');

var UserNewFormContainer = React.createClass({
	getInitialState: function() {
		return { schema: null };
	},
	componentDidMount: function() {
		this.loadUserSchema();
	},
	loadOrganizationalUnitsFromServer: function() {
		jQuery.ajax({
			url: 'json/organizationalUnits.json',
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
				//console.error("json/OrganizationalUnitalUnits.json", status, err);
				console.error(xhr.status);
				this.setState({error: xhr.status + ' (Retrieving Organizational Units)'});
			}.bind(this)
		});
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
			this.loadOrganizationalUnitsFromServer();
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
		if ((this.state.schema) && (this.state.data)) {
			return (
				<div>
					<UserNewForm   schema={this.state.schema} data={this.state.data}/>
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
		module.exports = UserNewFormContainer;
