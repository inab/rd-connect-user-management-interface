import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Row, Col, Button, ButtonGroup, Collapse, ListGroup, ListGroupItem, ControlLabel  } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { Link } from 'react-router';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import OrganizationalUnitManagement from '../OrganizationalUnitManagement.jsx';

const NoImageAvailable = 'images/No_image_available.svg';

function organizationalUnitValidation(formData,errors) {
	return errors;
}

function validateImageInput(image) {
	let responseText = null;
	if((image.type !== 'image/jpeg') && (image.type !== 'image/png')) {
		responseText = 'Image should be in JPEG or PNG format';
	}
	return responseText;
}

class OrganizationalUnitNewForm extends React.Component {
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
			picture: null,
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
		this.setState({showModal: true, modalTitle: this.state.modalTitle});
	}
	
	toggle() {
      this.setState({ in: !this.state.in });
    }
    
    wait() {
		setTimeout(() => {
			this.toggle();
		}, 3000);
    }
    
	ouImageDropHandler(files) {
		if(Array.isArray(files) && files.length > 0) {
			//console.log('Received files: ', files);
			files.forEach((file)=> {
				let error = validateImageInput(file);
				if(!error){
					this.setState({files: files});
					this.setState({picture: file.preview});
				} else {
					this.setState({modalTitle: 'Error', error: error, showModal: true});
				}
			});
		} else {
			this.setState({files: [], picture: null});
		}
	}
    
	onOpenClick() {
		this.refs.ouImageDropzone.open();
	}
	
	onRemoveClick() {
		this.ouImageDropHandler();
	}
    
	addOrganizationalUnitData(formData) {
		let organizationalUnitData = Object.assign({},formData);
		let myBlob = jQuery('.dropzoneEditNew input').get(0).files[0];
		let reader = new window.FileReader();
		
		let oum = new OrganizationalUnitManagement();
		
		let errHandler = (err) => {
			this.setState({
				...err,
				modalTitle: 'Error',
				showModal: true
			});
		};
		
		let ouCreateHandler = (ouD) => {
			oum.createOrganizationalUnitPromise(ouD)
				.then(() => {
					this.setState({ modalTitle: 'Success', error: 'Organizational Unit created correctly!!', showModal: true});
				},errHandler);
		};
		
		if(typeof myBlob !== 'undefined'){
			reader.addEventListener('load',() => {
				let stringBase64Image = reader.result;
				organizationalUnitData.picture = stringBase64Image;
				
				ouCreateHandler(organizationalUnitData);
			});
			reader.readAsDataURL(myBlob);
		} else {
			ouCreateHandler(organizationalUnitData);
		}
	}
	
	render() {
		let schema = this.state.schema;
		const uiSchema = {
			/*,
			'picture': {
				'ui:widget': 'file'
			}*/
		};
		
		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		delete schema.title;
		const data = undefined;
		//console.log(schema);
		//const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.addOrganizationalUnitData(formData);
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);

		let ouImage = this.state.picture;
		if(ouImage === null){
			ouImage = NoImageAvailable;
		}
		//console.log("ouImage: ",ouImage);
		//console.log("this.state.files.length: ",this.state.files.length);
		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header>
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
								<Button>{this.state.copied ? 'Copied!' : 'Copy trace'}&nbsp;<Glyphicon glyph="copy" /></Button>
							</CopyToClipboard>
							:
							null
						}
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<h3> Create New Organizational Unit</h3>
				<Collapse in={this.state.in} onEntering={() => this.wait()} bsStyle="success" ref="fade">
					<ListGroup>
						<ListGroupItem bsStyle="success">Organizational Unit created successfully!!</ListGroupItem>
					</ListGroup>
				</Collapse>
				<Row className="show-grid">
					<Col xs={12} md={9}>
							<Form schema={schema}
								uiSchema={uiSchema}
								formData={data}
								//onChange={log('changed')}
								onSubmit={onSubmit}
								onError={onError}
								validate={organizationalUnitValidation}
								liveValidate
							>
								<div className="button-submit">
									<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
									<Button bsStyle="primary" type="submit" className="submitCancelButtons" >Submit&nbsp;<Glyphicon glyph="pencil" /></Button>
								</div>
							</Form>
					</Col>
					<Col xs={6} md={3} >
						<div style={{textAlign: 'center'}}>
							<ControlLabel>Organizational Unit Picture</ControlLabel>
							<div><img src={ouImage} name="documentFile" width="100" alt="image_ou" className="imagePreview" /></div>
							<ButtonGroup block justified>
								<Link className="btn btn-primary btn-xs changeImageButton" role="button" onClick={() => this.onOpenClick()}>
									Set&nbsp;<Glyphicon glyph="camera" />
								</Link>
								<Link className="btn btn-primary btn-xs changeImageButton" role="button" disabled={this.state.picture === null} onClick={() => this.onRemoveClick()}>
									Remove&nbsp;<Glyphicon glyph="fire" />
								</Link>
							</ButtonGroup>
							<Dropzone className="dropzoneEditNew" disableClick={false} multiple={false} accept={'image/*'} onDrop={(images) => this.ouImageDropHandler(images)} ref="ouImageDropzone" >
								Click here or drop image
							</Dropzone>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

OrganizationalUnitNewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	history: React.PropTypes.object.isRequired
};


export default OrganizationalUnitNewForm;
