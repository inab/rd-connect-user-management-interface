var React = require('react');
var jQuery = require('jquery');
var GroupNewForm = require('./GroupNewForm.jsx');

var GroupNewFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null };
  },
  componentWillMount: function() {
	this.loadGroupSchema();
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
		console.log('Failed to retrieve Group Schema. ',jqXhr);
		var responseText = '';
		if (jqXhr.status === 0) {
			responseText = 'Failed to retrieve Group Schema. Not connect: Verify Network.';
		} else if (jqXhr.status === 404) {
			responseText = 'Failed to retrieve Group Schema. Validation Schema not found [404]';
		} else if (jqXhr.status === 500) {
			responseText = 'Failed to retrieve Group Schema. Internal Server Error [500].';
		} else if (jqXhr.status === 'parsererror') {
			responseText = 'Failed to retrieve Group Schema. Requested JSON parse failed.';
		} else if (jqXhr.status === 'timeout') {
			responseText = 'Failed to retrieve Group Schema. Time out error.';
		} else if (jqXhr.status === 'abort') {
			responseText = 'Failed to retrieve Group Schema. Ajax request aborted.';
		} else {
			responseText = 'Failed to retrieve Group Schema. Uncaught Error: ' + jqXhr.responseText;
		}
		this.setState({error: responseText});
	}.bind(this));
  },
  render: function() {
    if (this.state.schema) {
      return (
		<div>
			<GroupNewForm   schema={this.state.schema} />
		</div>
      );
    }
    if (this.state.error) {
      return (
		<div>
			Error: {this.state.error}
		</div>
      );
    }
    return <div>Loading...</div>;
  }
});
module.exports = GroupNewFormContainer;
