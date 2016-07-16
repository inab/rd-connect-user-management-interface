import { Router, Route, hashHistory, IndexRoute } from 'react-router';
(function () {
    var React = require('react'),
    	ReactDOM = require('react-dom'),
        injectTapEventPlugin = require("react-tap-event-plugin"),
        Main = require('./components/main.jsx');
    var UserListBox = require('./components/users/UserListBox.jsx');    
    var UserFormContainer = require('./components/users/UserFormContainer.jsx');
    var UserNewFormContainer = require('./components/users/UserNewFormContainer.jsx');
    
    var OrganizationalUnitListBox = require('./components/organizationalUnits/OrganizationalUnitListBox.jsx');    
    var OrganizationalUnitFormContainer = require('./components/organizationalUnits/OrganizationalUnitFormContainer.jsx');
    var OrganizationalUnitNewFormContainer = require('./components/organizationalUnits/OrganizationalUnitNewFormContainer.jsx');
    
    var GroupListBox = require('./components/groups/GroupListBox.jsx');    
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
                <Route path="/userList" component={UserListBox} />
                <Route path="/userEdit/:username" component={UserFormContainer} task={'edit'}/>
                <Route path="/userView/:username" component={UserFormContainer} task={'view'}/>
                <Route path="/userNew" component={UserNewFormContainer} />
                <Route path="/organizationList" component={OrganizationalUnitListBox} />
                <Route path="/organizationEdit/:organizationalUnit" component={OrganizationalUnitFormContainer} task={'edit'} />
                <Route path="/organizationView/:organizationalUnit" component={OrganizationalUnitFormContainer} task={'view'} />
                <Route path="/organizationNew" component={OrganizationalUnitNewFormContainer} />
                <Route path="/groupList" component={GroupListBox} />
                <Route path="/groupEdit/:groupName" component={GroupFormContainer} task={'edit'} />
                <Route path="/groupView/:groupName" component={GroupFormContainer} task={'view'} />
                <Route path="/groupNew" component={GroupNewFormContainer} />
            </Route>
        </Router>
        ), document.getElementById('content'));

})();
