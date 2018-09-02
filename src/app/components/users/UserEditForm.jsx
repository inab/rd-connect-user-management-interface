import React from 'react';
import { Glyphicon, Modal, Button, ButtonGroup, ControlLabel, Row, Col } from 'react-bootstrap';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import LayoutField from 'react-jsonschema-form-layout';
import Dropzone from 'react-dropzone';
import imageNotFoundSrc from './defaultNoImageFound.jsx';
import { Link } from 'react-router';

import UserManagement from '../UserManagement.jsx';
import GroupManagement from '../GroupManagement.jsx';

function userValidation(formData,errors) {
	if(formData.userPassword !== formData.userPassword2) {
		errors.userPassword2.addError('Passwords don\'t match');
	}
	
	// Now test there is at least one registered e-mail
	if(formData.registeredEmails === undefined || formData.registeredEmails === null || formData.registeredEmails.length === 0) {
		// Now test there is at least one valid e-mail
		if(formData.email === undefined || formData.email === null || formData.email.length === 0) {
			errors.registeredEmails.addError('At least one registered e-mail is needed');
		}
	}
		
	// Check whether there is at least one given name
	if(formData.givenName === undefined || formData.givenName === null || formData.givenName.length === 0) {
		errors.givenName.addError('At least one given name is needed');
	}
	
	// Check whether there is at least one surname
	if(formData.surname === undefined || formData.surname === null || formData.surname.length === 0) {
		errors.surname.addError('At least one surname is needed');
	}
	
	// Check whether there is a selected user category
	if(formData.userCategory === undefined || formData.userCategory === null || formData.userCategory.length === 0) {
		errors.userCategory.addError('Please set the user category');
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

class UserEditForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			schema: {
				...this.props.schema
			},
			files: [],
			picture: this.props.user.picture ? this.props.user.picture : imageNotFoundSrc,
		});
	}
	
	close() {
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			this.history.goBack();
		}
	}
	
	open() {
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	userImageDropHandler(files) {
		//console.log('Received files: ', files);
        files.forEach((image)=> {
			var error = validateImageInput(image);
			//var pictureFromBlob= new File([file.preview], file.name);
			if(!error){
				this.setState({files: files});
				this.setState({picture: image.preview}); //So the user's image is only updated in UI if the PUT process succeed'
				//console.log("Picture in the state after validation: ", file.preview);
				/*
				var req = request
					.put(config.usersBaseUri + '/' + encodeURIComponent(this.props.user.username) + '/picture')
					.type(file.type)
					.set(auth.getAuthHeaders())
				req.attach(file.name, file);
				req.end(function(err, res){
					if(!err && res){
						this.setState({files: files});
						this.setState({picture: file.preview}); //So the user's image is only updated in UI if the PUT process succeed'
						//console.log("Picture in the state after validation: ", file.preview);
					}
					else {
						var responseText = '';
						if(err && err.status === 404) {
							responseText = 'Failed to Update User\'s image. Not found [404]';
						}
						else if(err && err.status === 500) {
							responseText = 'Failed to Update User\'s image. Internal Server Error [500]';
						}
						else if(err && err.status === 'parsererror') {
							responseText = 'Failed to Update User\'s image. Sent JSON parse failed';
						}
						else if(err && err.status === 'timeout') {
							responseText = 'Failed to Update User\'s image. Time out error';
						}
						else if(err && err.status === 'abort') {
							responseText = ('Ajax request aborted');
						}
						else if(err) {
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
    }
    
	onOpenClick() {
      this.refs.userImageDropzone.open();
    }
    
	updateUserData(formData){
		//console.log('yay I\'m valid!');
		var userData = Object.assign({},formData);
		//Before submitting the editted data we add the information for the picture:
		var myBlob = jQuery('.dropzoneEditNew input').get(0).files[0];
		var reader = new window.FileReader();

		let um = new UserManagement();
		let gm = new GroupManagement();
		
		//let groups = this.state.selectedGroups.map(group => group.value);
		let groups = [];
		
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
				this.setState({ modalTitle: 'Success', error: 'User properly modified!!', showModal: true});
			}
		};
		let userEditHandler = (username,userD) => {
			um.modifyUserPromise(username,userD)
				.then((data) => {
					return groupCreationHandler(0,[username]);
				},errHandler);
		};
		
		if(typeof myBlob !== 'undefined'){
			reader.addEventListener('load',function() {
				var stringBase64Image = reader.result;
				userData.picture = stringBase64Image;
				
				userEditHandler(this.props.user.username,userData);
			}.bind(this));
			reader.readAsDataURL(myBlob);
		} else {
			userEditHandler(this.props.user.username,userData);
		}
	}
	
	render() {
		var schema = this.state.schema;
		
		// Replicating userPassword for schema validation and Ordering Schema for ui:order
		//Adding a userPassword2 field to validate userPassword change
		//schema.properties.userPassword2 = schema.properties.userPassword;
		//We remove userPassword from the schema since password modifications will be done from another form
		delete schema.properties.userPassword;
		
		// This structure is not going to be used in the user interface
		delete schema.properties.management;

		//First we create an array with the fields with the desired order.
		//var order = ['username','cn','givenName','surname','userPassword','userPassword2'];
		var order = ['username','cn','title','givenName','surname','organizationalUnit','userCategory','enabled','email','telephoneNumber','facsimileTelephoneNumber','groups','links'];

		//We remove picture from the schema since this will be managed by react-dropzone component
		//var schemaPicture = schema.properties.picture;
		delete schema.properties.picture;

		//We filter all the properties retrieving only the elements that are not in 'order' array
		var userSchemaKeys = Object.keys(schema.properties).filter(function(elem) {
			return order.indexOf(elem) === -1;
		});
		
		let keysLayout = userSchemaKeys.map((key) => {
			let retval = {};
			retval[key] = {md:12};
			return retval;
		});

		var data = this.props.user;
		//console.log('Picture en el state contiene: ', this.state.picture);
		//console.log('File en el state contiene: ', this.state.files);
		//Once we already have picture value, we remove from data since we have removed it from schema.
		//All picture related stuff will be managed by react-dropzone component.
		delete data.picture;
		//delete data.userPassword;
		//console.log('SCHEMA: ',schema);
		//console.log('DATA: ',data);
		
		const fields = {
			layout: LayoutField
		};
		
		
		
		
		const uiSchema = {
			'ui:field': 'layout',
			'ui:layout': [
				{
					'username': { md: 6},
					'cn': { md: 6},
				},
				{
					'title': { md: 12 },
				},
				{
					'givenName': { md: 6},
					'surname': { md: 6},
				},
				{
					'organizationalUnit': { md: 5 },
					'userCategory': { md: 5 },
					'enabled': { md: 2 }
				},
				{
					'email': { md: 6 },
					'telephoneNumber': { md: 3 },
					'facsimileTelephoneNumber': { md: 3 },
				},
				{
					'groups': { md: 6 },
					'links': { md: 6 }
				},
				...keysLayout
			],
			'username': {
				'ui:readonly': true,
			},
			'acceptedGDPR': {
				//'ui:widget': 'alt-datetime',
				'ui:readonly': true,
			},
			'registeredEmails': {
				'items': {
					'registeredAt': {
						'ui:widget': 'alt-datetime',
					},
					'lastValidatedAt': {
						'ui:widget': 'alt-datetime',
					},
					'validUntil': {
						'ui:widget': 'alt-datetime',
					},
					'validQuarantineCheckUntil': {
						'ui:widget': 'alt-datetime',
					},
				}
			},
			'email': {
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
			}/*,
			'picture': {
				'ui:widget': 'file'
			}*/
		};
		//const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateUserData(formData);
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		var userImage = this.state.picture;
		if(typeof userImage === 'undefined') {
			userImage = imageNotFoundSrc;
		}
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
				<Row className="show-grid">
					<Col xs={12} md={9}>
						<Form schema={schema}
							uiSchema={uiSchema}
							fields={fields}
							formData={data}
							//onChange={({formData}) => this.setState({formData})}
							onSubmit={onSubmit}
							onError={onError}
							validate={userValidation}
							liveValidate={false}
							showErrorList={false}
						>
							<div className="button-submit">
								<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
								<Button bsStyle="primary" type="submit" className="submitCancelButtons" >Submit&nbsp;<Glyphicon glyph="pencil" /></Button>
							</div>
						</Form>
					</Col>
					<Col xs={6} md={3} >
						<div style={{textAlign: 'center'}}>
							<ControlLabel>Password</ControlLabel>
							<ButtonGroup block justified>
								<Link className="btn btn-danger changePasswordButton" role="button" to={'/users/reset-password/' + encodeURIComponent(data.username)}>
									Reset&nbsp;<Glyphicon glyph="alert" />
								</Link>
								<Link className="btn btn-danger changePasswordButton" role="button" to={'/users/password/' + encodeURIComponent(data.username)}>
									Change&nbsp;<Glyphicon glyph="pencil" />
								</Link>
							</ButtonGroup>
							<ControlLabel>User Picture</ControlLabel>
							{this.state.files.length > 0 ? <div>
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} name="documentFile" width="100" alt="image_user" className="imagePreview" /> )}</div>
							</div> : <div><img src={userImage} name="documentFile" width="100" alt="image_user" className="imagePreview" /></div>}
							<Link className="btn btn-primary changeImageButton" role="button" onClick={() => this.onOpenClick()}>
								Change User Picture
							</Link>
							<Dropzone className="dropzoneEditNew" disableClick={false} multiple={false} accept={'image/*'} onDrop={(images) => this.userImageDropHandler(images)} ref="userImageDropzone" >
								Click here or drop image for {data.username}
							</Dropzone>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

UserEditForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	user: React.PropTypes.object.isRequired,
	history: React.PropTypes.object.isRequired
};


module.exports = UserEditForm;
