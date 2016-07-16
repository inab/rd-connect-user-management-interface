var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from "react-jsonschema-form";
import { Row, Col, Code } from 'react-bootstrap';

function organizationalUnitValidation(formData,errors) {
	var imageString = formData.picture;
	var prefix = 'data:image/jpeg';
	var prefix2 = 'data:image/jpeg';

	if ((imageString.startsWith(prefix))==false && (imageString.startsWith(prefix2))==false){
		errors.picture.addError("Invalid image format");
	}
		return errors;
}

var OrganizationalUnitEditForm = React.createClass({
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
  	updateOrganizationalUnitData: function(formData){
  		console.log("yay I'm valid!");
  		//console.log(formData);
  		var organizationalUnitData = Object.create({},formData);
  		//delete userData.userPassword2;
  		jQuery.ajax({
		    type: 'PUT',
		    url: '/some/url',
		    data: organizationalUnitData
		})
		.done(function(data) {
		    self.clearForm()
		})
		.fail(function(jqXhr) {
		    console.log('Failed to Update Organizational Unit Information',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to Update Organizational Unit Information. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to Update Organizational Unit Information. Not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to Update Organizational Unit Information. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to Update Organizational Unit Information. Sent JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to Update Organizational Unit Information. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Ajax request aborted.';
			} else {
			    responseText='Uncaught Error: ' + jqXHR.responseText;
			}
		    this.setState({error: responseText, showModal: true});
		}.bind(this));
  	},
  	render: function() {
  		var schema = this.props.schema;
		var data = this.props.data;

		schema = {
			"id": "http://rd-connect.eu/cas/json-schemas/userValidation#CASOrganizationalUnit",
			"$schema": "http://json-schema.org/draft-04/hyper-schema#",
			"title": "RD-Connect CAS organizational unit",
			"type": "object",
			"properties": {
				"organizationalUnit": {
					"title": "Organizational Unit (acronym)",
					"type": "string",
					"minLength": 1
				},
				"description": {
					"title": "Organizational Unit (long name)",
					"type": "string",
					"minLength": 1
				},
				"picture": {
					"title": "A picture with the organizational unit logotype, or a group snapshot",
					"type": "string",
					"format": "data-url",
					"media": {
						"type": "image/jpeg",
						"binaryEncoding": "base64"
					}
				},
				"links": {
					"title": "Optional links related to the user",
					"type": "array",
					"items": {
						"type": "object",
						"properties": {
							"uri": {
								"title": "The URI of the link related to the organizational UNIT",
								"type": "string",
								"format": "uri"
							},
							"label": {
								"title": "The type of URI",
								"type": "string",
								"enum": ["Publication","LinkedIn","OrganizationalUnitProfile"]
							}
						},
						"additionalProperties": false,
						"required": [
							"uri",
							"label"
						]
					}
				}
			},
			"additionalProperties": false,
			"required": [
				"organizationalUnit",
				"description"
			],
			"dependencies": {
			}
		}
  		console.log(schema);
  		console.log(data);
		/*const uiSchema = {
			
		};
		*/
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateOrganizationalUnitData({formData});
		const onError = (errors) => console.log("I have", errors.length, "errors to fix");
		console.log("Error: ", this.state.error);
		console.log("Show: ", this.state.showModal);
		
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
					        //uiSchema={uiSchema}
					        formData={data}
					        onChange={log("changed")}
					        onSubmit={onSubmit}
					        onError={onError}
					        validate={organizationalUnitValidation}
					        liveValidate= {true} />
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
module.exports = OrganizationalUnitEditForm;