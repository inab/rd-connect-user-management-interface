import React from 'react';
import jQuery from 'jquery';
import OrganizationalUnitNewForm from './OrganizationalUnitNewForm.jsx';

import config from 'config.jsx';

var OrganizationalUnitNewFormContainer = React.createClass({
	getInitialState: function() {
		return { schema: null };
	},
	componentWillMount: function() {
		this.loadOrganizationalUnitSchema();
	},
	loadOrganizationalUnitSchema: function() {
		jQuery.ajax({
			url: config.ouBaseUri + '?schema',
			type: 'GET',
			dataType: 'json',
		})
		.done(function(schema) {
			this.setState({schema: schema});
		}.bind(this))
		.fail(function(jqXhr) {
			//console.log('failed to retrieve Organizational Unit Schema',jqXhr);
			var responseText = '';
			if(jqXhr.status === 0) {
				responseText = 'Not connect: Verify Network.';
			} else if(jqXhr.status === 404) {
				responseText = 'Validation Schema not found [404]';
			} else if(jqXhr.status === 500) {
				responseText = 'Internal Server Error [500].';
			} else if(jqXhr.status === 'parsererror') {
				responseText = 'Requested JSON parse failed.';
			} else if(jqXhr.status === 'timeout') {
				responseText = 'Time out error.';
			} else if(jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText});
		}.bind(this));
  },

  render: function() {
    if(this.state.schema) {
		return (
			<div>
				<OrganizationalUnitNewForm   schema={this.state.schema} />
			</div>
		);
    }
    if(this.state.error) {
      return (
		<div>
			Error: {this.state.error}
		</div>
      );
    }
    return <div>Loading...</div>;
  }
});
module.exports = OrganizationalUnitNewFormContainer;
