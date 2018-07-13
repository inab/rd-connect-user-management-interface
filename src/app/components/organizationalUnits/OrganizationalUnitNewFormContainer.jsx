import React from 'react';
import OrganizationalUnitNewForm from './OrganizationalUnitNewForm.jsx';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

class OrganizationalUnitNewFormContainer extends AbstractFetchedDataContainer {
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
			},errHandler);
	}
	
	render() {
		if(this.state.schema) {
			return (
				<div>
					<OrganizationalUnitNewForm   schema={this.state.schema} history={this.history} />
				</div>
			);
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

export default OrganizationalUnitNewFormContainer;
