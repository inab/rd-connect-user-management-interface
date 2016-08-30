var React = require('react');
var jQuery = require('jquery');
var DocumentsUser = require('./DocumentsUser.jsx');

//This container should retrieve information about documents related to a given user
var DocumentsUserContainer = React.createClass({
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
		this.loadUserDocumentsInfoFromServer();
		//setInterval(this.loadUsersFromServer, 20000);
		console.log('This state contains data for user: ', this.state.data);
	},
	loadUserDocumentsInfoFromServer: function() {
		jQuery.ajax({
			url: 'json/documents-' + this.props.params.username + '.json',
			type: 'GET',
			dataType: 'json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			contentType: 'application/json; charset=utf-8',
		})
		.done(function(data) {
			this.setState({data: data});
		}.bind(this))
		.fail(function(jqXhr) {
			console.log('Failed to retrieve Documents for this user',jqXhr);
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
					<DocumentsUser data={this.state.data}/>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});
module.exports = DocumentsUserContainer;
