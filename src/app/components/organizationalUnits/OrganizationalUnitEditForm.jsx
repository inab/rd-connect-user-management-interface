import React from 'react';
import jQuery from 'jquery';
import Form from 'react-jsonschema-form';
import { Glyphicon, Modal, Button, ButtonGroup, Row, Col, ControlLabel } from 'react-bootstrap';
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

class OrganizationalUnitEditForm extends React.Component {
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
			picture:  this.props.data.picture ? this.props.data.picture : null,
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
	
	open(){
		this.setState({showModal: true});
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
	
	updateOrganizationalUnitData(formData) {
		//console.log('yay I\'m valid!');
		//console.log('El formData contiene: ',formData);
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
		
		let ouEditHandler = (ouName,ouD) => {
			oum.modifyOrganizationalUnitPromise(ouName,ouD)
				.then(() => {
					this.setState({ modalTitle: 'Success', error: 'Organizational Unit modified correctly!!', showModal: true});
				},errHandler);
		};
		
		if(typeof myBlob !== 'undefined'){
			reader.addEventListener('load',function() {
				let stringBase64Image = reader.result;
				organizationalUnitData.picture = stringBase64Image;
				
				ouEditHandler(this.props.data.organizationalUnit,organizationalUnitData);
			}.bind(this));
			reader.readAsDataURL(myBlob);
		} else {
			ouEditHandler(this.props.data.organizationalUnit,organizationalUnitData);
		}
	}
	
	render() {
		let schema = this.state.schema;
		let data = this.props.data;
		const uiSchema = {
			/*,
			'picture': {
				'ui:widget': 'file'
			}*/
		};
		//console.log('Retrieved schema from API and passed by Props: ', schema);
		//console.log('data passed by props', data);

		//We remove picture from the schema since this will be managed by react-dropzone component
		delete schema.properties.picture;
		//Once we already have picture value, we remove from data since we have removed it from schema.
		//All picture related stuff will be managed by react-dropzone component.
		delete data.picture;

		//console.log('Retrieved schema from API: ', schema);

		//const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateOrganizationalUnitData(formData);
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);

		let ouImage = this.state.picture;
		if(ouImage === null){
			ouImage = NoImageAvailable;
		}
		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
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
								<Button>{this.state.copied ? 'Copied!' : 'Copy trace'}&nbsp;<Glyphicon glyph="copy" /></Button>
							</CopyToClipboard>
							:
							null
						}
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Row className = "show-grid">
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
								Click here or drop image for {data.organizationalUnit}
							</Dropzone>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

OrganizationalUnitEditForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	data: React.PropTypes.object.isRequired,
	history: React.PropTypes.object.isRequired
};

export default OrganizationalUnitEditForm;
