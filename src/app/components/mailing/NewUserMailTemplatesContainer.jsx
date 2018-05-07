import React from 'react';
import RichTextEditor from 'react-rte';
import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';
import { Button, ControlLabel, Glyphicon, Modal } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

class NewUserMailTemplatesContainer extends AbstractFetchedDataContainer {
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
		this.listTemplateDocuments((listing) => {
			this.getTemplateMail((mailTemplate) => {
				//let mailTemplate = '<p>Component in development</p>';
				this.setState({
					mailTemplate: RichTextEditor.createValueFromString(mailTemplate, 'html'),
					loaded: true
				});
			},errHandler);
		},errHandler);
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
		this.saveTemplateMail(this.state.mailTemplate.toString('html'),() => {
			this.setState({modalTitle:'Success', error: 'Mail template properly stored!!', showModal: true});
		},errHandler);
	}

	render() {
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
			{ this.state.loaded && 
				<form onSubmit={this.onSubmit.bind(this)}>
					<div style={{float: 'left',clear:'left'}}><ControlLabel>Template mail body</ControlLabel></div>
					<div style={{float: 'right',clear:'right'}}>(accepted keywords: <b>[% username %]</b> and <b>[% fullname %]</b>)</div>
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
			{ this.state.loaded || <div>Loading template...</div> }
		</div>
		);
	}
}


export default NewUserMailTemplatesContainer;
