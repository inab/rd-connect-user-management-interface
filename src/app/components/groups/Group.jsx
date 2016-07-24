var React = require('react');

import { Link } from 'react-router';

const Group = (props) => (
	<div className="group">
		<strong>{props.group.cn}:</strong> {props.group.description} <Link to={"/groups/edit/"+props.group.cn}>(Edit Group)</Link>
		{props.children}
	</div>
);
module.exports = Group;
