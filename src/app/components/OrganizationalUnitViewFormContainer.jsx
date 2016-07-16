var React = require('react');
var jQuery = require('jquery');
var OrganizationalUnitViewForm = require('./OrganizationalUnitEditForm.jsx');

var OrganizationalUnitViewFormContainer = React.createClass({
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
		    console.log('failed to retrieve organizational unit Schema',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to retrieve organizational unit Schema. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to retrieve organizational unit Schema. Validation Schema not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to retrieve organizational unit Schema. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to retrieve organizational unit Schema. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to retrieve organizational unit Schema. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Failed to retrieve organizational unit Schema. Ajax request aborted.';
			} else {
			    responseText='Uncaught Error: ' + jqXHR.responseText;
			}
		    this.setState({error: responseText});
		}.bind(this));
  },
  loadOrganizationalUnitData: function() {
	  	jQuery.ajax({
	  		url: 'json/organizationalUnit-'+this.props.params.username+'.json',
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
		    console.log('Failed to retrieve organizational unit Information',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to retrieve organizational unit Information. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to retrieve organizational unit Information. Requested User not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to retrieve organizational unit Information. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to retrieve organizational unit Information. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to retrieve organizational unit Information. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Failed to retrieve organizational unit Information. Ajax request aborted.';
			} else {
			    responseText='Failed to retrieve organizational unit Information. Uncaught Error: ' + jqXHR.responseText;
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
	    	<OrganizationalUnitViewForm   schema={this.state.schema}  data={this.state.data}  />
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
module.exports = OrganizationalUnitViewFormContainer;
