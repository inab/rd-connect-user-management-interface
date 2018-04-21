import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ListGroup, ListGroupItem } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import imageNotFoundSrc from './defaultNoImageFound.jsx';
import zxcvbn from 'zxcvbn';

//import ModalError from './ModalError.jsx';

import config from 'config.jsx';
import auth from 'components/auth.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

function validateImageInput(image,that) {
	let responseText = null;
	if(image.type !== 'image/jpeg' && image.type !== 'image/png') {
		responseText = 'Image should be in JPEG or PNG format';
	}
	return responseText;
}

class UserNewForm extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			files: [],
			picture : null,
			in: false
		});
		this.setState({
			picture: imageNotFoundSrc,
			schema: this.props.schema,
			data: this.props.data,
			users: this.props.users
		});
	}
	
	userValidation(formData,errors) {
		if(formData.userPassword !== undefined && formData.userPassword !== null) {
			let zxcv = zxcvbn(formData.userPassword);
			const score = zxcv.score;
			if(score <= 3) {
				errors.userPassword.addError('Password too weak (score=' + score + ')');
			}
		}
		
		if(formData.userPassword !== formData.userPassword2) {
			errors.userPassword2.addError('Passwords don\'t match');
		}
		//Now we test if user exists...
		var username = formData.username;
		var arrayOfUsers = this.state.users;
		var usersRepeated = jQuery.grep(arrayOfUsers, function(e){ return e.username === username; });
		if(usersRepeated.length !== 0 ){
			errors.username.addError('The username is in use. Please choose a different one');
		}

		//Now we test if email exists...
		var email = formData.email;
		var arrayOfUsers = this.state.users;
		//console.log('arrayOfUsers contains: ', arrayOfUsers);
		jQuery.grep(arrayOfUsers, function(e){
			//console.log('e contains: ', e );
			if(typeof email !== 'undefined'){
				//e.email is an array of emails. We have to look inside each one
				if(typeof e.email !== 'undefined'){
					for(var x = 0; x < e.email.length; x++){
						if(e.email[x] === email[x]) {
							errors.email.addError('The email is in use. Please choose a different one');
						}
					}
				}
			}
		});
		return errors;
	}
	
	close() {
		if(this.state.modalTitle === 'Error') {
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			this.history.goBack();
		}
	}
	
	open() {
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	toggle() {
      this.setState({ in: !this.state.in });
    }
    
    wait() {
      setTimeout(() => this.toggle(), 3000);
    }
    
	dropHandler(files) {
        files.forEach((file)=> {
			var error = validateImageInput(file);
			if(!error){
				this.setState({files: files});
				this.setState({picture: file.preview}); //So the user's image is only updated in UI if the PUT process succeed'
			} else {
				this.setState({modalTitle: 'Error', error: error, showModal: true});
			}
        });
    }
    
	onOpenClick() {
      this.refs.dropzone.open();
    }
    
	addUserData({formData}){
		//console.log('yay I\'m valid!');
		var userData = Object.assign({},formData);
		delete userData.userPassword2;
		//console.log('El userData contiene: ',userData);
		//var userExists = this.testIfUserExists(userData);
		var responseText = '';
		
		if(userData.userPassword === undefined || userData.userPassword === null || userData.userPassword === '') {
			// Generating a random password, in case the password field is empty
			function shuffleArray(array) {
				for(let i = array.length - 1; i > 0; i--) {
					let j = Math.floor(Math.random() * (i + 1));
					let temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
				return array;
			}
			function generatePassword(passwordLength) {
				let numberChars = '0123456789';
				let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				let lowerChars = 'abcdefghiklmnopqrstuvwxyz';
				let punctuation = ',.;:+-/&%$!"\'?';
				let allChars = upperChars + punctuation + numberChars + lowerChars;
				let randPasswordArray = Array(passwordLength);
				
				randPasswordArray[0] = upperChars;
				randPasswordArray[1] =  punctuation;
				randPasswordArray[2] =  numberChars;
				randPasswordArray[3] =  lowerChars;
				randPasswordArray.fill(allChars,4);
				return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)]; })).join('');
			}
			
			userData.userPassword = generatePassword(12);
		}
		
		//Before submitting the editted data we add the information for the picture:
		var myBlob = jQuery('.dropzoneEditNew input').get(0).files[0];
		var reader = new window.FileReader();
		if(typeof myBlob !== 'undefined'){
			reader.addEventListener('load',function() {
				var stringBase64Image = reader.result;
				userData.picture = stringBase64Image;
				jQuery.ajax({
					type: 'PUT',
					url: config.usersBaseUri,
					headers: auth.getAuthHeaders(),
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(userData)
				})
				.done(function(data) {
					this.setState({ modalTitle: 'Success', error: 'User created correctly!!', showModal: true});
				}.bind(this))
				.fail(function(jqXhr) {
					//console.log('Failed to Create New User',jqXhr);
					if(jqXhr.status === 0) {
						responseText = 'Failed to Create New User. Not connect: Verify Network.';
					} else if(jqXhr.status === 404) {
						responseText = 'Failed to Create New User. Not found [404]';
					} else if(jqXhr.status === 500) {
						responseText = 'Failed to Create New User. Internal Server Error [500].';
					} else if(jqXhr.status === 'parsererror') {
						responseText = 'Failed to Create New User. Sent JSON parse failed.';
					} else if(jqXhr.status === 'timeout') {
						responseText = 'Failed to Create New User. Time out error.';
					} else if(jqXhr.status === 'abort') {
						responseText = 'Ajax request aborted.';
					} else {
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
					}
					this.setState({modaTitle: 'Error', error: responseText, showModal: true});
				}.bind(this));
			}.bind(this));
			reader.readAsDataURL(myBlob);
		} else {
			jQuery.ajax({
					type: 'PUT',
					url: config.usersBaseUri,
					contentType: 'application/json',
					headers: auth.getAuthHeaders(),
					dataType: 'json',
					data: JSON.stringify(userData)
				})
				.done(function(data) {
					//console.log('User created correctly!!');
					this.setState({modalTitle:'Success', error: 'User created correctly!!', showModal: true});

				}.bind(this))
				.fail(function(jqXhr) {
					//console.log('Failed to create new user',jqXhr.responseText);
					let responseTextUser = '';
					if(jqXhr.status === 0) {
						responseTextUser = 'Failed to create new user. Not connect: Verify Network.';
					} else if(jqXhr.status === 404) {
						responseTextUser = 'Failed to create new user. Not found [404]';
					} else if(jqXhr.status === 500) {
						responseTextUser = 'Failed to create new user. Internal Server Error [500].';
					} else if(jqXhr.status === 'parsererror') {
						responseTextUser = 'Failed to create new user. Sent JSON parse failed.';
					} else if(jqXhr.status === 'timeout') {
						responseTextUser = 'Failed to create new user. Time out error.';
					} else if(jqXhr.status === 'abort') {
						responseTextUser = 'Ajax request aborted.';
					} else {
						responseTextUser = 'Uncaught Error: ' + jqXhr.responseText;
					}
					this.setState({ modalTitle: 'Error', error: responseTextUser, showModal: true});
				}.bind(this))
				.always(() => {
				});
		}
	}
	
	render() {
		const formData = {};
		let schema = this.state.schema;

		//we delete groups from new user form since  'ui:widget' : 'hidden' doesn't work for arrays
		delete schema.properties.groups;
		delete schema.title;
		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		
		let userImage = this.state.picture;
		if(typeof userImage === 'undefined'){
			userImage = imageNotFoundSrc;
		}
		//We generate the enums property for the Organizational Units extracting the info from data
		let arrayOUobjects = this.state.data; var arrayOUstrings = [];
		for(let i = 0; i < arrayOUobjects.length; i++) {
			arrayOUstrings.push(arrayOUobjects[i].organizationalUnit);
		}
		arrayOUstrings.sort();
		
		schema.properties.organizationalUnit.enum = arrayOUstrings;
		//Replicating userPassword for schema validation and Ordering Schema for ui:order
		//Adding a userPassword2 field to validate userPassword change
		schema.properties.userPassword2 = schema.properties.userPassword;
		//First we create an array with the fields with the desired order.
		let order = ['username','cn','givenName','surname','userPassword','userPassword2','email'];
		//We filter all the properties retrieving only the elements that are not in 'order' array
		let userSchemaKeys = Object.keys(schema.properties).filter(function(elem) {
			return order.indexOf(elem) === -1;
		});
		//We concatenate order with userSchemaKeys, retrieving the ordered schema as desired
		let schemaOrdered = order.concat(userSchemaKeys);

		//var data = this.props.data;
		//delete data.userPassword;
		//console.log(schema);
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
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		
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
				<h3> Create New User </h3>
				<Collapse in={this.state.in} onEntering={this.wait} bsStyle="success" ref="fade">
					<ListGroup>
					<ListGroupItem bsStyle="success">User created successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={8}>
						<Form schema={schema}
						uiSchema={uiSchema}
						formData={formData}
						//onChange={log('changed')}
						onSubmit={onSubmit}
						onError={onError}
						validate={this.userValidation}
						liveValidate
						showErrorList={false}
						>
							<div className="button-submit">
								<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
								<Button bsStyle="primary" type="submit" className="submitCancelButtons" >Submit</Button>
							</div>
						</Form>
					</Col>
					<Col xs={6} md={4} >
						<div>
							<button type="button" onClick={this.onOpenClick} className="changeImageButton">
								Add image
							</button>
							<Dropzone className="dropzoneEditNew" disableClick={false} multiple={false} accept={'image/*'} onDrop={this.dropHandler} ref="dropzone" >
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
}

UserNewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	data: React.PropTypes.array.isRequired,
	users: React.PropTypes.array.isRequired
};

module.exports = UserNewForm;
