import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import UserNewForm from './UserNewForm.jsx';
import UserNewFormUnprivileged from './UserNewFormUnprivileged.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UserNewFormContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	//mixins: [ History ], //This is to browse history back when user is not found after showing modal error
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			schema: null,
			error: null,
			loaded: false,
			showModal: false,
			task: this.props.route.task
		});
	}
	
	componentDidMount() {
		let errHandler = (err) => {
			this.onChange({
				...err,
				showModal: true
			});
		};
		
		this.usersSchemaPromise()
			.then((usersSchema) => {
				this.onChange({schema: usersSchema});
				
				// Force user loading
				return this.usersPromise();
			},errHandler)
			.then((users) => {
				this.onChange({users: users});
				
				this.loadSelectableOrganizationalUnits((selectableOUs) => {
					this.loadSelectableGroups((selectableGroups) => {
						if(this.props.route.task === 'new_as_template') {
							this.loadUser(this.props.params.username,(user) => {
								this.onChange({loaded: true, template: user});
							}, errHandler);
						} else {
							this.setState({loaded: true});
						}
					}, errHandler);
				}, errHandler);
			}, errHandler);
	}
	
	// We have to invalidate the users cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateUsers();
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
				case 'new_privileged':
					return (
						<div>
							<UserNewForm
								schema={this.state.schema}
								organizationalUnits={this.state.selectableOUs}
								groups={this.state.selectableGroups}
								users={this.state.users}
								history={this.history}
							/>
						</div>
					);
				case 'new_privileged_ou':
					return (
						<div>
							<UserNewForm
								schema={this.state.schema}
								template={{organizationalUnit: this.props.params.organizationalUnit}}
								organizationalUnits={this.state.selectableOUs}
								groups={this.state.selectableGroups}
								users={this.state.users}
								history={this.history}
							/>
						</div>
					);
				case 'new_as_template':
					return (
						<div>
							<UserNewForm
								schema={this.state.schema}
								template={this.state.template}
								organizationalUnits={this.state.selectableOUs}
								groups={this.state.selectableGroups}
								users={this.state.users}
								history={this.history}
							/>
						</div>
					);
				case 'new_unprivileged':
					return (
						<div>
							<UserNewFormUnprivileged
								schema={this.state.schema}
								organizationalUnits={this.state.organizationalUnits}
								groups={this.state.selectableGroups}
								users={this.state.users}
								history={this.history}
							/>
						</div>
					);
				default:
					console.log('TODO: NEW USER Unimplemented task: ' + this.state.task);
					break;
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
							<Button onClick={()=>this.history.goBack()}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		
		return <div>Loading...</div>;
	}
}

UserNewFormContainer.propTypes = {
	route: React.PropTypes.object,
	params: React.PropTypes.object
};

UserNewFormContainer.contextTypes = {
	router: React.PropTypes.object
};
		
export default UserNewFormContainer;
