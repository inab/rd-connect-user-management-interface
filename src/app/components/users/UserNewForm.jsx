import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import LayoutField from 'react-jsonschema-form-layout';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ControlLabel, ListGroup, ListGroupItem } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import imageNotFound from './defaultNoImageFound.jsx';
import zxcvbn from 'zxcvbn';
import Select from 'react-select';

//import ModalError from './ModalError.jsx';

import UserManagement from '../UserManagement.jsx';
import GroupManagement from '../GroupManagement.jsx';

function validateImageInput(image,that) {
	let responseText = null;
	if(image.type !== 'image/jpeg' && image.type !== 'image/png') {
		responseText = 'Image should be in JPEG or PNG format';
	}
	return responseText;
}

class UserNewForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		let initialFormData = this.props.template ? JSON.parse(JSON.stringify(this.props.template)) : {};
		initialFormData.enabled = true;
		
		let initiallySelectedGroups = [];
		if(this.props.template) {
			// Removing attributes which are from the template user
			delete initialFormData.cn;
			delete initialFormData.username;
			delete initialFormData.givenName;
			delete initialFormData.surname;
			delete initialFormData.title;
			delete initialFormData.email;
			
			
			// Migrating the value to a more appropriate place
			if(initialFormData.groups) {
				initiallySelectedGroups = initialFormData.groups;
				delete initialFormData.groups;
			}
		}
		
		// Pre-processing the props
		let schema = this.props.schema;

		//we delete groups from new user form since  'ui:widget' : 'hidden' doesn't work for arrays
		delete schema.properties.groups;
		delete schema.title;
		
		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		
		// We move the minLength propery from registeredEmails to email
		schema.properties.email.minItems = schema.properties.registeredEmails.minItems;
		delete schema.properties.registeredEmails;
		
		delete schema.properties.management;
		
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			files: [],
			in: false,
			picture: imageNotFound.src,
			schema: {
				...this.props.schema
			},
			selectableOUs: this.props.organizationalUnits,
			users: this.props.users,
			selectableGroups: this.props.groups,
			selectedGroups: initiallySelectedGroups,
			formData: initialFormData
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
			errors.username.addError('The username is already in use. Please choose a different one');
		}
		
		// Check whether there is at least one given name
		if(formData.givenName === undefined || formData.givenName === null || formData.givenName.length === 0) {
			errors.givenName.addError('At least one given name is needed');
		}
		
		// Check whether there is at least one surname
		if(formData.surname === undefined || formData.surname === null || formData.surname.length === 0) {
			errors.surname.addError('At least one surname is needed');
		}
		
		// Check whether there is at least one e-mail
		if(formData.email === undefined || formData.email === null || formData.email.length === 0) {
			errors.email.addError('At least one e-mail is needed');
		}
		
		// Check whether there is a selected organizational unit
		if(formData.organizationalUnit === undefined || formData.organizationalUnit === null || formData.organizationalUnit.length === 0) {
			errors.organizationalUnit.addError('Please choose an organizational unit');
		}
		
		// Check whether there is a selected user category
		if(formData.userCategory === undefined || formData.userCategory === null || formData.userCategory.length === 0) {
			errors.userCategory.addError('Please set the user category');
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
		this.setState({showModal: true});
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
    
	addUserData() {
		//console.log('yay I\'m valid!');
		let userData = Object.assign({},this.state.formData);
		delete userData.userPassword2;
		
		//console.log('El userData contiene: ',userData);
		//var userExists = this.testIfUserExists(userData);
		
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
		let um = new UserManagement();
		let gm = new GroupManagement();
		
		let groups = this.state.selectedGroups.map(group => group.value);
		
		let errHandler = (err) => {
			this.setState({
				...err,
				showModal: true
			});
		};
		let groupCreationHandler = (iGroup,usernames) => {
			if(iGroup < groups.length) {
				return gm.addMembersToGroupPromise(groups[iGroup],usernames)
					.then(() => {
						return groupCreationHandler(iGroup + 1,usernames);
					},errHandler);
			} else {
				this.setState({ modalTitle: 'Success', error: 'User created correctly!!', showModal: true});
			}
		};
		let userCreationHandler = (userD) => {
			um.createUserPromise(userD)
				.then((data) => {
					return groupCreationHandler(0,[userD.username]);
				},errHandler);
		};
		
		if(typeof myBlob !== 'undefined'){
			reader.addEventListener('load',() => {
				var stringBase64Image = reader.result;
				userData.picture = stringBase64Image;
				
				userCreationHandler(userData);
			});
			reader.readAsDataURL(myBlob);
		} else {
			userCreationHandler(userData);
		}
	}
	
	render() {
		let userImage = this.state.picture;
		if(typeof userImage === 'undefined'){
			userImage = imageNotFound.src;
		}
		//We generate the enums property for the Organizational Units extracting the info from data
		let arrayOUobjects = this.state.selectableOUs;
		arrayOUobjects.sort((a,b) => { return a.value.localeCompare(b.value); });
		let ouEnum = arrayOUobjects.map((ou) => { return ou.value; });
		let ouEnumLabel = arrayOUobjects.map((ou) => { return ou.label; });
		schema.properties.organizationalUnit.enum = ouEnum;
		schema.properties.organizationalUnit.enumNames = ouEnumLabel;
		
		//Replicating userPassword for schema validation and Ordering Schema for ui:order
		//Adding a userPassword2 field to validate userPassword change
		schema.properties.userPassword2 = JSON.parse(JSON.stringify(schema.properties.userPassword));
		schema.properties.userPassword2.title += ' (again)';
		//First we create an array with the fields with the desired order.
		var order = ['username','cn','title','givenName','surname','userPassword','userPassword2','organizationalUnit','userCategory','enabled','email','telephoneNumber','facsimileTelephoneNumber','links'];
		//We filter all the properties retrieving only the elements that are not in 'order' array
		let userSchemaKeys = Object.keys(schema.properties).filter(function(elem) {
			return order.indexOf(elem) === -1;
		});
		
		let keysLayout = userSchemaKeys.map((key) => {
			let retval = {};
			retval[key] = {md:12};
			return retval;
		});
		
		const fields = {
			layout: LayoutField
		};

		//var data = this.props.data;
		//delete data.userPassword;
		//console.log(schema);
		const uiSchema = {
			'ui:field': 'layout',
			'ui:layout': [
				{
					'username': { md: 6},
					'organizationalUnit': { md: 6 },
				},
				{
					'userPassword': { md: 6 },
					'userPassword2': { md: 6 }
				},
				{
					'title': { md: 12 },
				},
				{
					'givenName': { md: 6},
					'surname': { md: 6},
				},
				{
					'userCategory': { md: 5 },
					'enabled': { md: 2 },
					'email': { md: 5 },
				},
				{
					'links': { md: 6 },
					'telephoneNumber': { md: 3 },
					'facsimileTelephoneNumber': { md: 3 },
				},
				...keysLayout
			],
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
			'enabled': {
				'ui:widget': 'radio'
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
		
		const onSubmit = () => this.addUserData();
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		
		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<h3> Create New User { (this.props.template && this.props.template.cn) ? ' (based on ' + this.props.template.cn + ')' : '' }</h3>
				<Collapse in={this.state.in} onEntering={() => this.wait()} bsStyle="success" ref="fade">
					<ListGroup>
						<ListGroupItem bsStyle="success">User created successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={9}>
						<Form schema={schema}
							uiSchema={uiSchema}
							formData={this.state.formData}
							fields={fields}
							onChange={({formData}) => this.setState({formData})}
							//onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={(formData,errors) => this.userValidation(formData,errors)}
							liveValidate={true}
							showErrorList={false}
						>
							<div className="button-submit">
								<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
								<Button bsStyle="primary" type="submit" className="submitCancelButtons" >Submit</Button>
							</div>
						</Form>
					</Col>
					<Col xs={6} md={3} >
						<div style={{textAlign: 'center'}}>
							<ControlLabel>Initial Groups</ControlLabel>
							<Select style={{textAlign: 'left'}}
								disabled={this.state.selectableGroups.length === 0}
								placeholder="Select the group(s)"
								options={this.state.selectableGroups}
								value={this.state.selectedGroups}
								onChange={(values) => this.setState({selectedGroups: values})}
								multi
							/>
							<ControlLabel>User Picture</ControlLabel>
							{this.state.files.length > 0 ? <div>
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} width="100" alt="image_user" className="imagePreview" /> )}</div>
							</div> : <div><img src={userImage} width="100" alt="image_user" className="imagePreview" /></div>}
							<button type="button" onClick={() => this.onOpenClick()} className="changeImageButton">
								Set user picture
							</button>
							<Dropzone className="dropzoneEditNew" disableClick={false} multiple={false} accept={'image/*'} onDrop={(files) => this.dropHandler(files)} ref="dropzone" >
								Click here or drop image
							</Dropzone>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

UserNewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	template: React.PropTypes.object,
	organizationalUnits: React.PropTypes.array.isRequired,
	users: React.PropTypes.array.isRequired,
	groups: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};

export default UserNewForm;
