import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import jQuery from 'jquery';
import UserNewForm from './UserNewForm.jsx';
import UserNewFormUnprivileged from './UserNewFormUnprivileged.jsx';
import { hashHistory } from 'react-router';

import config from 'config.jsx';

var UserNewFormContainer = React.createClass({
	propTypes: {
		route: React.PropTypes.array,
		params: React.PropTypes.object
	},
	//mixins: [ History ], //This is to browse history back when user is not found after showing modal error
	contextTypes: {
		router: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			data: null,
			schema: null,
			groups: null,
			users: null,
			error: null,
			showModal: false,
			task: null };
	},
	componentWillMount: function() {
		this.setState({task: this.props.route.task});
		this.loadUserSchema();
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	loadUsersFromServer: function() {
		jQuery.ajax({
			url: config.usersBaseUri,
			dataType: 'json',
			cache: false,
		})
		.done(function(users) {
			//console.log('success!');
			this.setState({users: users});
		}.bind(this))
		.fail(function(xhr, status, err) {
			//console.error('json/OrganizationalUnitalUnits.json', status, err);
			console.error(xhr.status);
			this.setState({error: xhr.status + ' (Retrieving List of Users)'});
		}.bind(this));
	},
	loadGroupsFromServer: function() {
		jQuery.ajax({
			url: config.groupsBaseUri,
			dataType: 'json',
			cache: false,
		})
		.done(function(groups) {
			//console.log('success!');
			this.setState({groups: groups});
			this.loadUsersFromServer();
		}.bind(this))
		.fail(function(xhr, status, err) {
			//console.error('json/OrganizationalUnitalUnits.json', status, err);
			console.error(xhr.status);
			this.setState({error: xhr.status + ' (Retrieving Groups)'});
		}.bind(this));
	},
	loadOrganizationalUnitsFromServer: function() {
		jQuery.ajax({
			url: config.ouBaseUri,
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log("success!");
				this.setState({data: data});
				//console.log(this.state.data);
				this.loadGroupsFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/OrganizationalUnitalUnits.json", status, err);
				console.error(xhr.status);
				var responseText = '';
				if(xhr.status === 0) {
					responseText = 'Not connect: Verify Network.';
				} else if(xhr.status === 404) {
					responseText = 'Validation Schema not found [404]';
				} else if(xhr.status === 500) {
					responseText = 'Internal Server Error [500].';
				} else if(xhr.status === 'parsererror') {
					responseText = 'Requested JSON parse failed.';
				} else if(xhr.status === 'timeout') {
					xhr = 'Time out error.';
				} else if(xhr.status === 'abort') {
					responseText = 'Ajax request aborted.';
				} else {
					responseText = 'Uncaught Error: ' + xhr.responseText;
				}
				this.setState({error: responseText, showModal: true});
				//this.setState({error: xhr.status + ' (Retrieving Organizational Units)'});
			}.bind(this)
		});
	},
	loadUserSchema: function() {
		jQuery.ajax({
			url: config.usersBaseUri + '?schema',
			dataType: 'json',
		})
		.done(function(schema) {
			this.setState({schema: schema});
			this.loadOrganizationalUnitsFromServer();
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('failed to retrieve user Schema',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Validation Schema not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Requested JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},

	render: function() {
		if((this.state.schema) && (this.state.data) && (this.state.users)) {
			if(this.state.task === 'new_privileged'){
				return (
					<div>
						<UserNewForm   schema={this.state.schema} data={this.state.data} users={this.state.users}/>
					</div>
				);
			} else if(this.state.task === 'new_unprivileged'){
				if(this.state.groups){
					return (
						<div>
							<UserNewFormUnprivileged   schema={this.state.schema} data={this.state.data} groups={this.state.groups} users={this.state.users} />
						</div>
					);
				}
			}
		}
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
		return <div>Loading...</div>;
		}
		});
		module.exports = UserNewFormContainer;
