import React from 'react';
import Form from 'react-jsonschema-form';
import { Row, Col, Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router';

//import ModalError from './ModalError.jsx';

function groupValidation(formData,errors) {
		return errors;
}

var GroupViewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
	},
	render: function() {
		var schema = this.props.schema;
		var data = this.props.data;
		console.log('Schema contains: ',schema);
		console.log('Data contains: ',data);
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
						>
						<div>
								<Button>Back</Button>
							</div>
						</Form>
					</Col>
					<Col xs={6} md={4}>
						<code></code>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = GroupViewForm;
