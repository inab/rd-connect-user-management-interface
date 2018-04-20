import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { hashHistory } from 'react-router';

import config from 'config.jsx';
import auth from 'components/auth.jsx';

function groupValidation(formData,errors) {
		return errors;
}

var GroupNewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { modalTitle: null, error: null, showModal: false, in: false};
	},
	componentWillMount: function() {
		this.setState({ schema: this.props.schema});
	},
	close(){
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			hashHistory.goBack();
		}
	},
	open(){
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	},
	toggle(){
      this.setState({ in: !this.state.in });
    },
    wait(){
      setTimeout(() => {
        this.toggle();
      }, 3000);
    },
	addGroupData: function({formData}){
		//console.log('yay I\'m valid!');
		//console.log('Formdata sent to server:', formData);
		var groupData = Object.assign({},formData);
		jQuery.ajax({
			type: 'PUT',
			url: config.groupsBaseUri,
			headers: auth.getAuthHeaders(),
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(groupData)
		})
		.done(function(data) {
			this.setState({ modalTitle: 'Success', error: 'Group created correctly!!', showModal: true});
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('Failed to add new group',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Failed to add new group. Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Failed to add new group. Not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Failed to add new group. Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Failed to add new group. Sent JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Failed to add new group. Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Failed to add new group. Ajax request aborted.';
			} else {
				responseText = 'Failed to add new group. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({modaTitle: 'Error', error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = this.state.schema;
		//console.log('Schema: ', schema);
		delete schema.title;
		//console.log(schema);
		const formData = undefined;
		//console.log(schema);
		const uiSchema = {

		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({theFormData}) => this.addGroupData({theFormData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
						</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<h3> Create New Group</h3>
				<Collapse in={this.state.in} onEntering={this.wait} bsStyle="success" ref="fade">
					<ListGroup>
					<ListGroupItem bsStyle="success">Group created successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={8}>
							<Form schema={schema}
								uiSchema={uiSchema}
								formData={formData}
								onChange={log('changed')}
								onSubmit={onSubmit}
								onError={onError}
								validate={groupValidation}
								liveValidate= {false}
							>
								<div className="button-submit">
									<Button bsStyle="info" onClick={()=>hashHistory.goBack()} className="submitCancelButtons"><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
									<Button bsStyle="primary" type="submit" className="submitCancelButtons">Submit</Button>
								</div>
							</Form>
					</Col>
					<Col xs={6} md={4}/>
				</Row>
			</div>
		);
	}
});
module.exports = GroupNewForm;
