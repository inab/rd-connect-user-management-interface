var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from 'react-jsonschema-form';
import { Row, Col } from 'react-bootstrap';
//var ModalError = require('./ModalError.jsx');

function userValidation(formData,errors) {
		return errors;
}

var UserNewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { error: null, showModal:false};
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	addUserData: function({formData}){
		console.log('yay I\'m valid!');
		//console.log(formData);
		var userData = Object.assign({},formData);
		delete userData.userPassword2;
		jQuery.ajax({
			type: 'PUT',
			url: '/some/url',
			data: userData
		})
		.done(function(data) {
			self.clearForm();
		})
		.fail(function(jqXhr) {
			console.log('Failed to Create New User',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Create New User. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Create New User. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Create New User. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Create New User. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Create New User. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		const formData = undefined;
		var schema = this.props.schema;
		//we delete groups from new user form since  'ui:widget' : 'hidden' doesn't work for arrays
		delete schema.properties.groups;
		//We generate the enums property for the Organizational Units extracting the info from data
		var arrayOUobjects = this.props.data; var arrayOUstrings = [];
		for (var i = 0; i < arrayOUobjects.length; i++) {
			arrayOUstrings.push(arrayOUobjects[i].organizationalUnit);
	}
		arrayOUstrings.sort();

		schema.properties.organizationalUnit.enum = arrayOUstrings;
		//Replicating userPassword for schema validation and Ordering Schema for ui:order
		//Adding a userPassword2 field to validate userPassword change
		schema.properties.userPassword2 = schema.properties.userPassword;
		//First we create an array with the fields with the desired order.
		var order = ['username','cn','givenName','surname','userPassword','userPassword2'];
		//We filter all the properties retrieving only the elements that are not in 'order' array
		var userSchemaKeys = Object.keys(schema.properties).filter(function(elem) {
			return order.indexOf(elem) === -1;
		});
		//We concatenate order with userSchemaKeys, retrieving the ordered schema as desired
		var schemaOrdered = order.concat(userSchemaKeys);

		//var data = this.props.data;
		//delete data.userPassword;
		console.log(schema);
		const uiSchema = {
			'ui:order': schemaOrdered,
			'userPassword': {
				'ui:widget': 'password',
				'ui:placeholder': '************'
			},
			'userPassword2': {
				'ui:widget': 'password',
				'ui:placeholder': '************'
			},
			'cn': {
				'ui:widget': 'hidden',
			},
			'organizationalUnit': {
				'ui:widget': 'select',
				'type': 'string'
			},
			'registeredAddress': {
				'ui:widget': 'textarea',
				'type': 'string'
			},
			'postalAddress': {
				'ui:widget': 'textarea',
				'type': 'string'
			}
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.addUserData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		console.log('Error: ', this.state.error);
		console.log('Show: ', this.state.showModal);

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
						<code>
							<Form schema={schema}
							uiSchema={uiSchema}
							formData={formData}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={userValidation}
							liveValidate= {false}
							/>
						</code>
					</Col>
					<Col xs={6} md={4}>
						<code></code>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = UserNewForm;
