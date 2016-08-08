var React = require('react');
var Bootstrap = require('react-bootstrap');
import Form from 'react-jsonschema-form';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
//var ModalError = require('./ModalError.jsx');

function userValidation(formData,errors) {
	if (formData.userPassword !== formData.userPassword2) {
		errors.userPassword2.addError('Passwords don\'t match');
	}
		return errors;
}

var UserViewForm = React.createClass({
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
	render: function() {
		var schema = this.props.schema;
		// Replicating userPassword for schema validation and Ordering Schema for ui:order
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
		var data = this.props.data;
		delete data.userPassword;
		console.log(schema);
		console.log(data);
		const uiSchema = {
			'ui:order': schemaOrdered,

			'username': {
				'ui:readonly': true
			},
			'givenName': {
				'ui:readonly': true
			},
			'surname': {
				'ui:readonly': true
			},
			'userPassword': {
				'ui:widget': 'password',
				'ui:placeholder': '************',
				'ui:readonly': true
			},
			'userPassword2': {
				'ui:widget': 'password',
				'ui:placeholder': '************',
				'ui:readonly': true
			},
			'cn': {
				'ui:readonly': true,
			},
			'organizationalUnit': {
				'ui:readonly': true,
			},
			'groups': {
				'ui:readonly': true,
			},
			'registeredAddress': {
				'ui:widget': 'textarea',
				'type': 'string',
				'ui:readonly': true
			},
			'postalAddress': {
				'ui:widget': 'textarea',
				'type': 'string',
				'ui:readonly': true
			},
			'telephoneNumber': {
				'ui:readonly': true
			},
			'facsimileTelephoneNumber': {
				'ui:readonly': true
			},
			'email': {
				'ui:readonly': true
			},
			'links': {
				'ui:readonly': true
			},
			'userCategory': {
				'ui:disabled': true
			},
			'enabled': {
				'ui:disabled': true
			}
		};
		const log = (type) => console.log.bind(console, type);
		//const onSubmit = ({formData}) => this.updateUserData({formData});
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
							<Form
								schema={schema}
								uiSchema={uiSchema}
								formData={data}
								onChange={log('changed')}
								//onSubmit={onSubmit}
								onError={onError}
								validate={userValidation}
								liveValidate
							>
								<div>
									<LinkContainer to={{ pathname: '/users/list/', query: { } }}><Button>Back</Button></LinkContainer>
								</div>
							</Form>
					</Col>
					<Col xs={6} md={4} />
				</Row>
			</div>
		);
	}
});
module.exports = UserViewForm;
