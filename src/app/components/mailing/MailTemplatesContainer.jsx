import React from 'react';
import RichTextEditor from 'react-rte';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';
import { Button, ControlLabel, Glyphicon, Modal } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

class MailTemplatesContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			domainId: this.props.params.domainId,
			templateDomain: null,
			modalTitle: null,
			error: null,
			showModal: false,
			
			mailTemplate: RichTextEditor.createEmptyValue(),
			attachments: [],
			loaded: false,
		});
	}
	
	componentDidMount() {
		let errHandler = (err) => {
			this.setState({
				...err,
				showModal: true
			});
		};
		
		this.templateDomainPromise(this.state.domainId)
			.then((templateDomain) => {
				this.setState({
					templateDomain: templateDomain
				});
				
				return this.templateDocumentsPromise(this.state.domainId);
			},errHandler)
			.then((listing) => {
				return this.templateMailPromise(this.state.domainId,listing);
			},errHandler)
			.then((mailTemplateFiles) => {
				this.setState({
					mailTemplateFile: mailTemplateFiles[0],
					mailTemplateAttachments: (mailTemplateFiles.length > 1) ? mailTemplateFiles[1] : [],
					attachments: (mailTemplateFiles.length > 1) ? mailTemplateFiles[1].map((file) => { return new File([file.content], file.cn, {type: file.mime}); }) : [],
					mailTemplate: RichTextEditor.createValueFromString(mailTemplateFiles[0].content, 'html'),
					loaded: true
				});
			},errHandler);
	}
	
	componentWillReceiveProps(nextProps,nextContext) {
		if(this.props.params.domainId !== nextProps.domainId) {
			// Resetting to a default state
			this.setState({
				domainId: nextProps.params.domainId,
				templateDomain: null,
				modalTitle: null,
				error: null,
				showModal: false,
				
				mailTemplate: RichTextEditor.createEmptyValue(),
				attachments: [],
				loaded: false,
			});
		}
	}
	
	componentDidUpdate(prevProps,prevState,prevContext) {
		if(prevProps.params.domainId !== this.state.domainId) {
			// Re-fetch the templates
			this.componentDidMount();
		}
	}
	
	close() {
		if(this.state.modalTitle === 'Error'){
			this.setState({showModal: false});
		} else {
			this.setState({showModal: false});
			this.history.goBack();
		}
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
		target.setAttribute("download",f.name);
		target.setAttribute("href",URL.createObjectURL(f));
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
	
	onSubmit() {
		let errHandler = (err) => {
			this.setState({
				...err,
				showModal: true
			});
		};
		
		let mailTemplateFile = {
			...this.state.mailTemplateFile,
			content: this.state.mailTemplate.toString('html'),
			mime: 'text/html'
		};
		
		// Let's identify the attachments to be erased
		let deletedAttachments = [];
		if(this.state.mailTemplateAttachments.length > 0) {
			if(this.state.attachments.length > 0) {
				deletedAttachments = this.state.mailTemplateAttachments.filter(removedAtt => this.state.attachments.every(att => att.name !== removedAtt.cn));
			} else {
				deletedAttachments = this.state.mailTemplateAttachments;
			}
		}
		
		// And the touched ones
		let attachments = [];
		if(this.state.attachments.length > 0) {
			if(this.state.mailTemplateAttachments.length > 0) {
				attachments = this.state.attachments.filter(att => this.state.mailTemplateAttachments.every(prevAtt => att.name !== prevAtt.cn || att !== prevAtt.content));
			} else {
				attachments = this.state.attachments;
			}
		}
		let mailTemplateAttachments = attachments.map((att) => {
			return {
				content: att,
				mime: att.type,
				cn: att.name
			};
		});
		
		this.saveTemplateMailPromise(this.state.domainId,mailTemplateFile,mailTemplateAttachments)
			.then(() => {
				// Let's remove those attachments which have disappeared
				return deletedAttachments.length > 0 ? this.deleteTemplateAttachmentsPromise(this.state.domainId,deletedAttachments) : true;
			},errHandler)
			.then(() => {
				this.setState({modalTitle:'Success', error: 'Mail template (and attachments) properly stored!!', showModal: true});
			},errHandler);
	}
	
	render() {
		let loaded = this.state.loaded;
		
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
			{ loaded && 
				<form onSubmit={this.onSubmit.bind(this)}>
					<div style={{float: 'left',clear:'left'}}><ControlLabel>{this.state.templateDomain.desc}</ControlLabel></div>
					<div style={{float: 'right',clear:'right'}}>(accepted keywords: {
						this.state.templateDomain.tokens.map((t,i) => {
							let retval = [];
							if(i > 0) {
								retval.push(this.state.templateDomain.tokens.length === (i + 1) ? ' and ' : ', ');
							}
							retval.push(<b>{'[% ' + t + ' %]'}</b>);
							return retval;
						})
					})</div>
					<div style={{clear: 'both'}}>
						<RichTextEditor
							className={'umi-mailing'}
							value={this.state.mailTemplate}
							onChange={(value) => { this.onChange({mailTemplate: value}); }}
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
								this.state.attachments.map((f,numF) => <li key={f.name}><a onClick={(e) => { this.attachmentClick(e.target,f); } }>{f.name}</a> <i>({f.size} bytes)</i> <a style={{ color: 'red' }} onClick={() => this.attachmentRemove(numF)}>remove<Glyphicon glyph="trash" /></a></li>)
							}
							</ol>
						</div>
					</div>
					
					<div className="button-submit">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
						<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Update e-mail template&nbsp;<Glyphicon glyph="pencil" /></Button>
					</div>
				</form>
			}
			{ loaded || <div>Loading template...</div> }
		</div>
		);
	}
}


MailTemplatesContainer.propTypes = {
    params: React.PropTypes.object,
    history:  React.PropTypes.object
};

export default MailTemplatesContainer;
