import React from 'react';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ListGroup, ListGroupItem  } from 'react-bootstrap';
import Select from 'react-select';
import Underscore from 'underscore';

import GroupManagement from '../GroupManagement.jsx';

function groupValidation(formData,errors) {
	//console.log('FormData inside groupValidation is: ', formData);
	//Check if there is at least one owner for the group
	if(formData.owner.length === 0) {
		errors.owner.addError('Please select at least one owner');
	}
	return errors;
}

class GroupEditForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		let group = this.props.group;
		// Protecting from corner cases
		if(group.owner === undefined) {
			group.owner = [];
		}
		if(group.members === undefined) {
			group.members = [];
		}
		let startOwners = group.owner;
		let startMembers = group.members;
		
		// Initializing the components
		//group.members = startMembers.map(username => { return (username in hashUsers) ? hashUsers[username] : {value:username,label:username};});
		//group.owner = startOwners.map(username => { return (username in hashUsers) ? hashUsers[username] : {value:username,label:username};});
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			in: false,
			schema: this.props.schema,
			selectableUsers: this.props.users,
			group: group,
			startMembers: startMembers,
			startOwners: startOwners
		});
	}
	
	close() {
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			this.history.goBack();
		}
	}
	
	open() {
		this.setState({showModal: true });
	}
	
	toggle() {
		this.setState({ in: !this.state.in });
    }
    
    wait() {
		setTimeout(() => {
			this.toggle();
		}, 3000);
    }
    
	updateGroupData(){
		if(this.state.group.owner.length > 0) {
			let groupData = Object.assign({},this.state.group);
			
			
			// First, prepare the owners and members data
			let owners = groupData.owner.map(own => {
				return own.value !== undefined ? own.value : own;
			});
			let members = groupData.members.map(member => {
				return member.value !== undefined ? member.value : member;
			});
			groupData.owner = owners;
			groupData.members = members;
			
			let groupname = groupData.cn;
			
			//console.log('yay I\'m valid!');
			// Now, we delete all the missing members and later we add the new members
			let membersToRemove = Underscore.difference(this.state.startMembers,members);
			let membersToAdd = Underscore.difference(members, this.state.startMembers);
			
			// Then, we delete all the missing owners and later we add the new members
			let ownersToRemove = Underscore.difference(this.state.startOwners,owners);
			let ownersToAdd = Underscore.difference(owners, this.state.startOwners);
			
			
			// And now, submit!!!!!
			let gm = new GroupManagement();
			
			let errHandler = (err) => {
				this.setState({
					...err,
					showModal: true
				});
			};
			
			// First, group modification
			// Then, add members
			// Third, remove members
			// Fourth, add owners
			// Fifth, remove owners
			gm.modifyGroupPromise(groupname, groupData)
				.then(() => {
					if(membersToAdd.length > 0) {
						return gm.addMembersToGroupPromise(groupname,membersToAdd);
					}
				},errHandler)
				.then(() => {
					if(ownersToAdd.length > 0) {
						return gm.addOwnersToGroupPromise(groupname,ownersToAdd);
					}
				},errHandler)
				.then(() => {
					if(membersToRemove.length > 0) {
						return gm.removeMembersFromGroupPromise(groupname,membersToRemove);
					}
				},errHandler)
				.then(() => {
					if(ownersToRemove.length > 0) {
						return gm.removeOwnersFromGroupPromise(groupname,ownersToRemove);
					}
				},errHandler)
				.then(() => {
					this.setState({ modalTitle: 'Success', error: 'Group modified correctly!!', showModal: true});
				},errHandler);
		}
	}
	
	render() {
		var schema = this.state.schema;
		//console.log('Schema: ', schema);
		delete schema.title;
		//console.log(schema);


		
		const CustomUsersWidget = (props) => {
			return (
				<Select
					disabled={props.disabled}
					placeholder="Select the user(s)"
					options={this.state.selectableUsers}
					value={props.value}
					onChange={(values) => props.onChange(values)}
					multi
				/>
			);
		};
		
		// Tweak to for the rendering
		schema.properties.owner.type = 'string';
		delete schema.properties.owner.items;
		delete schema.properties.owner.minItems;
		delete schema.properties.owner.uniqueItems;
		schema.properties.members.type = 'string';
		delete schema.properties.members.items;
		delete schema.properties.members.minItems;
		delete schema.properties.members.uniqueItems;
		
		const uiSchema = {
			cn: {
				'ui:readonly': true
			},
			owner: {
				'ui:widget': CustomUsersWidget
			},
			members: {
				'ui:widget': CustomUsersWidget
			}
		};
		
		const onSubmit = () => this.updateGroupData();
		//const onError = (errors) => {
		//	console.log(errors);
		//	//this.setState({error: errors[0].property + ' ' + errors[0].message, showModal: true});
		//};
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
						</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<h3>Modify Group {this.state.group.cn}</h3>
				<Collapse in={this.state.in} onEntering={() => this.wait()} bsStyle="success" ref="fade">
					<ListGroup>
						<ListGroupItem bsStyle="success">Group modified successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={8}>
							<Form schema={schema}
								uiSchema={uiSchema}
								formData={this.state.group}
								onChange={({formData}) => this.setState({group: formData})}
								//onChange={log('changed')}
								onSubmit={onSubmit}
								//onError={onError}
								validate={groupValidation}
								liveValidate={false}
								showErrorList={false}
							>
								<div className="button-submit">
									<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons"><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
									<Button bsStyle="primary" type="submit" className="submitCancelButtons">Submit</Button>
								</div>
							</Form>
					</Col>
					<Col xs={6} md={4}/>
				</Row>
			</div>
		);
	}
}

GroupEditForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	users: React.PropTypes.array.isRequired,
	group: React.PropTypes.object.isRequired,
	history:  React.PropTypes.object.isRequired
};

export default GroupEditForm;
