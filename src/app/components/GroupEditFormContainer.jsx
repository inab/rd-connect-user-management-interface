var React = require('react');
var jQuery = require('jquery');
var GroupEditForm = require('./GroupEditForm.jsx');

var GroupEditFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null, data: null };
  },
  
  loadGroupSchema: function() {
	  	jQuery.ajax({
	  		url: 'json/groupValidation.json',
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
		    console.log('failed to retrieve group Schema',jqXhr);
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
  loadGroupData: function() {
	  	jQuery.ajax({
	  		url: 'json/group-'+this.props.params.groupName+'.json',
	  		type: 'GET',
	  		dataType: 'json',
	  		headers: {
	  			'X-CAS-Referer': window.location.href
	  		},
	  		contentType: 'application/json; charset=utf-8',
	  	})
  		.done(function(data) {
  			this.setState({data: data});
  			this.loadGroupSchema();
		}.bind(this))
		.fail(function(jqXhr, textStatus, errorThrown) {
		    console.log('failed to retrieve group Information',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Requested Group not found [404]';
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
    	this.loadGroupData();
  },

  render: function() {
    if (this.state.schema && this.state.data) {
      return (
      	<div>
	    	<GroupEditForm   schema={this.state.schema}  data={this.state.data}  />
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
module.exports = GroupEditFormContainer;
