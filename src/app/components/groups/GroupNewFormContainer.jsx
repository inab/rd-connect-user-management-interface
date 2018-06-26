import React from 'react';
import { Modal, Button } from 'react-bootstrap';

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
		
		this.loadGroupsSchema((groupsSchema) => {
			this.onChange({schema: groupsSchema});
			this.selectableUsersPromise()
				.catch(errHandler)
				.then((selectableUsers) => {
					this.setState({loaded:true});
				});
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
					<GroupNewForm schema={this.state.schema} users={this.state.selectableUsers} history={this.history} />
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
