import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import MultiselectField from './Multiselect.jsx';
import { hashHistory } from 'react-router';
import config from 'config.jsx';
import auth from 'components/auth.jsx';
var Underscore = require('underscore');

var GroupEditForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired,
		users: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return {
			error: null,
			showModal: false,
			schema: null,
			data: null,
			users: null,
			startMembers: null
		};
	},
	componentWillMount: function(){
		this.setState({
			schema: this.props.schema,
			data: this.props.data,
			users: this.props.users,
			startMembers: this.props.data.members
		});
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	modifyGroupFeatures:function(formData){
		jQuery.ajax({
			type: 'POST',
			url: config.groupsBaseUri + '/' + encodeURIComponent(this.state.data.cn),
			headers: auth.getAuthHeaders(),
			contentType: 'application/json',
			data: JSON.stringify(formData)
		})
		.done(function(data) {
			//This is a two ajax call process. Once the members are deleted, we call to add the members in formData.members
			hashHistory.goBack();

		})
		.fail(function(jqXhr) {
			console.log('Failed modifying group features. ',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed modifying group features. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed modifying group features. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed modifying group features. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed modifying group features. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed modifying group features. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	addMembersToGroup:function(formData, membersToAdd){
		console.log('inside addMembersToGroup, members contains: ',formData.members);
		jQuery.ajax({
			type: 'POST',
			url: config.groupsBaseUri + '/' + encodeURIComponent(this.state.data.cn) + '/members',
			headers: auth.getAuthHeaders(),
			contentType: 'application/json',
			data: JSON.stringify(membersToAdd)
		})
		.done(function(data) {
			//This is a two ajax call process. Once the members are deleted, we call to add the members in formData.members
			this.modifyGroupFeatures(formData);

		}.bind(this))
		.fail(function(jqXhr) {
			console.log('Failed to add members to Group ',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to add members to Group. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to add members to Group. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to add members to Group. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to add members to Group. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to add members to Group. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	updateGroupData: function({formData}){
		//console.log('yay I\'m valid!');
		//First we delete all the members and later we add the final members
		formData.members = this.state.data.members;
		//console.log('Formdata contiene', formData);
		//console.log(config.groupsBaseUri + '/' + encodeURIComponent(this.state.data.cn)  + '/members');
		//console.log('this.state.data.members contains the initial members, to erase: ', this.state.startMembers);
		//console.log(formData);
		var groupData = Object.assign({},formData);
		var startMembers = Object.assign([],this.state.startMembers);
		startMembers = Underscore.difference(startMembers,groupData.members);
		var membersToAdd = Underscore.difference(groupData.members, this.state.startMembers);

		if(startMembers.length > 0) {
			jQuery.ajax({
				type: 'DELETE',
				url: config.groupsBaseUri + '/' + encodeURIComponent(this.state.data.cn) + '/members',
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(startMembers)
			})
			.done(function(data) {
				//Once the members are deleted, we call to add the members in formData.members
				if(membersToAdd.length > 0) {
					this.addMembersToGroup(formData, membersToAdd);
				} else {
					this.modifyGroupFeatures(formData);
				}
			}.bind(this))
			.fail(function(jqXhr) {
				console.log('Failed to Update Group Information',jqXhr);
				var responseText = '';
				if (jqXhr.status === 0) {
					responseText = 'Failed to Update Group Information. Not connect: Verify Network.';
				} else if (jqXhr.status === 404) {
					responseText = 'Failed to Update Group Information. Not found [404]';
				} else if (jqXhr.status === 500) {
					responseText = 'Failed to Update Group Information. Internal Server Error [500].';
				} else if (jqXhr.status === 'parsererror') {
					responseText = 'Failed to Update Group Information. Sent JSON parse failed.';
				} else if (jqXhr.status === 'timeout') {
					responseText = 'Failed to Update Group Information. Time out error.';
				} else if (jqXhr.status === 'abort') {
					responseText = 'Ajax request aborted.';
				} else {
					responseText = 'Uncaught Error: ' + jqXhr.responseText;
				}
				this.setState({error: responseText, showModal: true});
			}.bind(this));
		} else if(membersToAdd.length > 0) {
			this.addMembersToGroup(formData, membersToAdd);
		} else {
			this.modifyGroupFeatures(formData);
		}
	},
	logChange: function(val){
		console.log('Selected: ' + val);
	},
	handleChangeSelected:function(value){
		//console.log(value);
		var data = this.state.data;
		if (value === null){
			data.members = [];
		}
		else {
			data.members = value.split(',');
		}
		this.setState({data:data});
		console.log('this.state inside handleChangeSelected contains: ', this.state);
	},
	render: function() {
		//console.log('Schema contains: ', this.state.schema);
		//console.log('Users contains: ', this.state.users);
		//console.log('Data contains: ', this.state.data);
		//We need to be sure that the new user added to this group is an existing user
		var newSchema = Object.create(this.state.schema);
		newSchema.type = this.state.schema.type;
		newSchema.properties = {};
		newSchema.additionalProperties = false;
		newSchema.dependencies = this.state.schema.dependencies;
		newSchema.properties.cn = this.state.schema.properties.cn;
		newSchema.properties.owner = this.state.schema.properties.owner;
		newSchema.properties.description = this.state.schema.properties.description;
		newSchema.properties.groupPurpose = this.state.schema.properties.groupPurpose;
		//We don't add members to newSchema since this field validation will be done by the Multiselect component
		//We generate an array with all the available users that will be used as "options" input for Multiselect component
		//allowCreate=false (default) so only users inside options array will be allowed inside component
		console.log('users contains: ', this.state.users);
		var arrayUsers = Object.create(this.state.users);
		console.log('arrayUsers contains: ', arrayUsers);
		var options = [];
		this.state.users.map(function(user, i){
			arrayUsers[user.username] = user.cn;
			options.push({'value':user.username, 'label': user.cn});
		});
		//Now we generate the initialSelected array. Which contains the users that already belongs to the group. This
		//array will be passed as a prop to the MutiselectField component
		console.log('ArrayUsers contiene: ', arrayUsers);
		var initialMembersSelected = [];
		this.state.data.members.map(function(memberUserName, k){
			initialMembersSelected.push({'value':memberUserName, 'label': arrayUsers[memberUserName]});
		});
		console.log('New schema contains: ', newSchema);
		var newData = Object.create(this.state.data);

		newData.cn = this.state.data.cn;
		newData.owner = this.state.data.owner;
		//newData.members = this.props.data.members; //Managed by React-select Multiselect component
		newData.description = this.state.data.description;

		const uiSchema = {
			'cn': {
				'ui:readonly': true
			}
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateGroupData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>Error!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Row className="show-grid">
					<Col xs={12} md={8}>
						<Form schema={newSchema}
						uiSchema={uiSchema}
						formData={newData}
						onChange={log('changed')}
						onSubmit={onSubmit}
						onError={onError}
						//validate={groupValidation}
						liveValidate
						>
						<MultiselectField label="Members of this group" options={options} initialSelected={initialMembersSelected} onChangeSelected={this.handleChangeSelected}/>
						<div className="button-submit">
							<Button bsStyle="info" type="submit">Submit</Button>
						</div>
						</Form>
					</Col>
					<Col xs={6} md={4}>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = GroupEditForm;
