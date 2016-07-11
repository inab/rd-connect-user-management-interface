var React = require('react');
var jQuery = require('jquery');
var UserForm = require('./UserForm.jsx');

var UserFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null, data: null };
  },
  
  loadUserSchema: function() {
	  	jQuery.get('json/userValidation.json')
	  		.done(function(schema) {
      			this.setState({schema: schema});
    		}.bind(this))
    		.fail(function(jqXhr) {
			    console.log('failed to retrieve user Schema',jqXhr);
			    var responseText="";
			    if (jqXhr.status === 0) {
				    responseText='Not connect: Verify Network.';
				} else if (jqXhr.status == 404) {
				    responseText='Validation Schema not found [404]';
				} else if (jqXhr.status == 500) {
				    responseText='Internal Server Error [500].';
				} else if (textStatus === 'parsererror') {
				    responseText='Requested JSON parse failed.';
				} else if (textStatus === 'timeout') {
				    responseText='Time out error.';
				} else if (textStatus === 'abort') {
				    responseText='Ajax request aborted.';
				} else {
				    responseText='Uncaught Error: ' + jqXHR.responseText;
				}
			    this.setState({error: responseText});
			}.bind(this));
  },
  loadUserData: function() {
	  	jQuery.get('json/user-'+this.props.params.username+'.jsonnn')
	  		.done(function(data) {
      			this.setState({data: data});
      			this.loadUserSchema();
    		}.bind(this))
    		.fail(function(jqXhr, textStatus, errorThrown) {
			    console.log('failed to retrieve user Information',jqXhr);
			    var responseText="";
			    if (jqXhr.status === 0) {
				    responseText='Not connect: Verify Network.';
				} else if (jqXhr.status == 404) {
				    responseText='Requested User not found [404]';
				} else if (jqXhr.status == 500) {
				    responseText='Internal Server Error [500].';
				} else if (textStatus === 'parsererror') {
				    responseText='Requested JSON parse failed.';
				} else if (textStatus === 'timeout') {
				    responseText='Time out error.';
				} else if (textStatus === 'abort') {
				    responseText='Ajax request aborted.';
				} else {
				    responseText='Uncaught Error: ' + jqXHR.responseText;
				}
			    this.setState({error: responseText});
			}.bind(this));
  },
  componentDidMount: function() {
    	this.loadUserData();
  },

  render: function() {
    if (this.state.schema && this.state.data) {
      return (
      	<div>
	    	<UserForm   schema={this.state.schema}  data={this.state.data}  />
	    </div>
      )
    }
    if (this.state.error) {
      return (
      	<div>
	    	Error: {this.state.error}
	    </div>
      )
    }
    return <div>Loading...</div>;
  }
});
/*
var UserFormContainer = React.createClass({
	getInitialState: function() {
    	return {
      		schema: {},
      		data: {}
    	};
  	},
  	componentDidMount: function() {
    	this.serverRequest = jQuery.get("json/userValidation.json", function (schema) {
      		this.setState({
        		schema: schema
      		});
    	}.bind(this));
  	},
  	componentWillUnmount: function() {
	    this.serverRequest.abort();
	},
	render: function() {
		//console.log(this.state.schema);
	    return (
	      <div>
	        	<UserForm   schema={this.state.schema}  />
	      </div>
	    );
  	}
});
*/

module.exports = UserFormContainer;
