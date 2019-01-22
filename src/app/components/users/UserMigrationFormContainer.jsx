import React from 'react';
import { Modal, Button, Glyphicon } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import UserMigrationForm from './UserMigrationForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UserMigrationFormContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
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
		
		this.userPromise(this.props.params.username)
			.then((user) => {
				this.setState({user: user});
				
				return this.selectableOrganizationalUnitsPromise();
			}, errHandler)
			.then((selectableOUs) => {
				this.setState({selectableOUs: selectableOUs, loaded: true});
			}, errHandler);
	}
	
	// We have to invalidate the users cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateUser(this.props.params.username);
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
				<UserMigrationForm user={this.state.user} ous={this.state.selectableOUs} history={this.history} />
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

export default UserMigrationFormContainer;
