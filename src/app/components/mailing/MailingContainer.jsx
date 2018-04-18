import React from 'react';
import auth from 'components/auth.jsx';
import RichTextEditor from 'react-rte';
import { Button, Col, ControlLabel, FormControl, FormGroup, Glyphicon, Grid, HelpBlock, Row } from 'react-bootstrap';

class MailingContainer extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
		this.state = {
			subject: '',
			body: RichTextEditor.createEmptyValue()
		};
		this.onChange = this.onChange.bind(this);
	}
	
	onChange(e) {
		this.setState(e);
	}
	
	onSubjectChange(e) {
		this.onChange({subject: e.target.value});
	}
	
	getSubjectValidationState() {
		const length = this.state.subject.length;
		if (length > 0) return 'success';
		else return 'warning';
	}
	
	getRecipientsValidationState() {
		// TO BE IMPLEMENTED
		return 'error';
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		//return nextProps.user.id === props.user.id;
		return true;
	}
	
	update(e) {
		//this.props.update(e.target.value)
	}
	
	render() {
		return <div>
			<form>
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
							<div style={{marginTop: '1em'}}>
								<RichTextEditor
									value={this.state.body}
									onChange={(value) => { this.onChange({body: value}) }}
								/>
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
							User, group, and organizational units selection will be here
						</FormGroup>
					</Col>
				</Row>
				<div className="button-submit">
					<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons" ><Glyphicon glyph="step-backward" />&nbsp;Cancel</Button>
					<Button bsStyle="danger" type="submit" className="submitCancelButtons" >Send e-mail&nbsp;<Glyphicon glyph="pencil" /></Button>
				</div>
			</form>
			{this.state.body.toString('html')}
		</div>;
		// return <MyInput onChange={this.update} />
	}
}


export default MailingContainer;
