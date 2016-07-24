var React = require('react');

import { Link } from 'react-router';

const User = (props) => (
	<div className="user">
		<strong>{props.user.cn}:</strong> {props.user.email} <Link to={"/users/edit/"+props.user.username}>(Edit User)</Link>
		{props.children}
	</div>
);

module.exports = User;
