import React from 'react';
import { Link, withRouter } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import Navigation from './Navigation.jsx';
import config from 'config.jsx';
import auth from './auth.jsx';

class App extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.router;
	}
	
	componentWillMount() {
		this.setState({
			loggedIn: auth.loggedIn(),
			loginData: {},
			canSubmit: false,
			validationErrors: {}
		});
		auth.onChangeListener((loggedIn) => this.updateAuth(loggedIn));
	}
	
	updateAuth(loggedIn) {
		this.setState({loggedIn: !!loggedIn,loginData: loggedIn ? loggedIn : {}});
	}
	
	scheduleUserViewRedirect() {
		auth.getLoginDataP()
		.then((loginData) => {
			this.history.push('/users/view/' + encodeURIComponent(loginData.username));
		});
	}
	
	render() {
		if(!this.props.children) {
			if(this.state.loggedIn) {
				this.scheduleUserViewRedirect();
			}
		}
		return (
			<div>
				<div>
					<header className="primary-header">
						<div className="loginBox">
							<Link to="/userProfile">User's Profile</Link>
							&nbsp;|&nbsp;
									{this.state.loggedIn ? (
									<Link to="/logout">Log out</Link>
									) : (
									<Link to="/login">Login</Link>
									)}
						</div>
						<Navigation projectName="RD-Connect UMI" />
					</header>
					<aside className="primary-aside" />
					<main className = "container">
						<Breadcrumbs
							routes={this.props.routes}
							params={this.props.params}
						/>
						{
							this.props.children ||
							<div>
								<p>You are { this.state.loggedIn || 'not'} logged in.</p>
								{this.state.loggedIn ? (
									<Link to="/logout">Log out</Link>
									) : (
									<Link to="/login">Login</Link>
								)}
								<p>Debug info:</p><pre>{JSON.stringify(config.buildInfo, null, '\t')}</pre>
							</div>
						}
					</main>
				</div>
			</div>
		);
	}
}

App.propTypes = {
	router: React.PropTypes.object.isRequired,
	params: React.PropTypes.object.isRequired,
	routes: React.PropTypes.array.isRequired,
	children: React.PropTypes.object,
};

export default withRouter(App);
