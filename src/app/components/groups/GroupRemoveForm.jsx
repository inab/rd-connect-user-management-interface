import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import GroupManagement from '../GroupManagement.jsx';
//import ModalError from './ModalError.jsx';

class GroupRemoveForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let group = {...this.props.group};

		this.setState({ group: group, error: null, showModal:false, groupnameToRemove: ''});
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
	
	canGroupBeRemoved() {
		return this.state.group.cn === this.state.groupnameToRemove;
	}
	
	validateGroupToRemove() {
		return this.canGroupBeRemoved() ? 'success' : 'error';
	}
	
	handleGroupToRemoveChange(e) {
		this.setState({ groupnameToRemove: e.target.value });
	}
	
	doRemoveGroup() {
		let gm = new GroupManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		gm.removeGroupPromise(this.state.groupnameToRemove)
			.then(() => {
				this.setState({modalTitle:'Group ' + this.state.groupnameToRemove + ' removed', error: 'Group ' + this.state.user.description + ' does not exist any more', showModal: true});
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
				<form onSubmit={() => this.doRemoveGroup()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateGroupToRemove()}
					>
						<ControlLabel>Please, write the group name of {this.state.group.description}, in order to confirm the operation</ControlLabel>
						<FormControl
							type="text"
							value={this.state.groupnameToRemove}
							placeholder="Group name"
							onChange={(e) => this.handleGroupToRemoveChange(e)}
						/>
						<FormControl.Feedback />
						<HelpBlock>Remember, this operation cannot be UNDONE!</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" bsSize="xs" type="submit" className="submitCancelButtons" disabled={!this.canGroupBeRemoved()}>
							Remove Group<br/><Glyphicon glyph="fire" /> <b>DANGER!</b> <Glyphicon glyph="fire" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

GroupRemoveForm.propTypes = {
	group: React.PropTypes.object.isRequired,
	history: React.PropTypes.object
};


export default GroupRemoveForm;
