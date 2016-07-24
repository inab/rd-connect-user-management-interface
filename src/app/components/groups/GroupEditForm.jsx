var React = require('react');
var Bootstrap = require('react-bootstrap');
var jQuery = require('jquery');
import Form from 'react-jsonschema-form';
import { Row, Col } from 'react-bootstrap';

/*function groupValidation(formData,errors) {
	if (formData.userPassword !== formData.userPassword2) {
	    errors.userPassword2.addError("Passwords don't match");
	}
		return errors;
}*/

var GroupEditForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired,
		users: React.PropTypes.array.isRequired
	},
	getInitialState: function() {
		return { error: null, showModal:false};
	},
	close(){
		this.setState({showModal: false});
	},
	open(){
		this.setState({showModal: true});
	},
	updateGroupData: function({formData}){
		//console.log("yay I'm valid!");
		//console.log(formData);
		var groupData = Object.assign({},formData);
		jQuery.ajax({
			type: 'PUT',
			url: '/some/url',
			data: groupData
		})
		.done(function(data) {
			self.clearForm();
		})
		.fail(function(jqXhr) {
			console.log('Failed to Update Group Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to Update Group Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to Update Group Information. Not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to Update Group Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to Update Group Information. Sent JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to Update Group Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Ajax request aborted.';
			} else {
				responseText = 'Uncaught Error: ' + jqXhr.responseText;
			}
			this.setState({error: responseText, showModal: true});
		}.bind(this));
	},
	render: function() {
		var schema = this.props.schema;
		//We need to be sure that the new user added to this group is an existing user
		var newSchema = {};
		newSchema.type = schema.type;
		newSchema.properties = {};
		newSchema.additionalProperties = false;
		newSchema.dependencies = schema.dependencies;
		newSchema.properties.cn = schema.properties.cn;
		newSchema.properties.owner = schema.properties.owner;
		//We generate an array with all the available groups
		var arrayUsers = {};
		for (var i = 0; i < this.props.users.length; i++){
			var cn = this.props.users[i].cn;
			var username = this.props.users[i].username;
			arrayUsers[cn] = username;
		}
		//console.log("arrayUsers contiene: ", arrayUsers);
		//Now we sort arrayUsers by the keys
		var arrayUsersSortable = [];
		for (var user in arrayUsers){
			arrayUsersSortable.push([user, arrayUsers[user]]);
			arrayUsersSortable.sort(
				function(a, b) {
					return a[0] > b[0];
				}
			);
		}
		//Now we generate the arrays for enum y enumNames from arrayUsesSortable
		var usersEnum = [];
		var usersEnumNames = [];
		for (var i = 0; i < 89; i++){
			usersEnum.push(arrayUsersSortable[i][1]);
			usersEnumNames.push(arrayUsersSortable[i][0]);
		}
		newSchema.properties.members = {
			'title': 'Members inside ' + this.props.data.cn + ' group: ',
			'type': 'array',
			'uniqueItems': true,
			'items': {
				'type': 'string',
				'minLength': 1
			}
		};
		//We set the enum property to usersEnum forcing the user to choose an existing user as member of this group
		newSchema.properties.members.items.enum = usersEnum;
		newSchema.properties.members.items.enumNames = usersEnumNames;

		var data = this.props.data;
		var newData = Object.create(data);

		newData.cn = data.cn;
		newData.owner = data.owner;
		newData.members = data.members;

		const uiSchema = {
			'cn': {
				'ui:readonly': true
			},
			'owner': {
				'ui:readonly': true
			},
			'members': {
				'ui:widget': 'select'
			}
		};
		const log = (type) => console.log.bind(console, type);
		const onSubmit = ({formData}) => this.updateGroupData({formData});
		const onError = (errors) => console.log('I have', errors.length, 'errors to fix');
		//console.log("Error: ", this.state.error);
		//console.log("Show: ", this.state.showModal);
		return (
			<div>
				<Bootstrap.Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Bootstrap.Modal.Header closeButton>
						<Bootstrap.Modal.Title>Error!</Bootstrap.Modal.Title>
					</Bootstrap.Modal.Header>
					<Bootstrap.Modal.Body>
						<h4>{this.state.error}</h4>
					</Bootstrap.Modal.Body>
					<Bootstrap.Modal.Footer>
						<Bootstrap.Button onClick={this.close}>Close</Bootstrap.Button>
					</Bootstrap.Modal.Footer>
				</Bootstrap.Modal>
				<Row className="show-grid">
					<Col xs={12} md={8}>
						<code>
							<Form schema={newSchema}
							uiSchema={uiSchema}
							formData={newData}
							onChange={log('changed')}
							onSubmit={onSubmit}
							onError={onError}
							//validate={groupValidation}
							liveValidate
							/>
						</code>
					</Col>
					<Col xs={6} md={4}>
						<code></code>
					</Col>
				</Row>
			</div>
		);
	}
});
module.exports = GroupEditForm;
