import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import GroupManagement from '../GroupManagement.jsx';

import { genCustomUsersWidgetInstance } from '../SelectableUsersWidget.jsx';

class GroupNewForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		// Pre-processing the props
		let schema = {
			...this.props.schema
		};
		delete schema.title;
		
		// Also removing new creationTimestamp and modificationTimestamp attributes
		// as they do not make sense when a group is being created
		delete schema.properties.creationTimestamp;
		delete schema.properties.modificationTimestamp;
		
		const SelectableUsersWidget = genCustomUsersWidgetInstance(this.props.users);
		
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
			owner: {
				'ui:widget': SelectableUsersWidget
			},
			members: {
				'ui:widget': SelectableUsersWidget
			}
		};
		
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			in: false,
			schema: schema,
			uiSchema: uiSchema,
			selectableUsers: this.props.users,
			existingGroups: this.props.groups,
			group: {
				cn: '',
				description: '',
				groupPurpose: '',
				owner: [],
				members: []
			}
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

	groupValidation(formData,errors) {
		//Now we test if user exists...
		var groupname = formData.cn;
		var arrayOfGroups = this.state.existingGroups;
		var groupsRepeated = jQuery.grep(arrayOfGroups, function(e){ return e.cn === groupname; });
		if(groupsRepeated.length !== 0 ){
			errors.cn.addError('The group name is already in use. Please choose a different one');
		}
		
		if(formData.owner.length === 0) {
			errors.owner.addError('At least one owner is needed');
		}
		
		// Check whether there is a selected group purpose
		if(formData.groupPurpose === undefined || formData.groupPurpose === null || formData.groupPurpose.length === 0) {
			errors.groupPurpose.addError('Please set the group purpose');
		}
		
		return errors;
	}
    
	addGroupData(){
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
		
		// And now, submit!!!!!
		let gm = new GroupManagement();
		
		let errHandler = (err) => {
			this.setState({
				...err,
				showModal: true
			});
		};

		let groupCreationHandler = (groupD) => {
			gm.createGroupPromise(groupD)
				.then((data) => {
					this.setState({ modalTitle: 'Success', error: 'Group created correctly!!', showModal: true});
				},errHandler);
		};
		
		groupCreationHandler(groupData);
	}
	
	render() {
		const onSubmit = () => this.addGroupData();
		//const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
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
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<h3> Create New Group</h3>
				<Collapse in={this.state.in} onEntering={this.wait} bsStyle="success" ref="fade">
					<ListGroup>
						<ListGroupItem bsStyle="success">Group created successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={8}>
							<Form schema={this.state.schema}
								uiSchema={this.state.uiSchema}
								formData={this.state.group}
								onChange={({formData}) => this.setState({group: formData})}
								onSubmit={onSubmit}
								//onError={onError}
								validate={(formData,errors) => this.groupValidation(formData,errors)}
								liveValidate
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

GroupNewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	users: React.PropTypes.array.isRequired,
	groups: React.PropTypes.array.isRequired,
	history:  React.PropTypes.object.isRequired
};

export default GroupNewForm;
