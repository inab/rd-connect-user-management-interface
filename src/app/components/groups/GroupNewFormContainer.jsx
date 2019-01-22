import React from 'react';
import { Modal, Button, Glyphicon } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import GroupNewForm from './GroupNewForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class GroupNewFormContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			schema: null,
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
		
		this.groupsSchemaPromise()
			.then((groupsSchema) => {
				this.onChange({schema: groupsSchema});
				
				return this.selectableUsersPromise();
			}, errHandler)
			.then((selectableUsers) => {
				this.setState({selectableUsers: selectableUsers});
				
				return this.selectableGroupsPromise();
			}, errHandler)
			.then((selectableGroups) => {
				this.setState({selectableGroups: selectableGroups, loaded: true});
			}, errHandler);
	}
	
	// We have to invalidate the groups cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateGroups();
	}
	
	close() {
		this.setState({showModal: false});
	}
	
	open() {
		this.setState({showModal: true});
	}
	
	render() {
		if(this.state.loaded) {
			return (
				<div>
					<GroupNewForm schema={this.state.schema} users={this.state.selectableUsers} groups={this.state.selectableGroups} history={this.history} />
				</div>
			);
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
									<Button>{this.state.copied ? 'Copied!' : 'Copy trace'}&nbsp;<Glyphicon glyph="copy" /></Button>
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

export default GroupNewFormContainer;
