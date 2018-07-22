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
				//let mailTemplate = '<p>Component in development</p>';
				this.setState({
					mailTemplateFile: mailTemplateFiles[0],
					mailTemplateAttachments: (mailTemplateFiles.length > 1) ? mailTemplateFiles[1] : [],
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
		this.onChange({attachments:files});
	}
	
	onSubmit() {
		let errHandler = (err) => {
			this.setState({
				...err,
				showModal: true
			});
		};
		
		this.state.mailTemplateFile.content = this.state.mailTemplate.toString('html');
		this.state.mailTemplateFile.mime = 'text/html';
		this.saveTemplateMailPromise(this.state.domainId,this.state.mailTemplateFile,this.state.mailTemplateAttachments)
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
								this.state.attachments.map(f => <li key={f.name}>{f.name} <i>({f.size} bytes)</i></li>)
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
