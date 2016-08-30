var React = require('react');
var jQuery = require('jquery');
var DocumentsUsers = require('./DocumentsUsers.jsx');


var DocumentsUsersContainer = React.createClass({
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
