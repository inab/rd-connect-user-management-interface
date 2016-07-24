var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from 'react-jsonschema-form';
import { Row, Col} from 'react-bootstrap';
//var ModalError = require('./ModalError.jsx');

function groupValidation(formData,errors) {
		return errors;
}

var GroupViewForm = React.createClass({
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
	updateGroupData: function({formData}){
		console.log('yay I\'m valid!');
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
			console.log('Failed to Update group Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Update group Information. Failed to Update Group Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Update group Information. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Update group Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Update group Information. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Update group Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to Update group Information. Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = this.props.schema;
		var data = this.props.data;
		console.log(schema);
		console.log(data);

		const uiSchema = {
			'cn': {
				'ui:readonly': true
			},
			'description': {
				'ui:readonly': true
			},
			'members': {
				'ui:readonly': true
			},
			'owner': {
				'ui:readonly': true
			},
			'groupPurpose': {
				'ui:readonly': true
			},
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateGroupData({formData});
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
							formData={data}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={groupValidation}
							liveValidate
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
module.exports = GroupViewForm;
