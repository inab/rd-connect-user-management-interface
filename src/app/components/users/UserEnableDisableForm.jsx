import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Modal, Button, Row, Col, Glyphicon } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import config from 'config.jsx';
import auth from 'components/auth.jsx';

function userValidation(formData,errors) {
	return errors;
}

var UserEnableDisableForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		user: React.PropTypes.object.isRequired
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
	updateUserData: function({formData}){
		//console.log('yay I\'m valid!');
		//console.log('formData contiene: ', formData);
		var enabled = formData.enabled;
		var urlEnabled = config.usersBaseUri + '/' + encodeURIComponent(this.props.user.username);
		if(enabled){
			urlEnabled += '/disable';
		} else {
			urlEnabled += '/enable';
		}
		jQuery.ajax({
			type: 'POST',
			url: urlEnabled,
			headers: auth.getAuthHeaders(),
		})
		.done(function(data) {
			self.clearForm();
		})
		.fail(function(jqXhr) {
			//console.log('Failed to Update User Information',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Failed to Update User Information. Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Failed to Update User Information. Not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Failed to Update User Information. Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Failed to Update User Information. Sent JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Failed to Update User Information. Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			console.log('UserEnableDisable REST Error (status ' + jqXhr.status + '): ' + responseText);
			console.log('Returned: ',jqXhr.responseText);
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = {
			'type': 'object',
			'properties': {
				'username': {
					'title': 'The username',
					'type': 'string',
					'minLength': 1
				},
				'enabled': {
					'title': 'Click to enable/disable user',
					'type': 'boolean'
				}
			}
		};
		var data = this.props.user;
		//We copy just the values related to enable/disable user operation from data (the whole user information data)
		//This is the user's data to paint, then we manage the action
		var enableDisableData = {
			username: data.username,
			enabled: data.enabled
		};
		//console.log(schema);
		//console.log('ENABLE/DISABLE data: ',enableDisableData);
		const uiSchema = {
			'username': {
				'ui:readonly': true,
			}
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateUserData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);

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
						{ this.state.trace !== undefined ?
							<CopyToClipboard
								text={this.state.trace}
								onCopy={() => this.setState({copied: true})}
							>
								<Button>Copy trace&nbsp;<Glyphicon glyph="copy" /></Button>
							</CopyToClipboard>
							:
							null
						}
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Row className="show-grid">
					<Col xs={12} md={8}>
							<Form schema={schema}
							uiSchema={uiSchema}
							formData={enableDisableData}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={userValidation}
							liveValidate
							/>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = UserEnableDisableForm;
