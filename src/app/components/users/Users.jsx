import React from 'react';
import { Glyphicon, Row, Panel } from 'react-bootstrap';
import Underscore from 'underscore';
import { Link } from 'react-router';
//import User from './User.jsx';
import UserTable from './UserTable.jsx';


class Users extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		this.setState({users:this.props.users});
	}
	
	render() {
		//console.log("Data so far is: ", data);
		var groupedData = Underscore
			.chain(this.state.users)
			.groupBy('organizationalUnit')
			.toArray()
			.sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
			.value();

		return (
			<div>
				<h3 style={{float:'left'}}> List of Users</h3>
				<div className="right">
					<Link className="btn btn-primary" role="button" to={'/users/new/'}>Add New User&nbsp;<Glyphicon glyph="plus" /></Link>
				</div>
				<div className="clear-both" />
				<Row className="show-grid">
					{groupedData.map((ouUsers,i) => {
						var organizationalUnit = ouUsers[0].organizationalUnit;
						return (
							<Panel collapsible defaultExpanded header={
									<div style={{width:'100%'}}>
										{organizationalUnit}
										<div style={{float: 'right',clear: 'right'}}>
											<Link className="btn btn-primary" role="button" to={'/organizationalUnits/addUser/' + encodeURIComponent(organizationalUnit)}>Create User &nbsp;<Glyphicon glyph="user" /></Link>
										</div>
									</div>
								} key={i}
							>
								<UserTable users={ouUsers} />
							</Panel>
						);
					}
					)}
				</Row>
			</div>
		);
	}
}

Users.propTypes = {
    users: React.PropTypes.array.isRequired,
    history:  React.PropTypes.object
};
export default Users;
