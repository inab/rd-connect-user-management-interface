var React = require('react');
import { Modal, Row, Col, Button, Jumbotron, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
//var ModalError = require('./ModalError.jsx');
//import { hashHistory } from 'react-router';
var imageNotFoundSrc = require('./defaultNoImageFound.js');

var UserViewForm = React.createClass({
	propTypes:{
		schema: React.PropTypes.object.isRequired,
		data: React.PropTypes.object.isRequired
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
	render: function() {
		var data = this.props.data;
		delete data.userPassword;
		console.log(data);
		console.log('Error: ', this.state.error);
		console.log('Show: ', this.state.showModal);
		var isChecked = this.props.data.enabled;
		var userImage = this.props.data.picture;
		if (typeof userImage === 'undefined'){
			userImage = imageNotFoundSrc.src;
		}
		console.log(userImage);
		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>Error!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Jumbotron>
					<Row className="show-grid">
						<Col xs={16} md={10}>
							<Panel header="Common Name">
								<p>{this.props.data.cn}</p>
							</Panel>
							<Panel header="Username">
								<p>{this.props.data.username}</p>
							</Panel>
							<Panel header="First/Given Name">
								{this.props.data.givenName.map(function(name, i){
									return (
										<p key={i}>{name}</p>
									);
								})}
							</Panel>
							<Panel header="Surname">
								{this.props.data.surname.map(function(name, j){
									return (
										<p key={j}>{name}</p>
									);
								})}
							</Panel>
							<Panel header="Organizational Unit">
								<p>{this.props.data.organizationalUnit}</p>
							</Panel>
							<Panel header="Email Addresses">
								{this.props.data.email.map(function(mail, k){
									return (
										<p key={k}>{mail}</p>
									);
								})}
							</Panel>
							<Panel header="Is the user enabled?">
								<p>{isChecked.toString()}</p>
							</Panel>
							<Panel header="User Category">
								<p>{this.props.data.userCategory}</p>
							</Panel>
							<Panel header="Preferred way to address the user">
								<p>{this.props.data.title}</p>
							</Panel>
							{typeof this.props.data.telephoneNumber !== 'undefined' 
								? <Panel header="Contact Phone Number">
										{this.props.data.telephoneNumber.map(function(telephone, l){
											return (
												<p key={l}>{telephone}</p>
											);
										})}
									</Panel>
								: <Panel header="Contact Phone Number"/>
							}
							{typeof this.props.data.facsimileTelephoneNumber !== 'undefined' 
								? <Panel header="Fax Number">
										{this.props.data.facsimileTelephoneNumber.map(function(fax, m){
											return (
												<p key={m}>{fax}</p>
											);
										})}
									</Panel>
								: <Panel header="Fax Number"/>
							}
							<Panel header="Address to physically reach the user:">
								<p>{this.props.data.registeredAddress}</p>
							</Panel>
							<Panel header="Address to send traditional mail to the user">
								<p>{this.props.data.postalAddress}</p>
							</Panel>
							{typeof this.props.data.links !== 'undefined' 
								? <Panel header="Links related to the user">
										{this.props.data.links.map(function(link, n){
											return (
												<p key={n}>{link}</p>
											);
										})}
									</Panel>
								: <Panel header="Links related to the user"/>
							}
							{typeof this.props.data.groups !== 'undefined' 
								? <Panel header="List of groups where the user is registered in">
										{this.props.data.groups.map(function(group, o){
											return (
												<p key={o}>{group}</p>
											);
										})}
										<Link className="btn btn-primary editViewButton" role="button" to={'/users/groups/edit/' + encodeURIComponent(`${this.props.data.username}`)}>
											Edit
										</Link>
									</Panel>
								: <Panel header="List of groups where the user is registered in"/>
							}
						</Col>
						<Col>
							<img src={userImage} width="100" alt="image_user" />
						</Col>
					</Row>
				</Jumbotron>
				<div className="right">
					<Link className="btn btn-primary editViewButton" role="button" to="/users/list">
						Back
					</Link>
					<Link className="btn btn-primary editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(`${this.props.data.username}`)}>
						Edit User Info
					</Link>
				</div>
			</div>
		);
	}
});
module.exports = UserViewForm;
