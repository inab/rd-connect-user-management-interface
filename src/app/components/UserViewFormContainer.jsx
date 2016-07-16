var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var UserViewForm = require('./UserViewForm.jsx');
import { Row, Col, Code } from 'react-bootstrap';
import {ReactRouter, Router, Route, Link, History} from 'react-router';

var UserViewFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null, data: null, error: null, showModal: false };
  	},
  	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
  	loadUserSchema: function() {
	  	jQuery.ajax({
	  		url: 'json/userValidation.json',
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
		    console.log('Failed to retrieve user Schema',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to retrieve user Schema. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to retrieve user Schema. Validation Schema not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to retrieve user Schema. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to retrieve user Schema. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to retrieve user Schema. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Failed to retrieve user Schema. Ajax request aborted.';
			} else {
			    responseText='Failed to retrieve user Schema. Uncaught Error: ' + jqXHR.responseText;
			}
		    this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
  loadUserData: function() {
	  	jQuery.ajax({
	  		url: 'json/user-'+this.props.params.username+'.json',
	  		type: 'GET',
	  		dataType: 'json',
	  		headers: {
	  			'X-CAS-Referer': window.location.href
	  		},
	  		contentType: 'application/json; charset=utf-8',
	  	})
  		.done(function(data) {
  			this.setState({data: data});
  			this.loadUserSchema();
		}.bind(this))
		.fail(function(jqXhr, textStatus, errorThrown) {
		    console.log('Failed to retrieve user Information',jqXhr);
		    var responseText="";
		    if (jqXhr.status === 0) {
			    responseText='Failed to retrieve user Information. Not connect: Verify Network.';
			} else if (jqXhr.status == 404) {
			    responseText='Failed to retrieve user Information. Requested User not found [404]';
			} else if (jqXhr.status == 500) {
			    responseText='Failed to retrieve user Information. Internal Server Error [500].';
			} else if (textStatus === 'parsererror') {
			    responseText='Failed to retrieve user Information. Requested JSON parse failed.';
			} else if (textStatus === 'timeout') {
			    responseText='Failed to retrieve user Information. Time out error.';
			} else if (textStatus === 'abort') {
			    responseText='Failed to retrieve user Information. Ajax request aborted.';
			} else {
			    responseText='Failed to retrieve user Information. Uncaught Error: ' + jqXHR.responseText;
			}
		    this.setState({error: responseText, showModal: true});
		}.bind(this));
  },
  componentDidMount: function() {
    	this.loadUserData();
  },
  mixins: [ History ], //This is to browse history back when user is not found after showing modal error
  render: function() {
    if (this.state.schema && this.state.data) {
      return (
      	<div>
	    	<UserViewForm   schema={this.state.schema}  data={this.state.data}  />
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
module.exports = UserViewFormContainer;