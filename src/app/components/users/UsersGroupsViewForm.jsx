var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from "react-jsonschema-form";
import { Row, Col, Code, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
//var ModalError = require("./ModalError.jsx");

function userValidation(formData,errors) {
	return errors;
}

var UsersGroupsViewForm = React.createClass({
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
  	render: function() {
  		var schema = this.props.schema;
  		console.log("ORIGINAL SCHEMA: ", schema);
  		var schema = {
  			"type": "object",
			"properties": {
	  			"username": {
					"title": "The username",
					"type": "string",
					"minLength": 1
				},
				"cn": {
					"title": "Common name (usually givenName + surname)",
					"type": "string",
					"minLength": 1
				},
				"groups": {
					"title": "The list of groups where this user is registered in",
					"type": "array",
					"uniqueItems": true,
					"items": {
						"type": "string",
						"minLength": 1
					}
				}
			}
		};
  		console.log("NEW SCHEMA: ", schema);
		var data = this.props.data;
		console.log("Data: ", data);
		var username = data.username;
  		console.log(username);
		const uiSchema = {
			"username": {
				"ui:readonly": true
			},
			"cn": {
				"ui:readonly": true
			},
			"groups": {
				"ui:readonly": true
			}
		};
		const log = (type) => console.log.bind(console, type);
		//const onSubmit = ({formData}) => this.updateUserData({formData});
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
      						<Form 
      							schema={schema}
					        	uiSchema={uiSchema}
					        	formData={data}
					        	onChange={log("changed")}
					        	onError={onError}
					        	validate={userValidation}
					        	liveValidate= {true}
					        />
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
module.exports = UsersGroupsViewForm;