import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import UserRenameForm from './UserRenameForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UserRenameFormContainer extends AbstractFetchedDataContainer {
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
				
				return this.selectableUsersPromise();
			}, errHandler)
			.then((selectableUsers) => {
				this.setState({selectableUsers: selectableUsers, loaded: true});
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
				<UserRenameForm user={this.state.user} users={this.state.selectableUsers} history={this.history} />
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
							<Button onClick={()=>this.history.goBack()}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
}

export default UserRenameFormContainer;
