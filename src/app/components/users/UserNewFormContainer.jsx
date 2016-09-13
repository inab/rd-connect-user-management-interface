var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
var UserNewForm = require('./UserNewForm.jsx');
var UserNewFormUnprivileged = require('./UserNewFormUnprivileged.jsx');
import { hashHistory } from 'react-router';

var UserNewFormContainer = React.createClass({
	propTypes: {
		route: React.PropTypes.array,
		params: React.PropTypes.object
	},
	//mixins: [ History ], //This is to browse history back when user is not found after showing modal error
	contextTypes: {
		router: React.PropTypes.object
	},
	getInitialState: function() {
		return {
			data: null,
			schema: null,
			groups: null,
			error: null,
			showModal: false,
			task: null };
	},
	componentWillMount: function() {
		this.setState({task: this.props.route.task});
		this.loadUserSchema();
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	loadGroupsFromServer: function() {
		jQuery.ajax({
			url: 'json/groups.json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			dataType: 'json',
			cache: false,
		})
		.done(function(groups) {
			//console.log('success!');
			this.setState({groups: groups});
		}.bind(this))
		.fail(function(xhr, status, err) {
			//console.error('json/OrganizationalUnitalUnits.json', status, err);
			console.error(xhr.status);
			this.setState({error: xhr.status + ' (Retrieving Groups)'});
		}.bind(this));
	},
	loadOrganizationalUnitsFromServer: function() {
		jQuery.ajax({
			url: 'json/organizationalUnits.json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log("success!");
				this.setState({data: data});
				//console.log(this.state.data);
				this.loadGroupsFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/OrganizationalUnitalUnits.json", status, err);
				console.error(xhr.status);
				var responseText = '';
				if (xhr.status === 0) {
					responseText = 'Not connect: Verify Network.';
				} else if (xhr.status === 404) {
					responseText = 'Validation Schema not found [404]';
				} else if (xhr.status === 500) {
					responseText = 'Internal Server Error [500].';
				} else if (xhr.status === 'parsererror') {
					responseText = 'Requested JSON parse failed.';
				} else if (xhr.status === 'timeout') {
					xhr = 'Time out error.';
				} else if (xhr.status === 'abort') {
					responseText = 'Ajax request aborted.';
				} else {
					responseText = 'Uncaught Error: ' + xhr.responseText;
				}
				this.setState({error: responseText, showModal: true});
				//this.setState({error: xhr.status + ' (Retrieving Organizational Units)'});
			}.bind(this)
		});
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
			this.loadOrganizationalUnitsFromServer();
		}.bind(this))
		.fail(function(jqXhr) {
			console.log('failed to retrieve user Schema',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Validation Schema not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},

	render: function() {
		if ((this.state.schema) && (this.state.data)) {
			if (this.state.task === 'new_privileged'){
				return (
					<div>
						<UserNewForm   schema={this.state.schema} data={this.state.data}/>
					</div>
				);
			} else if (this.state.task === 'new_unprivileged'){
				if (this.state.groups){
					return (
						<div>
							<UserNewFormUnprivileged   schema={this.state.schema} data={this.state.data} groups={this.state.groups}/>
						</div>
					);
				}
			}
		}
		if (this.state.error) {
			return (
				<div>
					<Bootstrap.Modal show={this.state.showModal} onHide={()=>hashHistory.goBack()} error={this.state.error}>
						<Bootstrap.Modal.Header closeButton>
							<Bootstrap.Modal.Title>Error!</Bootstrap.Modal.Title>
						</Bootstrap.Modal.Header>
						<Bootstrap.Modal.Body>
							<h4>{this.state.error}</h4>
						</Bootstrap.Modal.Body>
						<Bootstrap.Modal.Footer>
							<Bootstrap.Button onClick={()=>hashHistory.goBack()}>Close</Bootstrap.Button>
						</Bootstrap.Modal.Footer>
					</Bootstrap.Modal>
				</div>
			);
		}
		return <div>Loading...</div>;
		}
		});
		module.exports = UserNewFormContainer;
