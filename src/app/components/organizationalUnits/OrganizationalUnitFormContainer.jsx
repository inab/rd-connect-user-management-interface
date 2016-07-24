var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var OrganizationalUnitEditForm = require('./OrganizationalUnitEditForm.jsx');
var OrganizationalUnitViewForm = require('./OrganizationalUnitViewForm.jsx');

import { History} from 'react-router';

var OrganizationalUnitFormContainer = React.createClass({
	mixins: [ History ], //This is to browse history back when organizational unit is not found after showing modal error
	getInitialState: function() {
		return {
			schema: null,
			data: null,
			error: null,
			showModal: false,
			task: this.props.route.task
		};
	},
	componentDidMount: function() {
		this.loadOrganizationalUnitData();
	},
	close (){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
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
			console.log('Failed to retrieve Organizationa Unit Schema',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve Organizationa Unit Schema. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	loadOrganizationalUnitData: function() {
		jQuery.ajax({
			url: 'json/organizationalUnit-' + this.props.params.organizationalUnit + '.json',
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
			console.log('Failed to retrieve Organizational Unit Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve Organizational Unit Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve Organizational Unit Information. Requested User not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve Organizational Unit Information. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
				responseText = 'Failed to retrieve Organizational Unit Information. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
				responseText = 'Failed to retrieve Organizational Unit Information. Time out error.';
			} else if (textStatus === 'abort') {
				responseText = 'Failed to retrieve Organizational Unit Information. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve Organizational Unit Information. Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		if (this.state.schema && this.state.data) {
		if (this.state.task === 'edit'){
			return (
				<div>
					<OrganizationalUnitEditForm schema={this.state.schema}  data={this.state.data}  />
				</div>
			);
		} else if (this.state.task === 'view'){
			return (
				<div>
					<OrganizationalUnitViewForm schema={this.state.schema}  data={this.state.data}  />
				</div>
			);
		}
    }
    if (this.state.error) {
      return (
		<div>
			<Bootstrap.Modal show={this.state.showModal} onHide={this.history.goBack} error={this.state.error}>
				<Bootstrap.Modal.Header closeButton>
					<Bootstrap.Modal.Title>Error!</Bootstrap.Modal.Title>
				</Bootstrap.Modal.Header>
				<Bootstrap.Modal.Body>
					<h4>{this.state.error}</h4>
				</Bootstrap.Modal.Body>
				<Bootstrap.Modal.Footer>
					<Bootstrap.Button onClick={this.history.goBack}>Close</Bootstrap.Button>
				</Bootstrap.Modal.Footer>
			</Bootstrap.Modal>
		</div>
      );
    }
    return <div>Loading...</div>;
  }
});
module.exports = OrganizationalUnitFormContainer;
