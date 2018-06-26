import React from 'react';
import Users from './Users.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UsersContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		
		this.setState({
			users: [],
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
		
		this.usersPromise()
			.then((users) => {
				this.onChange({users: users});
			}, errHandler);
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		this.setState({task: this.props.route.task});
	}
	
	render() {
		if(this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if(this.state.users.length > 0) {
			return (
				<div>
					<Users users={this.state.users} history={this.history} />
				</div>
			);
		}
		return <div>Loading...</div>;
	}
}

export default UsersContainer;
