import React from 'react';

import { Link } from 'react-router';

class Group extends React.Component {
	constructor(props,context) {
		super(props,context);
	}
	
	render() {
		return (
			<div className="group">
				<strong>{this.props.group.cn}:</strong> {this.props.group.description} <Link to={'/groups/edit/' + this.props.group.cn}>(Edit Group)</Link>
				{this.props.children}
			</div>
		);
	}
}

Group.propTypes = {
	group: React.PropTypes.object,
	children: React.PropTypes.array
};

module.exports = Group;
