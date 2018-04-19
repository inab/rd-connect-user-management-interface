import React from 'react';
import RichTextEditor from 'react-rte';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';
import { Button, Col, ControlLabel, FormControl, FormGroup, Glyphicon, Grid, HelpBlock, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import jQuery from 'jquery';
import auth from 'components/auth.jsx';
import config from 'config.jsx';


function dataURItoBlob(dataURI) {
	// Split metadata from data
	var splitted = dataURI.split(",");
	// Split params
	var params = splitted[0].split(";");
	// Get mime-type from params
	var type = params[0].replace("data:", "");
	// Filter the name property from params
	var properties = params.filter(function (param) {
		return param.split("=")[0] === "name";
	});
	// Look for the name and use unknown if no name property.
	var name = void 0;
	if (properties.length !== 1) {
		name = "unknown";
	} else {
		// Because we filtered out the other property,
		// we only have the name case here.
		name = properties[0].split("=")[1];
	}
	
	// Built the Uint8Array Blob parameter from the base64 string.
	var binary = atob(splitted[1]);
	var array = [];
	for (var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	// Create the blob object
	var blob = new window.Blob([new Uint8Array(array)], { type: type, charset: 'utf-8' });
	
	return { blob: blob, name: name };
}

function String2DataURI(string,cb,mime='text/html') {
	// Fast hack to get the UTF-8 bytes of a string
	let utf8string = unescape(encodeURIComponent(string));
	let numBytes = utf8string.length;
	let byteArray = new Uint8Array(numBytes);
	for(let i=0;i<numBytes;i++) {
		byteArray[i] = utf8string.charCodeAt(i);
	}
	let blobString = new Blob([byteArray],{type: mime});
	
	let reader = new FileReader();
	reader.addEventListener("load",() => {
		if(cb) {
			let iSemiColon = reader.result.indexOf(';');
			let result = reader.result.substring(0,iSemiColon)+';charset=utf-8'+reader.result.substring(iSemiColon);
			
			cb(result);
			
		}
	}, false);

	reader.readAsDataURL(blobString);
}


class MailingContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			modalTitle: null,
			error: null,
			showModal: false,
			
			subject: '',
			body: RichTextEditor.createEmptyValue(),
			mailTemplate: '',
			selectedUsers: [],
			selectedOUs: [],
			selectedGroups: [],
			attachments: [],
			dataUrlAttachments: []
		});
	}
	
	componentDidMount() {
		//super.componentDidMount();
		
		this.loadSelectableUsers();
		
		this.loadSelectableOrganizationalUnits();
		
		this.loadSelectableGroups();
	}
	
	onSubjectChange(e) {
		this.onChange({subject: e.target.value});
	}
	
	onDropAttachments(files) {
		this.onChange({attachments:files});
	}
	
	getSubjectValidationState() {
		const length = this.state.subject.length;
		if (length > 0) return 'success';
		else return 'warning';
	}
	
	getRecipientsValidationState() {
		// TO BE IMPLEMENTED
		return (this.state.selectedUsers.length===0 && this.state.selectedOUs.length===0 && this.state.selectedGroups.length===0) ? 'error' : 'success';
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		//return nextProps.user.id === props.user.id;
		return true;
	}
	
	update(e) {
		//this.props.update(e.target.value)
	}
	
	attachmentsToDataURL(index,cb) {
		if(index < this.state.attachments.length) {
			let reader = new FileReader();
			reader.addEventListener("load",() => {
				this.state.dataUrlAttachments[index] = reader.result;
				this.attachmentsToDataURL(index+1,cb);
			}, false);

			reader.readAsDataURL(this.state.attachments[index]);
		} else if(cb) {
			cb();
		}
	}
	
	onSubmit() {
		String2DataURI(this.state.body.toString('html'),(dataurl) => {
			this.setState({mailTemplate: dataurl});
			this.attachmentsToDataURL(0,() => {
				// At last, prepare the JSON message, and send it!!!!!
				let mailMessage = {
					users: this.state.selectedUsers.map(user => user.value),
					organizationalUnits: this.state.selectedOUs.map(ou => ou.value),
					groups: this.state.selectedGroups.map(group => group.value),
					subject: this.state.subject,
					mailTemplate: this.state.mailTemplate,
					attachments: this.state.dataUrlAttachments
				};
				jQuery.ajax({
						type: 'POST',
						url: config.mailingBaseUri,
						contentType: 'application/json',
						headers: auth.getAuthHeaders(),
						dataType: 'json',
						data: JSON.stringify(mailMessage)
					})
					.done(function(data) {
						//console.log('Password correctly updated!!');
						this.setState({modalTitle:'Success', error: 'Password changed correctly!!', showModal: true});

					}.bind(this))
					.fail(function(jqXhr) {
						//console.log('Failed to change user password',jqXhr.responseText);
						var responseText = '';
						if (jqXhr.status === 0) {
							responseText = 'Failed to send e-mail. Not connect: Verify Network.';
						} else if (jqXhr.status === 404) {
							responseText = 'Failed to send e-mail. Not found [404]';
						} else if (jqXhr.status === 500) {
							responseText = 'Failed to send e-mail. Internal Server Error [500].';
						} else if (jqXhr.status === 'parsererror') {
							responseText = 'Failed to send e-mail. Sent JSON parse failed.';
						} else if (jqXhr.status === 'timeout') {
							responseText = 'Failed to send e-mail. Time out error.';
						} else if (jqXhr.status === 'abort') {
							responseText = 'Ajax request aborted.';
						} else {
							responseText = 'Uncaught Error: ' + jqXhr.responseText;
						}
						this.setState({ modalTitle: 'Error', error: responseText, showModal: true});
					}.bind(this))
					.always(() => {
					});
			});
			// To be done
		});
	}
	
	close() {
		if (this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			hashHistory.goBack();
		}
	}
	
	render() {
		return <div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="info" onClick={this.close}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
					</Modal.Footer>
				</Modal>
			<form onSubmit={this.onSubmit.bind(this)}>
				<Row>
					<Col sm={12} md={8}>
						<FormGroup
							controlId="mail"
							validationState={this.getSubjectValidationState()}
						>
							<ControlLabel>Mail subject</ControlLabel>
							<FormControl
								type="text"
								value={this.state.subject}
								placeholder="Subject"
								onChange={(e) => { this.onChange({subject: e.target.value}) }}
							/>
							<br/>
							<RichTextEditor
								value={this.state.body}
								onChange={(value) => { this.onChange({body: value}) }}
							/>
							<br />
							<ControlLabel>Attachments</ControlLabel>
							<div>
								<div style={{float:'left'}}>
									<Dropzone onDrop={this.onDropAttachments.bind(this)}>
										<p>Click or try dropping the attachments here</p>
									</Dropzone>
								</div>
								<div style={{float:'left'}}>
									<ol>
									{
										this.state.attachments.map(f => <li key={f.name}>{f.name} <i>({f.size} bytes)</i></li>)
									}
									</ol>
								</div>
							</div>
							<FormControl.Feedback />
						</FormGroup>
					</Col>
					<Col sm={12} md={4}>
						<FormGroup
							controlId="recipients"
							validationState={this.getRecipientsValidationState()}
						>
							<ControlLabel>Recipients</ControlLabel>
							<Select
								disabled={this.state.selectableUsers.length == 0}
								placeholder="Select the user(s)"
								options={this.state.selectableUsers}
								value={this.state.selectedUsers}
								onChange={(values) => this.onChange({selectedUsers: values})}
								multi
							/>
							<br/>
							<Select
								disabled={this.state.selectableOUs.length == 0}
								placeholder="Select the organizational unit(s)"
								options={this.state.selectableOUs}
								value={this.state.selectedOUs}
								onChange={(values) => this.onChange({selectedOUs: values})}
								multi
							/>
							<br/>
							<Select
								disabled={this.state.selectableGroups.length == 0}
								placeholder="Select the group(s)"
								options={this.state.selectableGroups}
								value={this.state.selectedGroups}
								onChange={(values) => this.onChange({selectedGroups: values})}
								multi
							/>
						</FormGroup>
					</Col>
				</Row>
				<div className="button-submit">
					<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
					<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Send e-mail&nbsp;<Glyphicon glyph="pencil" /></Button>
				</div>
			</form>
		</div>;
		// return <MyInput onChange={this.update} />
	}
}


export default MailingContainer;
