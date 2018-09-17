import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import UserManagement from '../UserManagement.jsx';
//import ModalError from './ModalError.jsx';

class UserMigrationForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let user = {...this.props.user};

		this.setState({ user: user, existingOUs: this.props.ous, error: null, showModal:false, destOrganizationalUnit: null});
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
	
	canUserBeMigrated() {
		return this.state.destOrganizationalUnit !== null && this.state.destOrganizationalUnit.value !== this.state.user.organizationalUnit;
	}
	
	validateUserToMigrate() {
		return this.canUserBeMigrated() ? 'success' : 'error';
	}
	
	handleUserToMigrateChange(value) {
		this.setState({ destOrganizationalUnit: value });
	}
	
	doMigrateUser() {
		let um = new UserManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		um.migrateUserPromise(this.state.user.username,this.state.destOrganizationalUnit.value)
			.then(() => {
				this.setState({modalTitle:'User ' + this.state.user.username + ' migrated', error: 'User ' + this.state.user.username + ' has been migrated to ' + this.state.destOrganizationalUnit.value, showModal: true});
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
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={() => this.doMigrateUser()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateUserToMigrate()}
					>
						<ControlLabel>Please, select the target organizational unit for user {this.state.user.username} ({this.state.user.cn})</ControlLabel>
						<Select
							placeholder="Select the target organizational unit"
							options={this.state.existingOUs}
							value={this.state.destOrganizationalUnit}
							onChange={(values) => this.handleUserToMigrateChange(values)}
						/>
						<FormControl.Feedback />
						<HelpBlock>The target organizational unit name must be different from the original one</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" disabled={!this.canUserBeMigrated()}>
							Migrate User&nbsp;<Glyphicon glyph="plane" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

UserMigrationForm.propTypes = {
	user: React.PropTypes.object.isRequired,
	ous: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};


export default UserMigrationForm;
