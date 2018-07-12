import React from 'react';
import OrganizationalUnitsUsers from './OrganizationalUnitsUsers.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class OrganizationalUnitsUsersContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		
		this.setState({
			users: []
		});
	}
	
	componentDidMount() {
		let errHandler = (err) => {
			this.onChange({
				...err,
				showModal: true
			});
		};
		
		this.usersPromise()
			.then((users) => {
				//console.log('success!');
				this.setState({users: users});
				//console.log(this.state.users);
			}, errHandler);
	}
	
	render() {
		if(this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if(this.state.users) {
			return (
				<div>
					<OrganizationalUnitsUsers data={this.state.users} task="viewEdit"/>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
}

export default OrganizationalUnitsUsersContainer;
