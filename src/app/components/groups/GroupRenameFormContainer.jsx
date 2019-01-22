import React from 'react';
import { Modal, Button, Glyphicon } from 'react-bootstrap';

import GroupRenameForm from './GroupRenameForm.jsx';
import GroupMergeForm from './GroupMergeForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class GroupRenameFormContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			task: this.props.route.task,
			error: null,
			loaded: false,
			showModal: false
		});
	}
	
	componentDidMount() {
		let errHandler = (err) => {
			this.onChange({
				...err,
				showModal: true
			});
		};
		
		this.groupPromise(this.props.params.groupName)
			.then((group) => {
				this.setState({group: group});
				
				return this.selectableGroupsPromise();
			}, errHandler)
			.then((selectableGroups) => {
				this.setState({selectableGroups: selectableGroups, loaded: true});
			}, errHandler);
	}
	
	// We have to invalidate the groups cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateGroup(this.props.params.groupName);
	}
	
	close() {
		this.setState({showModal: false});
	}
	
	open() {
		this.setState({showModal: true});
	}
	
	render() {
		if(this.state.loaded) {
			switch(this.state.task) {
				case 'rename':
					return (
						<GroupRenameForm group={this.state.group} groups={this.state.selectableGroups} history={this.history} />
					);
				case 'merge':
					return (
						<GroupMergeForm group={this.state.group} groups={this.state.selectableGroups} history={this.history} />
					);
			}
		}
		if(this.state.error) {
			return (
				<div>
					<Modal show={this.state.showModal} onHide={()=>this.history.goBack()} error={this.state.error}>
						<Modal.Header closeButton>
							<Modal.Title>Error!</Modal.Title>
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
							<Button onClick={()=>this.history.goBack()}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
}

export default GroupRenameFormContainer;
