import React from 'react';
import config from 'config.jsx';
import cache from './cache.jsx';
//import auth from 'components/auth.jsx';

// The schemas are not going to change, so cache them harder
const DEFAULT_SCHEMA_CACHE_TTL = 60*60*1000;

class AbstractFetchedDataContainer extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.requests = [];
		this.onChange = this.onChange.bind(this);
	}

	componentWillMount() {
		this.setState({
			schemas: {},
			users: [],
			organizationalUnits: [],
			groups: [],
			selectableUsers: [],
			selectableOUs: [],
			selectableGroups: [],
		});
	}
	
	componentWillUnmount() {
		this.abortPendingRequests();
	}
	
	onChange(e) {
		this.setState(e);
	}
	
	abortPendingRequests() {
		this.requests.forEach(request => request.abort());
	}
	
	registerRequest(request) {
		this.requests.push(request);
	}
	
	loadUsersSchema(cb,ecb = undefined) {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		let request;
		request = cache.getData(config.usersBaseUri + '?schema','users JSON schema',(usersSchema) => {
			this.onChange((prevState) => {
				return {
					schemas: {
						...prevState.schemas,
						users: usersSchema
					}
				};
			});
			if(cb) {
				cb(usersSchema);
			}
		},(errMsg) => {
			console.error('Unable to load users schema');
			if(ecb) {
				ecb(errMsg);
			}
		},false,DEFAULT_SCHEMA_CACHE_TTL);
		this.registerRequest(request);
	}
	
	loadUsers(cb,ecb = undefined) {
		let request;
		request = cache.getData(config.usersBaseUri,'users',(users) => {
			this.onChange({users: users});
			if(cb) {
				cb(users);
			}
		},(errMsg) => {
			console.error('Unable to load users');
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadUser(username,cb,ecb = undefined) {
		let request;
		request = cache.getData(config.usersBaseUri + '/' + encodeURIComponent(username),'user ' + username,(user) => {
			if(cb) {
				cb(user);
			}
		},(errMsg) => {
			console.error('Unable to load user ' + username);
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadOrganizationalUnitsSchema(cb,ecb = undefined) {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		let request;
		request = cache.getData(config.ouBaseUri + '?schema','organizational units schema',(ouSchema) => {
			this.onChange((prevState) => {
				return {
					schemas: {
						...prevState.schemas,
						organizationalUnits: ouSchema
					}
				};
			});
			if(cb) {
				cb(ouSchema);
			}
		},(errMsg) => {
			console.error('Unable to load organizations schema');
			if(ecb) {
				ecb(errMsg);
			}
		},false,DEFAULT_SCHEMA_CACHE_TTL);
		this.registerRequest(request);
	}
	
	loadOrganizationalUnits(cb,ecb = undefined) {
		let request;
		request = cache.getData(config.ouBaseUri,'organizational units',(organizationalUnits) => {
			this.onChange({organizationalUnits: organizationalUnits});
			if(cb) {
				cb(organizationalUnits);
			}
		},(errMsg) => {
			console.error('Unable to load organizations');
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadOrganizationalUnit(ou,cb,ecb = undefined) {
		let request;
		request = cache.getData(config.ouBaseUri + '/' + encodeURIComponent(ou),'organizational unit ' + ou,(organizationalUnit) => {
			if(cb) {
				cb(organizationalUnit);
			}
		},(errMsg) => {
			console.error('Unable to load organization ' + ou);
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadGroupsSchema(cb,ecb = undefined) {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		let request;
		request = cache.getData(config.groupsBaseUri + '?schema','groups schema',(groupsSchema) => {
			this.onChange((prevState) => {
				return {
					schemas: {
						...prevState.schemas,
						groups: groupsSchema
					}
				};
			});
			if(cb) {
				cb(groupsSchema);
			}
		},(errMsg) => {
			console.error('Unable to load groups schema');
			if(ecb) {
				ecb(errMsg);
			}
		},false,DEFAULT_SCHEMA_CACHE_TTL);
		this.registerRequest(request);
	}
	
	loadGroups(cb,ecb = undefined) {
		let request;
		request = cache.getData(config.groupsBaseUri,'groups',(groups) => {
			this.onChange({groups: groups});
			if(cb) {
				cb(groups);
			}
		},(errMsg) => {
			console.error('Unable to load groups');
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadGroup(groupname,cb,ecb = undefined) {
		let request;
		request = cache.getData(config.groupsBaseUri + '/' + groupname,'group ' + groupname,(group) => {
			if(cb) {
				cb(group);
			}
		},(errMsg) => {
			console.error('Unable to load group ' + groupname);
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadSelectableUsers() {
		this.loadUsers((users) => {
			this.onChange({
				selectableUsers: users.map((user) => {
					return {
						label: user.cn + ' (' + user.organizationalUnit + ')',
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
						label: ou.description + ' (' + ou.organizationalUnit + ')',
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
						label: group.description + ' (' + group.cn + ')',
						value: group.cn
					};
				})
			});
		});
	}
}

export default AbstractFetchedDataContainer;
