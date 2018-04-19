import React from 'react';
import { Link } from 'react-router';
import { Checkbox, Row, Col } from 'react-bootstrap';

const User = React.createClass({
	propTypes:{
		data: React.PropTypes.object.isRequired,
		index: React.PropTypes.number
	},
	render: function() {
		var isChecked = this.props.data.enabled;
		//console.log('Groups that user ' + this.props.data.username + ' belongs to: ', groups);
		return (
			<Row className="show-grid" key={this.props.index}>
				<Col xs={2} md={2}>{this.props.data.username}</Col>
				<Col xs={2} md={2}>{this.props.data.cn}</Col>
				<Col xs={3} md={3}>{this.props.data.email}</Col>
				<Col xs={1} md={1}>{this.props.data.userCategory}</Col>
				<Col xs={1} md={1}><Checkbox checked={isChecked} readOnly /></Col>
				<Col xs={2} md={2}>
					<ul className="user-ul">
					{
						this.props.data.groups.map(function(groupName, i){
							return (
								<li key={i}>{groupName}</li>
							);
						})
					}
					</ul>
				</Col>
				<Col xs={1} md={1}><Link to={'/users/view/' + encodeURIComponent(`${this.props.data.username}`)}>View</Link>/<Link to={'/users/edit/' + encodeURIComponent(`${this.props.data.username}`)}>Edit</Link></Col>
			</Row>
		);
	}
});
module.exports = User;
