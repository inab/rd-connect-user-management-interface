import React from 'react';
import { Link } from 'react-router';

class OrganizationalUnit extends React.Component {
	constructor(props,context) {
		super(props,context);
	}

	render() {
		return (
			<div className="organizationalUnit">
				<strong>{this.props.organizationalUnit.organizationalUnit}:</strong> {this.props.organizationalUnit.description} <Link to={'/organizationalUnits/edit/' + this.props.organizationalUnit.organizationalUnit}>(Edit)</Link>
				{this.props.children}
			</div>
		);
	}
}

OrganizationalUnit.propTypes = {
	organizationalUnit: React.PropTypes.object,
	children: React.PropTypes.array
};

module.exports = OrganizationalUnit;
