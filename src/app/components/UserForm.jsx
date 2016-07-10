var React = require('react');
var Bootstrap = require('react-bootstrap');
import Form from "react-jsonschema-form";

var UserForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
  	},
  	
  	render: function() {
  		var schema = this.props.schema;  		
  		//console.log(schema);
  		//console.log(testSchema);
		const uiSchema = {
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
		
		const formData = {
		  title: "User Data",
		  done: true
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => console.log("yay I'm valid!");
		const onError = (errors) => console.log("I have", errors.length, "errors to fix");
	    return (
	      <Form schema={schema}
	        //uiSchema={uiSchema}
	        //formData={formData}
	        onChange={log("changed")}
	        onSubmit={onSubmit}
	        onError={onError} />
	    );
	 }
});
module.exports = UserForm;