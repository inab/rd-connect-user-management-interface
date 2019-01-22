import React from 'react';
import { Glyphicon, Modal, Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import zxcvbn from 'zxcvbn';
import ReactMustache from 'react-mustache';

import UserManagement from '../UserManagement.jsx';

class UserPassword extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		let template = '<table class=""> \
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
		this.setState({
			user: this.props.user,
			modalTitle: null,
			error: null,
			showModal: false,
			valuePassword1: '',
			valuePassword2: '',
			mustachePassword1:'',
			mustachePassword2:'',
			template: template,
			suggestionsMessage: 'Password strength estimator based on zxcvbn'
		});
	}
	
	close() {
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			this.history.goBack();
		}
	}
	
	open() {
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	getValidationPassword1() {
		let zxcv = zxcvbn(this.state.valuePassword1);
		//console.log(zxcv);
		//console.log(zxcv.sequence);
		//var mustachePassword1 = Mustache.render(template, zxcv);
		//this.state.mustachePassword1 = mustachePassword1;
		//console.log(mustachePassword1);
		const score = zxcv.score;
		if(score > 3) {
			return 'success';
		} else if(score > 2) {
			return 'warning';
		} else if(score > 1) {
			return 'warning';
		} else if(score > 0) {
			return 'error';
		} else if(score === 0) {
			return 'error';
		}

	}
	
	getValidationPassword2() {
		if(this.state.valuePassword1 === this.state.valuePassword2) {
			return this.getValidationPassword1();
		} else {
			return 'error';
		}
	}
	
	handleChange1(e) {
		this.setState({ valuePassword1: e.target.value });
	}
	
	handleChange2(e) {
		this.setState({ valuePassword2: e.target.value });
	}
	
	changePassword(){
		let um = new UserManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		um.changeUserPasswordPromise(this.state.user.username,this.state.valuePassword1)
			.then(() => {
				this.setState({modalTitle:'Password for ' + this.state.user.username + ' changed', error: 'User ' + this.state.user.cn + ' has properly changed the password', showModal: true});
			},errHandler);
	}
	
	render() {
		var suggestions = this.state.suggestionsMessage;
		const onSubmit = () => this.changePassword();
		return (
			<div>
				<h3>Password change for user {this.state.user.username}</h3>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						{ this.state.trace !== undefined ?
							<CopyToClipboard
								text={this.state.trace}
								onCopy={() => this.setState({copied: true})}
							>
								<Button>{this.state.copied ? 'Copied!' : 'Copy trace'}&nbsp;<Glyphicon glyph="copy" /></Button>
							</CopyToClipboard>
							:
							null
						}
						<Button bsStyle="info" onClick={() => this.close()}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
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
									onChange={(e) => this.handleChange1(e)}
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
										onChange={(e) => this.handleChange2(e)}
									/>
									<FormControl.Feedback />
								</FormGroup>
							</Col>
						</Row>
					</Grid>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Change password&nbsp;<Glyphicon glyph="pencil" /></Button>
					</div>
				</form>
				<ReactMustache template={this.state.template} data={zxcvbn(this.state.valuePassword1)} />
			</div>
		);
	}
}

UserPassword.propTypes = {
	history: React.PropTypes.object.isRequired,
	user: React.PropTypes.object.isRequired
};

export default UserPassword;
