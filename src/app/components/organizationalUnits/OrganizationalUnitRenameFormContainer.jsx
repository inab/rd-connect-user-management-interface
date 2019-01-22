import React from 'react';
import { Modal, Button, Glyphicon } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import OrganizationalUnitRenameForm from './OrganizationalUnitRenameForm.jsx';
import OrganizationalUnitMergeForm from './OrganizationalUnitMergeForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class OrganizationalUnitRenameFormContainer extends AbstractFetchedDataContainer {
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
		
		this.organizationalUnitPromise(this.props.params.organizationalUnit)
			.then((ou) => {
				this.setState({ou: ou});
				
				return this.selectableOrganizationalUnitsPromise();
			}, errHandler)
			.then((selectableOUs) => {
				this.setState({selectableOUs: selectableOUs, loaded: true});
			}, errHandler);
	}
	
	// We have to invalidate the organizational units cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateOrganizationalUnit(this.props.params.organizationalUnit);
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
						<OrganizationalUnitRenameForm ou={this.state.ou} ous={this.state.selectableOUs} history={this.history} />
					);
				case 'merge':
					return (
						<OrganizationalUnitMergeForm ou={this.state.ou} ous={this.state.selectableOUs} history={this.history} />
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

export default OrganizationalUnitRenameFormContainer;
