var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from 'react-jsonschema-form';
import { Row, Col, Button } from 'react-bootstrap';
var MultiselectField = require('./Multiselect.jsx');

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
			users: null
		};
	},
	componentWillMount: function(){
		this.setState({
			schema: this.props.schema,
			data: this.props.data,
			users: this.props.users
		});
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	updateGroupData: function({formData}){
		//console.log('yay I\'m valid!');
		formData.members = this.state.data.members;
		console.log('Formdata contiene', formData);
		//console.log(formData);
		var groupData = Object.assign({},formData);
		jQuery.ajax({
			type: 'PUT',
			url: '/some/url',
			data: groupData
		})
		.done(function(data) {
			self.clearForm();
		})
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
				<Bootstrap.Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Bootstrap.Modal.Header closeButton>
						<Bootstrap.Modal.Title>Error!</Bootstrap.Modal.Title>
					</Bootstrap.Modal.Header>
					<Bootstrap.Modal.Body>
						<h4>{this.state.error}</h4>
					</Bootstrap.Modal.Body>
					<Bootstrap.Modal.Footer>
						<Bootstrap.Button onClick={this.close}>Close</Bootstrap.Button>
					</Bootstrap.Modal.Footer>
				</Bootstrap.Modal>
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
