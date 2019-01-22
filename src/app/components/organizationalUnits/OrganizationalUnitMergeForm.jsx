import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import OrganizationalUnitManagement from '../OrganizationalUnitManagement.jsx';
//import ModalError from './ModalError.jsx';

class OrganizationalUnitMergeForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let ou = {...this.props.ou};

		this.setState({ ou: ou, existingOUs: this.props.ous, error: null, showModal:false, mergingOrganizationalUnit: null});
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
	
	canOrganizationalUnitBeMerged() {
		return this.state.mergingOrganizationalUnit !== null && this.state.mergingOrganizationalUnit.value !== this.state.ou.organizationalUnit;
	}
	
	validateOrganizationalUnitToMerge() {
		return this.canOrganizationalUnitBeMerged() ? 'success' : 'error';
	}
	
	handleOrganizationalUnitToMergeChange(value) {
		this.setState({ mergingOrganizationalUnit: value });
	}
	
	doMergeOrganizationalUnit() {
		let oum = new OrganizationalUnitManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		oum.mergeOrganizationalUnitPromise(this.state.ou.organizationalUnit,this.state.mergingOrganizationalUnit.value)
			.then(() => {
				this.setState({modalTitle:'Organizational Unit ' + this.state.ou.organizationalUnit + ' merged', error: 'Organizational Unit ' + this.state.ou.organizationalUnit + ' has been merged with ' + this.state.mergingOrganizationalUnit.value, showModal: true});
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
				<form onSubmit={() => this.doMergeOrganizationalUnit()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateOrganizationalUnitToMerge()}
					>
						<ControlLabel>Please, select the destination organizational unit for {this.state.ou.organizationalUnit} members ({this.state.ou.description})</ControlLabel>
						<Select
							placeholder="Select the organizational unit to merge with"
							options={this.state.existingOUs}
							value={this.state.mergingOrganizationalUnit}
							onChange={(values) => this.handleOrganizationalUnitToMergeChange(values)}
						/>
						<FormControl.Feedback />
						<HelpBlock>The merging organizational unit must be different from the existing one</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" disabled={!this.canOrganizationalUnitBeMerged()}>
							Merge Organizational Unit&nbsp;<Glyphicon glyph="pencil" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

OrganizationalUnitMergeForm.propTypes = {
	ou: React.PropTypes.object.isRequired,
	ous: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};


export default OrganizationalUnitMergeForm;
