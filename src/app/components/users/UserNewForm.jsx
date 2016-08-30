var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var request = require('superagent');
import Form from 'react-jsonschema-form';
import { Row, Col, Button } from 'react-bootstrap';
import createHistory from 'history/lib/createBrowserHistory';
var Dropzone = require('react-dropzone');
var imageNotFoundSrc = require('./defaultNoImageFound.js');

//var ModalError = require('./ModalError.jsx');

function userValidation(formData,errors) {
	if (formData.userPassword !== formData.userPassword2) {
		errors.userPassword2.addError('Passwords don\'t match');
	}
		return errors;
}
function validateImageInput(image,that) {
	var responseText = null;
	if (image.type !== 'image/jpeg') {
		responseText = 'Image should be in jpeg format';
	}
	return responseText;
}

var UserNewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return { error: null, showModal: false, files: [], picture : null};
	},
	componentWillMount: function() {
		this.setState({picture: this.props.data.picture});
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	dropHandler: function (files) {
		console.log('Received files: ', files);
		var req = request.post('/users/:user_id/picture');
        files.forEach((file)=> {
			var error = validateImageInput(file);
			if (!error){
				req.attach(file.name, file);
				req.end(function(err, res){
					if (!err && res){
						this.setState({files: files});
						this.setState({picture: file.preview}); //So the user's image is only updated in UI if the PUT process succeed'
						//console.log("Picture in the state after validation: ", file.preview);
					}
					else {
						var responseText = '';
						if (err && err.status === 404) {
							responseText = 'Failed to Update User\'s image. Not found [404]';
						}
						else if (err && err.status === 500) {
							responseText = 'Failed to Update User\'s image. Internal Server Error [500]';
						}
						else if (err && err.status === 'parsererror') {
							responseText = 'Failed to Update User\'s image. Sent JSON parse failed';
						}
						else if (err && err.status === 'timeout') {
							responseText = 'Failed to Update User\'s image. Time out error';
						}
						else if (err && err.status === 'abort') {
							responseText = ('Ajax request aborted');
						}
						else if (err) {
							responseText = 'Ajax generic error';
						}
						this.setState({error: responseText, showModal: true});
					}
				}.bind(this));
			} else {
				this.setState({error: error, showModal: true});
			}
        });
    },
	onOpenClick: function () {
      this.refs.dropzone.open();
    },
	addUserData: function({formData}){
		console.log('yay I\'m valid!');
		console.log(formData);
		var userData = Object.assign({},formData);
		delete userData.userPassword2;
		console.log('El userData contiene: ',userData);
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
		const history = createHistory();
		const formData = {};
		var schema = this.props.schema;
		//we delete groups from new user form since  'ui:widget' : 'hidden' doesn't work for arrays
		delete schema.properties.groups;

		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;

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
		var userImage = this.state.picture;
		if (typeof userImage === 'undefined'){
			userImage = imageNotFoundSrc;
		}
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
							<Form schema={schema}
							uiSchema={uiSchema}
							formData={formData}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={userValidation}
							liveValidate= {false}
							>
								<Button bsStyle="primary" onClick={history.goBack} >Cancel</Button>
								<Button bsStyle="primary" type="submit">Submit</Button>
							</Form>
					</Col>
					<Col xs={6} md={4} >
						<div>
							<button type="button" onClick={this.onOpenClick} className="changeImageButton">
								Add image
							</button>
							<Dropzone className="dropzone" disableClick={false} multiple={false} accept={'image/*'} onDrop={this.dropHandler} ref="dropzone" >
								Click here or drop image
							</Dropzone>
							{this.state.files.length > 0 ? <div>
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} width="100" alt="image_user" className="imagePreview" /> )}</div>
							</div> : <div><img src={userImage} width="100" alt="image_user" className="imagePreview" /></div>}
						</div>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = UserNewForm;