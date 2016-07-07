var React = require('react');
var Bootstrap = require('react-bootstrap');
var Navigation = require('./Navigation.jsx');
var Home = require('./Home.jsx');


var Main = React.createClass({

    render: function () {
        return (
            <div>
                <Navigation projectName="react-bootstrap-starter" />
                <div className="container">
                    {this.props.children || <Home />}
                </div>
            </div>
        );
    }

});

module.exports = Main;