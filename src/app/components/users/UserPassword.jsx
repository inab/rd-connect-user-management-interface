import React from 'react';
import jQuery from 'jquery';
import { Modal, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import config from 'config.jsx';
import auth from 'components/auth.jsx';
import zxcvbn from 'zxcvbn';
import ReactMustache from 'react-mustache'

var userPassword = React.createClass({
	propTypes:{
		data: React.PropTypes.object.isRequired,
	},
	getInitialState: function() {
		return {
			modalTitle: null,
			error: null,
			showModal: false,
			data: null,
			valuePassword1: '',
			valuePassword2: '',
			zxcvbnObject1:null,
			mustachePassword1:'',
			mustachePassword2:'',
			template:'',
			suggestionsMessage:''
		};
	},
	componentWillMount: function(){
		this.setState({data: this.props.data, suggestionsMessage: 'Password strength estimator based on zxcvbn'});
	},
	close(){
		if (this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			hashHistory.goBack();
		}
	},
	open(){
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	},
	getValidationPassword1() {
		var zxcv = zxcvbn(this.state.valuePassword1);
		this.state.zxcvbnObject1 = zxcv;
		//console.log(zxcv);
		//console.log(zxcv.sequence);
		var template = '<table class=""> \
        <tr>\
            <td colspan="3">guess times:</td>\
        </tr>\
        <tr>\
            <td>100 / hour:</td>\
            <td>{{crack_times_display.online_throttling_100_per_hour}} ({{crack_times_seconds.online_throttling_100_per_hour}} secs.)</td>\
            <td> (throttled online attack)</td>\
        </tr>\
        <tr>\
            <td>10&nbsp; / second:</td>\
            <td>{{crack_times_display.online_no_throttling_10_per_second}} ({{crack_times_seconds.offline_slow_hashing_1e4_per_second}} secs.)</td>\
            <td> (unthrottled online attack)</td>\
        </tr>\
        <tr>\
            <td>10k / second:</td>\
            <td>{{crack_times_display.offline_slow_hashing_1e4_per_second}} ({{crack_times_seconds.offline_slow_hashing_1e4_per_second}})</td>\
            <td> (offline attack, slow hash, many cores)</td>\
        </tr>\
        <tr>\
            <td>10B / second:</td>\
            <td>{{crack_times_display.offline_fast_hashing_1e10_per_second}} ({{crack_times_seconds.offline_fast_hashing_1e10_per_second}})</td>\
            <td> (offline attack, fast hash, many cores)</td>\
        </tr>\
    </tbody>\
</table>';
		this.state.template = template;
		//var mustachePassword1 = Mustache.render(template, zxcv);
		//this.state.mustachePassword1 = mustachePassword1;
		//console.log(mustachePassword1);
		const score = zxcv.score;
		if (score > 3) {
			return 'success';
		} else if (score > 2) {
			return 'warning';
		} else if (score > 1) {
			return 'warning';
		} else if (score > 0) {
			return 'error';
		} else if (score === 0) {
			return 'error';
		}

	},
	getValidationPassword2() {		
		if(this.state.valuePassword1===this.state.valuePassword2) {
			return this.getValidationPassword1();
		} else {
			return 'error';
		}
	},
	handleChange1(e) {
		this.setState({ valuePassword1: e.target.value });
	},
	handleChange2(e) {
		this.setState({ valuePassword2: e.target.value });
	},
	changePassword: function(){
		jQuery.ajax({
				type: 'POST',
				url: config.usersBaseUri + '/' + encodeURIComponent(this.props.data.username) + '/resetPassword',
				contentType: 'application/json',
				headers: auth.getAuthHeaders(),
				dataType: 'json',
				data: JSON.stringify({userPassword: this.state.valuePassword1})
			})
			.done(function(data) {
				console.log('Password correctly updated!!');
				this.setState({modalTitle:'Success', error: 'Password changed correctly!!', showModal: true});

			}.bind(this))
			.fail(function(jqXhr) {
				console.log('Failed to change user password',jqXhr.responseText);
				var responseText = '';
				if (jqXhr.status === 0) {
					responseText = 'Failed to change user password. Not connect: Verify Network.';
				} else if (jqXhr.status === 404) {
					responseText = 'Failed to change user password. Not found [404]';
				} else if (jqXhr.status === 500) {
					responseText = 'Failed to change user password. Internal Server Error [500].';
				} else if (jqXhr.status === 'parsererror') {
					responseText = 'Failed to create new user. Sent JSON parse failed.';
				} else if (jqXhr.status === 'timeout') {
					responseText = 'Failed to create new user. Time out error.';
				} else if (jqXhr.status === 'abort') {
					responseText = 'Ajax request aborted.';
				} else {
					responseText = 'Uncaught Error: ' + jqXhr.responseText;
				}
				this.setState({ modalTitle: 'Error', error: responseText, showModal: true});
			}.bind(this))
			.always(() => {
			});
		/*
		jQuery.ajax({
			type: 'PUT',
			url: config.usersBaseUri,
			dataType: 'json',
			//processData: false,
			contentType: 'application/json',
			headers: auth.getAuthHeaders(),
			data: JSON.stringify()
		})
		.done(function(data) {
			self.clearForm();
		})
		.fail(function(jqXhr) {
			console.log('Failed to Create New User',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Create New User. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Create New User. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Create New User. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Create New User. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Create New User. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
		*/
	},
	render: function() {
		var suggestions = this.state.suggestionsMessage;
		const onSubmit = () => this.changePassword();
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={onSubmit}>
					<Grid>
						<Row>
							<Col sm={12} md={6}>
								<FormGroup
								controlId="formBasicText"
								validationState={this.getValidationPassword1()}
								>
								<ControlLabel>Write new password</ControlLabel>
								<FormControl
									type="password"
									value={this.state.valuePassword1}
									placeholder="New password"
									onChange={this.handleChange1}
								/>
								<FormControl.Feedback />
								<HelpBlock>{suggestions}</HelpBlock>
								</FormGroup>
							</Col>
							<Col sm={12} md={6}>
								<FormGroup
								controlId="formBasicText"
								validationState={this.getValidationPassword2()}
								>
									<ControlLabel>Repeat password</ControlLabel>
									<FormControl
										type="password"
										value={this.state.valuePassword2}
										placeholder="Repeat password"
										onChange={this.handleChange2}
									/>
									<FormControl.Feedback />
								</FormGroup>
							</Col>
						</Row>
					</Grid>
					<div className="button-submit">
						<Button bsStyle="primary" onClick={()=>hashHistory.goBack()} className="submitCancelButtons" >Cancel</Button>
						<Button bsStyle="primary" type="submit" className="submitCancelButtons" >Change password</Button>
					</div>
				</form>
				<ReactMustache template={this.state.template} data={this.state.zxcvbnObject1} />
			</div>
		);
	}
});
module.exports = userPassword;
