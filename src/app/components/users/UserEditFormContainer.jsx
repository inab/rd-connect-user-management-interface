import React from 'react';
import { Modal , Button } from 'react-bootstrap';
import jQuery from 'jquery';
import UserEditForm from './UserEditForm.jsx';

import config from 'config.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class UserEditFormContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			schema: null,
			data: null,
			error: null,
			showModal: false,
			task: null
		});
	}
	
	componentDidMount() {
		this.loadUsersSchema((usersSchema) => {
			this.onChange({schema: usersSchema});
			this.loadUsers((users) => {
				this.onChange({data: users});
			}, (err) => {
				this.onChange({
					...err,
					showModal: true
				});
			});
		}, (err) => {
			this.onChange({
				...err,
				showModal: true
			});
		});
	}
	
	componentWillUnmount() {
		this.setState({task: this.props.route.task});
	}

	close() {
		this.onChange({showModal: false});
	}
	
	open() {
		this.onChange({showModal: true});
	}
	
	render() {
		//console.log('task: ', this.state.task);
		//console.log('schema: ', this.state.schema);
		//console.log('data: ', this.state.data);
		//console.log('error: ', this.state.error);
		if(this.state.schema && this.state.data) {
			return (
				<div>
					<UserEditForm schema={this.state.schema}  data={this.state.data}  />
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

UserEditFormContainer.propTypes = {
	route: React.PropTypes.object,
	params: React.PropTypes.object
};
	//mixins: [ History ], //This is to browse history back when user is not found after showing modal error
UserEditFormContainer.contextTypes = {
	router: React.PropTypes.object
};

module.exports = UserEditFormContainer;
