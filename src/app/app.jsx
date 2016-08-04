import { Router, Route, IndexRoute } from 'react-router';
var browserHistory = Router.browserHistory;

(function () {
    var React = require('react');
    var	ReactDOM = require('react-dom');
    var injectTapEventPlugin = require('react-tap-event-plugin');
    var Main = require('./components/main.jsx');

    //var SearchLayout = require('./components/layout/SearchLayout.jsx');
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
    var Home = require('./components/Home.jsx');

    //Needed for React Developer Tools
    window.React = React;

    //Needed for onTouchTap
    //Can go away when react 1.0 release
    //Check this repo:
    //https://github.com/zilverline/react-tap-event-plugin
    injectTapEventPlugin();

    // Render the main app react component into the document body.
    // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
    ReactDOM.render((
        <Router history={browserHistory} >
            <Route path="/" component={Main} name="Home">
                {/* add it here, as a child of `/` */}
                <IndexRoute component={Home}/>
                <Route path="/users" name="Users" component={Box}>
                    <IndexRoute component={UsersContainer}/>
                    <Route path="list" name="List" component={UsersContainer} task={'list'} />
                    <Route path="edit/:username" name="Edit" staticName component={UserFormContainer} task={'edit'}/>
                    <Route path="view/:username" name="View" staticName component={UserFormContainer} task={'view'}/>
                    <Route path="enable-disable/:username" name="Enable-Disable" staticName component={UserFormContainer} task={'enable_disable'}/>
                    <Route path="new" name="New" component={UserNewFormContainer} />
                    <Route path="groups" name="Users in groups" component={UsersGroupsContainer} >
                        <Route path="view/:username" name="View Users in group" staticName component={UsersGroupsFormContainer} task={'users_groups_view'}/>
                        <Route path="edit/:username" name="Edit Users in group" staticName component={UsersGroupsFormContainer} task={'users_groups_edit'}/>
                    </Route>
                </Route>
                <Route path="/organizationalUnits" name="Organizational Units" component={Box}>>
                    <IndexRoute component={OrganizationalUnitsContainer}/>
                    <Route path="list" name="List Organizational Units" component={OrganizationalUnitsContainer} />
                    <Route path="edit/:organizationalUnit" name="Edit" staticName component={OrganizationalUnitFormContainer} task={'edit'} />
                    <Route path="view/:organizationalUnit" name="View" staticName component={OrganizationalUnitFormContainer} task={'view'} />
                    <Route path="new" name="New" component={OrganizationalUnitNewFormContainer} />
                    <Route path="users" name="Users in Organizational Units" component={OrganizationalUnitsUsersContainer} />
                </Route>
                <Route path="/groups" name="Groups" component={Box}>
                    <IndexRoute component={GroupsContainer}/>
                    <Route path="list" name="List" component={GroupsContainer} />
                    <Route path="edit/:groupName" name="Edit" staticName component={GroupFormContainer} task={'edit'} />
                    <Route path="view/:groupName" name="View" staticName component={GroupFormContainer} task={'view'} />
                    <Route path="new" name="New" component={GroupNewFormContainer} />
                </Route>
            </Route>
        </Router>
        ), document.getElementById('content'));

})();
