import React from 'react';
import { Glyphicon, Modal, Button, Row, Col } from 'react-bootstrap';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import Dropzone from 'react-dropzone';
import imageNotFoundSrc from './defaultNoImageFound.jsx';
import { Link, hashHistory } from 'react-router';
import config from 'config.jsx';
import auth from 'components/auth.jsx';

function userValidation(formData,errors) {
	if(formData.userPassword !== formData.userPassword2) {
		errors.userPassword2.addError('Passwords don\'t match');
	}
	return errors;
}

function validateImageInput(image,that) {
	var responseText = null;
	if(image.type !== 'image/jpeg' && image.type !== 'image/png') {
		responseText = 'Image should be in JPEG or PNG format';
	}
	return responseText;
}

var UserEditForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { modalTitle: null, error: null, showModal: false, files: [], picture : null};
	},
	componentWillMount: function() {
		this.setState({picture: this.props.data.picture});
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
	dropHandler: function (files) {
		//console.log('Received files: ', files);
        files.forEach((file)=> {
			var error = validateImageInput(file);
			//var pictureFromBlob= new File([file.preview], file.name);
			if(!error){
				this.setState({files: files});
				this.setState({picture: file.preview}); //So the user's image is only updated in UI if the PUT process succeed'
				//console.log("Picture in the state after validation: ", file.preview);
				/*
				var req = request
					.put(config.usersBaseUri + '/' + encodeURIComponent(this.props.data.username) + '/picture')
					.type(file.type)
					.set(auth.getAuthHeaders())
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
				*/
			} else {
				this.setState({modalTitle: 'Error', error: error, showModal: true});
			}
        });
    },
	onOpenClick: function () {
      this.refs.dropzone.open();
    },
	updateUserData: function({formData}){
		//console.log('yay I\'m valid!');
		var userData = Object.assign({},formData);
		//Before submitting the editted data we add the information for the picture:
		var myBlob = jQuery('.dropzoneEditNew input').get(0).files[0];
		var reader = new window.FileReader();
		//console.log('myBlob needs to be controlled, contains: ', myBlob);
		if(typeof myBlob !== 'undefined'){
			reader.addEventListener('load', function() {
				var stringBase64Image = reader.result;
				userData.picture = stringBase64Image;
				jQuery.ajax({
					type: 'POST',
					url: config.usersBaseUri + '/' + encodeURIComponent(this.props.data.username),
					contentType: 'application/json',
					headers: auth.getAuthHeaders(),
					dataType: 'json',
					data: JSON.stringify(userData)
				})
				.done(function(data) {
					//console.log('User modified correctly!!');
					this.setState({ modalTitle: 'Success', error: 'User modified correctly!!', showModal: true});
				}.bind(this))
				.fail(function(jqXhr) {
					//console.log('Failed to Update User Information',jqXhr.responseText);
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
					this.setState({ modalTitle: 'Error', error: responseText, showModal: true});
				}.bind(this))
				.always(() => {
				})
			}.bind(this));
			reader.readAsDataURL(myBlob);
		} else {
			jQuery.ajax({
					type: 'POST',
					url: config.usersBaseUri + '/' + encodeURIComponent(this.props.data.username),
					contentType: 'application/json',
					headers: auth.getAuthHeaders(),
					dataType: 'json',
					data: JSON.stringify(userData)
				})
				.done(function(data) {
					//console.log('User modified correctly!!');
					this.setState({modalTitle:'Success', error: 'User modified correctly!!', showModal: true});

				}.bind(this))
				.fail(function(jqXhr) {
					//console.log('Failed to Update User Information',jqXhr.responseText);
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
					this.setState({ modalTitle: 'Error', error: responseText, showModal: true});
				}.bind(this))
				.always(() => {
				});
		}
	},
	render: function() {
		var schema = this.props.schema;
		// Replicating userPassword for schema validation and Ordering Schema for ui:order
		//Adding a userPassword2 field to validate userPassword change
		//schema.properties.userPassword2 = schema.properties.userPassword;
		//We remove userPassword from the schema since password modifications will be done from another form
		delete schema.properties.userPassword;

		//First we create an array with the fields with the desired order.
		//var order = ['username','cn','givenName','surname','userPassword','userPassword2'];
		var order = ['username','cn','givenName','surname'];

		//We remove picture from the schema since this will be managed by react-dropzone component
		//var schemaPicture = schema.properties.picture;
		delete schema.properties.picture;

		//We filter all the properties retrieving only the elements that are not in 'order' array
		var userSchemaKeys = Object.keys(schema.properties).filter(function(elem) {
			return order.indexOf(elem) === -1;
		});

		//We concatenate order with userSchemaKeys, retrieving the ordered schema as desired
		var schemaOrdered = order.concat(userSchemaKeys);

		var data = this.props.data;
		//console.log('Picture en el state contiene: ', this.state.picture);
		//console.log('File en el state contiene: ', this.state.files);
		//Once we already have picture value, we remove from data since we have removed it from schema.
		//All picture related stuff will be managed by react-dropzone component.
		delete data.picture;
		//delete data.userPassword;
		//console.log('SCHEMA: ',schema);
		//console.log('DATA: ',data);
		const uiSchema = {
			'ui:order': schemaOrdered,
			'username': {
				'ui:readonly': true,
			},
			/*'userPassword': {
				'ui:widget': 'password',
				'ui:placeholder': '************',
				'ui:help': 'Hint: Make it strong!'
			},
			'userPassword2': {
				'ui:widget': 'password',
				'ui:placeholder': '************',
				'ui:help': 'Passwords have to match!'
			},*/
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
				'type': 'string'
			},
			'postalAddress': {
				'ui:widget': 'textarea',
				'type': 'string'
			}/*,
			'picture': {
				'ui:widget': 'file'
			}*/
		};
		//const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateUserData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		var userImage = this.state.picture;
		if(typeof userImage === 'undefined') {
			userImage = imageNotFoundSrc;
		}
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
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
				<Row className="show-grid">
					<Col xs={12} md={8}>
						<Form schema={schema}
							uiSchema={uiSchema}
							formData={data}
							//onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={userValidation}
							liveValidate
						>
							<div className="button-submit">
								<Button bsStyle="info" onClick={()=>hashHistory.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
								<Button bsStyle="primary" type="submit" className="submitCancelButtons" >Submit&nbsp;<Glyphicon glyph="pencil" /></Button>
							</div>
						</Form>
					</Col>
					<Col xs={6} md={4} >
						<Link className="btn btn-danger changePasswordButton" role="button" to={'/users/password/' + encodeURIComponent(`${data.username}`)}>
							Change Password&nbsp;<Glyphicon glyph="pencil" />
						</Link>
						<div>
							<Dropzone className="dropzoneEditNew" disableClick={false} multiple={false} accept={'image/*'} onDrop={this.dropHandler} ref="dropzone" >
								Click here or drop image for {data.username}
							</Dropzone>
							{this.state.files.length > 0 ? <div>
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} name="documentFile" width="100" alt="image_user" className="imagePreview" /> )}</div>
							</div> : <div><img src={userImage} name="documentFile" width="100" alt="image_user" className="imagePreview" /></div>}
							<Link className="btn btn-primary changeImageButton" role="button" onClick={this.onOpenClick}>
								Change Image
							</Link>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = UserEditForm;
