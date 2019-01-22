import React from 'react';
import { Modal, Button, Glyphicon } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import GroupNewFormContainer from './GroupNewFormContainer.jsx';
import GroupEditForm from './GroupEditForm.jsx';
import GroupViewForm from './GroupViewForm.jsx';
import GroupRemoveForm from './GroupRemoveForm.jsx';

class GroupFormContainer extends GroupNewFormContainer {
	constructor(props,context) {
		super(props,context);
	}
	
	componentWillMount() {
		super.componentWillMount();
		
		this.setState({
			group: null,
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
		
		// The parent loads the other needed features
		this.groupPromise(this.props.params.groupName)
			.then((group) => {
				this.onChange({group: group});
				super.componentDidMount();
			}, errHandler);
	}
	
	// We have to invalidate the groups cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		if(this.state.task === 'edit') {
			this.invalidateGroup(this.props.params.groupName);
		}
	}
	
	//This is to browse history back when group is not found after showing modal error
	render() {
		//console.log('this.state.schema is: ',this.state.schema);
		//console.log('this.state.data is: ',this.state.data);
		//console.log('this.state.users is: ',this.state.users);
		if(this.state.loaded) {
			switch(this.state.task) {
				case 'edit':
					return (
							<GroupEditForm schema={this.state.schema} group={this.state.group} users={this.state.selectableUsers} history={this.history} />
					);
				case 'view':
					return (
							<GroupViewForm schema={this.state.schema} group={this.state.group} history={this.history} />
					);
				case 'remove':
					return (
							<GroupRemoveForm group={this.state.group} history={this.history} />
					);
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
							{ this.state.trace !== undefined ?
								<CopyToClipboard
									text={this.state.trace}
									onCopy={() => this.setState({copied: true})}
								>
									<Button>Copy trace&nbsp;<Glyphicon glyph="copy" /></Button>
								</CopyToClipboard>
								:
								null
							}
							<Button onClick={()=>this.history.goBack()}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		
		return <div>Loading...</div>;
	}
}

GroupFormContainer.propTypes = {
	route: React.PropTypes.array,
	params: React.PropTypes.object
};

export default GroupFormContainer;
