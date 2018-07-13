import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import OrganizationalUnitEditForm from './OrganizationalUnitEditForm.jsx';
import OrganizationalUnitViewForm from './OrganizationalUnitViewForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class OrganizationalUnitFormContainer extends AbstractFetchedDataContainer {
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
		
		this.organizationalUnitsSchemaPromise()
			.then((ouSchema) => {
				this.onChange({schema: ouSchema});
				
				return this.organizationalUnitPromise(this.props.params.organizationalUnit);
			},errHandler)
			.then((data) => {
				this.setState({data: data});
			},errHandler);
	}
	
	close() {
		this.setState({showModal: false});
	}
	
	open() {
		this.setState({showModal: true});
	}
	
	render() {
		if(this.state.schema && this.state.data) {
			switch(this.state.task) {
				case 'edit':
					return (
						<div>
							<OrganizationalUnitEditForm schema={this.state.schema}  data={this.state.data} history={this.history} />
						</div>
					);
				case 'view':
					return (
						<div>
							<OrganizationalUnitViewForm schema={this.state.schema}  data={this.state.data} history={this.history}  />
						</div>
					);
				default:
					this.state.error = 'ASSERTION: Undefined view';
					break;
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
							<Button onClick={()=>this.history.goBack()}>Close</Button>
						</Modal.Footer>
					</Modal>
				</div>
			);
		}
		return <div>Loading...</div>;
	}
}

OrganizationalUnitFormContainer.propTypes = {
	route: React.PropTypes.object,
	params: React.PropTypes.object
};

export default OrganizationalUnitFormContainer;
