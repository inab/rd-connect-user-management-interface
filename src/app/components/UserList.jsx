var React = require('react');
var Bootstrap = require('react-bootstrap');

//var Navigation = require('./navigation.jsx');
var User = require('./User.jsx');    

var UserList = React.createClass({
  render: function() {
  	var userNodes = this.props.data.map(function(user) {
      return (
        <User email={user.email} cn={user.cn}></User>
      );
    });
    return (
      <div className="userList">
        {userNodes}
      </div>
    );
  }
});


module.exports = UserList;