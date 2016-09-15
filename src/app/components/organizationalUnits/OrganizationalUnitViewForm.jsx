import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Modal, Row, Col, Button, LinkContainer} from 'react-bootstrap';
//import ModalError from './ModalError.jsx';

import config from 'config.jsx';
import auth from 'components/auth.jsx';

function organizationalUnitValidation(formData,errors) {
	//if (formData.userPassword !== formData.userPassword2) {
	//    errors.userPassword2.addError('Passwords don't match');
	//}
		return errors;
}

var OrganizationalUnitViewForm = React.createClass({
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
	updateOrganizationalUnitData: function({formData}){
		console.log('yay I\'m valid!');
		//console.log(formData);
		var organizationalUnitData = Object.assign({},formData);
		jQuery.ajax({
			type: 'POST',
			url: config.ouBaseUri+'/'+encodeURIComponent(this.state.data.organizationalUnit),
			headers: auth.getAuthHeaders(),
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(organizationalUnitData)
		})
		.done(function(data) {
			self.clearForm();
		})
		.fail(function(jqXhr) {
			console.log('Failed to Update Organizational Unit Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Update Organizational Unit Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Update Organizational Unit Information. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Update Organizational Unit Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Update Organizational Unit Information. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Update Organizational Unit Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to Update Organizational Unit Information. Ajax request aborted.';
			} else {
				responseText = 'Failed to Update Organizational Unit Information. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = this.props.schema;
		var data = this.props.data;
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateOrganizationalUnitData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		const uiSchema = {
			'organizationalUnit': {
				'ui:readonly': true
			},
			'description': {
				'ui:readonly': true
			},
			'picture': {
				'ui:readonly': true
			},
			'links': {
				'ui:readonly': true
			},
		};
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
							<Form schema={schema}
							uiSchema={uiSchema}
							formData={data}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={organizationalUnitValidation}
							liveValidate
							>
							<div>
									<Button>Back</Button>
								</div>
							</Form>
					</Col>
					<Col xs={6} md={4} />
				</Row>
			</div>
		);
	}
});
module.exports = OrganizationalUnitViewForm;
