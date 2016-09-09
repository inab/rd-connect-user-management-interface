var React = require('react');
var jQuery = require('jquery');
var DocumentsGroups = require('./DocumentsGroups.jsx');


var DocumentsGroupsContainer = React.createClass({
	getInitialState: function() {
		return {
			data: []
		};

	},
	componentWillMount: function() {
		this.loadGroupsFromServer();
		//setInterval(this.loadUsersFromServer, 20000);
	},
	loadGroupsFromServer: function() {
		jQuery.ajax({
			url: 'json/groups.json',
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
					<DocumentsGroups data={this.state.data}/>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});

module.exports = DocumentsGroupsContainer;
