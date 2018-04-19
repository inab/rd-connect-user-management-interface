import React from 'react';
import jQuery from 'jquery';
import { Glyphicon, Modal, Button } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import config from 'config.jsx';
import auth from 'components/auth.jsx';

const UserPasswordReset = React.createClass({
	propTypes:{
		user: React.PropTypes.object.isRequired,
	},
	getInitialState: function() {
		return {
			modalTitle: null,
			error: null,
			showModal: false,
			user: {},
		};
	},
	componentWillMount: function(){
		console.log(this.props);
		console.log(this.state);
		this.setState({user: this.props.user});
	},
	close(){
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			hashHistory.goBack();
		}
	},
	open(){
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	},
	resetPassword: function(){
		jQuery.ajax({
				type: 'POST',
				url: config.usersBaseUri + '/' + encodeURIComponent(this.props.user.username) + '/resetPassword',
				contentType: 'application/json',
				headers: auth.getAuthHeaders(),
				dataType: 'json',
				data: JSON.stringify({})
			})
			.done(function(data) {
				this.setState({modalTitle:'Success', error: 'Password correctly resetted!!', showModal: true});

			}.bind(this))
			.fail(function(jqXhr) {
				//console.log('Failed to reset password',jqXhr.responseText);
				var responseText = '';
				if(jqXhr.status === 0) {
					responseText = 'Failed to change user password. Not connect: Verify Network.';
				} else if(jqXhr.status === 404) {
					responseText = 'Failed to change user password. Not found [404]';
				} else if(jqXhr.status === 500) {
					responseText = 'Failed to change user password. Internal Server Error [500].';
				} else if(jqXhr.status === 'parsererror') {
					responseText = 'Failed to create new user. Sent JSON parse failed.';
				} else if(jqXhr.status === 'timeout') {
					responseText = 'Failed to create new user. Time out error.';
				} else if(jqXhr.status === 'abort') {
					responseText = 'Ajax request aborted.';
				} else {
					responseText = 'Uncaught Error: ' + jqXhr.responseText;
				}
				this.setState({ modalTitle: 'Error', error: responseText, showModal: true});
			}.bind(this))
			.always(() => {
			});
	},
	render: function() {
		const onSubmit = () => this.resetPassword();
		console.log(this.props);
		console.log(this.state);
		return (
			<div>
				<h3>Password reset for user {this.props.user.username}</h3>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="info" onClick={this.close}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={onSubmit}>
					<p>Are you sure you want to reset password for user {this.props.user.username}?</p>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>hashHistory.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Reset password&nbsp;<Glyphicon glyph="pencil" /></Button>
					</div>
				</form>
			</div>
		);
	}
});
module.exports = UserPasswordReset;
