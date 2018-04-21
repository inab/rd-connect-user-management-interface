import React from 'react';
import { Modal , Button } from 'react-bootstrap';
import UserFormContainer from './UserFormContainer.jsx';
import { hashHistory } from 'react-router';

import UserPassword from './UserPassword.jsx';
import UserPasswordReset from './UserPasswordReset.jsx';

class PasswordContainer extends UserFormContainer {
	render() {
		//console.log('task: ', this.state.task);
		//console.log('schema: ', this.state.schema);
		//console.log('data: ', this.state.data);
		//console.log('error: ', this.state.error);
		if(this.state.schema && this.state.u) {
			switch(this.state.task) {
				case 'passwordChange':
					return <UserPassword schema={this.state.schema}  data={this.state.data} />;
					//break;
				case 'passwordReset':
					console.log(this.state.data);
					return <UserPasswordReset user={this.state.data} />;
					//break;
				default:
					console.log('TODO: Unimplemented task: ' + this.state.task);
					break;
			}
		}
		if(this.state.error) {
			return (
				<Modal show={this.state.showModal} onHide={()=>hashHistory.goBack()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>Error!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={()=>hashHistory.goBack()}>Close</Button>
					</Modal.Footer>
				</Modal>
			);
		}
		return <div>Loading...</div>;
	}
}

module.exports = PasswordContainer;
