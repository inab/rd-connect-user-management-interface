import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import imageNotFoundSrc from '../users/defaultNoImageFound.jsx';

import config from 'config.jsx';
import auth from 'components/auth.jsx';

function organizationalUnitValidation(formData,errors) {
	return errors;
}

function validateImageInput(image) {
	var responseText = null;
	if((image.type !== 'image/jpeg') && (image.type !== 'image/png')) {
		responseText = 'Image should be in JPEG or PNG format';
	}
	return responseText;
}

var OrganizationalUnitNewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { modalTitle: null, error: null, showModal:false, files: [], picture : null, in: false};
	},
	componentWillMount: function() {
		this.setState({picture: imageNotFoundSrc, schema: this.props.schema});
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
	dropHandler: function (files) {
        files.forEach((file)=> {
			var error = validateImageInput(file);
			if(!error){
				this.setState({files: files});
				this.setState({picture: file.preview}); //So the user's image is only updated in UI if the PUT process succeed'
			} else {
				this.setState({modalTitle: 'Error', error: error, showModal: true});
			}
        });
    },
	onOpenClick: function () {
      this.refs.dropzone.open();
    },
	addOrganizationalUnitData: function({formData}){
		//console.log('yay I\'m valid!');
		//console.log(formData);
		var organizationalUnitData = Object.assign({},formData);
		//delete userData.userPassword2;
		var responseText = '';
		//Before submitting the editted data we add the information for the picture:
		var myBlob = jQuery('.dropzoneEditNew input').get(0).files[0];
		var reader = new window.FileReader();
		var insertImage = false;
		if(typeof myBlob !== 'undefined'){
			insertImage = true;
			reader.readAsDataURL(myBlob);
			reader.onloadend = function() {
				var stringBase64Image = reader.result;
				organizationalUnitData.picture = stringBase64Image;
				jQuery.ajax({
					type: 'PUT',
					url: config.ouBaseUri,
					headers: auth.getAuthHeaders(),
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(organizationalUnitData)
				})
				.done(function(data) {
					this.setState({ modalTitle: 'Success', error: 'Organizational Unit created correctly!!', showModal: true});
				}.bind(this))
				.fail(function(jqXhr) {
					//console.log('Failed to Update Organizational Unit Information',jqXhr);
					if(jqXhr.status === 0) {
						responseText = 'Failed to Update Organizational Unit Information. Not connect: Verify Network.';
					} else if(jqXhr.status === 404) {
						responseText = 'Failed to Update Organizational Unit Information. Not found [404]';
					} else if(jqXhr.status === 500) {
						responseText = 'Failed to Update Organizational Unit Information. Internal Server Error [500].';
					} else if(jqXhr.status === 'parsererror') {
						responseText = 'Failed to Update Organizational Unit Information. Sent JSON parse failed.';
					} else if(jqXhr.status === 'timeout') {
						responseText = 'Failed to Update Organizational Unit Information. Time out error.';
					} else if(jqXhr.status === 'abort') {
						responseText = 'Ajax request aborted.';
					} else {
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
					}
					this.setState({modaTitle: 'Error', error: responseText, showModal: true});
				}.bind(this));
			}.bind(this);
		} else {
			insertImage = false;
			jQuery.ajax({
					type: 'PUT',
					url: config.ouBaseUri,
					contentType: 'application/json',
					headers: auth.getAuthHeaders(),
					dataType: 'json',
					data: JSON.stringify(organizationalUnitData)
				})
				.done(function(data) {
					//console.log('User created correctly!!');
					this.setState({modalTitle:'Success', error: 'User created correctly!!', showModal: true});

				}.bind(this))
				.fail(function(jqXhr) {
					//console.log('Failed to create new user',jqXhr.responseText);
					if(jqXhr.status === 0) {
						responseText = 'Failed to create new user. Not connect: Verify Network.';
					} else if(jqXhr.status === 404) {
						responseText = 'Failed to create new user. Not found [404]';
					} else if(jqXhr.status === 500) {
						responseText = 'Failed to create new user. Internal Server Error [500].';
					} else if(jqXhr.status === 'parsererror') {
						responseText = 'Failed to create new user. Sent JSON parse failed.';
					} else if(jqXhr.status === 'timeout') {
						responseText = 'Failed to create new user. Time out error.';
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
		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		delete schema.title;
		const formData = undefined;
		//console.log(schema);
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.addOrganizationalUnitData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);

		var ouImage = this.state.picture;
		if(typeof ouImage === 'undefined'){
			ouImage = imageNotFoundSrc;
		}
		//console.log("ouImage: ",ouImage);
		//console.log("this.state.files.length: ",this.state.files.length);
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<h3> Create New Organizational Unit</h3>
				<Collapse in={this.state.in} onEntering={this.wait} bsStyle="success" ref="fade">
					<ListGroup>
					<ListGroupItem bsStyle="success">Organizational Unit created successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={8}>
							<Form schema={schema}
							formData={formData}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							validate={organizationalUnitValidation}
							liveValidate
							showErrorList={false}
							>
								<div className="button-submit">
									<Button bsStyle="info" onClick={()=>hashHistory.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
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
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} width="100" alt="image_OU" className="imagePreview" /> )}</div>
							</div> : <div><img src={ouImage.src} width="100" alt="organizationalUnit_image"  /></div>}
						</div>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = OrganizationalUnitNewForm;
