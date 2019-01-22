import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import UserManagement from '../UserManagement.jsx';
//import ModalError from './ModalError.jsx';

class UserRenameForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let user = {...this.props.user};

		this.setState({ user: user, existingUsers: this.props.users, error: null, showModal:false, newUsername: ''});
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
		this.setState({showModal: true});
	}
	
	canUserBeRenamed() {
		if(this.state.newUsername.length > 0) {
			// Checking for duplicates
			let username = this.state.newUsername;
			let arrayOfUsers = this.state.existingUsers;
			return arrayOfUsers.every(function(e){ return e.value !== username; });
		} else {
			return false;
		}
	}
	
	validateUserToRename() {
		return this.canUserBeRenamed() ? 'success' : 'error';
	}
	
	handleUserToRenameChange(e) {
		this.setState({ newUsername: e.target.value });
	}
	
	doRenameUser() {
		let um = new UserManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		um.renameUserPromise(this.state.user.username,this.state.newUsername)
			.then(() => {
				this.setState({modalTitle:'User ' + this.state.user.username + ' renamed', error: 'User ' + this.state.user.username + ' has been renamed to ' + this.state.newUsername, showModal: true});
			},errHandler);
	}
	
	render() {
		return (
			<div>
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
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={() => this.doRenameUser()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateUserToRename()}
					>
						<ControlLabel>Please, write the new user name for {this.state.user.username} ({this.state.user.cn})</ControlLabel>
						<FormControl
							type="text"
							value={this.state.newUsername}
							placeholder="User name"
							onChange={(e) => this.handleUserToRenameChange(e)}
						/>
						<FormControl.Feedback />
						<HelpBlock>The new user name must be different from the existing ones</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" disabled={!this.canUserBeRenamed()}>
							Rename User&nbsp;<Glyphicon glyph="pencil" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

UserRenameForm.propTypes = {
	user: React.PropTypes.object.isRequired,
	users: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};


export default UserRenameForm;
