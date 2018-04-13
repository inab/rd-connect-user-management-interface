import React from 'react';
import { Modal , Button } from 'react-bootstrap';
import jQuery from 'jquery';
import UserEditForm from './UserEditForm.jsx';
import UserViewForm from './UserViewForm.jsx';
import UserEnableDisableForm from './UserEnableDisableForm.jsx';

import { hashHistory } from 'react-router';

import config from 'config.jsx';

var UserEditFormContainer = React.createClass({
	propTypes:{
		route: React.PropTypes.object,
		params: React.PropTypes.object
	},
	//mixins: [ History ], //This is to browse history back when user is not found after showing modal error
	contextTypes: {
		router: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			schema: null,
			data: null,
			error: null,
			showModal: false,
			task: null
		};
	},
	componentDidMount: function() {
		this.setState({task: this.props.route.task});
		this.loadUserData();
	},
	componentWillUnmount: function(){
		this.serverDataRequest.abort();
		this.serverSchemaRequest.abort();
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	loadUserSchema: function() {
		this.serverSchemaRequest = jQuery.ajax({
			url: config.usersBaseUri + '?schema',
			type: 'GET',
			dataType: 'json',
		})
		.done(function(schema) {
			this.setState({schema: schema});
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('Failed to retrieve user Schema',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve user Schema. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve user Schema. Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve user Schema. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve user Schema. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve user Schema. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve user Schema. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve user Schema. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	loadUserData: function() {
		this.serverDataRequest = jQuery.ajax({
			url: config.usersBaseUri + '/' + encodeURIComponent(this.props.params.username),
			type: 'GET',
			cache: false,
			dataType: 'json',
		})
		.done(function(data) {
			this.setState({data: data});
			this.loadUserSchema();
		}.bind(this))
		.fail(function(jqXhr, textStatus, errorThrown) {
			//console.log('Failed to retrieve user Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve user Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve user Information. Requested User not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve user Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve user Information. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve user Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve user Information. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve user Information. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},

  render: function() {
	//console.log('task: ', this.state.task);
	//console.log('schema: ', this.state.schema);
	//console.log('data: ', this.state.data);
	//console.log('error: ', this.state.error);
	if (this.state.schema && this.state.data) {
			return (
				<div>
					<UserEditForm schema={this.state.schema}  data={this.state.data}  />
				</div>
			);
	}
	if (this.state.error) {
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
	return <div>Loading...</div>;
}
});
module.exports = UserEditFormContainer;
