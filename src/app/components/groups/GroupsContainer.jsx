import React from 'react';
import Groups from './Groups.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class GroupsContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
		});
	}
	
	componentDidMount() {
		// The value is already populated by this method
		this.loadGroups(null,(xhr) => this.setState({error: xhr.status + ' (Retrieving groups)'}));
	}
	
	render() {
		if(this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if(this.state.groups) {
			return (
				<div>
					<Groups groups={this.state.groups} />
				</div>
			);
		}
		return <div>Loading....</div>;
	}
}

export default GroupsContainer;
