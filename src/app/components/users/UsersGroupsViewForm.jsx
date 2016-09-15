import React from 'react';
import Form from 'react-jsonschema-form';
import { Modal, Row, Col, Button } from 'react-bootstrap';
//import ModalError from './ModalError.jsx';

function userValidation(formData,errors) {
	return errors;
}

var UsersGroupsViewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired,
		groups: React.PropTypes.object.isRequired
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
		var originalSchema = this.props.schema;
		console.log('ORIGINAL SCHEMA: ', originalSchema);
		var newSchema = {};
		newSchema.type = originalSchema.type;
		newSchema.properties = {};
		newSchema.properties.username = originalSchema.properties.username;
		newSchema.properties.cn = originalSchema.properties.cn;
		console.log('All Available Groups are: ', this.props.groups);
		//We generate an array with all the available groups
		var arrayGroups = [];
		for (var i = 0; i < this.props.groups.length; i++){
			arrayGroups.push(this.props.groups[i].cn);
		}
		arrayGroups.sort();
		newSchema.properties.groups = {
			'title': 'The list of groups where this user is registered in',
			'type': 'array',
			'uniqueItems': true,
			'items': {
				'type': 'string',
				'minLength': 1
			}
		};
		newSchema.properties.groups.items.enum = arrayGroups;
		console.log('NEW SCHEMA: ', newSchema);
		var data = this.props.data;
		console.log('DATA contains: ', data);
		var username = data.username;
		console.log(username);
		const uiSchema = {
			'username': {
				'ui:readonly': true
			},
			'cn': {
				'ui:readonly': true
			},
			'groups': {
				'ui:disabled': true,
				'ui:widget': 'checkboxes'
			}
		};
		const log = (type) => console.log.bind(console, type);
		//const onSubmit = ({formData}) => this.updateUserData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		console.log('Error: ', this.state.error);
		console.log('Show: ', this.state.showModal);
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
							<Form
								schema={newSchema}
								uiSchema={uiSchema}
								formData={data}
								onChange={log('changed')}
								onError={onError}
								validate={userValidation}
								liveValidate
							/>
					</Col>
					<Col xs={6} md={4}/>
				</Row>
			</div>
		);
	}
});
module.exports = UsersGroupsViewForm;
