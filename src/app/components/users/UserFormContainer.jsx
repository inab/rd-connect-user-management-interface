import React from 'react';
import { Modal , Button } from 'react-bootstrap';
import UserEditForm from './UserEditForm.jsx';
import UserViewForm from './UserViewForm.jsx';
import UserRemoveForm from './UserRemoveForm.jsx';
import UserEnableDisableForm from './UserEnableDisableForm.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UserFormContainer extends AbstractFetchedDataContainer {
	//mixins: [ History ], //This is to browse history back when user is not found after showing modal error
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		
		this.setState({
			schema: null,
			user: null,
			error: null,
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
				
				return this.userPromise(this.props.params.username);
			}, errHandler)
			.then((user) => {
				this.onChange({user: user});
			}, errHandler);
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		this.setState({task: this.props.route.task});
	}
	
	close() {
		this.setState({showModal: false});
	}
	
	open() {
		this.setState({showModal: true});
	}
	
	render() {
		//console.log('task: ', this.state.task);
		//console.log('schema: ', this.state.schema);
		//console.log('user: ', this.state.user);
		//console.log('error: ', this.state.error);
		if(this.state.schema && this.state.user) {
			switch(this.state.task) {
				case 'edit':
					return <UserEditForm schema={this.state.schema} user={this.state.user} history={this.history} />;
					//break;
				case 'view':
					return <UserViewForm schema={this.state.schema} user={this.state.user} history={this.history}  />;
					//break;
				case 'remove':
					return <UserRemoveForm user={this.state.user} history={this.history}  />;
					//break;
				case 'enable_disable':
					return <UserEnableDisableForm schema={this.state.schema} user={this.state.user} history={this.history}  />;
					//break;
				default:
					console.log('TODO: USER Unimplemented task: ' + this.state.task);
					break;
			}
		}
		if(this.state.error) {
			return (
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
			);
		}
		return <div>Loading...</div>;
	}
}

UserFormContainer.propTypes = {
	route: React.PropTypes.object,
	params: React.PropTypes.object
};

UserFormContainer.contextTypes = {
	router: React.PropTypes.object
};

export default UserFormContainer;
