var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from 'react-jsonschema-form';
import { Row, Col, Button } from 'react-bootstrap';
var MultiselectField = require('./Multiselect.jsx');
import { hashHistory } from 'react-router';

//var ModalError = require('./ModalError.jsx');

function userValidation(formData,errors) {
	return errors;
}

var UsersGroupsEditForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired,
		groups: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return { error: null,
			showModal: false,
			schema: null,
			data: null,
			groups: null};
	},
	componentWillMount: function(){
		this.setState({
			schema: this.props.schema,
			data: this.props.data,
			groups: this.props.groups
		});
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	updateUserData: function({formData}){
		console.log('yay I\'m valid!');
		//console.log('El formData contiene: ',formData);
		var userData = Object.assign({},formData);
		//console.log('El userData contiene: ',userData);
		jQuery.ajax({
			type: 'PUT',
			url: '/users/groups/edit/:username',
			data: userData
		})
		.done(function(data) {
			self.clearForm();
		})
		.fail(function(jqXhr) {
			console.log('Failed to Update User Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Update User Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Update User Information. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Update User Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Update User Information. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Update User Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	handleChangeSelected:function(value){
		//console.log(value);
		var data = this.state.data;
		if (value === null){
			data.groups = [];
		}
		else {
			data.groups = value.split(',');
		}
		this.setState({data:data});
		console.log('this.state inside handleChangeSelected contains: ', this.state);
	},
	render: function() {
		var schema = this.props.schema;
		console.log('ORIGINAL SCHEMA: ', schema);
		var newSchema =  {};
		newSchema.type = schema.type;
		newSchema.properties = {};
		newSchema.properties.cn = schema.properties.cn;
		newSchema.properties.username = schema.properties.username;

		//We don't add groups to newSchema since this field validation will be done by the Multiselect component
		//We generate an array with all the available groups that will be used as "options" input for Multiselect component
		//allowCreate=false (default) so only groups inside options array will be allowed inside component
		console.log('groups contains: ', this.state.groups);
		var arrayGroups = Object.create(this.state.groups);
		console.log('arrayGroups contains: ', arrayGroups);
		var options = [];
		this.state.groups.map(function(group, i){
			arrayGroups[group.cn] = group.cn;
			options.push({'value':group.cn, 'label': group.cn});
		});
		//Now we generate the initialSelected array. Which contains the groups that the user already belongs to. This
		//array will be passed as a prop to the MutiselectField component
		console.log('arrayGroups contiene: ', arrayGroups);
		var initialGroupsSelected = [];
		this.state.data.groups.map(function(groupName, k){
			initialGroupsSelected.push({'value':groupName, 'label': arrayGroups[groupName]});
		});
		console.log('New schema contains: ', newSchema);
		var newData = Object.create(this.state.data);

		newData.cn = this.state.data.cn;
		newData.username = this.state.data.username;

		console.log('NEW DATA contains: ', newData);
		const uiSchema = {
			'username': {
				'ui:readonly': true
			},
			'cn': {
				'ui:readonly': true
			}
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateUserData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
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
				<Row className = "show-grid">
					<Col xs={12} md={8}>
							<Form
								schema={newSchema}
								uiSchema={uiSchema}
								formData={newData}
								onChange={log('changed')}
								onSubmit={onSubmit}
								onError={onError}
								validate={userValidation}
								liveValidate
							>
							<MultiselectField label="Member of these groups" options={options} initialSelected={initialGroupsSelected} onChangeSelected={this.handleChangeSelected}/>
						<div className="button-submit">
							<Button bsStyle="primary" onClick={()=>hashHistory.goBack()} className="submitCancelButtons">Cancel</Button>
							<Button bsStyle="primary" type="submit" className="submitCancelButtons">Submit</Button>
						</div>
						</Form>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = UsersGroupsEditForm;
