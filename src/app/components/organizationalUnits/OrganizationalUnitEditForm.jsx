import React from 'react';
import jQuery from 'jquery';
import request from 'superagent';
import Form from 'react-jsonschema-form';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import imageNotFoundSrc from '../users/defaultNoImageFound.js';
import { hashHistory } from 'react-router';
import config from 'config.jsx';
import auth from 'components/auth.jsx';

function organizationalUnitValidation(formData,errors) {
	var imageString = formData.picture;
	var prefix = 'data:image/jpeg';
	var prefix2 = 'data:image/png';

	if ((imageString.startsWith(prefix)) === false && (imageString.startsWith(prefix2)) === false){
		errors.picture.addError('Invalid image format');
	}
	return errors;
}
function validateImageInput(image) {
	var responseText = null;
	if ((image.type !== 'image/jpeg') && (image.type !== 'image/png')) {
		responseText = 'Image should be in JPEG or PNG format';
	}
	return responseText;
}

var OrganizationalUnitEditForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { error: null, showModal:false, files: [], picture : null};
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
		var req = request.put(config.ouBaseUri+'/'+encodeURIComponent(this.state.data.organizationalUnit)+'/picture').set(auth.getAuthHeaders());
        files.forEach((file)=> {
			var error = validateImageInput(file);
			if (!error){
				req.attach(file.name, file);
				req.end(function(err, res){
					if (!err && res){
						this.setState({files: files});
						this.setState({picture: file.preview}); //So the ou's image is only updated in UI if the PUT process succeeds'
						//console.log("Picture in the state after validation: ", file.preview);
					}
					else {
						var responseText = '';
						if (err && err.status === 404) {
							responseText = 'Failed to Update OrganizationalUnit\'s image. Not found [404]';
						}
						else if (err && err.status === 500) {
							responseText = 'Failed to Update OrganizationalUnit\'s image. Internal Server Error [500]';
						}
						else if (err && err.status === 'parsererror') {
							responseText = 'Failed to Update OrganizationalUnit\'s image. Sent JSON parse failed';
						}
						else if (err && err.status === 'timeout') {
							responseText = 'Failed to Update OrganizationalUnit\'s image. Time out error';
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
	updateOrganizationalUnitData: function({formData}){
		console.log('yay I\'m valid!');
		console.log('El formData contiene: ',formData);
		var organizationalUnitData = Object.assign({},formData);
		jQuery.ajax({
			type: 'POST',
			url: config.ouBaseUri + '/' + encodeURIComponent(organizationalUnitData.organizationalUnit),
			headers: auth.getAuthHeaders(),
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(organizationalUnitData)
		})
		.done(function(data) {
			hashHistory.goBack();
		})
		.fail(function(jqXhr) {
			console.log('Failed to Update Organizational Unit Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Update Organizational Unit Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Update Organizational Unit Information. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Update Organizational Unit Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Update Organizational Unit Information. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Update Organizational Unit Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = this.props.schema;
		var data = this.props.data;
		/*
		schema = {
			'id': 'http://rd-connect.eu/cas/json-schemas/userValidation#CASOrganizationalUnit',
			'$schema': 'http://json-schema.org/draft-04/hyper-schema#',
			'title': 'RD-Connect CAS organizational unit',
			'type': 'object',
			'properties': {
				'organizationalUnit': {
					'title': 'Organizational Unit (acronym)',
					'type': 'string',
					'minLength': 1
				},
				'description': {
					'title': 'Organizational Unit (long name)',
					'type': 'string',
					'minLength': 1
				},
				'picture': {
					'title': 'A picture with the organizational unit logotype, or a group snapshot',
					'type': 'string',
					'format': 'data-url',
					'media': {
						'type': 'image/jpeg',
						'binaryEncoding': 'base64'
					}
				},
				'links': {
					'title': 'Optional links related to the user',
					'type': 'array',
					'items': {
						'type': 'object',
						'properties': {
							'uri': {
								'title': 'The URI of the link related to the organizational UNIT',
								'type': 'string',
								'format': 'uri'
							},
							'label': {
								'title': 'The type of URI',
								'type': 'string',
								'enum': ['Publication','LinkedIn','OrganizationalUnitProfile']
							}
						},
						'additionalProperties': false,
						'required': [
							'uri',
							'label'
						]
					}
				}
			},
			'additionalProperties': false,
			'required': [
				'organizationalUnit',
				'description'
			],
			'dependencies': {
			}
		};
		*/
		console.log('Retrieved schema from API and passed by Props: ', schema);
		console.log('data passed by props', data);

		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		console.log('Picture en el state contiene: ', this.state.picture);
		console.log('File en el state contiene: ', this.state.files);

		//Once we already have picture value, we remove from data since we have removed it from schema.
		//All picture related stuff will be managed by react-dropzone component.
		delete data.picture;

		console.log('Retrieved schema from API: ', schema);

		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateOrganizationalUnitData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		console.log('Error: ', this.state.error);
		console.log('Show: ', this.state.showModal);

		var ouImage = this.state.picture;
		if (typeof ouImage === 'undefined'){
			ouImage = imageNotFoundSrc;
		}
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>Error!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Row className = "show-grid">
					<Col xs={12} md={8}>
							<Form schema={schema}
							//uiSchema={uiSchema}
							formData={data}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							//validate={organizationalUnitValidation}
							liveValidate
							/>
					</Col>
					<Col xs={6} md={4} >
						<div>
							<button type="button" onClick={this.onOpenClick} className="changeImageButton">
								Change image
							</button>
							<Dropzone className="dropzoneEditNew" disableClick={false} multiple={false} accept={'image/*'} onDrop={this.dropHandler} ref="dropzone" >
								Click here or drop image for {data.username}
							</Dropzone>
							{this.state.files.length > 0 ? <div>
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} width="100" alt="ou_image" className="imagePreview" /> )}</div>
							</div> : <div><img src={ouImage} width="100" alt="ou_image" className="imagePreview" /></div>}
						</div>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = OrganizationalUnitEditForm;
