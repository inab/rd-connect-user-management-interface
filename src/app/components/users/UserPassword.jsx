import React from 'react';
import jQuery from 'jquery';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { hashHistory } from 'react-router';
import config from 'config.jsx';
import auth from 'components/auth.jsx';
import zxcvbn from 'zxcvbn';
import ReactMustache from 'react-mustache'

var userPassword = React.createClass({
	propTypes:{
		data: React.PropTypes.object.isRequired,
		schema: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			data: null,
			schema: null,
			valuePassword1: '',
			valuePassword2: '',
			zxcvbnObject1:null,
			zxcvbnObject2:null,
			mustachePassword1:'',
			mustachePassword2:'',
			template:'',
			suggestionsMessage:''
		};
	},
	componentWillMount: function(){
		this.setState({data: this.props.data, suggestionsMessage: 'Password strength estimator based on zxcvbn'});
	},
	getValidationPassword1() {
		var zxcv = zxcvbn(this.state.valuePassword1);
		this.state.zxcvbnObject1 = zxcv;
		console.log(zxcv);
		console.log(zxcv.sequence);
		var template = '<table class=""> \
    <tbody>\
        <tr>\
            <td>password: </td>\
            <td colspan="2"><strong>{{password}}</strong></td>\
        </tr>\
        <tr>\
            <td>guesses_log10: </td>\
            <td colspan="2">{{guesses_log10}}</td>\
        </tr>\
        <tr>\
            <td>score: </td>\
            <td>{{score}}</td>\
        </tr>\
        <tr>\
            <td>function runtime (ms): </td>\
            <td colspan="2">{{calc_time}}</td>\
        </tr>\
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
        <tr>\
            <td colspan="3"><strong>match sequence:</strong></td>\
        </tr>\
    </tbody>\
</table>\
<table><tbody><tr><td>Suggestions:</td><td>{{feedback.suggestions}}</td></tr><tr><td>Warnings:</td><td>{{feedback.warning}}</td></tr></tbody></table>';
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
	handleChange1(e) {
		this.setState({ valuePassword1: e.target.value });
	},
	handleChange2(e) {
		this.setState({ valuePassword2: e.target.value });
	},
	changePassword: function(){
		console.log('yay I\'m valid!');
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
		return (
			<div>
				<form>
					<FormGroup
					controlId="formBasicText"
					validationState={this.getValidationPassword1()}
					>
					<ControlLabel>Create new password</ControlLabel>
					<FormControl
						type="text"
						value={this.state.valuePassword1}
						placeholder="New password"
						onChange={this.handleChange1}
					/>
					<FormControl.Feedback />
					<HelpBlock>{suggestions}</HelpBlock>
					</FormGroup>
				</form>
				<ReactMustache template={this.state.template} data={this.state.zxcvbnObject1} />
			</div>
		);
	}
});
module.exports = userPassword;
