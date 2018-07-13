import React from 'react';
import UsersGroupsEditForm from './UsersGroupsEditForm.jsx';
import UsersGroupsViewForm from './UsersGroupsViewForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UsersGroupsFormContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			schema: null,
			data: null,
			groups: null,
			error: null,
			showModal: false,
			task: this.props.route.task
		});
	}
	
	componentDidMount() {
		// The value is already populated by this method
		let errHandler = (err) => this.setState({error: err.status + ' (Retrieving groups)'});
		
		this.usersSchemaPromise()
			.then((schema) => {
				this.setState({schema: schema});
				
				return this.userPromise(this.props.params.username);
			},errHandler)
			.then((data) => {
				this.setState({data: data});
				
				return this.groupsPromise();
			}, errHandler)
			.then((groups) => {
				this.setState({groups: groups});
			},errHandler);
	}
	
	render() {
		//console.log('Schema: ', this.state.schema);
		//console.log('Data: ', this.state.data);
		//console.log('Groups: ', this.state.groups);
		//console.log('TASK: ', this.state.task);
		if((this.state.schema) && (this.state.data) && (this.state.groups)) {
			switch(this.state.task) {
				case 'users_groups_view':
					return (
						<div>
							<UsersGroupsViewForm schema={this.state.schema} data={this.state.data} groups={this.state.groups} history={this.history} />
						</div>
					);
				case 'users_groups_edit':
					return (
						<div>
							<UsersGroupsEditForm schema={this.state.schema} data={this.state.data} groups={this.state.groups} history={this.history} />
						</div>
					);
				default:
					this.state.error = 'ASSERTION: unknown state ' + this.state.task;
					break;
			}
		}
		
		if(this.state.error) {
			return (
				<div>
					Error: {this.state.error}
				</div>
			);
		}
		
		return <div>Loading...</div>;
	}
}

UsersGroupsFormContainer.propTypes = {
	route: React.PropTypes.array,
	params: React.PropTypes.array
};


export default UsersGroupsFormContainer;
