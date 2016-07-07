var React = require('react');

import { Link } from 'react-router';

var User = React.createClass({
  render: function() {
    if(this.props.brief) {
    	return (
	      <div className="user">
	          <strong>{this.props.user.cn}:</strong> {this.props.user.email} <Link to="/groupList">(Edit User)</Link>
	        {this.props.children}
	      </div>
	    );
    } else {
    	return (
	      <div className="user">
	          <strong>First name: {this.props.user.firstName}; Surname: {this.props.user.surname};</strong> {this.props.user.email}
	        {this.props.children}
	      </div>
	    );
    }
  }
});

module.exports = User;