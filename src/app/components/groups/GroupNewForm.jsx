var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from 'react-jsonschema-form';
import { Row, Col, Button, Collapse, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { hashHistory } from 'react-router';

function groupValidation(formData,errors) {
		return errors;
}

var GroupNewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { error: null, showModal: false, in: false};
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	toggle(){
      this.setState({ in: !this.state.in });
    },
    wait(){
      var mythis = this;
      setTimeout(function(){
        mythis.toggle();
      }, 3000);
    },
	addGroupData: function({formData}){
		console.log('yay I\'m valid!');
		console.log('Formdata sent to server:', formData);
		var groupData = Object.assign({},formData);
		jQuery.ajax({
			type: 'PUT',
			url: '/some/url',
			data: groupData
		})
		.done(function(data) {
			self.clearForm();
			this.setState({in: true});
		})
		.fail(function(jqXhr) {
			console.log('Failed to add new group',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to add new group. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to add new group. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to add new group. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to add new group. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to add new group. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to add new group. Ajax request aborted.';
			} else {
				responseText = 'Failed to add new group. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = this.props.schema;
		delete schema.title;
		console.log(schema);
		const formData = undefined;
		console.log(schema);
		const uiSchema = {

		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.addGroupData({formData});
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
									<Button bsStyle="primary" onClick={()=>hashHistory.goBack()} className="submitCancelButtons">Cancel</Button>
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
