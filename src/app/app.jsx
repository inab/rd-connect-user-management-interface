import React from 'react';
import { render } from 'react-dom';
import { hashHistory, Router, Route, Link, withRouter, IndexRoute } from 'react-router';
//import withExampleBasename from 'components/withExampleBasename.js';
import { Modal, Button, Col } from 'react-bootstrap';
import Raven from 'raven-js';
//import sentryConfig from './sentryConfig.js';

import auth from 'components/auth.jsx';
import Navigation from 'components/Navigation.jsx';
import Breadcrumbs from 'react-breadcrumbs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from 'components/main.jsx';
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

import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const {Form, Input } = FRC;
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
const App = React.createClass({
  getInitialState() {
    return {
      loggedIn: auth.loggedIn(),
      canSubmit: false,
      validationErrors: {}
    };
  },
  componentWillMount() {
    auth.onChange = this.updateAuth;
    //auth.login();
  },
  updateAuth(loggedIn) {
      this.setState({
          loggedIn
      });
  },
  render() {
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
                    {this.props.children ||
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
  render() {
    const loginData = auth.getLoginData();

    return (
      <div>
        <h1>User's Profile</h1>
        <p>Username: {loginData.username}</p>
        <p>Fullname: {loginData.fullname}</p>
        <p>e-mail: {loginData.email}</p>
        <p>Category: {loginData.userCategory}</p>
      </div>
    );
  }
});

const Login = withRouter(React.createClass({
    getInitialState() {
      return {
        error: false,
        canSubmit: false,
        showModal:true,
        validationErrors: {}
      };
    },
    enableButton() {
        this.setState({
            canSubmit: true
        });
    },
    disableButton() {
        this.setState({
            canSubmit: false
        });
    },
    close(){
      this.setState({showModal: false});
    },
    validateForm: function (values) {
      //First we validate username
      if (!values.username){
        this.setState({
          validationErrors: {
            username: 'Please type your username'
          }
        });
      } else if (values.username.length < 4){
        this.setState({
          validationErrors: {
            username: 'Username min length is 4 characters'
          }
        });
      } else if (!values.password){ //Then we validate password
        this.setState({
          validationErrors: {
            password: 'Please type your password'
          }
        });
      } else if (values.password.length < 7){
        this.setState({
          validationErrors: {
            password: 'Password min length is 7 characters'
          }
        });
      } else {
        this.setState({
          validationErrors: {
          }
        });
      }
    },
    handleSubmit(model) {
      //event.preventDefault();
      //const email = this.refs.email.value;
      const username = model.username;
      //const pass = this.refs.pass.value;
      const password = model.password;
      auth.login(username, password, (loggedIn,status,errorMsg) => {
        if (!loggedIn){
          return this.setState({ error: true, errorMsg: errorMsg, status: status });
        }
        const { location } = this.props;
        if (location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname);
        } else {
          this.props.router.replace('/');
        }
      });
    },

    render() {
      return (
        <div>
          <Modal show={this.state.showModal} error={this.state.error} className="login">
            <Modal.Header className="login">
              <Modal.Title>RD-Connect UMI Login</Modal.Title>
              </Modal.Header>
            <Modal.Body className="login">
              <Formsy.Form
                onValidSubmit={this.handleSubmit}
                onChange={this.validateForm}
                validationErrors={this.state.validationErrors}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                name="loginForm"
                className="documentsForm login"
              >
              <fieldset>
                <legend>Username</legend>
                <Input
                    id="username"
                    name="username"
                    value=""
                    label=""
                    type="text"
                    placeholder="Type your username (For example: a.canada)."
                    help=""
                    layout="horizontal"
					  style={{width:"95%"}}
                    required
                />
              </fieldset>
              <fieldset>
                  <legend>Password</legend>
                  <Input
                      id="password"
                      name="password"
                      value=""
                      label=""
                      type="password"
                      placeholder="Type your password"
                      layout="horizontal"
					  autoComplete="off"
					  style={{width:"95%"}}
                      required
                  />
                </fieldset>
                      <Button type="submit" bsStyle="primary" className="right" disabled={!this.state.canSubmit} >Login</Button>
              </Formsy.Form>
            </Modal.Body>
            <Modal.Footer className="login">
                      {this.state.error && (
                        <p className="badLoginInformation" >{(function(state) {
							let message;
							switch(state.status) {
								case 404:
									message="CAS server is unreachable";
									break;
								case 401:
									message="Error while authenticating (bad login information?)";
									break;
								case 404:
									message="CAS UMI or server are unreachable";
									break;
								default:
									if(state.status>=500) {
										message="CAS UserManagement internal error ("+state.status+")";
									} else {
										message="CAS UserManagement error ("+state.status+")";
									}
									break;
							}
							return message;
						})(this.state)}</p>
                      )}
            </Modal.Footer>
          </Modal>
          </div>
      );
    }
  })
);

const Logout = React.createClass({
  componentDidMount() {
    auth.logout();
  },

  render() {
    return <p>You are now logged out</p>;
  }
});

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
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

render((
    <Router history={hashHistory}>
            <Route path="/" component={App} name="Home">
                {/* add it here, as a child of `/` */}
                <Route path="login" component={Login} name="Login"/>
                <Route path="logout" component={Logout} name="Logout"/>
                <Route path="userProfile" component={UserProfile} onEnter={requireAuth} name="User's Profile"/>
                <Route path="/users" name="Users" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={UsersContainer}/>
                    <Route path="list" name="List" component={UsersContainer} task={'list'} />
                    <Route path="edit/:username" name="Edit" staticName component={UserEditFormContainer} task={'edit'}/>
                    <Route path="view/:username" name="View" staticName component={UserFormContainer} task={'view'}/>
                    <Route path="enable-disable/:username" name="Enable-Disable" staticName component={UserFormContainer} task={'enable_disable'}/>
                    <Route path="password/:username" name="Change Password" staticName component={PasswordContainer} task={'passwordChange'}/>
                    <Route path="reset-password/:username" name="Reset Password" staticName component={PasswordContainer} task={'passwordReset'}/>
                    <Route path="new" name="New" component={UserNewFormContainer} task={'new_privileged'}/>
                    <Route path="new-unprivileged" name="New (unprivileged)" component={UserNewFormContainer} task={'new_unprivileged'} />
                    <Route path="groups" name="Users in groups" component={Box} >
                        <IndexRoute component={UsersGroupsContainer}/>
                        <Route path="list" name="View Users in group" staticName component={UsersGroupsContainer} task={'list'}/>
                        <Route path="view/:username" name="View Users in group" staticName component={UsersGroupsFormContainer} task={'users_groups_view'}/>
                        <Route path="edit/:username" name="Edit Users in group" staticName component={UsersGroupsFormContainer} task={'users_groups_edit'}/>
                    </Route>
                </Route>
                <Route path="/organizationalUnits" name="Organizational Units" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={OrganizationalUnitsContainer}/>
                    <Route path="list" name="List Organizational Units" component={OrganizationalUnitsContainer} />
                    <Route path="edit/:organizationalUnit" name="Edit" staticName component={OrganizationalUnitFormContainer} task={'edit'} />
                    <Route path="view/:organizationalUnit" name="View" staticName component={OrganizationalUnitFormContainer} task={'view'} />
                    <Route path="new" name="New" component={OrganizationalUnitNewFormContainer} />
                    <Route path="users" name="Users in Organizational Units" component={OrganizationalUnitsUsersContainer} />
                </Route>
                <Route path="/groups" name="Groups" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={GroupsContainer}/>
                    <Route path="list" name="List" component={GroupsContainer} />
                    <Route path="edit/:groupName" name="Edit" staticName component={GroupFormContainer} task={'edit'} />
                    <Route path="view/:groupName" name="View" staticName component={GroupFormContainer} task={'view'} />
                    <Route path="new" name="New" component={GroupNewFormContainer} />
                </Route>
                <Route path="/documents" name="Documents" component={Box} onEnter={requireAuth}>
                    <IndexRoute component={DocumentsUsersContainer}/>
                    <Route path="users" name="Users" component={DocumentsUsersContainer} />
                    <Route path="users/:username" name="List User Documents" component={DocumentsUserContainer} />
                    <Route path="users/:username/new" name="New User Document" component={DocumentsUserNew} />
                    <Route path="groups" name="Groups" component={DocumentsGroupsContainer} />
                    <Route path="groups/:groupName" name="List Group Documents" component={DocumentsGroupContainer} />
                    <Route path="groups/:groupName/new" name="New Group Document" component={DocumentsGroupNew} />
                </Route>
            </Route>
        </Router>
 ), document.getElementById('content'));
