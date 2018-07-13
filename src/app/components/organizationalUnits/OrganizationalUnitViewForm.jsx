import React from 'react';
import Form from 'react-jsonschema-form';
import { Modal, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import imageNotFoundSrc from '../users/defaultNoImageFound.jsx';
//import ModalError from './ModalError.jsx';

function organizationalUnitValidation(formData,errors) {
	//if(formData.userPassword !== formData.userPassword2) {
	//    errors.userPassword2.addError('Passwords don't match');
	//}
		return errors;
}

class OrganizationalUnitViewForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		this.setState({
			modalTitle: null,
			error: null,
			showModal:false,
			schema: {
				...this.props.schema
			},
			files: [],
			picture:  this.props.data.picture ? this.props.data.picture : imageNotFoundSrc,
		});
	}
	
	close() {
		this.setState({showModal: false});
	}
	
	open() {
		this.setState({showModal: true});
	}
	
	render() {
		var schema = this.props.schema;
		var data = this.props.data;
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		const uiSchema = {
			'organizationalUnit': {
				'ui:readonly': true
			},
			'description': {
				'ui:readonly': true
			},
			'picture': {
				'ui:readonly': true
			},
			'links': {
				'ui:readonly': true
			},
		};
		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>Error!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Row className="show-grid">
					<Col xs={12} md={8}>
							<Form schema={schema}
							uiSchema={uiSchema}
							formData={data}
							onSubmit={()=>this.history.goBack()}
							onError={onError}
							validate={organizationalUnitValidation}
							liveValidate
							>
							<div>
									<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
								</div>
							</Form>
					</Col>
					<Col xs={6} md={4} />
				</Row>
			</div>
		);
	}
}

OrganizationalUnitViewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	data: React.PropTypes.object.isRequired,
	history: React.PropTypes.object.isRequired
};

export default OrganizationalUnitViewForm;
