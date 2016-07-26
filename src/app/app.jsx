import { Router, Route, hashHistory, IndexRoute } from 'react-router';
(function () {
    var React = require('react');
    var	ReactDOM = require('react-dom');
    var injectTapEventPlugin = require('react-tap-event-plugin');
    var Main = require('./components/main.jsx');

    //var SearchLayout = require('./components/layout/SearchLayout.jsx');
    var UsersContainer = require('./components/users/UsersContainer.jsx');
    var UserFormContainer = require('./components/users/UserFormContainer.jsx');
    var UserNewFormContainer = require('./components/users/UserNewFormContainer.jsx');
    var UsersGroupsBox = require('./components/users/UsersGroupsBox.jsx');
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
        <Router history={hashHistory} >
            <Route path="/" component={Main}>
                {/* add it here, as a child of `/` */}
                <IndexRoute component={Home}/>
                <Route path="/users">
                    <Route path="list" component={UsersContainer}/>
                    <Route path="edit/:username" component={UserFormContainer} task={'edit'}/>
                    <Route path="view/:username" component={UserFormContainer} task={'view'}/>
                    <Route path="enable-disable/:username" component={UserFormContainer} task={'enable_disable'}/>
                    <Route path="new" component={UserNewFormContainer} />
                    <Route path="groups" component={UsersGroupsBox} />
                    <Route path="groups/view/:username" component={UsersGroupsFormContainer} task={'users_groups_view'}/>
                    <Route path="groups/edit/:username" component={UsersGroupsFormContainer} task={'users_groups_edit'}/>
                </Route>
                <Route path="/organizationalUnits">
                    <Route path="list" component={OrganizationalUnitsContainer} />
                    <Route path="edit/:organizationalUnit" component={OrganizationalUnitFormContainer} task={'edit'} />
                    <Route path="view/:organizationalUnit" component={OrganizationalUnitFormContainer} task={'view'} />
                    <Route path="new" component={OrganizationalUnitNewFormContainer} />
                    <Route path="users" component={OrganizationalUnitsUsersContainer} />
                </Route>
                <Route path="/groups">
                    <Route path="list" component={GroupsContainer} />
                    <Route path="edit/:groupName" component={GroupFormContainer} task={'edit'} />
                    <Route path="view/:groupName" component={GroupFormContainer} task={'view'} />
                    <Route path="new" component={GroupNewFormContainer} />
                </Route>
            </Route>
        </Router>
        ), document.getElementById('content'));

})();
