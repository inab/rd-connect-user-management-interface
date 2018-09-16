import React from 'react';
import Form from 'react-jsonschema-form';
import { Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

//import ModalError from './ModalError.jsx';

function groupValidation(formData,errors) {
	return errors;
}

class GroupViewForm extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	render() {
		var schema = this.props.schema;
		var data = this.props.group;
		//console.log('Schema contains: ',schema);
		//console.log('Data contains: ',data);
		//const log = (type) => console.log.bind(console, type);
		//const onSubmit = ({formData}) => this.updateUserData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		const uiSchema = {
			'cn': {
				'ui:readonly': true
			},
			'members': {
				'ui:readonly': true
			},
			'owner': {
				'ui:readonly': true
			},
			'description': {
				'ui:readonly': true
			},
			'groupPurpose': {
				'ui:readonly': true
			}
		};
		return (
			<div>
				<Row className="show-grid">
					<div className="right">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons"><Glyphicon glyph="step-backward" />&nbsp;Back</Button>
						<Link className="btn btn-primary editViewButton" role="button" to={'/groups/edit/' + encodeURIComponent(data.cn)}>
							Edit&nbsp;<Glyphicon glyph="edit" />
						</Link>
						<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/groups/remove/' + encodeURIComponent(data.cn)}>
							Remove group<br/><Glyphicon glyph="fire" /> <b>DANGER!</b> <Glyphicon glyph="fire" />
						</Link>
						<br />
						<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/groups/rename/' + encodeURIComponent(data.cn)}>
							Rename&nbsp;<Glyphicon glyph="pencil" />
						</Link>
						<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/groups/merge/' + encodeURIComponent(data.cn)}>
							Merge&nbsp;<Glyphicon glyph="road" />
						</Link>
					</div>
				</Row>
				<Row className="show-grid">
					<Col xs={12} md={8}>
						<Form
								schema={schema}
								uiSchema={uiSchema}
								formData={data}
								//onChange={log('changed')}
								//onSubmit={onSubmit}
								onError={onError}
								validate={groupValidation}
								liveValidate
						/>
					</Col>
					<Col xs={6} md={4}>
						<code />
					</Col>
				</Row>
				<Row className="show-grid">
					<div className="right">
						<Button bsStyle="info" onClick={()=>this.history.goBack()} className="submitCancelButtons"><Glyphicon glyph="step-backward" />&nbsp;Back</Button>
						<Link className="btn btn-primary editViewButton" role="button" to={'/groups/edit/' + encodeURIComponent(data.cn)}>
							Edit&nbsp;<Glyphicon glyph="edit" />
						</Link>
						<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/groups/remove/' + encodeURIComponent(data.cn)}>
							Remove group<br/><Glyphicon glyph="fire" /> <b>DANGER!</b> <Glyphicon glyph="fire" />
						</Link>
						<br />
						<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/groups/rename/' + encodeURIComponent(data.cn)}>
							Rename&nbsp;<Glyphicon glyph="pencil" />
						</Link>
						<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/groups/merge/' + encodeURIComponent(data.cn)}>
							Merge&nbsp;<Glyphicon glyph="road" />
						</Link>
					</div>
				</Row>
			</div>
		);
	}
}

GroupViewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	group: React.PropTypes.object.isRequired,
	history:  React.PropTypes.object.isRequired
};

export default GroupViewForm;
