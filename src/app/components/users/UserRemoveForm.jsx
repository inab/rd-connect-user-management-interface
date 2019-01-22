import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import UserManagement from '../UserManagement.jsx';
//import ModalError from './ModalError.jsx';

const NoImageAvailable = 'images/No_image_available.svg';

class UserRemoveForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let user = {...this.props.user};
		delete user.userPassword;

		this.setState({ user: user, error: null, showModal:false, usernameToRemove: ''});
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
	
	canUserBeRemoved() {
		return this.state.user.username === this.state.usernameToRemove;
	}
	
	validateUserToRemove() {
		return this.canUserBeRemoved() ? 'success' : 'error';
	}
	
	handleUserToRemoveChange(e) {
		this.setState({ usernameToRemove: e.target.value });
	}
	
	doRemoveUser() {
		let um = new UserManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		um.removeUserPromise(this.state.usernameToRemove)
			.then(() => {
				this.setState({modalTitle:'User ' + this.state.usernameToRemove + ' removed', error: 'User ' + this.state.user.cn + ' does not exist any more', showModal: true});
			},errHandler);
	}
	
	render() {
		var data = this.state.user;
		//console.log(data);
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		var userImage = data.picture;
		if(typeof userImage === 'undefined'){
			userImage = NoImageAvailable;
		}
		
		//console.log(userImage);
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
				<form onSubmit={() => this.doRemoveUser()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateUserToRemove()}
					>
						<ControlLabel>Please, write the username of {this.state.user.cn}, in order to confirm the operation</ControlLabel>
						<FormControl
							type="text"
							value={this.state.usernameToRemove}
							placeholder="Username"
							onChange={(e) => this.handleUserToRemoveChange(e)}
						/>
						<FormControl.Feedback />
						<HelpBlock>Remember, this operation cannot be UNDONE!</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" bsSize="xs" type="submit" className="submitCancelButtons" disabled={!this.canUserBeRemoved()}>
							Remove user<br/><Glyphicon glyph="fire" /> <b>DANGER!</b> <Glyphicon glyph="fire" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

UserRemoveForm.propTypes = {
	user: React.PropTypes.object.isRequired,
	history: React.PropTypes.object
};


export default UserRemoveForm;
