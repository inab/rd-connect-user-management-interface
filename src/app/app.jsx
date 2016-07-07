import { Router, Route, hashHistory, IndexRoute } from 'react-router';
(function () {
    var React = require('react'),
    	ReactDOM = require('react-dom'),
        injectTapEventPlugin = require("react-tap-event-plugin"),
        Main = require('./components/main.jsx');
    var UserListBox = require('./components/UserListBox.jsx');    
    var UserNew = require('./components/UserNew.jsx');
    var OrganizationList = require('./components/OrganizationList.jsx');    
    var OrganizationNew = require('./components/OrganizationNew.jsx');
    var GroupList = require('./components/GroupList.jsx');    
    var GroupNew = require('./components/GroupNew.jsx');
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
                <Route path="/userNew" component={UserNew} />
                <Route path="/organizationList" component={OrganizationList} />
                <Route path="/organizationNew" component={OrganizationNew} />
                <Route path="/groupList" component={GroupList} />
                <Route path="/groupNew" component={GroupNew} />
            </Route>
        </Router>
        ), document.getElementById('content'));

})();
