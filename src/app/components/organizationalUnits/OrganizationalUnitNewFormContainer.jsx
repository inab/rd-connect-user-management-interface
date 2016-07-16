var React = require('react');
var jQuery = require('jquery');
var OrganizationalUnitNewForm = require('./OrganizationalUnitNewForm.jsx');

var OrganizationalUnitNewFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null };
  },
  
  loadOrganizationalUnitSchema: function() {
	  	jQuery.ajax({
	  		url: 'json/organizationalUnitValidation.json',
	  		type: 'GET',
	  		dataType: 'json',
	  		headers: {
	  			'X-CAS-Referer': window.location.href
	  		},
	  		contentType: 'application/json; charset=utf-8',
	  	})
	  	.done(function(schema) {
      		this.setState({schema: schema});
    	}.bind(this))
		.fail(function(jqXhr) {
		    console.log('failed to retrieve Organizational Unit Schema',jqXhr);
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
  componentDidMount: function() {
    	this.loadOrganizationalUnitSchema();
  },

  render: function() {
    if (this.state.schema) {
      return (
      	<div>
	    	<OrganizationalUnitNewForm   schema={this.state.schema} />
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
module.exports = OrganizationalUnitNewFormContainer;