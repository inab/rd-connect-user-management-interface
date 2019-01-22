import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import OrganizationalUnitManagement from '../OrganizationalUnitManagement.jsx';
//import ModalError from './ModalError.jsx';

class OrganizationalUnitRenameForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let ou = {...this.props.ou};

		this.setState({ ou: ou, existingOUs: this.props.ous, error: null, showModal:false, newOrganizationalUnit: ''});
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
	
	canOrganizationalUnitBeRenamed() {
		if(this.state.newOrganizationalUnit.length > 0) {
			// Checking for duplicates
			let organizationalUnit = this.state.newOrganizationalUnit;
			let arrayOfOUs = this.state.existingOUs;
			return arrayOfOUs.every(function(e){ return e.value !== organizationalUnit; });
		} else {
			return false;
		}
	}
	
	validateOrganizationalUnitToRename() {
		return this.canOrganizationalUnitBeRenamed() ? 'success' : 'error';
	}
	
	handleOrganizationalUnitToRenameChange(e) {
		this.setState({ newOrganizationalUnit: e.target.value });
	}
	
	doRenameOrganizationalUnit() {
		let oum = new OrganizationalUnitManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		oum.renameOrganizationalUnitPromise(this.state.ou.organizationalUnit,this.state.newOrganizationalUnit)
			.then(() => {
				this.setState({modalTitle:'Organizational Unit ' + this.state.ou.organizationalUnit + ' renamed', error: 'Organizational Unit ' + this.state.ou.organizationalUnit + ' has been renamed to ' + this.state.newOrganizationalUnit, showModal: true});
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
								<Button>Copy trace&nbsp;<Glyphicon glyph="copy" /></Button>
							</CopyToClipboard>
							:
							null
						}
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<form onSubmit={() => this.doRenameOrganizationalUnit()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateOrganizationalUnitToRename()}
					>
						<ControlLabel>Please, write the new organizational unit name for {this.state.ou.organizationalUnit} ({this.state.ou.description})</ControlLabel>
						<FormControl
							type="text"
							value={this.state.newOrganizationalUnit}
							placeholder="Organizational Unit name"
							onChange={(e) => this.handleOrganizationalUnitToRenameChange(e)}
						/>
						<FormControl.Feedback />
						<HelpBlock>The new organizational unit name must be different from the existing ones</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" disabled={!this.canOrganizationalUnitBeRenamed()}>
							Rename Organizational Unit&nbsp;<Glyphicon glyph="pencil" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

OrganizationalUnitRenameForm.propTypes = {
	ou: React.PropTypes.object.isRequired,
	ous: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};


export default OrganizationalUnitRenameForm;
