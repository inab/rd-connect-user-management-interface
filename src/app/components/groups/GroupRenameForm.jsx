import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import GroupManagement from '../GroupManagement.jsx';
//import ModalError from './ModalError.jsx';

class GroupRenameForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let group = {...this.props.group};

		this.setState({ group: group, existingGroups: this.props.groups, error: null, showModal:false, newGroupname: ''});
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
	
	canGroupBeRenamed() {
		if(this.state.newGroupname.length > 0) {
			// Checking for duplicates
			let groupname = this.state.newGroupname;
			let arrayOfGroups = this.state.existingGroups;
			return arrayOfGroups.every(function(e){ return e.value !== groupname; });
		} else {
			return false;
		}
	}
	
	validateGroupToRename() {
		return this.canGroupBeRenamed() ? 'success' : 'error';
	}
	
	handleGroupToRenameChange(e) {
		this.setState({ newGroupname: e.target.value });
	}
	
	doRenameGroup() {
		let gm = new GroupManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		gm.renameGroupPromise(this.state.group.cn,this.state.newGroupname)
			.then(() => {
				this.setState({modalTitle:'Group ' + this.state.group.cn + ' renamed', error: 'Group ' + this.state.group.cn + ' has been renamed to ' + this.state.newGroupname, showModal: true});
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
				<form onSubmit={() => this.doRenameGroup()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateGroupToRename()}
					>
						<ControlLabel>Please, write the new group name for {this.state.group.cn} ({this.state.group.description})</ControlLabel>
						<FormControl
							type="text"
							value={this.state.newGroupname}
							placeholder="Group name"
							onChange={(e) => this.handleGroupToRenameChange(e)}
						/>
						<FormControl.Feedback />
						<HelpBlock>The new group name must be different from the existing ones</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" disabled={!this.canGroupBeRenamed()}>
							Rename Group&nbsp;<Glyphicon glyph="pencil" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

GroupRenameForm.propTypes = {
	group: React.PropTypes.object.isRequired,
	groups: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};


export default GroupRenameForm;
