var React = require('react');
var jQuery = require('jquery');
var GroupViewForm = require('./GroupEditForm.jsx');

var GroupViewFormContainer = React.createClass({
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
		    console.log('Failed to retrieve group Schema',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to retrieve group Schema. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to retrieve group Schema. Validation Schema not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to retrieve group Schema. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to retrieve group Schema. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to retrieve group Schema. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Failed to retrieve group Schema. Ajax request aborted.';
			} else {
			    responseText='Failed to retrieve group Schema. Uncaught Error: ' + jqXHR.responseText;
			}
		    this.setState({error: responseText});
		}.bind(this));
  },
  loadGroupData: function() {
	  	jQuery.ajax({
	  		url: 'json/group-'+this.props.params.cn+'.json',
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
		    console.log('Failed to retrieve group Information',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to retrieve group Information. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to retrieve group Information. Requested Group not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to retrieve group Information. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to retrieve group Information. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to retrieve group Information. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Failed to retrieve group Information. Ajax request aborted.';
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
	    	<GroupViewForm   schema={this.state.schema}  data={this.state.data}  />
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
module.exports = GroupViewFormContainer;
