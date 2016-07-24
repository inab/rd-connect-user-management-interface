var React = require('react');
var Navigation = require('./Navigation.jsx');
var Home = require('./Home.jsx');


var Main = React.createClass({
    propTypes:{
        children: React.PropTypes.object.isRequired
    },
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
