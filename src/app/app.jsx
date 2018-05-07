import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Router, Route, Link, IndexRoute } from 'react-router';
//import withExampleBasename from 'components/withExampleBasename.js';
//import sentryConfig from './sentryConfig.js';

import auth from 'components/auth.jsx';
import Login from 'components/Login.jsx';
import Navigation from 'components/Navigation.jsx';
import Breadcrumbs from 'react-breadcrumbs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Box from 'components/Box.jsx';
import UsersContainer from 'components/users/UsersContainer.jsx';
import UserFormContainer from 'components/users/UserFormContainer.jsx';
import PasswordContainer from 'components/users/PasswordContainer.jsx';

import UserEditFormContainer from 'components/users/UserEditFormContainer.jsx';
import UserNewFormContainer from 'components/users/UserNewFormContainer.jsx';
import UsersGroupsContainer from 'components/users/UsersGroupsContainer.jsx';
import UsersGroupsFormContainer from 'components/users/UsersGroupsFormContainer.jsx';

import OrganizationalUnitsContainer from 'components/organizationalUnits/OrganizationalUnitsContainer.jsx';
import OrganizationalUnitFormContainer from 'components/organizationalUnits/OrganizationalUnitFormContainer.jsx';
import OrganizationalUnitNewFormContainer from 'components/organizationalUnits/OrganizationalUnitNewFormContainer.jsx';
import OrganizationalUnitsUsersContainer from 'components/organizationalUnits/OrganizationalUnitsUsersContainer.jsx';

import GroupsContainer from 'components/groups/GroupsContainer.jsx';
import GroupFormContainer from 'components/groups/GroupFormContainer.jsx';
import GroupNewFormContainer from 'components/groups/GroupNewFormContainer.jsx';

import DocumentsUsersContainer from 'components/documents/DocumentsUsersContainer.jsx';
import DocumentsUserContainer from 'components/documents/DocumentsUserContainer.jsx';
import DocumentsUserNew from 'components/documents/DocumentsUserNew.jsx';
import DocumentsGroupsContainer from 'components/documents/DocumentsGroupsContainer.jsx';
import DocumentsGroupContainer from 'components/documents/DocumentsGroupContainer.jsx';
import DocumentsGroupNew from 'components/documents/DocumentsGroupNew.jsx';

import MailingContainer from 'components/mailing/MailingContainer.jsx';
import NewUserMailTemplatesContainer from 'components/mailing/NewUserMailTemplatesContainer.jsx';

var _APP_INFO = {
  name: 'RD-Connect User Management Interface',
  branch: 'Master',
  version: '1.0'
};
/*var sentryURL = 'https://' + sentryConfig.sentryKey + '@sentry.io/' + sentryConfig.sentryApp;
Raven.config(sentryURL, {
  release: _APP_INFO.version,
  tags: {
    branch: _APP_INFO.branch,
    whatever: 'we want'
  }
}).install();
*/

const history = hashHistory;

const App = React.createClass({
  getInitialState() {
    return {
      loggedIn: auth.loggedIn(),
      loginData: {},
      canSubmit: false,
      validationErrors: {}
    };
  },
  componentWillMount() {
    auth.onChange = this.updateAuth;
    //auth.login();
  },
	updateAuth(loggedIn) {
		this.setState({loggedIn: !!loggedIn,loginData: loggedIn ? loggedIn : {}});
		//auth.getLoginData((loginData) => {
		//	this.setState({
		//		loginData: loginData
		//	});
		//});
	},
	scheduleUserViewRedirect: function() {
		auth.getLoginData((loginData) => {
			history.push('/users/view/' + encodeURIComponent(loginData.username));
		});
	},
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
                    <Navigation projectName="react-bootstrap-starter" />
                </header>
                <aside className="primary-aside"></aside>
                <main className = "container">
                    <Breadcrumbs
                        routes={this.props.routes}
                        params={this.props.params}
                    />
                    {
						this.props.children ||
                        <div>
                            <p>You are {!this.state.loggedIn && 'not'} logged in.</p>
                            {this.state.loggedIn ? (
                                <Link to="/logout">Log out</Link>
                                ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </div>
                    }
                </main>
            </div>
      </div>
    );
  }
});

const UserProfile = React.createClass({
	getInitialState: function() {
		return {
			loginData: null
		};
	},
	componentDidMount: function() {
		auth.getLoginData((loginData) => {
			this.setState({loginData: loginData });
			history.push('/users/view/' + encodeURIComponent(loginData.username));
		});
	},
  render() {
    const loginData = this.state.loginData;

    return loginData ? (
      <div>
        <h1>User's Profile</h1>
        <p>Username: {loginData.username}</p>
        <p>Fullname: {loginData.fullname}</p>
        <p>e-mail: {loginData.email}</p>
        <p>Category: {loginData.userCategory}</p>
      </div>
    ) : (<div />);
  }
});

const Logout = React.createClass({
  componentDidMount() {
    auth.logout();
  },

  render() {
    return <p>You are now logged out</p>;
  }
});

function requireAuth(nextState, replace) {
  if(!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render((
    <Router history={history}>
            <Route path="/" component={App} name="Home">
                {/* add it here, as a child of `/` */}
                <Route path="login" component={Login} name="Login" />
                <Route path="logout" component={Logout} name="Logout" />
                <Route path="userProfile" component={UserProfile} onEnter={requireAuth} name="User's Profile" />
                <Route path="users" name="Users" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={UsersContainer} />
                    <Route path="list" name="List" component={UsersContainer} task={'list'} />
                    <Route path="edit/:username" name="Edit" staticName component={UserEditFormContainer} task={'edit'}/>
                    <Route path="view/:username" name="View" staticName component={UserFormContainer} task={'view'}/>
                    <Route path="enable-disable/:username" name="Enable-Disable" staticName component={UserFormContainer} task={'enable_disable'}/>
                    <Route path="password/:username" name="Change Password" staticName component={PasswordContainer} task={'passwordChange'}/>
                    <Route path="reset-password/:username" name="Reset Password" staticName component={PasswordContainer} task={'passwordReset'}/>
                    <Route path="new" name="New" component={UserNewFormContainer} task={'new_privileged'}/>
                    <Route path="new-as-template/:username" name="New using a template" component={UserNewFormContainer} task={'new_as_template'} />
                    <Route path="new-unprivileged" name="New (unprivileged)" component={UserNewFormContainer} task={'new_unprivileged'} />
                    <Route path="groups" name="Users in groups" component={Box} >
                        <IndexRoute component={UsersGroupsContainer}/>
                        <Route path="list" name="View Users in group" staticName component={UsersGroupsContainer} task={'list'}/>
                        <Route path="view/:username" name="View Users in group" staticName component={UsersGroupsFormContainer} task={'users_groups_view'} />
                        <Route path="edit/:username" name="Edit Users in group" staticName component={UsersGroupsFormContainer} task={'users_groups_edit'} />
                    </Route>
                </Route>
                <Route path="organizationalUnits" name="Organizational Units" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={OrganizationalUnitsContainer}/>
                    <Route path="list" name="List Organizational Units" component={OrganizationalUnitsContainer} />
                    <Route path="addUser/:organizationalUnit" name="Add User" staticName component={UserNewFormContainer} task={'new_privileged_ou'} />
                    <Route path="edit/:organizationalUnit" name="Edit" staticName component={OrganizationalUnitFormContainer} task={'edit'} />
                    <Route path="view/:organizationalUnit" name="View" staticName component={OrganizationalUnitFormContainer} task={'view'} />
                    <Route path="new" name="New" component={OrganizationalUnitNewFormContainer} />
                    <Route path="users" name="Users in Organizational Units" component={OrganizationalUnitsUsersContainer} />
                </Route>
                <Route path="groups" name="Groups" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={GroupsContainer} />
                    <Route path="list" name="List" component={GroupsContainer} />
                    <Route path="edit/:groupName" name="Edit" staticName component={GroupFormContainer} task={'edit'} />
                    <Route path="view/:groupName" name="View" staticName component={GroupFormContainer} task={'view'} />
                    <Route path="new" name="New" component={GroupNewFormContainer} />
                </Route>
                <Route path="documents" name="Documents" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={DocumentsUsersContainer} />
                    <Route path="users" name="Users" component={DocumentsUsersContainer} />
                    <Route path="users/:username" name="List User Documents" component={DocumentsUserContainer} />
                    <Route path="users/:username/new" name="New User Document" component={DocumentsUserNew} />
                    <Route path="groups" name="Groups" component={DocumentsGroupsContainer} />
                    <Route path="groups/:groupName" name="List Group Documents" component={DocumentsGroupContainer} />
                    <Route path="groups/:groupName/new" name="New Group Document" component={DocumentsGroupNew} />
                </Route>
                <Route path="mail" name="Mail tasks" component={Box} onEnter={requireAuth}>
					<IndexRoute component={MailingContainer} />
					<Route path="platformMailing" name="Send massive e-mail" component={MailingContainer} />
					<Route path="newUserTemplatesManagement" name="New User Template Management" component={NewUserMailTemplatesContainer} />
                </Route>
            </Route>
        </Router>
 ), document.getElementById('content'));
