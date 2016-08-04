var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var GroupEditForm = require('./GroupEditForm.jsx');
var GroupViewForm = require('./GroupViewForm.jsx');
var Underscore = require('underscore');

import {History} from 'react-router';

var GroupFormContainer = React.createClass({
	propTypes:{
		route: React.PropTypes.array
	},
	mixins: [ History ],
	getInitialState: function() {
		return {
			schema: null,
			data: null,
			users: null,
			error: null,
			showModal: false,
			task: this.props.route.task
		};
	},
	componentWillMount: function() {
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
			url: 'json/users.json',
			type: 'GET',
			dataType: 'json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			contentType: 'application/json; charset=utf-8',
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
			console.log('Failed to retrieve Users',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve Users. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve Users. Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve Users. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve Users. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve Users. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve Users. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve Users. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	loadGroupSchema: function() {
		jQuery.ajax({
			url: 'json/groupValidation.json',
			type: 'GET',
			dataType: 'json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			contentType: 'application/json; charset=utf-8',
		})
		.done(function(schema) {
			this.setState({schema: schema});
			this.loadUsers();
		}.bind(this))
		.fail(function(jqXhr) {
			console.log('Failed to retrieve group Schema',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve group Schema. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve group Schema. Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve group Schema. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve group Schema. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve group Schema. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve group Schema. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve group Schema. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
  loadGroupData: function() {
		jQuery.ajax({
			url: 'json/group-' + this.props.params.groupName + '.json',
			type: 'GET',
			dataType: 'json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			contentType: 'application/json; charset=utf-8',
		})
		.done(function(data) {
			this.setState({data: data});
			this.loadGroupSchema();
		}.bind(this))
		.fail(function(jqXhr, textStatus, errorThrown) {
			console.log('Failed to retrieve group Information',jqXhr);

			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve group Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve group Information. Requested Group not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve group Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve group Information. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve group Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve group Information. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve group Information. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
   //This is to browse history back when group is not found after showing modal error
  render: function() {
	console.log('this.state.schema is: ',this.state.schema);
	console.log('this.state.data is: ',this.state.data);
	console.log('this.state.users is: ',this.state.users);
    if (this.state.schema && this.state.data && this.state.users) {
		if ((this.state.task === 'edit') && (this.state.data) && (this.state.users)){
			return (
					<GroupEditForm schema={this.state.schema}  data={this.state.data}  users={this.state.users} />
			);
		} else if ((this.state.task === 'view') && (this.state.data)){
			return (
					<GroupViewForm schema={this.state.schema}  data={this.state.data}  />
			);
		}
    }
    if (this.state.error) {
      return (
		<div>
			<Bootstrap.Modal show={this.state.showModal} onHide={this.history.goBack} error={this.state.error}>
				<Bootstrap.Modal.Header closeButton>
					<Bootstrap.Modal.Title>Error!</Bootstrap.Modal.Title>
					</Bootstrap.Modal.Header>
				<Bootstrap.Modal.Body>
					<h4>{this.state.error}</h4>
				</Bootstrap.Modal.Body>
				<Bootstrap.Modal.Footer>
					<Bootstrap.Button onClick={this.history.goBack}>Close</Bootstrap.Button>
				</Bootstrap.Modal.Footer>
			</Bootstrap.Modal>
		</div>
      );
    }
    return <div>Loading...</div>;
  }
});
module.exports = GroupFormContainer;
