import React from 'react';
import { Glyphicon, Modal, Row, Col, Button, Jumbotron, Panel } from 'react-bootstrap';
import { Link } from 'react-router';
//import ModalError from './ModalError.jsx';
import { withRouter } from 'react-router';

const NoImageAvailable = 'images/No_image_available.svg';

class UserViewForm extends React.Component {
    constructor(props,context) {
		super(props,context);
		this.history = props.history;
    }
	
	componentWillMount() {
		let user = {...this.props.user};
		delete user.userPassword;

		this.setState({ user: user, error: null, showModal:false});
	}
	
	close() {
		this.setState({showModal: false});
	}
	
	open() {
		this.setState({showModal: true});
	}
	
	render() {
		var data = this.state.user;
		//console.log(data);
		//console.log('Error: ', this.state.error);
		//console.log('Show: ', this.state.showModal);
		var isChecked = data.enabled;
		var userImage = data.picture;
		if(typeof userImage === 'undefined'){
			userImage = NoImageAvailable;
		}
		//console.log(userImage);
		return (
			<div>
				<Modal show={this.state.showModal} onHide={() => this.close()} error={this.state.error}>
					<Modal.Header closeButton>
						<Modal.Title>Error!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>{this.state.error}</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={() => this.close()}>Close</Button>
					</Modal.Footer>
				</Modal>
				<div className="right">
					<Button bsStyle="info" onClick={() => this.history.goBack()}><Glyphicon glyph="step-backward" />&nbsp;Back</Button>
					<Link className="btn btn-primary editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(data.username)}>
						Edit User Info&nbsp;<Glyphicon glyph="edit" />
					</Link>
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/remove/' + encodeURIComponent(data.username)}>
						Remove user<br/><Glyphicon glyph="fire" /> <b>DANGER!</b> <Glyphicon glyph="fire" />
					</Link>
					<br />
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/password/' + encodeURIComponent(data.username) + '/reset'}>
						Reset Password&nbsp;<Glyphicon glyph="alert" />
					</Link>
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/password/' + encodeURIComponent(data.username) + '/change'}>
						Change Password&nbsp;<Glyphicon glyph="pencil" />
					</Link>
					<br />
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/rename/' + encodeURIComponent(data.username)}>
						Rename&nbsp;<Glyphicon glyph="pencil" />
					</Link>
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/migrate/' + encodeURIComponent(data.username)}>
						Migrate to other OU&nbsp;<Glyphicon glyph="plane" />
					</Link>
				</div>
				<Jumbotron>
					<Row className="show-grid">
						<Col xs={16} md={10}>
							<Panel header="Full Name">
								<p>{data.cn}</p>
							</Panel>
							<Panel header="Username">
								<p>{data.username}</p>
							</Panel>
							<Panel header="First/Given Name">
								{data.givenName.map(function(name, i){
									return (
										<p key={i}>{name}</p>
									);
								})}
							</Panel>
							<Panel header="Surname">
								{data.surname.map(function(name, j){
									return (
										<p key={j}>{name}</p>
									);
								})}
							</Panel>
							<Panel header="Organizational Unit">
								<p>{data.organizationalUnit}</p>
							</Panel>
							<Panel header="Email Addresses">
								{data.email.map(function(mail, k){
									return (
										<p key={k}><a href={'mailto:' + mail} target="_blank">{mail}</a></p>
									);
								})}
							</Panel>
							<Panel header="Is the user enabled?">
								<p>{isChecked.toString()}</p>
							</Panel>
							<Panel header="User Category">
								<p>{data.userCategory}</p>
							</Panel>
							<Panel header="Preferred way to address the user">
								<p>{data.title}</p>
							</Panel>
							{typeof data.telephoneNumber !== 'undefined'
								? <Panel header="Contact Phone Number">
										{data.telephoneNumber.map(function(telephone, l){
											return (
												<p key={l}>{telephone}</p>
											);
										})}
									</Panel>
								: <Panel header="Contact Phone Number"/>
							}
							{typeof data.facsimileTelephoneNumber !== 'undefined'
								? <Panel header="Fax Number">
										{data.facsimileTelephoneNumber.map(function(fax, m){
											return (
												<p key={m}>{fax}</p>
											);
										})}
									</Panel>
								: <Panel header="Fax Number"/>
							}
							<Panel header="Address to physically reach the user:">
								<p>{data.registeredAddress}</p>
							</Panel>
							<Panel header="Address to send traditional mail to the user">
								<p>{data.postalAddress}</p>
							</Panel>
							{typeof data.links !== 'undefined'
								? <Panel header="Links related to the user">
										{data.links.map(function(link, n){
											return (
												<p key={n}>{link}</p>
											);
										})}
									</Panel>
								: <Panel header="Links related to the user"/>
							}
							{typeof data.groups !== 'undefined'
								? <Panel header="List of groups where the user is registered in">
										{data.groups.map(function(group, o){
											return (
												<p key={o}>{group}</p>
											);
										})}
										<Link className="btn btn-primary editViewButton" role="button" to={'/users/groups/edit/' + encodeURIComponent(data.username)}>
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
					<Button bsStyle="info" onClick={()=>this.history.goBack()}><Glyphicon glyph="step-backward" />&nbsp;Back</Button>
					<Link className="btn btn-primary editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(data.username)}>
						Edit User Info&nbsp;<Glyphicon glyph="edit" />
					</Link>
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/remove/' + encodeURIComponent(data.username)}>
						Remove user<br/><Glyphicon glyph="fire" /> <b>DANGER!</b> <Glyphicon glyph="fire" />
					</Link>
					<br />
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/password/' + encodeURIComponent(data.username) + '/reset'}>
						Reset Password&nbsp;<Glyphicon glyph="alert" />
					</Link>
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/password/' + encodeURIComponent(data.username) + '/change'}>
						Change Password&nbsp;<Glyphicon glyph="pencil" />
					</Link>
					<br />
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/rename/' + encodeURIComponent(data.username)}>
						Rename&nbsp;<Glyphicon glyph="pencil" />
					</Link>
					<Link className="btn btn-danger editViewButton btn-xs" role="button" to={'/users/migrate/' + encodeURIComponent(data.username)}>
						Migrate to other OU&nbsp;<Glyphicon glyph="plane" />
					</Link>
				</div>
			</div>
		);
	}
}

UserViewForm.propTypes = {
	schema: React.PropTypes.object.isRequired,
	user: React.PropTypes.object.isRequired,
	history: React.PropTypes.object
};


module.exports = withRouter(UserViewForm);
