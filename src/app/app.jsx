import { Router, Route, hashHistory, IndexRoute } from 'react-router';
(function () {
    var React = require('react'),
    	ReactDOM = require('react-dom'),
        injectTapEventPlugin = require("react-tap-event-plugin"),
        Main = require('./components/main.jsx');
    var UsersBox = require('./components/users/UsersBox.jsx');    
    var UserFormContainer = require('./components/users/UserFormContainer.jsx');
    var UserNewFormContainer = require('./components/users/UserNewFormContainer.jsx');
    var UsersGroupsBox = require('./components/users/UsersGroupsBox.jsx');    
    var UsersGroupsContainer = require('./components/users/UsersGroupsContainer.jsx');    
    var UsersGroupsFormContainer = require('./components/users/UsersGroupsFormContainer.jsx');    

    var OrganizationalUnitsBox = require('./components/organizationalUnits/OrganizationalUnitsBox.jsx');    
    var OrganizationalUnitFormContainer = require('./components/organizationalUnits/OrganizationalUnitFormContainer.jsx');
    var OrganizationalUnitNewFormContainer = require('./components/organizationalUnits/OrganizationalUnitNewFormContainer.jsx');
    var OrganizationalUnitsUsersBox = require('./components/organizationalUnits/OrganizationalUnitsUsersBox.jsx');
    
    
    var GroupsBox = require('./components/groups/GroupsBox.jsx');    
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
                <Route path="/users" component={UsersBox}/>
                <Route path="/users/edit/:username" component={UserFormContainer} task={'edit'}/>
                <Route path="/users/view/:username" component={UserFormContainer} task={'view'}/>
                <Route path="/users/enable-disable/:username" component={UserFormContainer} task={'enable_disable'}/>
                <Route path="/users/new" component={UserNewFormContainer} />
                <Route path="/users/groups" component={UsersGroupsBox} />
                <Route path="/users/groups/view/:username" component={UsersGroupsFormContainer} task={'users_groups_view'}/>
                <Route path="/users/groups/edit/:username" component={UsersGroupsFormContainer} task={'users_groups_edit'}/>

                <Route path="/organizationalUnits" component={OrganizationalUnitsBox} />
                <Route path="/organizationalUnits/edit/:organizationalUnit" component={OrganizationalUnitFormContainer} task={'edit'} />
                <Route path="/organizationalUnits/view/:organizationalUnit" component={OrganizationalUnitFormContainer} task={'view'} />
                <Route path="/organizationalUnits/new" component={OrganizationalUnitNewFormContainer} />
                <Route path="/organizationalUnits/users" component={OrganizationalUnitsUsersBox} />

                <Route path="/groups" component={GroupsBox} />
                <Route path="/groups/edit/:groupName" component={GroupFormContainer} task={'edit'} />
                <Route path="/groups/view/:groupName" component={GroupFormContainer} task={'view'} />
                <Route path="/groups/new" component={GroupNewFormContainer} />
            </Route>
        </Router>
        ), document.getElementById('content'));

})();
