import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import jQuery from 'jquery';
import GroupEditForm from './GroupEditForm.jsx';
import GroupViewForm from './GroupViewForm.jsx';
import Underscore from 'underscore';

import { hashHistory } from 'react-router';

import config from 'config.jsx';

var GroupFormContainer = React.createClass({
	propTypes:{
		route: React.PropTypes.array,
		params: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			schema: null,
			data: null,
			users: null,
			error: null,
			showModal: false,
			task: null
		};
	},
	componentWillMount: function() {
		this.setState({task: this.props.route.task});
		this.loadGroupData();
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	loadUsers: function() {
		jQuery.ajax({
			url: config.usersBaseUri,
			cache: false,
			dataType: 'json',
		})
		.done(function(users) {
			var sortedUsers = Underscore
				.chain(users)
				.toArray()
				.sortBy(function(userObjects){ return userObjects.cn; })
				.value();
			this.setState({users: sortedUsers});
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('Failed to retrieve Users',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Failed to retrieve Users. Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Failed to retrieve Users. Validation Schema not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Failed to retrieve Users. Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve Users. Requested JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve Users. Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve Users. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve Users. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	loadGroupSchema: function() {
		jQuery.ajax({
			url: config.groupsBaseUri + '?schema',
			dataType: 'json',
		})
		.done(function(schema) {
			this.setState({schema: schema});
			this.loadUsers();
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('Failed to retrieve group Schema',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Failed to retrieve group Schema. Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Failed to retrieve group Schema. Validation Schema not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Failed to retrieve group Schema. Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve group Schema. Requested JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve group Schema. Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve group Schema. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve group Schema. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
  loadGroupData: function() {
		jQuery.ajax({
			url: config.groupsBaseUri + '/' + encodeURIComponent(this.props.params.groupName),
			cache: false,
			dataType: 'json',
		})
		.done(function(data) {
			this.setState({data: data});
			this.loadGroupSchema();
		}.bind(this))
		.fail(function(jqXhr, textStatus, errorThrown) {
			//console.log('Failed to retrieve group Information',jqXhr);

			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Failed to retrieve group Information. Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Failed to retrieve group Information. Requested Group not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Failed to retrieve group Information. Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve group Information. Requested JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve group Information. Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve group Information. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve group Information. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
   //This is to browse history back when group is not found after showing modal error
  render: function() {
	//console.log('this.state.schema is: ',this.state.schema);
	//console.log('this.state.data is: ',this.state.data);
	//console.log('this.state.users is: ',this.state.users);
    if(this.state.schema && this.state.data && this.state.users) {
		if((this.state.task === 'edit') && (this.state.data) && (this.state.users)){
			return (
					<GroupEditForm schema={this.state.schema}  data={this.state.data}  users={this.state.users} />
			);
		} else if((this.state.task === 'view') && (this.state.data)){
			return (
					<GroupViewForm schema={this.state.schema}  data={this.state.data}  />
			);
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
module.exports = GroupFormContainer;
