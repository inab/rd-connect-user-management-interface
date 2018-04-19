import React from 'react';
import config from 'config.jsx';
import cache from './cache.jsx';
//import auth from 'components/auth.jsx';

class AbstractFetchedDataContainer extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		this.setState(e);
	}
	
	componentWillMount() {
		this.setState({
			users: [],
			organizationalUnits: [],
			groups: [],
			selectableUsers: [],
			selectableOUs: [],
			selectableGroups: [],
		});
	}
	
	loadUsers(cb) {
		cache.getData(config.usersBaseUri,(users) => {
			this.onChange({users: users});
			if(cb) {
				cb(users);
			}
		});
	}
	
	loadOrganizationalUnits(cb) {
		cache.getData(config.ouBaseUri,(organizationalUnits) => {
			this.onChange({organizationalUnits: organizationalUnits});
			if(cb) {
				cb(organizationalUnits);
			}
		});
	}
	
	loadGroups(cb) {
		cache.getData(config.groupsBaseUri,(groups) => {
			this.onChange({groups: groups});
			if(cb) {
				cb(groups);
			}
		});
	}
	
	loadSelectableUsers() {
		this.loadUsers((users) => {
			this.onChange({
				selectableUsers: users.map((user) => {
					return {
						label: user.cn + ' ('+user.organizationalUnit+')',
						value: user.username
					};
				})
			});
		});
	}
	
	loadSelectableOrganizationalUnits() {
		this.loadOrganizationalUnits((organizationalUnits) => {
			this.onChange({
				selectableOUs: organizationalUnits.map((ou) => {
					return {
						label: ou.description + ' (' + ou.organizationalUnit +')',
						value: ou.organizationalUnit
					};
				})
			});
		});
	}
	
	loadSelectableGroups() {
		this.loadGroups((groups) => {
			this.onChange({
				selectableGroups: groups.map((group) => {
					return {
						label: group.description + ' ('+ group.cn + ')',
						value: group.cn
					};
				})
			});
		});
	}
}

export default AbstractFetchedDataContainer;
