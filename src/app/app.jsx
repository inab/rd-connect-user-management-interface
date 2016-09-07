import React from 'react';
import { render } from 'react-dom';
import { hashHistory, Router, Route, Link, withRouter, IndexRoute } from 'react-router';
//import withExampleBasename from './components/withExampleBasename.js';
var Bootstrap = require('react-bootstrap');
import { Button, Col } from 'react-bootstrap';

import auth from './components/auth.jsx';
var Navigation = require('./components/Navigation.jsx');
var Breadcrumbs = require('react-breadcrumbs');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Main = require('./components/main.jsx');
var Box = require('./components/Box.jsx');
var UsersContainer = require('./components/users/UsersContainer.jsx');
var UserFormContainer = require('./components/users/UserFormContainer.jsx');
var UserNewFormContainer = require('./components/users/UserNewFormContainer.jsx');
var UsersGroupsContainer = require('./components/users/UsersGroupsContainer.jsx');
var UsersGroupsFormContainer = require('./components/users/UsersGroupsFormContainer.jsx');
var OrganizationalUnitsContainer = require('./components/organizationalUnits/OrganizationalUnitsContainer.jsx');
var OrganizationalUnitFormContainer = require('./components/organizationalUnits/OrganizationalUnitFormContainer.jsx');
var OrganizationalUnitNewFormContainer = require('./components/organizationalUnits/OrganizationalUnitNewFormContainer.jsx');
var OrganizationalUnitsUsersContainer = require('./components/organizationalUnits/OrganizationalUnitsUsersContainer.jsx');
var GroupsContainer = require('./components/groups/GroupsContainer.jsx');
var GroupFormContainer = require('./components/groups/GroupFormContainer.jsx');
var GroupNewFormContainer = require('./components/groups/GroupNewFormContainer.jsx');
var DocumentsUsersContainer = require('./components/documents/DocumentsUsersContainer.jsx');
var DocumentsUserContainer = require('./components/documents/DocumentsUserContainer.jsx');
var DocumentsUserNew = require('./components/documents/DocumentsUserNew.jsx');

import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const {Form, Input } = FRC;



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
    auth.login();
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
                        <ul>
                            <li>
                                {this.state.loggedIn ? (
                                <Link to="/logout">Log out</Link>
                                ) : (
                                <Link to="/login">Login</Link>
                                )}
                            </li>
                            <li><Link to="/userProfile">User's Profile</Link> (authenticated)</li>
                        </ul>
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
    const token = auth.getToken();

    return (
      <div>
        <h1>User's Profile</h1>
        <p>You made it!</p>
        <p>{token}</p>
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
      console.log('Values inside validateForm contains: ', values); 
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
      auth.login(username, password, (loggedIn) => {
        if (!loggedIn){
          return this.setState({ error: true });
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
          <Bootstrap.Modal show={this.state.showModal} error={this.state.error} className="login">
            <Bootstrap.Modal.Header className="login">
              <Bootstrap.Modal.Title>Login</Bootstrap.Modal.Title>
              </Bootstrap.Modal.Header>
            <Bootstrap.Modal.Body className="login">
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
                    layout="vertical"
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
                      layout="vertical"
                      required
                  />
                </fieldset>
                      <Button type="submit" bsStyle="primary" className="right" disabled={!this.state.canSubmit} >Login</Button>
                      {this.state.error && (
                        <p className="badLoginInformation" >Bad login information</p>
                      )}
              </Formsy.Form>
            </Bootstrap.Modal.Body>
            <Bootstrap.Modal.Footer className="login">
              
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
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
                    <Route path="edit/:username" name="Edit" staticName component={UserFormContainer} task={'edit'}/>
                    <Route path="view/:username" name="View" staticName component={UserFormContainer} task={'view'}/>
                    <Route path="enable-disable/:username" name="Enable-Disable" staticName component={UserFormContainer} task={'enable_disable'}/>
                    <Route path="new" name="New" component={UserNewFormContainer} />
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
                    <Route path="users/:username" name="List Documents" component={DocumentsUserContainer} />
                    <Route path="users/:username/new" name="New Document" component={DocumentsUserNew} />
                </Route>
            </Route>
        </Router>
 ), document.getElementById('content'));
