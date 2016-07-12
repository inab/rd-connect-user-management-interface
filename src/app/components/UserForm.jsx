var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from "react-jsonschema-form";
//var ModalError = require("./ModalError.jsx");

function userValidation(formData,errors) {
	if (formData.userPassword !== formData.userPassword2) {
	    errors.userPassword2.addError("Passwords don't match");
	}
		return errors;
}

var UserForm = React.createClass({
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
  	updateUserData: function(formData){
  		console.log("yay I'm valid!");
  		//console.log(formData);
  		var userData = Object.create({},formData);
  		delete userData.userPassword2;
  		jQuery.ajax({
		    type: 'PUT',
		    url: '/some/url',
		    data: userData
		})
		.done(function(data) {
		    self.clearForm()
		})
		.fail(function(jqXhr) {
		    console.log('Failed to Update User Information',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to Update User Information. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to Update User Information. Not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to Update User Information. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to Update User Information. Sent JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to Update User Information. Time out error.';
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
  		// Replicating userPassword for schema validation and Ordering Schema for ui:order
  		//Adding a userPassword2 field to validate userPassword change
  		schema.properties.userPassword2 = schema.properties.userPassword;
  		//First we create an array with the fields with the desired order.
  		var order = ["username","cn","givenName","surname","userPassword","userPassword2"];
  		//We filter all the properties retrieving only the elements that are not in "order" array
		var userSchemaKeys = Object.keys(schema.properties).filter(function(elem) {
  			return order.indexOf(elem)==-1;
  		});
  		//We concatenate order with userSchemaKeys, retrieving the ordered schema as desired
  		var schemaOrdered = order.concat(userSchemaKeys);
		
		var data = this.props.data;
  		delete data.userPassword;	
  		console.log(schema);
  		console.log(data);
		const uiSchema = {
			"ui:order": schemaOrdered,
			"userPassword": {
				"ui:widget": "password",
				"ui:placeholder": "************"
			},
			"userPassword2": {
				"ui:widget": "password",
				"ui:placeholder": "************"
			},
			"cn": {
				"ui:readonly": true,
			},
			"organizationalUnit": {
				"ui:readonly": true,
			},
			"groups": {
				"ui:readonly": true,
			},
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateUserData({formData});
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
	      		<Form schema={schema}
			        uiSchema={uiSchema}
			        formData={data}
			        onChange={log("changed")}
			        onSubmit={onSubmit}
			        onError={onError}
			        validate={userValidation}
			        liveValidate= {true} />
		    </div>
	    );
	 }
});
module.exports = UserForm;