import React from 'react';
import { Glyphicon, Modal, Button } from 'react-bootstrap';
import UserManagement from '../UserManagement.jsx';

class UserPasswordReset extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount(){
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			user: this.props.user
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
	
	resetPassword() {
		let um = new UserManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		um.changeUserPasswordPromise(this.state.user.username)
			.then(() => {
				this.setState({modalTitle:'Password for ' + this.state.user.username + ' resetted', error: 'User ' + this.state.user.cn + ' has properly resetted the password', showModal: true});
			},errHandler);
	}
	
	render() {
		const onSubmit = () => this.resetPassword();
		return (
			<div>
				<h3>Password reset for user {this.state.user.username}</h3>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="info" onClick={() => this.close()}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={onSubmit}>
					<p>Are you sure you want to reset password for user {this.state.user.username}?</p>
					<div className="button-submit">
						<Button bsStyle="info" onClick={() => this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Reset password&nbsp;<Glyphicon glyph="pencil" /></Button>
					</div>
				</form>
			</div>
		);
	}
}

UserPasswordReset.propTypes = {
	history: React.PropTypes.object.isRequired,
	user: React.PropTypes.object.isRequired
};

export default UserPasswordReset;
