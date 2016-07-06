import { Router, Route, hashHistory, IndexRoute } from 'react-router';
(function () {
    var React = require('react'),
    	ReactDOM = require('react-dom'),
        injectTapEventPlugin = require("react-tap-event-plugin"),
        Main = require('./components/main.jsx');
    var ListUsers = require('./components/ListUsers.jsx');    
    var NewUser = require('./components/NewUser.jsx');
    var ListOrganizations = require('./components/ListOrganizations.jsx');    
    var NewOrganization = require('./components/NewOrganization.jsx');
    var ListGroups = require('./components/ListGroups.jsx');    
    var NewGroup = require('./components/NewGroup.jsx');
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
    console.log(React);
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={Main}>
                {/* add it here, as a child of `/` */}
                <IndexRoute component={Home}/>
                <Route path="/listUsers" component={ListUsers} />
                <Route path="/newUser" component={NewUser} />
                <Route path="/listOrganizations" component={ListOrganizations} />
                <Route path="/newOrganization" component={NewOrganization} />
                <Route path="/listGroups" component={ListGroups} />
                <Route path="/newGroup" component={NewGroup} />
            </Route>
        </Router>
        ), document.getElementById('content'));

})();
