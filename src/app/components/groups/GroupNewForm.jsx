import React from 'react';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, Collapse, ListGroup, ListGroupItem  } from 'react-bootstrap';

import GroupManagement from '../GroupManagement.jsx';

import { genCustomUsersWidgetInstance } from '../SelectableUsersWidget.jsx';

function groupValidation(formData,errors) {
	console.log(errors);
	if(formData.owner.length === 0) {
		errors.owner.addError('At least one owner is needed');
	}
	return errors;
}

class GroupNewForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			in: false,
			schema: this.props.schema,
			selectableUsers: this.props.users,
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
		var schema = this.state.schema;
		//console.log('Schema: ', schema);
		delete schema.title;
		//console.log(schema);
		
		const SelectableUsersWidget = genCustomUsersWidgetInstance(this.state.selectableUsers);
		
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

GroupNewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	users: React.PropTypes.array.isRequired,
	history:  React.PropTypes.object.isRequired
};

export default GroupNewForm;
