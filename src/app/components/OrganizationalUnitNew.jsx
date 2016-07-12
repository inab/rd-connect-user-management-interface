var React = require('react');
var Bootstrap = require('react-bootstrap');

//var Navigation = require('./navigation.jsx');

var OrganizationNew = React.createClass({

    render: function () {
        return (
                    <div className="starter-template">
                        <h1>New Organization Form</h1>
                        <p className="lead">Use this document as a way to quickly start any new project.
                            <br />
                        All you get is this text and a mostly barebones HTML document.</p>
                    </div>
        );
    }

});

module.exports = OrganizationNew;