var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var request = require('superagent');
import Form from 'react-jsonschema-form';
import { Row, Col, Button } from 'react-bootstrap';
import { hashHistory } from 'react-router';
var Dropzone = require('react-dropzone');
var imageNotFoundSrc = require('./defaultNoImageFound.js');
var MultiselectField = require('./Multiselect.jsx');


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

var UserNewFormUnprivileged = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.array.isRequired,
		groups: React.PropTypes.array.isRequired,
		groupsSelected: React.PropTypes.array
	},
	getInitialState: function() {
		return {
			error: null,
			showModal: false,
			files: [],
			picture : null,
			schema: null,
			data: null,
			groups: [],
			groupsSelected: []
		};
	},
	componentWillMount: function() {
		this.setState({
			picture: this.props.data.picture,
			schema: this.props.schema,
			data: this.props.data,
			groups: this.props.groups
		});
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	handleChangeSelected:function(value){
		//console.log(value);
		var groupsSelected = this.state.groupsSelected;
		if (value === null){
			groupsSelected = [];
		}
		else {
			groupsSelected = value.split(',');
		}
		this.setState({groupsSelected:groupsSelected});
		console.log('this.state.groupsSelected inside handleChangeSelected contains: ', groupsSelected);
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
		//now we have to insert groups inside userData.
		userData.groups = this.state.groupsSelected;
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
		const formData = {};
		var schema = this.props.schema;
		//we delete groups from new user since it will be managed by MultiselectField component
		delete schema.properties.groups;
		//We delete the "enabled" option since it allways be disabled following this unprivileged process
		delete schema.properties.enabled;
		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		//We generate an array with all the available groups that will be used as "options" input for Multiselect component
		//allowCreate=false (default) so only groups inside options array will be allowed inside component
		console.log('groups contains: ', this.state.groups);
		var arrayGroups = Object.create(this.state.groups);
		var options = [];
		this.state.groups.map(function(group, i){
			arrayGroups[group.cn] = group.cn;
			options.push({'value':group.cn, 'label': group.cn});
		});
		//Now we generate the initialSelected array. Which contains the groups that the user already belongs to. This
		//array will be passed as a prop to the MutiselectField component
		console.log('arrayGroups contiene: ', arrayGroups);
		var initialGroupsSelected = this.state.groupsSelected;
		console.log('initialGroupsSelected contains: ', initialGroupsSelected);

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
		var order = ['username','cn','givenName','surname','userPassword','userPassword2','email'];
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
								liveValidate={false}
							>
								<MultiselectField label="Applicate to these groups" options={options} initialSelected={initialGroupsSelected} onChangeSelected={this.handleChangeSelected} />
								<div className="button-submit">
									<Button bsStyle="primary" onClick={()=>hashHistory.goBack()} className="submitCancelButtons" >Cancel</Button>
									<Button bsStyle="primary" type="submit" className="submitCancelButtons">Create User</Button>
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
});
module.exports = UserNewFormUnprivileged;
