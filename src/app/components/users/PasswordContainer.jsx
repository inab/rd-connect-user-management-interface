import React from 'react';
import { Modal , Button } from 'react-bootstrap';
import UserFormContainer from './UserFormContainer.jsx';

import UserPassword from './UserPassword.jsx';
import UserPasswordReset from './UserPasswordReset.jsx';

class PasswordContainer extends UserFormContainer {
	render() {
		//console.log('task: ', this.state.task);
		//console.log('schema: ', this.state.schema);
		//console.log('data: ', this.state.data);
		//console.log('error: ', this.state.error);
		if(this.state.schema && this.state.user) {
			switch(this.state.task) {
				case 'passwordChange':
					return <UserPassword schema={this.state.schema}  user={this.state.user} history={this.history} />;
					//break;
				case 'passwordReset':
					console.log(this.state.data);
					return <UserPasswordReset user={this.state.user} history={this.history} />;
					//break;
				default:
					console.log('TODO: Unimplemented task: ' + this.state.task);
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

export default PasswordContainer;
