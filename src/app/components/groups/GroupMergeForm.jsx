import React from 'react';
import { Glyphicon, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import GroupManagement from '../GroupManagement.jsx';
//import ModalError from './ModalError.jsx';

class GroupMergeForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let group = {...this.props.group};

		this.setState({ group: group, existingGroups: this.props.groups, error: null, showModal:false, mergingGroup: null});
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
	
	canGroupBeMerged() {
		return this.state.mergingGroup !== null && this.state.mergingGroup.value !== this.state.group.cn;
	}
	
	validateGroupToMerge() {
		return this.canGroupBeMerged() ? 'success' : 'error';
	}
	
	handleGroupToMergeChange(value) {
		this.setState({ mergingGroup: value });
	}
	
	doMergeGroup() {
		let gm = new GroupManagement();
		
		let errHandler = (err) => {
			this.setState({
					...err,
					showModal: true
			});
		};
		
		gm.mergeGroupPromise(this.state.group.cn,this.state.mergingGroup.value)
			.then(() => {
				this.setState({modalTitle:'Group ' + this.state.group.cn + ' merged', error: 'Group ' + this.state.group.cn + ' has been merged with ' + this.state.mergingGroup.value, showModal: true});
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
				<form onSubmit={() => this.doMergeGroup()}>
					<FormGroup
					controlId="formBasicText"
					validationState={this.validateGroupToMerge()}
					>
						<ControlLabel>Please, select the destination group for {this.state.group.cn} members ({this.state.group.description})</ControlLabel>
						<Select
							placeholder="Select the group to merge with"
							options={this.state.existingGroups}
							value={this.state.mergingGroup}
							onChange={(values) => this.handleGroupToMergeChange(values)}
						/>
						<FormControl.Feedback />
						<HelpBlock>The merging group name must be different from the existing one</HelpBlock>
					</FormGroup>
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" disabled={!this.canGroupBeMerged()}>
							Merge Group&nbsp;<Glyphicon glyph="pencil" />
						</Button>
					</div>
				</form>
			</div>
		);
	}
}

GroupMergeForm.propTypes = {
	group: React.PropTypes.object.isRequired,
	groups: React.PropTypes.array.isRequired,
	history: React.PropTypes.object
};


export default GroupMergeForm;
