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

var UsersGroupsEditForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired,
		groups: React.PropTypes.array.isRequired
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
	updateUserData: function({formData}){
  		console.log("yay I'm valid!");
  		//console.log("El formData contiene: ",formData);
  		var userData = Object.assign({},formData);
  		//console.log("El userData contiene: ",userData);
  		jQuery.ajax({
		    type: 'PUT',
		    url: '/users/groups/edit/:username',
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
  		console.log("ORIGINAL SCHEMA: ", schema);
  		var newSchema= new Object();
  		newSchema.type=schema.type;
  		newSchema.properties=new Object();
  		newSchema.properties.username=schema.properties.username;
  		newSchema.properties.cn=schema.properties.cn;
  		console.log("All Available Groups are: ", this.props.groups);
  		//We generate an array with all the available groups
  		var arrayGroups=new Array();
  		for(var i=0;i<this.props.groups.length;i++){
  			arrayGroups.push(this.props.groups[i].cn);
  		}
  		arrayGroups.sort()

  		newSchema.properties.groups={
			"title": "The list of groups where this user is registered in",
			"type": "array",
			"uniqueItems": true,
			"items": {
				"type": "string",
				"minLength": 1
				
			}
		};
		newSchema.properties.groups.items.enum=arrayGroups;
  		console.log("NEW SCHEMA: ", newSchema);
		var data = this.props.data;
		console.log("DATA contains: ", data);
		
		//As we will only show username, cn and groups: We generate a new data object copying this
		//fields from data
		var newData = new Object();
		newData.username=data.username; newData.cn=data.cn; newData.groups=data.groups;
		console.log("NEW DATA contains: ", newData);
		const uiSchema = {
			"username": {
				"ui:readonly": true
			},
			"cn": {
				"ui:readonly": true
			},
			"groups": {
				"ui:widget": "checkboxes"
			}
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateUserData({formData});
		const onError = (errors) => console.log("I have", errors.length, "errors to fix");
		//console.log("Error: ", this.state.error);
		//console.log("Show: ", this.state.showModal);
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
      							schema={newSchema}
					        	uiSchema={uiSchema}
					        	formData={newData}
					        	onChange={log("changed")}
					        	onSubmit={onSubmit}
					        	onError={onError}
					        	validate={userValidation}
					        	liveValidate= {true}
					        >
					        </Form>
      					</code>
      				</Col>
    			</Row>
		    </div>
	    );
	 }
});
module.exports = UsersGroupsEditForm;