import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';
//import withExampleBasename from 'components/withExampleBasename.js';
//import sentryConfig from './sentryConfig.js';

import auth from 'components/auth.jsx';
import App from 'components/App.jsx';
import Login from 'components/Login.jsx';
import Logout from 'components/Logout.jsx';
import UserProfile from 'components/UserProfile.jsx';
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
import OrganizationalUnitEditFormContainer from 'components/organizationalUnits/OrganizationalUnitEditFormContainer.jsx';
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
import MailTemplatesContainer from 'components/mailing/MailTemplatesContainer.jsx';

//var _APP_INFO = {
//  name: 'RD-Connect User Management Interface',
//  branch: 'Master',
//  version: '1.0'
//};
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

function requireAuth(nextState, replace, callback) {
	auth.getLoginData((userProps) => {
		callback();
	},(xhr, status, err) => {
		replace({
			pathname: '/login',
			state: { nextPathname: nextState.location.pathname }
		});
		callback();
	});
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
                <Route path="userProfile" component={UserProfile} name="User's Profile" />
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
                    <Route path="edit/:organizationalUnit" name="Edit" staticName component={OrganizationalUnitEditFormContainer} task={'edit'} />
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
					<Route path="domains/:domainId" name="Mail Domain Template Management" staticName component={MailTemplatesContainer} />
                </Route>
            </Route>
        </Router>
 ), document.getElementById('content'));
