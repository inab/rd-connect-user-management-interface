var React = require('react');
var jQuery = require('jquery');
var OrganizationalUnitsUsers = require('./OrganizationalUnitsUsers.jsx');


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
		//setInterval(this.loadUsersFromServer, 20000);
	},
	loadUsersFromServer: function() {
			jQuery.ajax({
			url: 'json/users.json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
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
