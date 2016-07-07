var React = require('react');
var Bootstrap = require('react-bootstrap');

//var Navigation = require('./navigation.jsx');

var User = React.createClass({
  render: function() {
    return (
      <div className="user">
          <strong>{this.props.cn}:</strong> {this.props.email}
        {this.props.children}
      </div>
    );
  }
});

module.exports = User;