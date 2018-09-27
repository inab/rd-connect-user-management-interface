import React from 'react';
import RichTextEditor from 'react-rte';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';
import { Button, Col, ControlLabel, FormControl, FormGroup, Glyphicon, Modal, Row } from 'react-bootstrap';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

import jQuery from 'jquery';
import auth from 'components/auth.jsx';
import config from 'config.jsx';


/*
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
	if(properties.length !== 1) {
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
*/

function String2DataURI(string,cb,mime = 'text/html') {
	// Fast hack to get the UTF-8 bytes of a string
	let utf8string = unescape(encodeURIComponent(string));
	let numBytes = utf8string.length;
	let byteArray = new Uint8Array(numBytes);
	for(let i = 0; i < numBytes; i++) {
		byteArray[i] = utf8string.charCodeAt(i);
	}
	let blobString = new Blob([byteArray],{type: mime});
	
	let reader = new FileReader();
	reader.addEventListener('load',() => {
		if(cb) {
			let iSemiColon = reader.result.indexOf(';');
			let result = reader.result.substring(0,iSemiColon) + ';charset=utf-8' + reader.result.substring(iSemiColon);
			
			console.log(result);
			
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
		
		let allControls = !(this.props.params.username || this.props.params.groupName || this.props.params.ouName);
		
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
			allControls: allControls,
			username: this.props.params.username,
			groupName: this.props.params.groupName,
			ouName: this.props.params.ouName,
			user: null,
			organizationalUnit: null,
			group: null,
			attachments: [],
			dataUrlAttachments: []
		});
	}
	
	componentDidMount() {
		//super.componentDidMount();
		let errHandler = (err) => {
			this.setState({
				...err,
				showModal: true
			});
		};
		if(this.state.allControls) {
			this.selectableUsersPromise().catch(errHandler);
			
			this.selectableOrganizationalUnitsPromise().catch(errHandler);
			
			this.selectableGroupsPromise().catch(errHandler);
		} else if(this.state.username) {
			this.userPromise(this.state.username)
				.then((user) => this.setState({user: user, selectedUsers:[{value: user.username}]}),errHandler);
		} else if(this.state.groupName) {
			this.groupPromise(this.state.groupName)
				.then((group) => this.setState({group: group, selectedGroups:[{value: group.cn}]}),errHandler);
		} else if(this.state.ouName) {
			this.organizationalUnitPromise(this.state.ouName)
				.then((ou) => this.setState({organizationalUnit: ou, selectedOUs:[{value: ou.organizationalUnit}]}),errHandler);
		}
	}
	
	onSubjectChange(e) {
		this.onChange({subject: e.target.value});
	}
	
	onDropAttachments(files) {
		this.setState((prevState,props) => {
			return {
				attachments: [
					...prevState.attachments,
					...files
				]
			};
		});
	}
	
	attachmentClick(target,f) {
		target.setAttribute('download',f.name);
		target.setAttribute('href',URL.createObjectURL(f));
	}
	
	attachmentRemove(numF) {
		this.setState((prevState,props) => {
			let newAtt = [ ...prevState.attachments ];
			newAtt.splice(numF,1);
			return {
				attachments: newAtt
			};
		});
	}
	
	getSubjectValidationState() {
		const length = this.state.subject.length;
		return (length > 0) ? 'success' : 'warning';
	}
	
	getRecipientsValidationState() {
		// TO BE IMPLEMENTED
		return (this.state.selectedUsers.length === 0 && this.state.selectedOUs.length === 0 && this.state.selectedGroups.length === 0) ? 'error' : 'success';
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
			reader.addEventListener('load',() => {
				this.state.dataUrlAttachments[index] = reader.result;
				this.attachmentsToDataURL(index + 1,cb);
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
						this.setState({modalTitle:'Success', error: 'Mail properly delivered!!', showModal: true});

					}.bind(this))
					.fail(function(jqXhr) {
						//console.log('Failed to change user password',jqXhr.responseText);
						var responseText = '';
						switch(jqXhr.status) {
							case 0:
								responseText = 'Failed to send e-mail. Not connect: Verify Network.';
								break;
							case 404:
								responseText = 'Failed to send e-mail. Not found [404]';
								break;
							case 500:
								responseText = 'Failed to send e-mail. Internal Server Error [500].';
								break;
							case 'parsererror':
								responseText = 'Failed to send e-mail. Sent JSON parse failed.';
								break;
							case 'timeout':
								responseText = 'Failed to send e-mail. Time out error.';
								break;
							case 'abort':
								responseText = 'Ajax request aborted.';
								break;
							default:
								responseText = 'Uncaught Error: ' + jqXhr.responseText;
								break;
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
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			this.history.goBack();
		}
	}
	
	render() {
		let ctrlSet = <p>Loading...</p>;
		if(this.state.allControls) {
			ctrlSet = <FormGroup
				controlId="recipients"
				validationState={this.getRecipientsValidationState()}
			>
				<ControlLabel>Recipients</ControlLabel>
				<Select
					disabled={this.state.selectableUsers.length === 0}
					placeholder="Select the user(s)"
					options={this.state.selectableUsers}
					value={this.state.selectedUsers}
					onChange={(values) => this.onChange({selectedUsers: values})}
					multi
				/>
				<br/>
				<Select
					disabled={this.state.selectableOUs.length === 0}
					placeholder="Select the organizational unit(s)"
					options={this.state.selectableOUs}
					value={this.state.selectedOUs}
					onChange={(values) => this.onChange({selectedOUs: values})}
					multi
				/>
				<br/>
				<Select
					disabled={this.state.selectableGroups.length === 0}
					placeholder="Select the group(s)"
					options={this.state.selectableGroups}
					value={this.state.selectedGroups}
					onChange={(values) => this.onChange({selectedGroups: values})}
					multi
				/>
			</FormGroup>
		} else {
			ctrlSet = [
				<ControlLabel>Recipient</ControlLabel>
			];
			if(this.state.user) {
				ctrlSet.push(<p>User {this.state.user.cn} ({this.state.user.organizationalUnit})</p>);
			} else if(this.state.group) {
				ctrlSet.push(<p>Group {this.state.group.description} ({this.state.group.cn})</p>);
			} else if(this.state.organizationalUnit) {
				ctrlSet.push(<p>Organizational Unit {this.state.organizationalUnit.description} ({this.state.organizationalUnit.organizationalUnit})</p>);
			}
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
						<Button bsStyle="info" onClick={() => this.close()}><Glyphicon glyph="step-backward" />&nbsp;Close</Button>
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
								onChange={(e) => { this.onChange({subject: e.target.value}); }}
							/>
							<br/>
							<div style={{float: 'left',clear:'left'}}><ControlLabel>Mail body</ControlLabel></div>
							<div style={{float: 'right',clear:'right'}}>(accepted keywords: <b>[% username %]</b> and <b>[% fullname %]</b>)</div>
							<div style={{clear: 'both'}}>
								<RichTextEditor
									className={'umi-mailing'}
									value={this.state.body}
									onChange={(value) => { this.onChange({body: value}); }}
								/>
							</div>
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
										this.state.attachments.map(f => <li key={f.name}><a onClick={(e) => { this.attachmentClick(e.target,f); }}>{f.name}</a> <i>({f.size} bytes)</i></li>)
									}
									</ol>
								</div>
							</div>
							<FormControl.Feedback />
						</FormGroup>
					</Col>
					<Col sm={12} md={4}>
						{ctrlSet}
					</Col>
				</Row>
				<div className="button-submit">
					<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
					<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Send e-mail&nbsp;<Glyphicon glyph="pencil" /></Button>
				</div>
			</form>
		</div>
		);
		// return <MyInput onChange={this.update} />
	}
}


MailingContainer.propTypes = {
    params: React.PropTypes.object,
    history:  React.PropTypes.object
};

export default MailingContainer;
