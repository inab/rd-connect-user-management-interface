var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from "react-jsonschema-form";

var UserForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
  	},
  	sendDataToServer(formData){
  		console.log("yay I'm valid!");
  		//console.log(formData);
  		jQuery.ajax({
		    type: 'PUT',
		    url: '/some/url',
		    data: formData
		})
		.done(function(data) {
		    self.clearForm()
		})
		.fail(function(jqXhr) {
		    console.log('Failed to Update User Information');
		});
  	},
  	render: function() {
  		var schema = this.props.schema;  
  		var data = this.props.data;		
  		console.log(schema);
  		console.log(data);
		const uiSchema = {
			userPassword: {
				"ui:widget": "password"
			},
		  	foo: {
		    	bar: {
		      		"ui:widget": "textarea"
		    	},
		    	baz: {
			      	// note the "items" for an array
			      	items: {
			        	description: {
			          		"ui:widget": "textarea"
			        	}
			      	}
		    	}
		  	}
		}
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.sendDataToServer({formData});
		const onError = (errors) => console.log("I have", errors.length, "errors to fix");
	    return (
	      <Form schema={schema}
	        //uiSchema={uiSchema}
	        formData={data}
	        onChange={log("changed")}
	        onSubmit={onSubmit}
	        onError={onError} />
	    );
	 }
});
module.exports = UserForm;