var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var request = require('superagent');
import Form from 'react-jsonschema-form';
import { Row, Col, Button } from 'react-bootstrap';
import createHistory from 'history/lib/createBrowserHistory';
var Dropzone = require('react-dropzone');
var imageNotFoundSrc = require('../users/defaultNoImageFound.js');

function organizationalUnitValidation(formData,errors) {
	if (this.formdata.picture){
		var imageString = formData.picture;
		var prefix = 'data:image/jpeg';
		var prefix2 = 'data:image/jpeg';

		if ((imageString.startsWith(prefix)) === false && (imageString.startsWith(prefix2)) === false){
			errors.picture.addError('Invalid image format');
		}
	}
		return errors;
}
function validateImageInput(image) {
	var responseText = null;
	if ((image.type !== 'image/jpeg') && (image.type !== 'image/png')) {
		responseText = 'Image should be in jpeg format';
	}
	return responseText;
}

var OrganizationalUnitNewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return { error: null, showModal:false, files: [], picture : null};
	},
	componentWillMount: function() {
		this.setState({picture: imageNotFoundSrc});
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	dropHandler: function (files) {
		console.log('Received files: ', files);
		var req = request.post('/organizationalUnits/:ou_id/picture');
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
	addOrganizationalUnitData: function({formData}){
		console.log('yay I\'m valid!');
		//console.log(formData);
		var organizationalUnitData = Object.assign({},formData);
		//delete userData.userPassword2;
		jQuery.ajax({
			type: 'PUT',
			url: '/some/url',
			data: organizationalUnitData
		})
		.done(function(data) {
			self.clearForm();
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
		const history = createHistory();
		var schema = this.props.schema;
		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		const formData = undefined;
		console.log(schema);
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.addOrganizationalUnitData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		console.log('Error: ', this.state.error);
		console.log('Show: ', this.state.showModal);

		var ouImage = this.state.picture;
		console.log("ouImage: ",ouImage);
		if (typeof ouImage === 'undefined'){
			ouImage = imageNotFoundSrc;
		}
		console.log("ouImage: ",ouImage);
		console.log("this.state.files.length: ",this.state.files.length);
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
							formData={formData}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							//validate={organizationalUnitValidation}
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
							<div>{this.state.files.map((file) => <img ref="imagePreview" src={file.preview} width="100" alt="image_OU" className="imagePreview" /> )}</div>
							</div> : <div><img src={ouImage.src} width="100" alt="organizationalUnit_image" className="imagePreview" /></div>}
						</div>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = OrganizationalUnitNewForm;
