import React from 'react';
import jQuery from 'jquery';
import DocumentsUser from './DocumentsUser.jsx';
import { Modal, Button } from 'react-bootstrap';

import config from 'config.jsx';
import auth from 'components/auth.jsx';
import { hashHistory } from 'react-router';

//This container should retrieve information about documents related to a given user
const DocumentsUserContainer = React.createClass({
	propTypes:{
		route: React.PropTypes.object,
		params: React.PropTypes.object
	},
	contextTypes: {
		router: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			data: null,
			error: null,
			showModal: false
		};

	},
	componentWillMount: function() {
		this.loadUserDocumentsInfoFromServer();
		this.loadUserDocumentsInterval = setInterval(this.loadUserDocumentsInfoFromServer, 15000);
		//console.log('This state contains data for user: ', this.state.data);
	},
	componentWillUnmount: function(){
		clearInterval(this.loadUserDocumentsInterval);
		this.serverRequest.abort();
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	loadUserDocumentsInfoFromServer: function() {
		this.serverRequest = jQuery.ajax({
			url: config.usersBaseUri + '/' + encodeURIComponent(this.props.params.username) + '/documents',
			type: 'GET',
			dataType: 'json',
			cache: false,
			headers: auth.getAuthHeaders(),
		})
		.done(function(data) {
			this.setState({data: data});
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('Failed to retrieve Documents for this user',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Failed to retrieve Documents. Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Failed to retrieve Documents. User ' + this.props.params.username + ' has no documents yet';
			} else if(jqXhr.status === 500) {
				responseText = 'Failed to retrieve Documents. Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve Documents. Requested JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve Documents. Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve Documents. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve Documents. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		if(this.state.error) {
			return (
				<div>
					<Modal show={this.state.showModal} onHide={()=>hashHistory.goBack()} error={this.state.error}>
						<Modal.Header closeButton>
							<Modal.Title>Error!</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<h4>{this.state.error}</h4>
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={()=>hashHistory.goBack()}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		if(this.state.data) {
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
