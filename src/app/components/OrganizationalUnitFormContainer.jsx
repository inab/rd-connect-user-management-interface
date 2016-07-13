var React = require('react');
var jQuery = require('jquery');
var OrganizationalUnitEditForm = require('./OrganizationalUnitEditForm.jsx');

var OrganizationalUnitFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null, data: null };
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
  loadOrganizationalUnitData: function() {
	  	jQuery.ajax({
	  		url: 'json/organizationalUnit-'+this.props.params.organizationalUnit+'.json',
	  		type: 'GET',
	  		dataType: 'json',
	  		headers: {
	  			'X-CAS-Referer': window.location.href
	  		},
	  		contentType: 'application/json; charset=utf-8',
	  	})
  		.done(function(data) {
  			this.setState({data: data});
  			this.loadOrganizationalUnitSchema();
		}.bind(this))
		.fail(function(jqXhr, textStatus, errorThrown) {
		    console.log('failed to retrieve Organizational Unit Information',jqXhr);
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
    	this.loadOrganizationalUnitData();
  },

  render: function() {
    if (this.state.schema && this.state.data) {
      return (
      	<div>
	    	<OrganizationalUnitEditForm   schema={this.state.schema}  data={this.state.data}  />
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
module.exports = OrganizationalUnitFormContainer;