var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var OrganizationalUnitViewForm = require('./OrganizationalUnitViewForm.jsx');
import { Row, Col, Code } from 'react-bootstrap';
import {ReactRouter, Router, Route, Link, History} from 'react-router';

var OrganizationalUnitViewFormContainer = React.createClass({
  	getInitialState: function() {
   		return { schema: null, data: null, error: null, showModal: false };
  	},
  	close(){
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
		    console.log('Failed to retrieve organizational unit Schema',jqXhr);
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
		    this.setState({error: responseText, showModal: true});
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
		    this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
  componentDidMount: function() {
    	this.loadOrganizationalUnitData();
  },
mixins: [ History ], //This is to browse history back when an organizational unit is not found after showing modal error
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
      )
    }
    return <div>Loading...</div>;
  }
});
module.exports = OrganizationalUnitViewFormContainer;
