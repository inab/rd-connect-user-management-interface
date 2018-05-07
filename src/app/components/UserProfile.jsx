import React from 'react';
import { Link, withRouter } from 'react-router';
import auth from './auth.jsx';
import config from 'config.jsx';

class UserProfile extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.router;
	}
	
	componentWillMount() {
		this.setState({
			loginData: null,
			loaded: false
		});
	}
	
	componentDidMount() {
		auth.getLoginData((loginData) => {
			this.setState({loginData: loginData, loaded: true });
			console.log(loginData);
			//this.history.push('/users/view/' + encodeURIComponent(loginData.username));
		});
	}
	
	render() {
		const loginData = this.state.loginData;

		return this.state.loaded ? (
		  <div>
			<h1>User's Profile</h1>
			<p>Username: <Link to={'/users/view/' + encodeURIComponent(loginData.username)}>{loginData.username}</Link></p>
			<p>Fullname: {loginData.fullname}</p>
			<p>e-mail: {loginData.email ? loginData.email.map((email) => {return <span><a href={'mailto:'+encodeURIComponent(email)} target="_blank">{email}</a>&nbsp;</span>;}) : ''}</p>
			<p>Category: {loginData.userCategory}</p>
			<p>Debug info:</p><pre>{JSON.stringify(config.buildInfo, null, '\t')}</pre>
		  </div>
		) : (<div />);
	}
}

export default withRouter(UserProfile);
